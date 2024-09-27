import { Router } from "express";

import { validateData } from "../validations/validate";
import authMiddleware from "../middleware/auth.middleware";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/products.controller";
import { allowedRoles } from "../middleware/validate-permission.middleware";
import {
  CreateProductSchema,
  UpdateProductSchema,
} from "../validations/schemas/products.schame";

const productsRouter = Router();

productsRouter.get("/", getProducts);
productsRouter.get("/:id", getProduct);

productsRouter.post(
  "/",
  authMiddleware,
  allowedRoles("admin", "seller"),
  validateData(CreateProductSchema),
  createProduct
);

productsRouter.put(
  "/:id",
  authMiddleware,
  allowedRoles("admin", "seller"),
  validateData(UpdateProductSchema),
  updateProduct
);

productsRouter.delete(
  "/:id",
  authMiddleware,
  allowedRoles("admin", "seller"),
  deleteProduct
);

export default productsRouter;
