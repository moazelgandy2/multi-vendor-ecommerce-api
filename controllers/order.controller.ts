import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest, JWTDecoded } from "../utils/types";
import { AppError } from "../utils/AppError";
import { db } from "../database/db";
import { deleteCart } from "../utils/cart-functions";
import { AppSuccess } from "../utils/AppSuccess";
import { createPaymentOrder, getOrders } from "../utils/order-functions";

export const createOrder = async (
  req: Request extends { user: JWTDecoded } ? Request : any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;
    const { payment } = req.query;

    if (payment != "COD" && payment != "CARD") {
      console.log(payment);
      return next(new AppError("Invalid payment type", 400));
    }

    const cart = await db.cart.findFirst({
      where: {
        userId: user.id,
      },
      include: {
        cartItems: true,
      },
    });

    if (!cart) {
      return next(new AppError("User has no carts.", 404));
    }

    const order = await createPaymentOrder(user.id, payment, cart);

    await deleteCart(cart.id);

    res.status(201).json(new AppSuccess("Order created", { order }));
  } catch (error) {
    console.log(error);
    return next(new AppError("Internal server error", 500));
  }
};

export const payCashOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const order = await db.order.findFirst({
      where: {
        id,
      },
    });

    if (!order) return next(new AppError("Order not found", 404));

    if (order.paymentType != "COD")
      return next(new AppError("Order is not cash on delivery", 400));

    const orderData = await db.order.update({
      where: {
        id,
      },
      data: {
        status: "PAID",
      },
    });

    res.status(200).json(new AppSuccess("Order paid", { orderData }));
  } catch (error) {
    console.log(error);
    return next(new AppError("Internal server error", 500));
  }
};

export const filterOrders = async (
  req: Request extends { user: JWTDecoded } ? Request : any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;
    const { status, delivery, paymentType } = req.query;

    const orders = await getOrders(user.role, user.id);

    if (!orders) return next(new AppError("No orders found", 404));

    const filteredOrders = orders.filter((order) => {
      const conditions = [
        !status || order.status === status.toUpperCase(),
        !delivery || order.delivery === delivery.toUpperCase(),
        !paymentType || order.paymentType === paymentType.toUpperCase(),
      ];

      return conditions.every((condition) => condition);
    });

    res
      .status(200)
      .json(new AppSuccess("Orders found", { orders: filteredOrders }));
  } catch (error) {
    console.log(error);
    return next(new AppError("Internal server error", 500));
  }
};

export const updateDeliveryStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body);
    const { id } = req.params;
    const { status } = req.body;

    const order = await db.order.findFirst({
      where: {
        id,
      },
    });

    if (!order) return next(new AppError("Order not found", 404));

    const orderData = await db.order.update({
      where: {
        id,
      },
      data: {
        delivery: status,
      },
    });

    res.status(200).json(new AppSuccess("Order updated", { orderData }));
  } catch (error) {
    console.log(error);
    return next(new AppError("Internal server error", 500));
  }
};

export const deleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const order = await db.order.findFirst({
      where: {
        id,
      },
    });

    if (!order) return next(new AppError("Order not found", 404));

    const orderData = await db.order.delete({
      where: {
        id,
      },
    });

    res.status(200).json(new AppSuccess("Order cancelled", { orderData }));
  } catch (error) {
    console.log(error);
    return next(new AppError("Internal server error", 500));
  }
};

export const cancelOrder = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;
    if (!user) return next(new AppError("User not found", 404));

    const { id } = req.params;

    const order = await db.order.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!order) return next(new AppError("Order not found", 404));

    const orderData = await db.order.delete({
      where: {
        id,
      },
    });

    res.status(200).json(new AppSuccess("Order cancelled", { orderData }));
  } catch (error) {
    console.log(error);
    return next(new AppError("Internal server error", 500));
  }
};
