import { Router } from "express";
import { body } from "express-validator";
import { login, register } from "../controllers/authController.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post(
  "/register",
  authRateLimiter,
  [body("name").isString(), body("email").isEmail(), body("password").isLength({ min: 8 })],
  asyncHandler(register)
);

router.post("/login", authRateLimiter, [body("email").isEmail(), body("password").isString()], asyncHandler(login));

export default router;
