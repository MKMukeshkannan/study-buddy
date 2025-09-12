import express from "express";
import async_middleware from "../middlewares/AsyncMiddleware.js";
import generate_canvas from "../controllers/teacher_controllers/canvas.js";
import generate_quiz from "../controllers/teacher_controllers/quiz.js";

const route = express.Router();

route.post("/generate-canvas", async_middleware(generate_canvas));
route.post("/generate-quiz", async_middleware(generate_quiz));

export default route;
