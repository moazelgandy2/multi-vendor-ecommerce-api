import { Router } from "express";
import multer, { MulterError } from "multer";

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
import { FileFilter } from "../utils/types";

const productsRouter = Router();

const storage = multer.memoryStorage();

const fileFilter: FileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(
      new MulterError("LIMIT_UNEXPECTED_FILE", "Only image files are allowed")
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 },
});

productsRouter.get("/", getProducts);
productsRouter.get("/:id", getProduct);

productsRouter.post(
  "/",
  authMiddleware,
  allowedRoles("admin", "seller"),
  upload.single("image"),
  validateData(CreateProductSchema),
  createProduct
);

productsRouter.put(
  "/:id",
  authMiddleware,
  allowedRoles("admin", "seller"),
  upload.single("image"),
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
