import crypto from 'crypto';
import { User, IUser } from '../users/user.model.js';
import { JWTService } from '../../utils/jwt.js';
import { PasswordService } from '../../utils/password.js';
import { CustomError } from '../../middleware/error.js';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  RefreshTokenResponse 
} from './auth.types.js';

export class AuthService {
  // Register a new user
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    const { name, email, password, phone } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new CustomError('User with this email already exists', 400);
    }

    // Validate password strength
    const passwordValidation = PasswordService.validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      throw new CustomError(
        `Password validation failed: ${passwordValidation.errors.join(', ')}`,
        400
      );
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
    };
    
    const tokens = JWTService.signTokenPair(tokenPayload);

    // Add refresh token to user
    user.addRefreshToken(tokens.refreshToken);
    await user.save();

    return {
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          isVerified: user.isVerified,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
        },
        tokens,
      },
    };
  }

  // Login user
  static async login(loginData: LoginRequest): Promise<AuthResponse> {
    const { email, password } = loginData;

    // Find user and include password field
    const user = await User.findOne({ email, isActive: true }).select('+password');
    
    if (!user) {
      throw new CustomError('Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new CustomError('Invalid email or password', 401);
    }

    // Update last login
    user.lastLogin = new Date();

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
    };
    
    const tokens = JWTService.signTokenPair(tokenPayload);

    // Add refresh token to user
    user.addRefreshToken(tokens.refreshToken);
    await user.save();

    return {
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          isVerified: user.isVerified,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
        },
        tokens,
      },
    };
  }

  // Refresh access token
  static async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      // Verify refresh token
      const decoded = JWTService.verifyRefreshToken(refreshToken);

      // Find user and check if refresh token exists
      const user = await User.findById(decoded.userId).select('+refreshTokens');
      
      if (!user || !user.isActive) {
        throw new CustomError('Invalid refresh token', 401);
      }

      if (!user.refreshTokens.includes(refreshToken)) {
        throw new CustomError('Invalid refresh token', 401);
      }

      // Generate new tokens
      const tokenPayload = {
        userId: user.id,
        email: user.email,
      };
      
      const tokens = JWTService.signTokenPair(tokenPayload);

      // Replace old refresh token with new one
      user.removeRefreshToken(refreshToken);
      user.addRefreshToken(tokens.refreshToken);
      await user.save();

      return {
        success: true,
        message: 'Token refreshed successfully',
        data: {
          tokens,
        },
      };
    } catch (error) {
      throw new CustomError('Invalid refresh token', 401);
    }
  }

  // Logout user
  static async logout(refreshToken: string): Promise<{ success: boolean; message: string }> {
    try {
      // Verify refresh token
      const decoded = JWTService.verifyRefreshToken(refreshToken);

      // Find user and remove refresh token
      const user = await User.findById(decoded.userId).select('+refreshTokens');
      
      if (user) {
        user.removeRefreshToken(refreshToken);
        await user.save();
      }

      return {
        success: true,
        message: 'Logout successful',
      };
    } catch (error) {
      // Even if token is invalid, return success for logout
      return {
        success: true,
        message: 'Logout successful',
      };
    }
  }

  // Logout from all devices
  static async logoutAll(userId: string): Promise<{ success: boolean; message: string }> {
    const user = await User.findById(userId).select('+refreshTokens');
    
    if (user) {
      user.clearRefreshTokens();
      await user.save();
    }

    return {
      success: true,
      message: 'Logged out from all devices successfully',
    };
  }

  // Generate email verification token
  static async generateEmailVerificationToken(userId: string): Promise<string> {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    if (user.isVerified) {
      throw new CustomError('Email is already verified', 400);
    }

    const verificationToken = user.createEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    return verificationToken;
  }

  // Verify email
  static async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    // Hash the token to compare with stored hashed token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new CustomError('Token is invalid or has expired', 400);
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return {
      success: true,
      message: 'Email verified successfully',
    };
  }

  // Generate password reset token
  static async generatePasswordResetToken(email: string): Promise<string> {
    const user = await User.findOne({ email, isActive: true });
    
    if (!user) {
      throw new CustomError('No user found with that email address', 404);
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    return resetToken;
  }

  // Reset password
  static async resetPassword(
    token: string, 
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    // Hash the token to compare with stored hashed token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new CustomError('Token is invalid or has expired', 400);
    }

    // Validate new password strength
    const passwordValidation = PasswordService.validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      throw new CustomError(
        `Password validation failed: ${passwordValidation.errors.join(', ')}`,
        400
      );
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    
    // Clear all refresh tokens to force re-login
    user.clearRefreshTokens();
    
    await user.save();

    return {
      success: true,
      message: 'Password has been reset successfully',
    };
  }
}
