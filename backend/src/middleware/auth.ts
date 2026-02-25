import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IRequestWithUser, UserRole, AppError } from "../types/index.js";
import { getConfig } from "../config/index.js";

const config = getConfig();

export const requireAuth = (req: IRequestWithUser, res: Response, next: NextFunction): void => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return next(new AppError("Unauthorized", 401));
    }

    const token = header.split(" ")[1];
    const payload = jwt.verify(token, config.JWT_SECRET) as { userId: string; role: UserRole; email: string };
    req.user = { userId: payload.userId, role: payload.role, email: payload.email };
    next();
  } catch (err) {
    next(new AppError("Invalid token", 401));
  }
};

export const requireRole = (role: UserRole) => (req: IRequestWithUser, res: Response, next: NextFunction): void => {
  if (!req.user) return next(new AppError("Unauthorized", 401));
  if (req.user.role !== role) return next(new AppError("Forbidden", 403));
  next();
};
