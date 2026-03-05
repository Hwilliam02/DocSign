import { Router } from "express";
import { body } from "express-validator";
import { login, register, getMe } from "../controllers/authController.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.post(
  "/register",
  authRateLimiter,
  [body("name").isString(), body("email").isEmail(), body("password").isLength({ min: 8 })],
  validate,
  asyncHandler(register)
);

router.post("/login", authRateLimiter, [body("email").isEmail(), body("password").isString()], validate, asyncHandler(login));

/** Validate token & return fresh user data */
router.get("/me", requireAuth as any, asyncHandler(getMe as any));

export default router;
