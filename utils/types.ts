import { Request } from "express";

export type ErrorObject = {
  success: boolean;
  message: string;
  statusCode: number;
  stack?: string;
  info?: any;
};

export interface AuthenticatedRequest extends Request {
  user?: JWTDecoded;
}

export type JWTDecoded = {
  id: string;
  role: string;
  email: string;
  phone: string;
  iat: number;
  exp: number;
};

export type Coupon = {
  code: string;
  discount: number;
  expiryInDays: number;
};
