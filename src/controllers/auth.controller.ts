import Container from "typedi";
import { LoginUserDto } from "../dto/user.dto";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { Request, Response, NextFunction } from "express";

export class AuthController {
  public authService = Container.get(AuthService);
  public userService = Container.get(UserService);

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body as LoginUserDto;

      const tokens = await this.authService.login(
        userData.email,
        userData.password
      );

      res.status(200).json({ ...tokens });
    } catch (error) {
      next(error);
    }
  };
  public logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      await this.authService.logout(email, password, token);

      return res.status(200).json({ message: "Successfully logged out" });
    } catch (error) {
      return next(error);
    }
  };
}
