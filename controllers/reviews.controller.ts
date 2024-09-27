import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { db } from "../database/db";
import { JWTDecoded } from "../utils/types";
import { AppSuccess } from "../utils/AppSuccess";

export const getProductReviews = async (
  req: Request extends { user: JWTDecoded } ? Request : any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const validObjectId = typeof id === "string" && id.length === 24;
    if (!validObjectId) return next(new AppError("Invalid product id", 400));

    const reviews = await db.review.findMany({
      where: {
        productId: id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    res
      .status(200)
      .json(new AppSuccess("Reviews fetched successfully", reviews));
  } catch (error) {
    console.log(error);
    return next(new AppError("Internal server error", 500));
  }
};

export const addReview = async (
  req: Request extends { user: JWTDecoded } ? Request : any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { comment, rating } = req.body;

    const existReview = await db.review.findFirst({
      where: {
        productId: id,
        userId: req.user.id,
      },
    });

    if (existReview)
      return next(new AppError("You have already reviewed this product", 409));

    const review = await db.review.create({
      data: {
        comment,
        rating,
        productId: id,
        userId: req.user.id,
      },
    });

    res.status(201).json(new AppSuccess("Review added successfully", review));
  } catch (error) {
    console.error(error);
    return next(new AppError("Internal server error", 500));
  }
};

export const updateReview = async (
  req: Request extends { user: JWTDecoded } ? Request : any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const validObjectId = typeof id === "string" && id.length === 24;
    if (!validObjectId) return next(new AppError("Invalid review id", 400));

    const { comment, rating } = req.body;

    const review = await db.review.findFirst({
      where: {
        id,
      },
    });

    if (!review) return next(new AppError("Review not found.", 404));

    const isAdmin = db.user.findUnique({
      where: {
        id: req.user.id,
        role: "ADMIN",
      },
    });
    if (review.userId != req.user.id && !isAdmin)
      return next(
        new AppError("You are not authorized to delete this review", 403)
      );

    const updatedReview = await db.review.update({
      where: {
        id,
      },
      data: {
        comment,
        rating,
      },
    });

    res
      .status(200)
      .json(new AppSuccess("Review updated successfully.", updatedReview));
  } catch (error) {
    console.log(error);
    return next(new AppError("Internal server error", 500));
  }
};

export const deleteReview = async (
  req: Request extends { user: JWTDecoded } ? Request : any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const validObjectId = typeof id === "string" && id.length === 24;
    if (!validObjectId) return next(new AppError("Invalid review id", 400));

    const review = await db.review.findFirst({
      where: {
        id,
      },
    });

    if (!review) return next(new AppError("Review not found.", 404));

    const isAdmin = db.user.findUnique({
      where: {
        id: req.user.id,
        role: "ADMIN",
      },
    });
    if (review.userId != req.user.id && !isAdmin)
      return next(
        new AppError("You are not authorized to delete this review", 403)
      );

    const deleted = await db.review.delete({
      where: {
        id,
      },
    });

    res
      .status(200)
      .json(new AppSuccess("Review deleted successfully.", deleted));
  } catch (error) {
    console.log(error);
    return next(new AppError("Internal server error", 500));
  }
};

export const getUserReviews = async (
  req: Request extends { user: JWTDecoded } ? Request : any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const validObjectId = typeof id === "string" && id.length === 24;
    if (!validObjectId) return next(new AppError("Invalid user id", 400));

    const isAdmin = await db.user.findUnique({
      where: {
        id: req.user.id,
        role: "ADMIN",
      },
    });

    if (!isAdmin)
      return next(new AppError("You are not authorized to view this", 403));

    const reviews = await db.review.findMany({
      where: {
        userId: id,
      },
      select: {
        rating: true,
        comment: true,
        product: {
          select: {
            name: true,
            price: true,
            description: true,
            image: true,
            stock: true,
            sold: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            username: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    res
      .status(200)
      .json(new AppSuccess("Reviews fetched successfully", reviews));
  } catch (error) {
    console.log(error);
    return next(new AppError("Internal server error", 500));
  }
};
