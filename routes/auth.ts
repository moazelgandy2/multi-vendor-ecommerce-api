import { Router } from "express";

import {
  changePassword,
  me,
  signIn,
  signUp,
  updateProfile,
} from "../controllers/auth.controller";

import { validateData } from "../validations/validate";
import {
  ChangePasswordSchema,
  SignInSchema,
  SignUpSchema,
  UpdateProfileSchema,
} from "../validations/schemas/auth.schema";
import authMiddleware from "../middleware/auth.middleware";

const authRouter = Router();

authRouter.post("/signup", validateData(SignUpSchema), signUp);

authRouter.post("/signin", validateData(SignInSchema), signIn);

authRouter.get("/me", authMiddleware, me);

authRouter.put(
  "/me",
  authMiddleware,
  validateData(UpdateProfileSchema),
  updateProfile
);

authRouter.put(
  "/me/password",
  authMiddleware,
  validateData(ChangePasswordSchema),
  changePassword
);

export default authRouter;
