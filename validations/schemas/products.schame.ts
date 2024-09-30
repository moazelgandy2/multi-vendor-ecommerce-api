import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(3).max(255),
  price: z.string(),
  image: z.instanceof(Buffer).refine((buffer) => buffer.length > 0, {
    message: "Image is required",
  }),
  categoryId: z.string(),
  stock: z.string(),
  sold: z.string().optional(),
});

export const UpdateProductSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().min(3).max(255).optional(),
  price: z.string().optional(),
  image: z
    .instanceof(Buffer)
    .refine((buffer) => buffer.length > 0, {
      message: "Image is required",
    })
    .optional(),
  categoryId: z.string().optional(),
  stock: z.string().optional(),
  sold: z.string().optional(),
});
