import express from "express";
import {user_login, user_signup} from "../controllers/auth_controllers/index.js";
import async_middleware from "../middlewares/AsyncMiddleware.js";

const route = express.Router();

route.post("/signup", async_middleware(user_signup));
route.post("/login", async_middleware(user_login));

export default route;

