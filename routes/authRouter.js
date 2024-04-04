import express from "express";

import validateBody from "../helpers/validateBody.js";

import { registerSchema, loginSchema } from "../schemas/usersSchemas.js";

import { login, register, logout, getCurrent } from "../controllers/authControllers.js";
import authenticate from "../middlewares/authenticate.js";


const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), register);

authRouter.post("/login", validateBody(loginSchema), login);

authRouter.get("/current", authenticate, getCurrent);

authRouter.post("/logout", authenticate, logout);

export default authRouter;
