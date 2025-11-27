import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  resetToken: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  newPassword: string;
}

