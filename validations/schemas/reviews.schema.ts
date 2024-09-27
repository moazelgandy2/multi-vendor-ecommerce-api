import { z } from "zod";

export const CreateReviewsSchema = z.object({
  rating: z.number().finite().min(1).max(5),
  comment: z.string().min(2).max(200),
});

export const UpdateReviewsSchema = z.object({
  rating: z.number().finite().min(1).max(5),

  comment: z.string().min(2).max(200).optional(),
});
