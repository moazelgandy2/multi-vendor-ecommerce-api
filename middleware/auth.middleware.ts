import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import jwt from "jsonwebtoken";
import { JWTDecoded } from "../utils/types";

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { token } = req.headers as { token: string };
  if (!token) return next(new AppError("Unauthorized", 401));

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) return next(new AppError("Unauthorized", 401));
    return ((req as any).user = decoded);
  });
  next();
}
