import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validation.js';
import {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth.schema.js';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/refresh', validate(refreshTokenSchema), AuthController.refreshToken);
router.post('/logout', validate(refreshTokenSchema), AuthController.logout);

// Email verification
router.post('/verify-email', authenticate, AuthController.sendVerificationEmail);
router.get('/verify-email/:token', validate(verifyEmailSchema), AuthController.verifyEmail);

// Password reset
router.post('/forgot-password', validate(forgotPasswordSchema), AuthController.forgotPassword);
router.patch('/reset-password/:token', validate(resetPasswordSchema), AuthController.resetPassword);

// Protected routes
router.use(authenticate); // All routes below this middleware require authentication

router.get('/me', AuthController.getMe);
router.post('/logout-all', AuthController.logoutAll);

export default router;
