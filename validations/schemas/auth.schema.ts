import { z } from "zod";

export const SignUpSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(8),
  address: z.array(
    z.object({
      street: z.string().min(5),
      city: z.string().min(3),
      state: z.string().min(3),
      zip: z.string().min(5),
      isDefault: z.boolean(),
    })
  ),
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

export const updateAddressSchema = z.object({
  street: z.string().min(5),
  city: z.string().min(3),
  state: z.string().min(3),
  zip: z.string().min(5),
  isDefault: z.boolean(),
});

export const ChangePasswordSchema = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
});
