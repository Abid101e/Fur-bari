import express from 'express';
import {
  registerUser,
  verifyEmail,
  resendVerificationEmail,
  loginUser,
  logoutUser,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
  changePassword,
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';
import {
  validateRegistration,
  validateLogin,
  validateEmail,
  validatePasswordReset,
  validateProfileUpdate,
} from '../middleware/validation.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general rate limiting to all routes
router.use(generalLimiter);

// Public routes
router.post('/register', authLimiter, validateRegistration, registerUser);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', authLimiter, validateEmail, resendVerificationEmail);
router.post('/login', authLimiter, validateLogin, loginUser);
router.post('/forgot-password', authLimiter, validateEmail, forgotPassword);
router.put('/reset-password/:token', authLimiter, validatePasswordReset, resetPassword);

// Protected routes
router.use(authenticateToken); // Apply authentication to all routes below

router.post('/logout', logoutUser);
router.get('/me', getMe);
router.put('/profile', validateProfileUpdate, updateProfile);
router.put('/change-password', changePassword);

export default router;
