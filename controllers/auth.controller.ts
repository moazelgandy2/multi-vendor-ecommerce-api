import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { db } from "../database/db";
import { AppSuccess } from "../utils/AppSuccess";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JWTDecoded } from "../utils/types";
import { redis } from "../database/redis";
import { sendMail } from "../utils/send-mail";
import { deleteTokenFromRedis, storeTokenToRedis } from "../utils/redis-token";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, phone, password, address } = req.body;

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

    const newAddress = await db.address.createMany({
      data: address.map((item: any) => ({
        ...item,
        userId: newUser.id,
      })),
    });

    const token = jwt.sign(
      {
        id: newUser.id,
        role: newUser.role,
        email: newUser.email,
        phone: newUser.phone,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      }
    );

    await storeTokenToRedis(token, newUser.id);

    res
      .status(201)
      .json(new AppSuccess("You have successfully signed up.", { token }));
  } catch (error) {
    try {
      await db.user.delete({ where: { email: req.body.email } });
    } catch (e) {
      console.log(e);
    }
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

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email, phone: user.phone },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      }
    );

    await storeTokenToRedis(token, user.id);

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
    await deleteTokenFromRedis(req.user.id);
    res.status(200).json(
      new AppSuccess("Password changed successfully.", {
        message: "Please login with your new password to get a new token.",
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
  try {
    const { email } = req.body;
    if (!email) return next(new AppError("Email is required", 400));

    const user = await db.user.findFirst({ where: { email } });

    if (!user) return next(new AppError("User not found", 404));

    const OTP = Math.floor(100000 + Math.random() * 900000);

    const hashKey = `reset-password:user-${user.id}`;

    await redis.hset(hashKey, "otp", OTP.toString());

    await sendMail(OTP, email);

    await deleteTokenFromRedis(user.id);

    res.status(200).json(new AppSuccess("OTP sent to your email.", { email }));
  } catch (error) {
    console.log(error);
    return next(new AppError("An error occurred", 500));
  }
};

export const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp)
      return next(new AppError("Email and OTP are required", 400));

    const user = await db.user.findFirst({ where: { email } });

    if (!user) return next(new AppError("User not found", 404));

    const hashKey = `reset-password:user-${user.id}`;

    const OTP = await redis.hget(hashKey, "otp");

    if (otp != OTP) return next(new AppError("Invalid OTP", 400));

    const randomTempPassword = Math.random().toString(36).slice(-8);

    const hashPassword = bcrypt.hashSync(randomTempPassword, 10);

    await db.user.update({
      where: { email },
      data: {
        password: hashPassword,
      },
    });

    await redis.del(hashKey);

    await deleteTokenFromRedis(user.id);

    res.status(200).json(
      new AppSuccess(
        "Password reset successfully.Please note that this is a temporary password. Please change it after login.",
        {
          password: randomTempPassword,
        }
      )
    );
  } catch (error) {
    console.log(error);
    return next(new AppError("An error occurred", 500));
  }
};
