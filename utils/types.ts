export type ErrorObject = {
  success: boolean;
  message: string;
  statusCode: number;
  stack?: string;
  info?: any;
};

export type JWTDecoded = {
  id: string;
  iat: number;
  exp: number;
};
