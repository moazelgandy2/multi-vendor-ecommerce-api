import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import {
  addToWishList,
  clearWishList,
  deleteFromWishList,
  getUserWishList,
} from "../controllers/wishlist.controller";

const wishListRouter = Router();

wishListRouter.get("/me", authMiddleware, getUserWishList);
wishListRouter.post("/:id", authMiddleware, addToWishList);
wishListRouter.delete("/:id", authMiddleware, deleteFromWishList);
wishListRouter.delete("/", authMiddleware, clearWishList);

export default wishListRouter;
