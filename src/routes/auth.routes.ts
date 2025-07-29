import { Router } from "express";
import UserController from "../controllers/user.controller";
import ValidationMiddleware from "../middlewares/validation.middleware";
import asyncHandler from "../middlewares/async-handler";
import { LoginUserDto } from "../dto/user.dto";
import { AuthController } from "../controllers/auth.controller";
import { loginLimiter } from "../middlewares/rateLimit.middleware";

const router = Router();
const authController = new AuthController();

/**
 * @route POST /v1/auth/login
 * @desc Login user and return token
 * @access Public
 */
router.post(
  "/v1/auth/login",
  loginLimiter,
  ValidationMiddleware(LoginUserDto),
  asyncHandler(authController.logIn)
);

/**
 * @route POST /v1/auth/logout
 * @desc Logout user by revoking token
 * @access Private
 */
router.post(
  "/v1/auth/logout",
  asyncHandler(authController.logout)
);

export default router;
