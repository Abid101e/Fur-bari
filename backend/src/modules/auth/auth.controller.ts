import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { 
  LoginInput,
  RegisterInput,
  RefreshTokenInput,
  VerifyEmailInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from './auth.schema.js';

export class AuthController {
  // Register a new user
  static register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await AuthService.register(req.body);
    
    res.status(201).json(result);
  });

  // Login user
  static login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await AuthService.login(req.body);
    
    res.status(200).json(result);
  });

  // Refresh access token
  static refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;
    const result = await AuthService.refreshToken(refreshToken);
    
    res.status(200).json(result);
  });

  // Logout user
  static logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;
    const result = await AuthService.logout(refreshToken);
    
    res.status(200).json(result);
  });

  // Logout from all devices
  static logoutAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const result = await AuthService.logoutAll(userId);
    
    res.status(200).json(result);
  });

  // Send email verification token
  static sendVerificationEmail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const verificationToken = await AuthService.generateEmailVerificationToken(userId);
    
    // TODO: Send email with verification token
    // await EmailService.sendVerificationEmail(req.user.email, verificationToken);
    
    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully',
      // For development only - remove in production
      ...(process.env.NODE_ENV === 'development' && { token: verificationToken }),
    });
  });

  // Verify email
  static verifyEmail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    const result = await AuthService.verifyEmail(token);
    
    res.status(200).json(result);
  });

  // Send password reset email
  static forgotPassword = catchAsync(async (req: Request<{}, {}, ForgotPasswordInput['body']>, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const resetToken = await AuthService.generatePasswordResetToken(email);
    
    // TODO: Send email with reset token
    // await EmailService.sendPasswordResetEmail(email, resetToken);
    
    res.status(200).json({
      success: true,
      message: 'Password reset email sent successfully',
      // For development only - remove in production
      ...(process.env.NODE_ENV === 'development' && { token: resetToken }),
    });
  });

  // Reset password
  static resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    const { password } = req.body;
    
    const result = await AuthService.resetPassword(token, password);
    
    res.status(200).json(result);
  });

  // Get current user info (protected route)
  static getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User information retrieved successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          bio: user.bio,
          location: user.location,
          isVerified: user.isVerified,
          role: user.role,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  });
}
