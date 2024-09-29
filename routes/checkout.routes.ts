import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { createCheckout } from "../controllers/checkout.controller";

const checkOutRouter = Router();

checkOutRouter.post("/:id", authMiddleware, createCheckout);

export default checkOutRouter;
