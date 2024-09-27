import { ErrorObject } from "./types";

export const catchError = (err: any, req: any, res: any, next: any) => {
  let errorObject: ErrorObject = {
    success: false,
    statusCode: err.statusCode,
    message: err.message,
  };

  const stack = process.env.NODE_ENV != "development" ? undefined : err.stack;
  const info = err.info ? err.info : undefined;

  info && (errorObject = { ...errorObject, info });
  stack && (errorObject = { ...errorObject, stack });

  return res.status(err.statusCode || 500).json(errorObject);
};
