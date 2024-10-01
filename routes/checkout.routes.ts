import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { createCheckout, payCash } from "../controllers/checkout.controller";
import { allowedRoles } from "../middleware/validate-permission.middleware";

const checkOutRouter = Router();

checkOutRouter.post("/:id", authMiddleware, createCheckout);

checkOutRouter.put(
  "/cash/:id",
  authMiddleware,
  allowedRoles("admin", "seller"),
  payCash
);

export default checkOutRouter;
