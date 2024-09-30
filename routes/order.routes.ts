import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import {
  cancelOrder,
  createOrder,
  deleteOrder,
  filterOrders,
  updateDeliveryStatus,
} from "../controllers/order.controller";
import { allowedRoles } from "../middleware/validate-permission.middleware";
import { validateData } from "../validations/validate";
import { updateDeliveryStatusSchema } from "../validations/schemas/order.schema";

const orderRouter = Router();

orderRouter.post("/create", authMiddleware, createOrder);

orderRouter.get("/me", authMiddleware, filterOrders);
orderRouter.get("/me/cancel/:id", authMiddleware, cancelOrder);

orderRouter.delete(
  "/:id",
  authMiddleware,
  allowedRoles("admin", "seller"),
  deleteOrder
);

orderRouter.put(
  "/delivery/:id",
  authMiddleware,
  allowedRoles("admin", "seller"),
  validateData(updateDeliveryStatusSchema),
  updateDeliveryStatus
);

export default orderRouter;
