import { z } from "zod";

export const SignUpSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(8),
});

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const UpdateProfileSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  phone: z.string().min(10),
});

export const ChangePasswordSchema = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
});
