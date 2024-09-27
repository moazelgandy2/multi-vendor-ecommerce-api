import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryWithProducts,
  updateCategory,
} from "../controllers/categories.controller";
import authMiddleware from "../middleware/auth.middleware";
import { allowedRoles } from "../middleware/validate-permission.middleware";
import { validateData } from "../validations/validate";
import {
  CreateCategorySchema,
  UpdateCategorySchema,
} from "../validations/schemas/categories.schema";

const categoriesRouter = Router();

categoriesRouter.get("/", getAllCategories);

categoriesRouter.get("/:id", getCategoryWithProducts);

categoriesRouter.post(
  "/",
  authMiddleware,
  allowedRoles("admin"),
  validateData(CreateCategorySchema),
  createCategory
);

categoriesRouter.put(
  "/:id",
  authMiddleware,
  allowedRoles("admin"),
  validateData(UpdateCategorySchema),
  updateCategory
);

categoriesRouter.delete(
  "/:id",
  authMiddleware,
  allowedRoles("admin"),
  deleteCategory
);

export default categoriesRouter;
