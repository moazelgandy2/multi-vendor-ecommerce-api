import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { db } from "../database/db";
import { AppSuccess } from "../utils/AppSuccess";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";
import { JWTDecoded } from "../utils/types";

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

export const me = async (
  req: Request extends { user: JWTDecoded } ? Request : any,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.user);

    const user = await db.user.findMany({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
      },
    });

    if (!user) return next(new AppError("User not found", 404));

    res.status(200).json(new AppSuccess("User data", user));
  } catch (error) {
    console.log(error);
    return next(new AppError("An error occurred", 500));
  }
};

export const updateProfile = async (
  req: Request extends { user: JWTDecoded } ? Request : any,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.body.oldPassword || req.body.newPassword)
      return next(new AppError("You can't update password here", 400));

    const user = await db.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) return next(new AppError("User not found", 404));

    const emailOrPhoneExist = await db.user.findFirst({
      where: {
        OR: [
          {
            email: req.body.email,
            NOT: { id: req.user.id },
          },
          {
            phone: req.body.phone,
            NOT: { id: req.user.id },
          },
        ],
      },
    });

    if (emailOrPhoneExist)
      return next(
        new AppError(
          "The provided email or phone number is already associated with another account. Please use a different one.",
          400
        )
      );

    const userData = await db.user.update({
      where: { id: req.user.id },
      data: {
        ...req.body,
      },
    });

    res
      .status(200)
      .json(new AppSuccess("Profile updated successfully.", userData));
  } catch (error) {
    console.log(error);
    return next(new AppError("An error occurred", 500));
  }
};

export const changePassword = async (
  req: Request extends { user: JWTDecoded } ? Request : any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await db.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) return next(new AppError("User not found", 404));

    const isPasswordValid = bcrypt.compareSync(oldPassword, user.password);

    if (!isPasswordValid) return next(new AppError("Invalid credentials", 400));

    await db.user.update({
      where: { id: req.user.id },
      data: {
        password: bcrypt.hashSync(newPassword, 10),
      },
    });

    res.status(200).json(
      new AppSuccess("Password changed successfully.", {
        token: jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
          expiresIn: "1d",
        }),
      })
    );
  } catch (error) {
    console.log(error);
    return next(new AppError("An error occurred", 500));
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  if (!email) return next(new AppError("Email is required", 400));

  const user = await db.user.findFirst({ where: { email } });

  if (!user) return next(new AppError("User not found", 404));

  // TODO: Generate OTP, save it in redis and send it to the user email
  // TODO: Make a route to verify the OTP and reset the password
};
