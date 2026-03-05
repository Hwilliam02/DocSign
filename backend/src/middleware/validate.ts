import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

/**
 * Express middleware that checks the results of express-validator chains.
 * Place after validator arrays in route definitions.
 */
export function validate(req: Request, _res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err: any = new Error("Validation failed");
    err.statusCode = 400;
    err.details = errors.array();
    throw err;
  }
  next();
}
