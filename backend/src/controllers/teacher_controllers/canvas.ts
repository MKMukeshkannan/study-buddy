import { Request, Response } from "express";
import { exampleJson, model } from "../../utils/constants.js";

export default async function generate_canvas(req: Request, res: Response) {
    try {
        const { prompt: userPrompt } = req.body;

        if (!userPrompt) {
            return res.status(400).json({ error: "Prompt is required in the request body." });
        }
        
        const fullPrompt =  `
            You are an expert visual novel script creator. Your task is to generate a JSON array that represents a highly interactive story based on a user's prompt.

            Follow this exact JSON structure and format. Do NOT deviate from it. Here is an example of a perfect response structure:
            ${exampleJson}

            **Constraints:**
            1. **Canvas Boundaries**: The canvas range size is [40, 600] units wide and [40, 360] units high. ALL 'pos_x' and 'pos_y' values MUST be within these bounds. No element should go outside the canvas.
            2. **Layout & Positioning**: 
               - Avoid overlapping elements (characters, text, buttons) whenever possible to ensure readability.
               - Characters should be "grounded" towards the bottom of the canvas, not floating in the middle. Their 'pos_y' should be high enough to look like they are standing.
            3. **Available Character Images**: You MUST only use the following file names for characters: 'student_1.svg', 'student_2.svg', 'teacher_1.svg', 'teacher_2.svg', 'teacher_3.svg'. Do not invent new file names.
            4. **Brevity is Key**: Each "content" string in the "texts" array must be less than 10 words. Keep it short and punchy.
            5. **Navigation**: The 'navigate_to' property in buttons MUST be the 0-based index (as a string) of the slide to navigate to in the JSON array. For example, to go to the second slide (at index 1), use "1".
            6. **Required Format**: Your entire response MUST be a single JSON array, wrapped in a markdown code block that starts with \`\`\`json and ends with \`\`\`.

            Now, generate a new, interactive visual novel script based on the following topic: "${userPrompt}"
        `;
        
        const result = await model.generateContent(fullPrompt);
        const response =  result.response;
        let text = response.text();

        if (text.startsWith("```json")) {
            text = text.substring(7, text.length - 3).trim();
        } else if (text.startsWith("```")) {
             text = text.substring(3, text.length - 3).trim();
        }


        try {
            const jsonCanvas = JSON.parse(text);
            res.status(200).json({
              status: "success",
              canvasContent: jsonCanvas
            });
        } catch (parseError) {
            console.error("Failed to parse JSON from model response:", text);
            console.error("Parse Error:", parseError);
            res.status(500).json({ status: "failed", error: "Failed to parse the generated story. The model returned invalid JSON.", rawResponse: text });
        }

    } catch (error) {
        console.error("Error generating canvas with Gemini:", error);
        res.status(500).json({ status: "failed", error: "An unexpected error occurred while generating the canvas." });
    }
}
