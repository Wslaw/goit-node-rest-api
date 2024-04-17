import express from "express";

import validateBody from "../helpers/validateBody.js";
import { updateAvatar } from "../controllers/authControllers.js";
import { registerSchema, loginSchema, userEmailSchema } from "../schemas/usersSchemas.js";

import { login, register, logout, getCurrent, verify, resendVerify } from "../controllers/authControllers.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), register);

authRouter.get("/verify/:verificationToken", verify);

authRouter.post("/verify", validateBody(userEmailSchema), resendVerify);


authRouter.post("/login", validateBody(loginSchema), login);

authRouter.get("/current", authenticate, getCurrent);

authRouter.post("/logout", authenticate, logout);

authRouter.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

export default authRouter;
