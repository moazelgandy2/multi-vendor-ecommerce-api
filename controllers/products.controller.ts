import { NextFunction, Request, Response } from "express";
import { db } from "../database/db";
import { AppSuccess } from "../utils/AppSuccess";
import { AppError } from "../utils/AppError";
import { JWTDecoded } from "../utils/types";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";
import { storage } from "../utils/firebase";

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    let products = await db.product.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
        reviews: {
          select: {
            rating: true,
            comment: true,
            user: {
              select: {
                username: true,
                email: true,
              },
            },
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

      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    products.forEach(
      (product) => (
        delete (product as any).categoryId, delete (product as any).sellerId
      )
    );

    res
      .status(200)
      .json(new AppSuccess(`Page ${page} & Limit ${limit}`, products));
  } catch (err) {
    console.error(err);
    next(new AppError("Internal server error", 500));
  }
};

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const validObjectId = typeof id === "string" && id.length === 24;
    if (!validObjectId) return next(new AppError("Invalid product id", 400));

    if (!id) return next(new AppError("Product ID is required", 400));

    let product = await db.product.findUnique({
      where: {
        id,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        reviews: {
          select: {
            rating: true,
            comment: true,
            user: {
              select: {
                username: true,
                email: true,
              },
            },
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
    });

    if (!product) return next(new AppError("Product not found", 404));

    delete (product as any).categoryId, delete (product as any).sellerId;

    res.status(200).json(new AppSuccess("Product found", product));
  } catch (err) {
    console.error(err);
    next(new AppError("Internal server error", 500));
  }
};

export const createProduct = async (
  req: Request extends { user: JWTDecoded } ? Request : any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, price, categoryId, description, stock } = req.body;

    const isAdmin = await db.user.findUnique({
      where: {
        id: req.user.id,
        role: { in: ["ADMIN", "SELLER"] },
      },
    });

    if (!isAdmin) {
      return next(
        new AppError("You don't have permission to update this product", 403)
      );
    }

    const validObjectId =
      typeof categoryId === "string" && categoryId.length === 24;
    if (!validObjectId) return next(new AppError("Invalid category id", 400));

    const validCategory = await db.category.findFirst({
      where: {
        id: categoryId,
      },
    });

    if (!validCategory) return next(new AppError("Invalid category.", 404));

    let product;
    try {
      const file = req.file;
      if (!file) {
        return next(new AppError("Image file is required", 400));
      }

      const fileExtension = file.originalname.split(".").pop();
      const fileRef = ref(
        storage,
        `images/${req.user.id}/${name}.${fileExtension}`
      );
      await uploadString(fileRef, file.buffer.toString("base64"), "base64");

      const imageUrl = await getDownloadURL(fileRef);

      product = await db.product.create({
        data: {
          name,
          price: +price,
          categoryId,
          description,
          sellerId: req.user.id,
          stock: +stock,
          image: imageUrl,
        },
      });
    } catch (err) {
      console.error(err);
      next(new AppError("Internal server error", 500));
    }

    res.status(201).json(new AppSuccess("Product created", product));
  } catch (err) {
    console.error(err);
    next(new AppError("Internal server error", 500));
  }
};

export const updateProduct = async (
  req: Request extends { user: JWTDecoded } ? Request : any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, price, categoryId, description, stock } = req.body;
    const file = req.file;
    if (categoryId) {
      const validObjectId =
        typeof categoryId === "string" && categoryId.length === 24;
      if (!validObjectId) return next(new AppError("Invalid category id", 400));
    }
    const product = await db.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) return next(new AppError("Product not found", 404));

    const isAdmin = await db.user.findUnique({
      where: {
        id: req.user.id,
        role: "ADMIN",
      },
    });

    if (product.sellerId !== req.user.id && !isAdmin) {
      return next(
        new AppError("You don't have permission to update this product", 403)
      );
    }

    const validCategory = await db.category.findFirst({
      where: {
        id: categoryId,
      },
    });

    if (!validCategory) return next(new AppError("Invalid category.", 404));

    let imageUrl = product.image;

    if (file) {
      const fileExtension = file.originalname.split(".").pop();
      const fileRef = ref(
        storage,
        `images/products/${product.id}.${fileExtension}`
      );

      await uploadBytes(fileRef, file.buffer);

      imageUrl = await getDownloadURL(fileRef);
    }

    const updateData: any = {
      image: imageUrl,
    };

    if (name) updateData.name = name;
    if (price) updateData.price = +price;
    if (categoryId) updateData.categoryId = categoryId;
    if (description) updateData.description = description;
    if (stock) updateData.stock = +stock;

    console.log(updateData);

    const updatedProduct = await db.product.update({
      where: {
        id,
      },
      data: updateData,
    });

    res.status(200).json(new AppSuccess("Product updated", updatedProduct));
  } catch (error) {
    console.log(error);
    return next(new AppError("Internal server error", 500));
  }
};

export const deleteProduct = async (
  req: Request extends { user: JWTDecoded } ? Request : any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const validObjectId = typeof id === "string" && id.length === 24;
    if (!validObjectId) return next(new AppError("Invalid product id", 400));

    const product = await db.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) return next(new AppError("Product not found", 404));

    const isAdmin = await db.user.findUnique({
      where: {
        id: req.user.id,
        role: "ADMIN",
      },
    });

    if (product.sellerId !== req.user.id && !isAdmin) {
      return next(
        new AppError("You don't have permission to update this product", 403)
      );
    }

    const deletedProduct = await db.product.delete({
      where: {
        id,
      },
    });

    res.status(200).json(new AppSuccess("Product deleted", deletedProduct));
  } catch (error) {
    console.log(error);
    return next(new AppError("Internal server error", 500));
  }
};
