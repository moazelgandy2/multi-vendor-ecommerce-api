import { Cart, CartItem, paymentStatus } from "@prisma/client";
import { db } from "../database/db";

export const createPaymentOrder = async (
  userId: string,
  paymentType: "COD" | "CARD",
  cart: Cart & { cartItems: CartItem[] }
) => {
  const order = await db.order.create({
    data: {
      userId,
      total: cart.total,
      paymentType,
    },
  });
  await createOrderItems(order.id, cart.cartItems);
  return await getOrderData(order.id);
};

const createOrderItems = async (orderId: string, cartItems: CartItem[]) => {
  const orderItemsData = cartItems.map(({ productId, quantity }) => ({
    productId,
    orderId,
    quantity,
  }));

  await db.orderItems.createMany({
    data: orderItemsData,
  });
};

const getOrderData = async (orderId: string) => {
  return db.order.findFirst({
    where: { id: orderId },
    select: {
      total: true,
      paymentType: true,
      status: true,
      orderItems: {
        select: { product: true },
      },
    },
  });
};

export const getOrders = async (
  type: "USER" | "SELLER" | "ADMIN",
  userId: string
) => {
  let orders;
  type == "SELLER" &&
    (orders = await db.order.findMany({
      include: {
        orderItems: {
          select: {
            product: true,
          },
        },
      },
      where: {
        orderItems: {
          some: {
            product: {
              sellerId: userId,
            },
          },
        },
      },
    }));
  type == "USER" &&
    (orders = await db.order.findMany({
      include: {
        orderItems: {
          select: {
            product: true,
          },
        },
      },
      where: {
        userId,
      },
    }));

  type == "ADMIN" &&
    (orders = await db.order.findMany({
      include: {
        orderItems: {
          select: {
            product: true,
          },
        },
      },
    }));

  return orders;
};

export const updateOrderStatus = async (
  orderId: string,
  status: paymentStatus
) => {
  const order = await db.order.update({
    where: {
      id: orderId,
    },
    data: {
      status,
    },
  });

  return order;
};
