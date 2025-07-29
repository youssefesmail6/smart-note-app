import bcrypt from "bcrypt";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import Container, { Service } from "typedi";
import { UserService } from "./user.service";
import env from "../config/env.config";
import HttpException from "../exceptions/http.exception";
import { JwtDto } from "../dto/jwt.dto";
import userModel, { IUser } from "../models/user.model"; // Make sure _id is typed correctly

@Service()
export class AuthService {
  private userService: UserService = Container.get(UserService);

  /**
   * Generic JWT token generator
   */
  private generateToken(
    payload: Record<string, any>,
    secret: Secret,
    expiresIn: string
  ): string {
    const options: SignOptions = {
      expiresIn: expiresIn as SignOptions["expiresIn"],
    };
    return jwt.sign(payload, secret, options);
  }

  /**
   * Access token generator
   */
  public generateAccessToken(payload: JwtDto): string {
    return this.generateToken(
      payload,
      env.AUTH.SECRET as Secret,
      env.AUTH.EXPIRES_IN || "15m"
    );
  }

  /**
   * Refresh token generator
   */
  private generateRefreshToken(userId: string): string {
    return this.generateToken(
      { userId },
      env.ENCRYPTION.JWT_REFRESH_SECRET_KEY as Secret,
      "7d"
    );
  }

  /**
   * Login logic: validate credentials and return access/refresh tokens
   */
  public async login(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const foundUser: IUser | null = await this.userService.findUserByEmail(
      email
    );
    if (!foundUser) throw new HttpException(404, "User not found");

    const isPasswordMatching = await bcrypt.compare(
      password,
      foundUser.password
    );
    if (!isPasswordMatching) {
      throw new HttpException(409, "Password is not matching");
    }

    const accessTokenPayload: JwtDto = {
      userId: foundUser._id as string,
      email: foundUser.email,
    };

    const accessToken = this.generateAccessToken(accessTokenPayload);
    const refreshToken = this.generateRefreshToken(foundUser._id as string);

    return { accessToken, refreshToken };
  }
  /**
   * Logout: revoke token by adding to blacklist
   */
  public async logout(
    email: string,
    password: string,
    token: string
  ): Promise<void> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new HttpException(404, "User not found");
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new HttpException(401, "Invalid password");
    }

    if (!user.tokenBlacklist) {
      user.tokenBlacklist = [];
    }
    if (!user.tokenBlacklist.includes(token)) {
      user.tokenBlacklist.push(token);
      await user.save();
    }
  }
}
