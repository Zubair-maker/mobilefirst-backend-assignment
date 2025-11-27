import { IsEmail, IsString, IsNotEmpty, Length } from 'class-validator';

export class VerifyEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 4, { message: 'OTP must be exactly 4 digits' })
  otp: string;
}

