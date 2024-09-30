import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../utils/types";
import { getTokenFromRedis } from "../utils/redis-token";

export default async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const { token } = req.headers as { token: string };
  if (!token) return next(new AppError("Unauthorized", 401));

  jwt.verify(token, process.env.JWT_SECRET!, async (err, decoded) => {
    if (err) return next(new AppError("Unauthorized", 401));

    if (decoded) {
      const tokenFromRedis = await getTokenFromRedis((decoded as any).id);
      if (tokenFromRedis !== token)
        return next(
          new AppError(
            `Unauthorized: Invalid token. Please login to get a new token.`,
            401
          )
        );

      (req as any).user = decoded;

      return next();
    }
  });
}
