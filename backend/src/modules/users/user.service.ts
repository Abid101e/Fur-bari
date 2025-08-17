import { User, IUser } from './user.model.js';
import { PasswordService } from '../../utils/password.js';
import { Types } from 'mongoose';

export class UserService {
  // Get user by ID
  static async getUserById(userId: string): Promise<IUser | null> {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  // Get user by email
  static async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      throw new Error(`Failed to get user by email: ${error.message}`);
    }
  }

  // Update user profile
  static async updateProfile(userId: string, updateData: Partial<IUser>) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      return {
        success: true,
        message: 'Profile updated successfully',
        data: { user },
      };
    } catch (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  // Change password
  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    try {
      const user = await User.findById(userId).select('+password');
      
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await PasswordService.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const hashedNewPassword = await PasswordService.hash(newPassword);
      
      // Update password
      user.password = hashedNewPassword;
      await user.save();

      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      throw new Error(`Failed to change password: ${error.message}`);
    }
  }

  // Get users with pagination and filtering
  static async getUsers(options: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isVerified?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        role,
        isVerified,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = options;

      // Build filter object
      const filter: any = {};

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      if (role) {
        filter.role = role;
      }

      if (typeof isVerified === 'boolean') {
        filter.isVerified = isVerified;
      }

      // Build sort object
      const sort: any = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Execute query
      const [users, total] = await Promise.all([
        User.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit),
        User.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        message: 'Users retrieved successfully',
        data: {
          users,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: total,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
      };
    } catch (error) {
      throw new Error(`Failed to get users: ${error.message}`);
    }
  }

  // Delete user account
  static async deleteUser(userId: string) {
    try {
      const user = await User.findByIdAndDelete(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      return {
        success: true,
        message: 'User account deleted successfully',
      };
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  // Update user role (admin only)
  static async updateUserRole(userId: string, newRole: string) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { role: newRole },
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      return {
        success: true,
        message: 'User role updated successfully',
        data: { user },
      };
    } catch (error) {
      throw new Error(`Failed to update user role: ${error.message}`);
    }
  }

  // Get user statistics
  static async getUserStats() {
    try {
      const [
        totalUsers,
        verifiedUsers,
        unverifiedUsers,
        adminUsers,
        recentUsers
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ isVerified: true }),
        User.countDocuments({ isVerified: false }),
        User.countDocuments({ role: 'ADMIN' }),
        User.countDocuments({ 
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
        })
      ]);

      return {
        success: true,
        message: 'User statistics retrieved successfully',
        data: {
          totalUsers,
          verifiedUsers,
          unverifiedUsers,
          adminUsers,
          recentUsers,
        },
      };
    } catch (error) {
      throw new Error(`Failed to get user statistics: ${error.message}`);
    }
  }
}
