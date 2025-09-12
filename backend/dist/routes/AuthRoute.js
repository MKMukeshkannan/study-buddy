import express from "express";
import { student_signup, student_login, staff_login, staff_signup } from "../controllers/auth_controllers/index.js";
import async_middleware from "../middlewares/AsyncMiddleware.js";
const route = express.Router();
route.post("/student/signup", async_middleware(student_signup));
route.post("/student/login", async_middleware(student_login));
route.post("/staff/signup", async_middleware(staff_signup));
route.post("/staff/login", async_middleware(staff_login));
export default route;
//# sourceMappingURL=AuthRoute.js.map