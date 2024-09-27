import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(3).max(255),
  price: z.number().positive(),
  image: z.string().url(),
  categoryId: z.string(),
  stock: z.number().positive(),
  sold: z.number().positive().optional(),
});

export const UpdateProductSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().min(3).max(255).optional(),
  price: z.number().positive().optional(),
  image: z.string().url().optional(),
  categoryId: z.string().optional(),
  stock: z.number().positive().optional(),
  sold: z.number().positive().optional(),
});
