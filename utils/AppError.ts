export class AppError extends Error {
  info: any;
  constructor(message: string, public statusCode: number, info?: any) {
    super(message);
    this.statusCode = statusCode;
    info && (this.info = info);
    process.env.NODE_ENV != "development"
      ? (this.stack = "")
      : Error.captureStackTrace(this, this.constructor);
  }
}
