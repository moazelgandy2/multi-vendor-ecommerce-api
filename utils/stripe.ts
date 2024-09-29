import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY;

if (!stripeSecret) {
  throw new Error("Stripe secret key not found");
}

export const stripe = new Stripe(stripeSecret, {
  apiVersion: "2024-06-20",
  typescript: true,
});
