import express, { Response, Request, NextFunction } from "express";
import dotenv from "dotenv";

import { AppError } from "./utils/AppError";
import { catchError } from "./utils/catchError";

import authRouter from "./routes/auth.route";
import productsRouter from "./routes/products.route";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/auth", authRouter);
app.use("/products", productsRouter);

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  return next(new AppError("Route not found", 404));
});

app.use(catchError);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
