import { NextFunction, Request, Response } from "express";
import { JWTDecoded } from "../utils/types";
import { AppError } from "../utils/AppError";
import { db } from "../database/db";
import { AppSuccess } from "../utils/AppSuccess";

export const getUserCart = async (
  req: Request extends { user: JWTDecoded } ? Request : any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userCart = await db.cart.findFirst({
      where: {
        userId: req.user.id,
      },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!userCart) {
      return next(new AppError("No cart found for the user.", 404));
    }

    res.status(200).json(new AppSuccess("Cart fetched successfully", userCart));
  } catch (error) {
    console.log(error);
    return next(new AppError("Internal server error", 500));
  }
};

export const addProductToCart = async (
  req: Request extends { user: JWTDecoded } ? Request : any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const cart = await db.cart.findFirst({
      where: {
        userId: req.user.id,
      },
    });
    const product = await db.product.findFirst({
      where: {
        id,
      },
    });

    if (!product) return next(new AppError("Product not found", 404));

    if (cart) {
      const productInCart = await db.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: id,
        },
      });

      if (productInCart) {
        if (productInCart.quantity + 1 > product.stock) {
          return next(new AppError("Product out of stock", 409));
        }
        await db.cartItem.update({
          where: {
            id: productInCart.id,
          },
          data: {
            quantity: productInCart.quantity + 1,
            amount: productInCart.amount + product.price,
          },
        });
        await db.cart.update({
          where: {
            id: cart.id,
          },
          data: {
            total: cart.total + product.price,
          },
        });
      } else {
        await db.cartItem.create({
          data: {
            cartId: cart.id,
            productId: id,
            quantity: 1,
            amount: product.price,
          },
        });
        await db.cart.update({
          where: {
            id: cart.id,
          },
          data: {
            total: cart.total + product.price,
          },
        });
      }

      const cartData = await db.cart.findFirst({
        where: {
          userId: req.user.id,
        },
        include: {
          cartItems: {
            include: {
              product: true,
            },
          },
        },
      });

      res
        .status(201)
        .json(new AppSuccess("Product added to cart first", cartData));
    } else {
      const newCart = await db.cart.create({
        data: {
          userId: req.user.id,
          total: product.price,
        },
      });

      const cartItem = await db.cartItem.create({
        data: {
          cartId: newCart.id,
          productId: product.id,
          quantity: 1,
          amount: product.price,
        },
      });

      const cartData = await db.cart.findFirst({
        where: {
          userId: req.user.id,
        },
        include: {
          cartItems: {
            include: {
              product: true,
            },
          },
        },
      });

      res.status(201).json(new AppSuccess("Product added to cart", cartData));
    }
  } catch (error) {
    console.log(error);
    return next(new AppError("Internal server error", 500));
  }
};

export const deleteCart = async (
  req: Request extends { user: JWTDecoded } ? Request : any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const isAdmin = await db.user.findFirst({
      where: {
        id: req.user.id,
        role: "ADMIN",
      },
    });

    const cart = await db.cart.findFirst({
      where: {
        id: id,
      },
    });

    if (!cart) {
      return next(new AppError("No cart found for the user.", 404));
    }

    if (cart.userId != req.user.id && !isAdmin)
      return next(
        new AppError(`You are not authorized to delete this cart.`, 409)
      );

    await db.cart.deleteMany({
      where: {
        id,
      },
    });

    await db.cartItem.deleteMany({
      where: {
        cartId: id,
      },
    });

    res.status(200).json(new AppSuccess("Cart cleared successfully", {}));
  } catch (error) {
    console.log(error);
    return next(new AppError("Internal server error", 500));
  }
};

export const updateUserCart = async (
  req: Request extends { user: JWTDecoded } ? Request : any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const cart = await db.cart.findFirst({
      where: {
        userId: req.user.id,
      },
    });

    if (!cart) {
      return next(new AppError("No cart found for the user.", 404));
    }

    const product = await db.product.findFirst({
      where: {
        id,
      },
    });

    if (!product) return next(new AppError("Product not found", 404));

    if (quantity >= product.stock) {
      return next(new AppError("Product out of stock", 409));
    }

    const productInCart = await db.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: id,
      },
    });

    if (!productInCart) {
      await db.cartItem.create({
        data: {
          cartId: cart.id,
          productId: id,
          quantity,
          amount: quantity * product.price,
        },
        include: {
          product: true,
        },
      });
    } else {
      await db.cartItem.update({
        where: {
          id: productInCart.id,
        },
        data: {
          quantity,
          amount: quantity * product.price,
        },
      });
    }

    const itemsData = await db.cartItem.findMany({
      where: {
        cartId: cart.id,
      },
    });

    const totalPrice = itemsData.reduce((acc, item) => {
      return acc + item.amount;
    }, 0);

    await db.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        total: totalPrice,
      },
    });

    const cartData = await db.cart.findFirst({
      where: {
        userId: req.user.id,
      },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });

    res.status(200).json(new AppSuccess("Cart updated successfully", cartData));
  } catch (error) {
    console.log(error);
    return next(new AppError("Internal server error", 500));
  }
};

export const removeProductFromCart = async (
  req: Request extends { user: JWTDecoded } ? Request : any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const cart = await db.cart.findFirst({
      where: {
        userId: req.user.id,
      },
    });

    console.log(cart);

    if (!cart) {
      return next(new AppError("No cart found for the user.", 404));
    }

    const productInCart = await db.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: id,
      },
    });

    console.log(productInCart);

    if (!productInCart) {
      return next(new AppError("Product not found in cart", 404));
    }

    await db.cartItem.delete({
      where: {
        id: productInCart.id,
      },
    });

    const itemsData = await db.cartItem.findMany({
      where: {
        cartId: cart.id,
      },
    });

    const totalPrice = itemsData.reduce((acc, item) => {
      return acc + item.amount;
    }, 0);

    await db.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        total: totalPrice,
      },
    });

    const cartData = await db.cart.findFirst({
      where: {
        userId: req.user.id,
      },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (cartData && cartData.cartItems.length === 0) {
      await db.cart.delete({
        where: {
          id: cart.id,
        },
      });
    }

    res
      .status(200)
      .json(new AppSuccess("Product removed from cart successfully", cartData));
  } catch (error) {
    console.log(error);
    return next(new AppError("Internal server error", 500));
  }
};
