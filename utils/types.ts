export type ErrorObject = {
  success: boolean;
  message: string;
  statusCode: number;
  stack?: string;
  info?: any;
};
