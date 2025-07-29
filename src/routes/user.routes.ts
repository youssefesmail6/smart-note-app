import { Router } from "express";
import UserController from "../controllers/user.controller";
import { createAccountLimiter } from "../middlewares/rateLimit.middleware";
import ValidationMiddleware from "../middlewares/validation.middleware";
import { RegisterUserDto } from "../dto/user.dto";
import asyncHandler from "../middlewares/async-handler";
import upload from "../middlewares/upload.middleware";
import { IsAuthenticatedMiddleware } from "../middlewares/auth.middleware";
import { ResetPasswordDto } from "../dto/reset.password.dto";

const router = Router();
const userController = new UserController();

/**
 * @route POST /register
 * @desc Register a new user
 * @access Public
 */
router.post(
  "/v1/user/create-user",
  createAccountLimiter,
  ValidationMiddleware(RegisterUserDto),
  asyncHandler(userController.register)
);
/**
 * @route PATCH /v1/user/upload-profile-pic
 * @desc Upload user's profile picture
 * @access Private
 */
router.patch(
  "/v1/user/upload-profile-pic",
  IsAuthenticatedMiddleware,
  upload.single("picture"),
  asyncHandler(userController.uploadProfilePicture)
);
/**
 * @route POST /v1/user/forget-password
 */
router.post(
  "/v1/user/forget-password",
  asyncHandler(userController.forgetPassword)
);
/**
 * @route POST /v1/user/reset-password
 */
router.post(
  "/v1/user/reset-password",
  ValidationMiddleware(ResetPasswordDto),
  asyncHandler(userController.resetPassword)
);

export default router;
