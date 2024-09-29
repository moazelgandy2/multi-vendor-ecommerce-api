import { z } from "zod";

export const createCouponSchema = z.object({
  code: z.string().min(3).max(10),
  discount: z.number().min(1).max(100),
  expiryInDays: z.number().min(1).max(365),
});

export const applyCouponSchema = z.object({
  code: z.string().min(3).max(10),
});
