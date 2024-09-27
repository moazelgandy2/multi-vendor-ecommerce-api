import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import {
  addProductToCart,
  deleteCart,
  getUserCart,
  removeProductFromCart,
  updateUserCart,
} from "../controllers/cart.controller";

const cartRouter = Router();

cartRouter.get("/", authMiddleware, getUserCart);
cartRouter.post("/product/:id", authMiddleware, addProductToCart);
cartRouter.delete("/:id", authMiddleware, deleteCart);
cartRouter.put("/product/:id", authMiddleware, updateUserCart);
cartRouter.delete("/product/:id", authMiddleware, removeProductFromCart);

export default cartRouter;
