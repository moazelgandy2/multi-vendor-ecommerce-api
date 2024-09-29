import Stripe from "stripe";
import { stripe } from "../utils/stripe";
import { db } from "../database/db";
import { NextFunction, Response } from "express";
import { AppError } from "../utils/AppError";
import { AppSuccess } from "../utils/AppSuccess";
import { AuthenticatedRequest } from "../utils/types";

export const createCheckout = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return next(new AppError("Unauthorized", 401));

  const { id } = req.params;

  if (!id) {
    return next(new AppError("Order not found", 400));
  }

  const order = await db.order.findFirst({
    where: {
      id,
      paymentType: "CARD",
      status: "PENDING",
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    return next(
      new AppError("Order not found or payment type is not CARD", 404)
    );
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
    order.orderItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
          images: [item.product.image],
          description: item.product.description,
          metadata: {
            productId: item.product.id,
            orderId: order.id,
          },
        },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    customer_email: req.user.email,
    mode: "payment",
    success_url: `${process.env.BASE_URL}/order?success=1&orderId=${order.id}`,
    cancel_url: `${process.env.BASE_URL}/order?success=0&orderId=${order.id}`,
    metadata: {
      orderId: order.id,
    },
  });

  res.status(200).json(new AppSuccess("Checkout created", { session }));
};
