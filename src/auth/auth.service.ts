import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { email, password, name } = signupDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 4-digit OTP
    const otp = this.generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        otp,
        otpExpiresAt,
        emailVerified: false,
      },
    });

    // Send OTP email (non-blocking - don't fail signup if email fails)
    this.emailService.sendOTPEmail(email, otp).catch((error) => {
      // Log error but don't throw - user is already created
      console.error(`Failed to send OTP email to ${email}:`, error);
    });

    // Remove sensitive data before returning
    const { password: _, otp: __, resetToken, resetExpiresAt, ...userResponse } = user;

    return {
      message: 'User created successfully. Please verify your email with the OTP sent to your email.',
      user: userResponse,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password first (for security, don't reveal email verification status on wrong password)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // If password is correct but email is not verified, send OTP for verification
    if (!user.emailVerified) {
      // Generate new OTP
      const otp = this.generateOTP();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Update user with new OTP
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          otp,
          otpExpiresAt,
        },
      });

      // Send OTP email (non-blocking)
      this.emailService.sendOTPEmail(email, otp).catch((error) => {
        console.error(`Failed to send OTP email to ${email}:`, error);
      });

      throw new UnauthorizedException(
        'Please verify your email before logging in. A new OTP has been sent to your email address.',
      );
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    // Store refresh token in database
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: tokens.refreshToken,
      },
    });

    // Remove sensitive data
    const { password: _, otp, resetToken, resetExpiresAt, refreshToken, ...userResponse } = user;

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: userResponse,
    };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { email, otp } = verifyEmailDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    // Check if OTP is expired
    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    // Update user
    const updatedUser = await this.prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
        otp: null,
        otpExpiresAt: null,
      },
    });

    // Remove sensitive data
    const { password: _, otp: __, resetToken, resetExpiresAt, ...userResponse } = updatedUser;

    return {
      message: 'Email verified successfully',
      user: userResponse,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return {
        message: 'If an account with that email exists, a password reset link has been sent.',
      };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Update user with reset token
    await this.prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetExpiresAt,
      },
    });

    // Send password reset email
    await this.emailService.sendPasswordResetEmail(email, resetToken);

    return {
      message: 'If an account with that email exists, a password reset link has been sent.',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, resetToken, newPassword } = resetPasswordDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Check if reset token matches
    if (user.resetToken !== resetToken) {
      throw new BadRequestException('Invalid reset token');
    }

    // Check if reset token is expired
    if (!user.resetExpiresAt || user.resetExpiresAt < new Date()) {
      throw new BadRequestException('Reset token has expired. Please request a new one.');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user
    await this.prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetExpiresAt: null,
      },
    });

    return {
      message: 'Password reset successfully',
    };
  }

  async logout(userId: number) {
    // Invalidate refresh token by removing it from database
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: null,
      },
    });

    return {
      message: 'Logged out successfully',
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    try {
      // Verify refresh token
      const refreshSecret = this.configService.get<string>(
        'JWT_REFRESH_SECRET',
        'your-refresh-secret-key',
      );

      const decoded = jwt.verify(refreshToken, refreshSecret);
      
      if (typeof decoded === 'string' || !decoded || typeof decoded !== 'object') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const decodedPayload = decoded as Record<string, any>;
      
      if (!decodedPayload.sub || !decodedPayload.email) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const payload: JwtPayload = {
        sub: decodedPayload.sub,
        email: decodedPayload.email,
      };

      // Find user and verify refresh token matches stored token
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.emailVerified) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Verify the refresh token matches the one stored in database
      if (user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(payload.sub, payload.email);

      // Update refresh token in database
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          refreshToken: tokens.refreshToken,
        },
      });

      // Remove sensitive data
      const { password: _, otp, resetToken, resetExpiresAt, refreshToken: __, ...userResponse } =
        user;

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: userResponse,
      };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }
      throw error;
    }
  }

  private async generateTokens(userId: number, email: string) {
    const payload: JwtPayload = { sub: userId, email };

    // Generate access token (short-lived)
    const accessToken = this.jwtService.sign(payload);

    // Generate refresh token (long-lived, with different secret)
    const refreshSecret = this.configService.get<string>(
      'JWT_REFRESH_SECRET',
      'your-refresh-secret-key',
    );
    const refreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');

    const refreshToken = jwt.sign(
      payload,
      refreshSecret,
      {
        expiresIn: refreshExpiresIn,
      } as jwt.SignOptions,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async resendOTP(email: string) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Generate new OTP
    const otp = this.generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new OTP
    await this.prisma.user.update({
      where: { email },
      data: {
        otp,
        otpExpiresAt,
      },
    });

    // Send OTP email (non-blocking)
    this.emailService.sendOTPEmail(email, otp).catch((error) => {
      console.error(`Failed to send OTP email to ${email}:`, error);
    });

    return {
      message: 'OTP has been resent to your email address.',
    };
  }

  private generateOTP(): string {
    // Generate a 4-digit OTP
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}

