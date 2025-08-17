import { z } from 'zod';

// User update schema
export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format').optional(),
    bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
    avatar: z.string().url('Invalid avatar URL').optional(),
    location: z.object({
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      coordinates: z.object({
        latitude: z.number().min(-90).max(90).optional(),
        longitude: z.number().min(-180).max(180).optional(),
      }).optional(),
    }).optional(),
    preferences: z.object({
      emailNotifications: z.boolean().optional(),
      smsNotifications: z.boolean().optional(),
      pushNotifications: z.boolean().optional(),
      language: z.enum(['en', 'bn']).optional(),
      theme: z.enum(['light', 'dark', 'auto']).optional(),
    }).optional(),
  }),
});

// Change password schema
export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase and number'),
    confirmPassword: z.string(),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }),
});

// User query schema
export const getUsersSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    search: z.string().optional(),
    role: z.enum(['USER', 'ADMIN', 'MODERATOR']).optional(),
    isVerified: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
    sortBy: z.enum(['createdAt', 'name', 'email', 'lastLogin']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

// Export types
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type GetUsersInput = z.infer<typeof getUsersSchema>;
