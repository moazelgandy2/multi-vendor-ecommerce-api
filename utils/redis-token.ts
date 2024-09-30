import { redis } from "../database/redis";

export const storeTokenToRedis = async (token: string, userId: string) => {
  try {
    const hashKey = `token:user-${userId}`;
    await redis.hset(hashKey, "token", token);

    return true;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to store token to redis");
  }
};

export const deleteTokenFromRedis = async (userId: string) => {
  try {
    const hashKey = `token:user-${userId}`;
    await redis.del(hashKey);

    return true;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete token from redis");
  }
};

export const getTokenFromRedis = async (userId: string) => {
  try {
    const hashKey = `token:user-${userId}`;
    const token = await redis.hget(hashKey, "token");

    return token;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get token from redis");
  }
};
