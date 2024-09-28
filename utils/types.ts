export type ErrorObject = {
  success: boolean;
  message: string;
  statusCode: number;
  stack?: string;
  info?: any;
};

export type JWTDecoded = {
  id: string;
  role: string;
  iat: number;
  exp: number;
};

export type Coupon = {
  code: string;
  discount: number;
  expiryInDays: number;
};
