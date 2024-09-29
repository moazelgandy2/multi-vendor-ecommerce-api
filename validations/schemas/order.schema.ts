import { z } from "zod";

export const updateDeliveryStatusSchema = z.object({
  status: z.enum(["DELIVERED", "PENDING", "REJECTED", "ACCEPTED"]),
});
