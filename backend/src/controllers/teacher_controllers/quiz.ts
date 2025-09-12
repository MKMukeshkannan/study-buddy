
import { Request, Response } from "express";
import { model } from "../../utils/constants.js";

type QuizQuestion = {
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  answer: keyof QuizQuestion["options"]; // "a" | "b" | "c" | "d"
};

export default async function generate_quiz(req: Request, res: Response) {
    try {
        const { topic: userTopic } = req.body;

        if (!userTopic) {
            return res.status(400).json({ error: "Topic is required in the request body." });
        }
        
        const quizPrompt = `
            You are an expert quiz creator. Your task is to generate a JSON array of exactly 10 multiple-choice quiz questions based on a user's topic.

            The JSON output MUST conform to this TypeScript type definition:
            \`\`\`typescript
            type QuizQuestion = {
              question: string;
              options: {
                a: string;
                b: string;
                c: string;
                d: string;
              };
              answer: keyof QuizQuestion["options"]; // "a" | "b" | "c" | "d"
            };
            \`\`\`

            Here is an example of a single perfect question object:
            \`\`\`json
            {
              "question": "What is the capital of France?",
              "options": {
                "a": "Berlin",
                "b": "Madrid",
                "c": "Paris",
                "d": "Rome"
              },
              "answer": "c"
            }
            \`\`\`

            **Constraints:**
            1.  Generate exactly 10 questions.
            2.  The "answer" key must be one of "a", "b", "c", or "d".
            3.  Your entire response MUST be a single JSON array of 10 question objects, wrapped in a markdown code block that starts with \`\`\`json and ends with \`\`\`.

            Now, generate a 10-question quiz on the following topic: "${userTopic}"
        `;

        const result = await model.generateContent(quizPrompt);
        const response = result.response;
        let text = response.text();

        if (text.startsWith("```json")) {
            text = text.substring(7, text.length - 3).trim();
        } else if (text.startsWith("```")) {
            text = text.substring(3, text.length - 3).trim();
        }

        try {
            const jsonQuiz: QuizQuestion[] = JSON.parse(text);
            res.status(200).json(jsonQuiz);
        } catch (parseError) {
            console.error("Failed to parse JSON from model response:", text);
            console.error("Parse Error:", parseError);
            res.status(500).json({ error: "Failed to parse the generated quiz. The model returned invalid JSON.", rawResponse: text });
        }

    } catch (error) {
        console.error("Error generating quiz with Gemini:", error);
        res.status(500).json({ error: "An unexpected error occurred while generating the quiz." });
    }
}
