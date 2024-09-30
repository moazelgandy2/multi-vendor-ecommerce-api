import { Router } from "express";

import {
  changePassword,
  me,
  resetPassword,
  signIn,
  signUp,
  updateProfile,
  verifyOTP,
} from "../controllers/auth.controller";

import { validateData } from "../validations/validate";
import {
  ChangePasswordSchema,
  resetPasswordSchema,
  SignInSchema,
  SignUpSchema,
  UpdateProfileSchema,
  verifyOTPSchema,
} from "../validations/schemas/auth.schema";
import authMiddleware from "../middleware/auth.middleware";

const authRouter = Router();

authRouter.post("/signup", validateData(SignUpSchema), signUp);

authRouter.post("/signin", validateData(SignInSchema), signIn);

authRouter.get("/profile", authMiddleware, me);

authRouter.put(
  "/profile",
  authMiddleware,
  validateData(UpdateProfileSchema),
  updateProfile
);

authRouter.put(
  "/password/update",
  authMiddleware,
  validateData(ChangePasswordSchema),
  changePassword
);

authRouter.post(
  "/password/forgot",
  validateData(resetPasswordSchema),
  resetPassword
);

authRouter.post("/otp/verify", validateData(verifyOTPSchema), verifyOTP);

export default authRouter;
