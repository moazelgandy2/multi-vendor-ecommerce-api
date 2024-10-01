import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import {
  applyCoupon,
  createCoupon,
  deleteCoupon,
} from "../controllers/coupon.controller";
import { validateData } from "../validations/validate";
import {
  applyCouponSchema,
  createCouponSchema,
} from "../validations/schemas/coupon.schema";

const couponRouter = Router();

couponRouter.post(
  "/create",
  authMiddleware,
  validateData(createCouponSchema),
  createCoupon
);
couponRouter.delete("/:code", authMiddleware, deleteCoupon);

couponRouter.post(
  "/apply",
  authMiddleware,
  validateData(applyCouponSchema),
  applyCoupon
);

export default couponRouter;
