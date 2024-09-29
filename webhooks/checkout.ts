import Stripe from "stripe";
import { stripe } from "../utils/stripe";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { db } from "../database/db";

export const stripeWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body;
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (error) {
      console.log(error);
      return next(new AppError("Invalid signature", 400));
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
      await db.order.update({
        where: {
          id: session?.metadata?.orderId,
        },
        data: {
          status: "PAID",
        },
      });
    }

    if (event.type === "payment_intent.payment_failed") {
      await db.order.update({
        where: {
          id: session?.metadata?.orderId,
        },
        data: {
          status: "FAILED",
        },
      });
    }

    res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.log(error);
    return next(new AppError("An error occurred", 500));
  }
};
