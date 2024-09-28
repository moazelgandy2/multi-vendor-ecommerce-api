import { NextFunction, Request, Response } from "express";
import { JWTDecoded } from "../utils/types";
import { AppError } from "../utils/AppError";
import { db } from "../database/db";
import { AppSuccess } from "../utils/AppSuccess";

export const getUserWishList = async (
  req: Request extends { user: JWTDecoded } ? Request : any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;

    const userWishList = await db.wishList.findMany({
      where: {
        userId,
      },
      include: {
        product: {
          select: {
            name: true,
            price: true,
            description: true,
            image: true,
            category: {
              select: {
                name: true,
              },
            },
            seller: {
              select: {
                username: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json(new AppSuccess("User wish list", userWishList));
  } catch (err) {
    console.error(err);
    next(new AppError("Internal server error", 500));
  }
};

export const addToWishList = async (
  req: Request extends { user: JWTDecoded } ? Request : any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;

    const { id: productId } = req.params;

    const existWishList = await db.wishList.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existWishList) {
      return next(new AppError("Product already in wish list", 400));
    }

    await db.wishList.create({
      data: {
        userId,
        productId,
      },
    });

    const userWishList = await db.wishList.findMany({
      where: {
        userId,
      },
      include: {
        product: {
          select: {
            name: true,
            price: true,
            description: true,
            image: true,
            category: {
              select: {
                name: true,
              },
            },
            seller: {
              select: {
                username: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    res
      .status(200)
      .json(new AppSuccess("Product added to wish list", userWishList));
  } catch (err) {
    console.error(err);
    next(new AppError("Internal server error", 500));
  }
};

export const deleteFromWishList = async (
  req: Request extends { user: JWTDecoded } ? Request : any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;

    const { id: productId } = req.params;

    const existWishList = await db.wishList.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (!existWishList) {
      return next(new AppError("Product not in wish list", 400));
    }

    await db.wishList.delete({
      where: {
        id: existWishList.id,
      },
    });

    const userWishList = await db.wishList.findMany({
      where: {
        userId,
      },
      include: {
        product: {
          select: {
            name: true,
            price: true,
            description: true,
            image: true,
            category: {
              select: {
                name: true,
              },
            },
            seller: {
              select: {
                username: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    res
      .status(200)
      .json(new AppSuccess("Product removed from wish list", userWishList));
  } catch (err) {
    console.error(err);
    next(new AppError("Internal server error", 500));
  }
};

export const clearWishList = async (
  req: Request extends { user: JWTDecoded } ? Request : any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;

    const deletedWishList = await db.wishList.deleteMany({
      where: {
        userId,
      },
    });

    res.status(200).json(new AppSuccess("Wish list cleared", deletedWishList));
  } catch (err) {
    console.error(err);
    next(new AppError("Internal server error", 500));
  }
};
