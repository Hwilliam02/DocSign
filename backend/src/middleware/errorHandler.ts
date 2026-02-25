import { Request, Response, NextFunction } from "express";
import { AppError } from "../types/index.js";

export const errorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction): void => {
  const isAppError = err instanceof AppError;
  const status = isAppError ? err.statusCode : 500;
  const body: { message: string } = { message: err.message };

  if (process.env.NODE_ENV !== "production") {
    // attach stack in development
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (body as any).stack = err.stack;
  }

  res.status(status).json(body);
};
