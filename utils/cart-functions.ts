import { Cart, CartItem, Product } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { AppError } from "./AppError";
import { AppSuccess } from "./AppSuccess";
import { db } from "../database/db";

export const getPriceAfterDiscount = (
  total: number,
  discount: number
): number => {
  const discountValue = (discount / 100) * total;

  return parseFloat((total - discountValue).toFixed(2));
};

export async function handleExistingCart(
  cart: Cart,
  product: Product,
  userId: string,
  res: Response,
  next: NextFunction,
  quantity?: number
) {
  const productInCart = await db.cartItem.findFirst({
    where: { cartId: cart.id, productId: product.id },
  });

  if (productInCart) {
    await updateExistingCartItem(cart, product, productInCart, next, quantity);
  } else {
    await addNewCartItem(cart, product);
  }

  const updatedCart = await updateCartTotals(cart, product.price);
  const cartData = await getCartData(userId);

  if (!cartData) {
    return next(new AppError("Cart not found", 404));
  }

  res.status(201).json(new AppSuccess("Product added to cart", cartData));
}

async function updateExistingCartItem(
  cart: Cart,
  product: Product,
  productInCart: CartItem,
  next: NextFunction,
  quantity?: number
) {
  if (!quantity && productInCart.quantity + 1 > product.stock) {
    return next(new AppError("Product out of stock", 409));
  }

  if (quantity && quantity > product.stock) {
    return next(new AppError("Product out of stock", 409));
  }

  await db.cartItem.update({
    where: { id: productInCart.id },
    data: {
      quantity: quantity || productInCart.quantity + 1,
      amount: productInCart.amount + (quantity ?? 1) * product.price,
    },
  });
}

async function addNewCartItem(cart: Cart, product: Product) {
  await db.cartItem.create({
    data: {
      cartId: cart.id,
      productId: product.id,
      quantity: 1,
      amount: product.price,
    },
  });
}

async function updateCartTotals(
  cart: Cart,
  productPrice: number
): Promise<Cart> {
  const updatedCart = await db.cart.update({
    where: { id: cart.id },
    data: { total: cart.total + productPrice },
  });

  if (cart.discount) {
    const discount = getPriceAfterDiscount(updatedCart.total, cart.discount);
    return db.cart.update({
      where: { id: cart.id },
      data: { totalAfterDiscount: discount },
    });
  }

  return updatedCart;
}

export async function createNewCart(
  userId: string,
  product: Product,
  res: Response
) {
  const newCart = await db.cart.create({
    data: {
      userId,
      total: product.price,
      cartItems: {
        create: {
          productId: product.id,
          quantity: 1,
          amount: product.price,
        },
      },
    },
  });

  const cartData = await getCartData(userId);
  res.status(201).json(new AppSuccess("Product added to cart", cartData));
}

async function getCartData(userId: string): Promise<Cart | null> {
  return db.cart.findFirst({
    where: { userId },
    include: {
      cartItems: {
        include: { product: true },
      },
    },
  });
}

export async function deleteCart(cartId: string) {
  const [cart, cartItems] = await Promise.all([
    db.cart.delete({ where: { id: cartId } }),
    db.cartItem.deleteMany({ where: { cartId } }),
  ]);

  return { cart, cartItems };
}
