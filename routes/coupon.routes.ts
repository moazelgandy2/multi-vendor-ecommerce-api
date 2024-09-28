import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import {
  applyCoupon,
  createCoupon,
  deleteCoupon,
} from "../controllers/coupon.controller";

const couponRouter = Router();

couponRouter.post("/create", authMiddleware, createCoupon);
couponRouter.delete("/:code", authMiddleware, deleteCoupon);
couponRouter.post("/apply", authMiddleware, applyCoupon);

export default couponRouter;
