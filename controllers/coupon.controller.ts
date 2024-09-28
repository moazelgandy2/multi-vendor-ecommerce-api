import { NextFunction, Request, Response } from "express";
import { Coupon, JWTDecoded } from "../utils/types";
import { AppError } from "../utils/AppError";
import { redis } from "../database/redis";
import { db } from "../database/db";
import { AppSuccess } from "../utils/AppSuccess";

export const applyCoupon = async (
  req: Request extends { user: JWTDecoded } ? Request : any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code } = req.body;

    const couponKey = `coupon:${code}`;

    const couponData = await redis.hgetall(couponKey);

    const coupon: Coupon = {
      code: couponData.code,
      discount: parseInt(couponData.discount),
      expiryInDays: parseInt(couponData.expiryInDays, 10),
    };

    if (!coupon) {
      return next(new AppError("Invalid coupon", 400));
    }

    const user = await db.user.findFirst({
      where: {
        id: req.user.id,
      },
    });

    if (!user) {
      return next(new AppError("User not found", 400));
    }

    const cart = await db.cart.findFirst({
      where: {
        userId: req.user.id,
      },
    });

    if (!cart) {
      return next(new AppError("Cart not found", 400));
    }

    const total = cart.total;

    const discount = (coupon.discount / 100) * total;

    const newTotal = total - discount;

    await db.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        totalAfterDiscount: newTotal,
        discount: coupon.discount,
      },
    });

    res.status(200).json(new AppSuccess("Coupon applied", { discount }));
  } catch (err) {
    redis.set("error", JSON.stringify(err));

    console.log(err);
    return next(new AppError("Internal Server Error", 500));
  }
};

export const createCoupon = async (
  req: Request extends { user: JWTDecoded } ? Request : any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code, discount, expiryInDays } = req.body;

    const isAdmin = await db.user.findFirst({
      where: {
        id: req.user.id,
        role: "ADMIN",
      },
    });

    if (!isAdmin) {
      return next(new AppError("Unauthorized", 401));
    }

    const hasKey = `coupon:${code}`;

    const coupon = await redis.hget(hasKey, "code");

    console.log(coupon);

    if (coupon) {
      return next(new AppError("Coupon already exists", 400));
    }

    const couponData = {
      code,
      discount,
      expiryInDays,
    };

    await redis.hset(hasKey, couponData);
    await redis.expire(hasKey, 3600 * 24 * expiryInDays);

    res.status(201).json(new AppSuccess("Coupon created", couponData));
  } catch (error) {
    console.log(error);
    return next(new AppError("Internal Server Error", 500));
  }
};

export const deleteCoupon = async (
  req: Request extends { user: JWTDecoded } ? Request : any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code } = req.params;

    const isAdmin = await db.user.findFirst({
      where: {
        id: req.user.id,
        role: "ADMIN",
      },
    });

    if (!isAdmin) {
      return next(new AppError("Unauthorized", 401));
    }

    const hasKey = `coupon:${code}`;

    const coupon = await redis.hget(hasKey, "code");

    if (!coupon) {
      return next(new AppError("Coupon not found", 400));
    }

    await redis.del(hasKey);

    res.status(200).json(new AppSuccess("Coupon deleted", coupon));
  } catch (error) {
    console.log(error);
    return next(new AppError("Internal Server Error", 500));
  }
};
