import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class ResetPasswordDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @Length(6, 6, { message: "OTP must be exactly 6 digits" })
  otp!: string;

  @IsNotEmpty()
  @Length(6, 100, { message: "Password must be at least 6 characters long" })
  newPassword!: string;
}
