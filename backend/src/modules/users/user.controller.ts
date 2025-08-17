import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service.js';
import { catchAsync } from '../../utils/catchAsync.js';

export class UserController {
  // Get current user profile
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
      message: 'User profile retrieved successfully',
      data: { user },
    });
  });

  // Update current user profile
  static updateMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const result = await UserService.updateProfile(userId, req.body);
    res.status(200).json(result);
  });

  // Change password
  static changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const result = await UserService.changePassword(userId, currentPassword, newPassword);
    res.status(200).json(result);
  });

  // Get user by ID (public profile)
  static getUserById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    
    const user = await UserService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: { user },
    });
  });

  // Get all users (admin only)
  static getUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.getUsers(req.query);
    res.status(200).json(result);
  });

  // Delete user account
  static deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role;
    
    // Users can delete their own account, or admins can delete any account
    if (userId !== currentUserId && currentUserRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const result = await UserService.deleteUser(userId);
    res.status(200).json(result);
  });

  // Update user role (admin only)
  static updateUserRole = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { role } = req.body;
    
    const result = await UserService.updateUserRole(userId, role);
    res.status(200).json(result);
  });

  // Get user statistics (admin only)
  static getUserStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.getUserStats();
    res.status(200).json(result);
  });

  // Delete current user account
  static deleteMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const result = await UserService.deleteUser(userId);
    res.status(200).json(result);
  });
}
