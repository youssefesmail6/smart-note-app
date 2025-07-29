import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

  export class LoginUserDto {
    @IsEmail()
    public email!: string;

    @IsString()
    @IsNotEmpty()
    public password!: string;
  }

  export class RegisterUserDto {
    @IsEmail()
    public email!: string;

    @IsString()
    @IsNotEmpty()
    public password!: string;

    @IsString()
    @IsNotEmpty()
    public name!: string;
  }