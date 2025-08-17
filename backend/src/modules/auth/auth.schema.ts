import { z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Please provide a valid email address')
      .toLowerCase(),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(1, 'Password cannot be empty'),
  }),
});

// Register validation schema
export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
      })
      .min(2, 'Name must be at least 2 characters long')
      .max(50, 'Name must be less than 50 characters long')
      .trim(),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Please provide a valid email address')
      .toLowerCase(),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(8, 'Password must be at least 8 characters long')
      .max(128, 'Password must be less than 128 characters long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
        'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
      ),
    phone: z
      .string()
      .regex(/^\+?[\d\s\-\(\)]+$/, 'Please provide a valid phone number')
      .optional(),
  }),
});

// Refresh token validation schema
export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z
      .string({
        required_error: 'Refresh token is required',
      })
      .min(1, 'Refresh token cannot be empty'),
  }),
});

// Email verification schema
export const verifyEmailSchema = z.object({
  params: z.object({
    token: z
      .string({
        required_error: 'Verification token is required',
      })
      .min(1, 'Verification token cannot be empty'),
  }),
});

// Password reset request schema
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Please provide a valid email address')
      .toLowerCase(),
  }),
});

// Password reset schema
export const resetPasswordSchema = z.object({
  params: z.object({
    token: z
      .string({
        required_error: 'Reset token is required',
      })
      .min(1, 'Reset token cannot be empty'),
  }),
  body: z.object({
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(8, 'Password must be at least 8 characters long')
      .max(128, 'Password must be less than 128 characters long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
        'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
      ),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
