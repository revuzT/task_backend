import express from "express";
import { registerSchema, loginSchema } from "../validators/auth.validator";
import { validate } from "../middleware.ts/validate.middleware";
import { login, register } from "../controller/auth.controller";

const authRouter = express.Router();

authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", validate(loginSchema), login);

export default authRouter;
