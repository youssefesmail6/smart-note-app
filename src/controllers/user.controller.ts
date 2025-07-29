import { Request, Response, NextFunction } from "express";
import { RegisterUserDto } from "../dto/user.dto";
import { UserService } from "../services/user.service";
import Container from "typedi";
import { RequestWithUser } from "../interfces/auth.interface";
import { ResetPasswordDto } from "../dto/reset.password.dto";


class UserController {
public userService = Container.get(UserService);
public register = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body as RegisterUserDto;

      const user = await this.userService.registerUser(email, password, name);


      return res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }

};
public uploadProfilePicture = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const userId = req.jwt?.userId;
    const filePath = req.file?.path;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!filePath) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const updatedUser = await this.userService.updateProfilePic(userId, filePath);

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      profilePicture: updatedUser.picture,
    });
  } catch (error) {
    next(error);
  }
};
public forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    await this.userService.sendPasswordResetOtp(email);

    return res.status(200).json({
      message: "If a user with that email exists, an OTP has been sent.",
    });
  } catch (error) {
    next(error);
  }
};
public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp, newPassword } = req.body as ResetPasswordDto;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    await this.userService.resetPassword(email, otp, newPassword);

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};

}
export default UserController;