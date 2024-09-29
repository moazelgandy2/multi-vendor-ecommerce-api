import express, { Response, Request, NextFunction } from "express";
import dotenv from "dotenv";

import { AppError } from "./utils/AppError";
import { catchError } from "./utils/catchError";

import authRouter from "./routes/auth.routes";
import productsRouter from "./routes/products.routes";
import categoriesRouter from "./routes/categories.routes";
import reviewsRouter from "./routes/reviews.routes";
import cartRouter from "./routes/cart.routes";
import wishListRouter from "./routes/wishlist.routes";
import couponRouter from "./routes/coupon.routes";
import orderRouter from "./routes/order.routes";
import checkOutRouter from "./routes/checkout.routes";
import cors from "cors";
import { stripeWebhook } from "./webhooks/checkout";

dotenv.config();

const app = express();
app.use(cors());
app.use((req, res, next) => {
  if (req.originalUrl === "/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});
const PORT = process.env.PORT || 3000;

app.use("/auth", authRouter);
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);
app.use("/reviews", reviewsRouter);
app.use("/cart", cartRouter);
app.use("/wishlist", wishListRouter);
app.use("/coupon", couponRouter);
app.use("/order", orderRouter);
app.use("/checkout", checkOutRouter);
app.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  return next(new AppError("Route not found", 404));
});

app.use(catchError);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
