import { Router } from "express";

import { signIn, signUp } from "../controllers/auth.controller";

import { validateData } from "../validations/validate";
import { SignInSchema, SignUpSchema } from "../validations/schemas/auth.schema";

const authRouter = Router();

authRouter.post("/signup", validateData(SignUpSchema), signUp);
authRouter.post("/signin", validateData(SignInSchema), signIn);

export default authRouter;
