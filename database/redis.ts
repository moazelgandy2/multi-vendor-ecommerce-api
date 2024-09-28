import { Redis } from "ioredis";
import { AppError } from "../utils/AppError";

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }

  throw new AppError("Redis URL not found", 500);
};

export const redis = new Redis(getRedisUrl());
