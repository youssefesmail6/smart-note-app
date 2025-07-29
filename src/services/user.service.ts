import { Inject, Service } from "typedi";
import UserModel, { IUser, IUser as User } from "../models/user.model";
import NotFoundException from "../exceptions/not-found.exception";
import { logger, Logger } from "./logger.service";
import HttpException from "../exceptions/http.exception";
import EmailService from "./email.service";
import crypto from "crypto";

@Service()
export class UserService {
  @Inject(() => EmailService)
  private emailService!: EmailService;

  public async registerUser(email: string, password: string , name: string): Promise<IUser> {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new HttpException(409, "Email already in use");
    }

    const newUser = new UserModel({ email, password, name });
    await newUser.save();
    return newUser;
  }

  public async findUserByEmail(email: string): Promise<User> {
    try {
      const foundUser: IUser | null = await UserModel.findOne({ email });
      if (!foundUser)
        throw new NotFoundException(`User with email ${email} not found`);
      return foundUser;
    } catch (err: any) {
      logger.error(`UserService.findUserByEmail: ${err.message}`, err);
      throw err;
    }
  }
  public async updateProfilePic(userId: string, filePath: string): Promise<IUser> {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new HttpException(404, "User not found");
  }

  user.picture = filePath;
  await user.save();
  return user;
}
public async sendPasswordResetOtp(email: string): Promise<void> {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    user.resetPasswordOtp = otp;
    user.resetOtpExpires = expires;

    await user.save();
    await this.emailService.sendOtpEmail(email, otp);
  }
 public async resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
  const user = await UserModel.findOne({ email });

  const isOtpExpired = !user?.resetOtpExpires || user.resetOtpExpires < new Date();

  if (!user || user.resetPasswordOtp !== otp || isOtpExpired) {
    throw new HttpException(400, "Invalid or expired OTP");
  }

  // Update password — hashing will be handled by the schema hook
  user.password = newPassword;

  // Invalidate OTP (one-time use)
  user.resetPasswordOtp = undefined;
  user.resetOtpExpires = undefined;

  await user.save();
}
}

