import express, { Response, Request, NextFunction } from "express";
import dotenv from "dotenv";

import { AppError } from "./utils/AppError";
import { catchError } from "./utils/catchError";

import authRouter from "./routes/auth.routes";
import productsRouter from "./routes/products.routes";
import categoriesRouter from "./routes/categories.routes";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/auth", authRouter);
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  return next(new AppError("Route not found", 404));
});

app.use(catchError);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
