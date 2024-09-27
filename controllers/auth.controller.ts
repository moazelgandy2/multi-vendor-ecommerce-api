import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { db } from "../database/db";
import { AppSuccess } from "../utils/AppSuccess";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, phone, password } = req.body;

    const existUser = await db.user.findFirst({
      where: { OR: [{ phone }, { email }] },
    });

    if (existUser) return next(new AppError("User already exist", 400));

    const newUser = await db.user.create({
      data: {
        username,
        email,
        phone,
        password: bcrypt.hashSync(password, 10),
      },
    });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    res
      .status(201)
      .json(new AppSuccess("You have successfully signed up.", { token }));
  } catch (error) {
    console.log(error);
    return next(new AppError("An error occurred", 500));
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await db.user.findFirst({ where: { email } });

    if (!user) return next(new AppError("User not found", 404));

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) return next(new AppError("Invalid credentials", 400));

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    res.status(200).json(new AppSuccess("Login successful.", { token }));
  } catch (error) {
    console.log(error);
    return next(new AppError("An error occurred", 500));
  }
};
