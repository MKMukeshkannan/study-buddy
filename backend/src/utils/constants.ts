import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

export const exampleJson = `
[
  {
    "id": "1",
    "characters": [
      { "id": "teacher", "file_name": "teacher_1.svg", "pos_x": 50, "pos_y": 180 }
    ],
    "texts": [
      { "id": "title", "content": "The Amazing Process of Photosynthesis!", "pos_x": 120, "pos_y": 40 },
      { "id": "intro_text", "content": "Hello class! Today, we're going to learn about how plants eat. It's a process called Photosynthesis.", "pos_x": 150, "pos_y": 120 }
    ],
    "buttons": [
      { "id": "start_button", "content": "Let's learn!", "navigate_to": "2", "pos_x": 270, "pos_y": 350 }
    ]
  },
  {
    "id": "2",
    "characters": [
      { "id": "teacher", "file_name": "teacher_1.svg", "pos_x": 50, "pos_y": 180 },
      { "id": "student", "file_name": "student_1.svg", "pos_x": 500, "pos_y": 180 }
    ],
    "texts": [
      { "id": "question_text", "content": "Photosynthesis is how plants use sunlight, water, and a gas called carbon dioxide to create their own food.", "pos_x": 100, "pos_y": 80 }
    ],
    "buttons": [
      { "id": "next_button_1", "content": "How do they do that?", "navigate_to": "3", "pos_x": 240, "pos_y": 350 }
    ]
  }
]
`;

