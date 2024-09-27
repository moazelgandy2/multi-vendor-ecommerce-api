import { Router } from "express";
import {
  addReview,
  deleteReview,
  getProductReviews,
  getUserReviews,
  updateReview,
} from "../controllers/reviews.controller";
import authMiddleware from "../middleware/auth.middleware";
import { validateData } from "../validations/validate";
import {
  CreateReviewsSchema,
  UpdateReviewsSchema,
} from "../validations/schemas/reviews.schema";
import { allowedRoles } from "../middleware/validate-permission.middleware";

const reviewsRouter = Router();

reviewsRouter.get("/product/:id", getProductReviews);

reviewsRouter.post(
  "/product/:id",
  authMiddleware,
  validateData(CreateReviewsSchema),
  addReview
);

reviewsRouter.put(
  "/:id",
  authMiddleware,
  validateData(UpdateReviewsSchema),
  updateReview
);

reviewsRouter.delete("/:id", authMiddleware, deleteReview);

reviewsRouter.get(
  "/user/:id",
  authMiddleware,
  allowedRoles("admin"),
  getUserReviews
);
export default reviewsRouter;
