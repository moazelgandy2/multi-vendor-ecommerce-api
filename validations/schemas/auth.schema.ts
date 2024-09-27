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
