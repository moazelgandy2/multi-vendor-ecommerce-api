import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { db } from "../database/db";
import { AppSuccess } from "../utils/AppSuccess";
import { JWTDecoded } from "../utils/types";

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    const categories = await db.category.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });

    res
      .status(200)
      .json(
        new AppSuccess(
          `Categories retrieved, page: ${page} & limit: ${limit}`,
          categories
        )
      );
  } catch (err) {
    console.log(err);
    return next(new AppError("Internal server error", 500));
  }
};

export const getCategoryWithProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const validObjectId = typeof id === "string" && id.length === 24;

    console.log(typeof id, id.length, validObjectId);

    if (!validObjectId) return next(new AppError("Invalid category id", 400));

    const category = await db.category.findUnique({
      where: {
        id,
      },
      include: {
        products: {
          select: {
            name: true,
            price: true,
            description: true,
            seller: {
              select: {
                username: true,
                email: true,
              },
            },
            reviews: {
              select: {
                rating: true,
                comment: true,
              },
            },
          },
        },
      },
    });

    if (!category) {
      return next(new AppError("Category not found", 404));
    }

    res.status(200).json(new AppSuccess(`Category with products`, category));
  } catch (err) {
    console.log(err);
    return next(new AppError("Internal server error", 500));
  }
};

export const createCategory = async (
  req: Request extends { user: JWTDecoded } ? Request : any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    const isAdmin = await db.user.findUnique({
      where: {
        id: req.user.id,
        role: "ADMIN",
      },
    });

    if (!isAdmin)
      return next(
        new AppError(`You are not authorized to perform this action`, 403)
      );

    const category = await db.category.create({
      data: {
        name,
      },
    });

    res.status(201).json(new AppSuccess("Category created", category));
  } catch (error) {
    console.log(error);
    return next(new AppError("Internal server error", 500));
  }
};

export const updateCategory = async (
  req: Request extends { user: JWTDecoded } ? Request : any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const validObjectId = typeof id === "string" && id.length === 24;
    if (!validObjectId) return next(new AppError("Invalid product id", 400));

    const { name } = req.body;

    const isAdmin = await db.user.findUnique({
      where: {
        id: req.user.id,
        role: "ADMIN",
      },
    });

    if (!isAdmin)
      return next(
        new AppError(`You are not authorized to perform this action`, 403)
      );

    const category = await db.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) return next(new AppError("Category not found", 404));

    const updatedCategory = await db.category.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    res.status(200).json(new AppSuccess("Category updated", updatedCategory));
  } catch (error) {
    console.log(error);
    return next(new AppError("Internal server error", 500));
  }
};

export const deleteCategory = async (
  req: Request extends { user: JWTDecoded } ? Request : any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const validObjectId = typeof id === "string" && id.length === 24;
    if (!validObjectId) return next(new AppError("Invalid product id", 400));

    const isAdmin = await db.user.findUnique({
      where: {
        id: req.user.id,
        role: "ADMIN",
      },
    });

    if (!isAdmin)
      return next(
        new AppError(`You are not authorized to perform this action`, 403)
      );

    const category = await db.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) return next(new AppError("Category not found", 404));

    const updatedCategory = await db.category.delete({
      where: {
        id,
      },
    });

    res.status(200).json(new AppSuccess("Category deleted", updatedCategory));
  } catch (error) {
    console.log(error);
    return next(new AppError("Internal server error", 500));
  }
};
