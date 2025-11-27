import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // Create transporter using Gmail or any SMTP service
    // For development, you can use Ethereal Email (free testing service)
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');
    
    if (!smtpUser || !smtpPass) {
      this.logger.warn('SMTP credentials not configured. Email sending will fail. Please set SMTP_USER and SMTP_PASS in your .env file.');
    }

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST', 'smtp.gmail.com'),
      port: this.configService.get<number>('SMTP_PORT', 587),
      secure: false, // true for 465, false for other ports
      auth: smtpUser && smtpPass ? {
        user: smtpUser,
        pass: smtpPass,
      } : undefined,
    });
  }

  async sendOTPEmail(email: string, otp: string): Promise<void> {
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');

    // If SMTP is not configured, log OTP to console for development
    if (!smtpUser || !smtpPass) {
      this.logger.warn(`SMTP not configured. OTP for ${email} is: ${otp}`);
      this.logger.warn('Please configure SMTP_USER and SMTP_PASS in your .env file to send emails.');
      return;
    }

    try {
      const mailOptions = {
        from: this.configService.get<string>('SMTP_FROM', 'noreply@example.com'),
        to: email,
        subject: 'Email Verification OTP',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Email Verification</h2>
            <p>Thank you for signing up! Please use the following OTP to verify your email address:</p>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
            </div>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you didn't request this verification, please ignore this email.</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`OTP email sent successfully to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP email to ${email}`, error);
      // Log OTP to console as fallback
      this.logger.warn(`OTP for ${email} (fallback): ${otp}`);
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    try {
      const resetUrl = `${this.configService.get<string>('APP_URL', 'http://localhost:3001')}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
      
      const mailOptions = {
        from: this.configService.get<string>('SMTP_FROM', 'noreply@example.com'),
        to: email,
        subject: 'Password Reset Request',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>You requested to reset your password. Click the link below to reset it:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="color: #666; word-break: break-all;">${resetUrl}</p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request a password reset, please ignore this email.</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}`, error);
      throw new Error('Failed to send password reset email');
    }
  }
}

