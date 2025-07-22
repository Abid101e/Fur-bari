import express from 'express';
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import User from '../models/user.js';

const router = express.Router();

// Rate limiting for OAuth endpoints
const oauthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 OAuth attempts per windowMs
  message: {
    success: false,
    message: 'Too many OAuth attempts, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(oauthLimiter);

// Generate JWT token helper function
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email 
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRE || '30d' 
    }
  );
};

// Initiate Google OAuth login
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

// Handle Google OAuth callback
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
    session: false 
  }),
  async (req, res) => {
    try {
      // Generate JWT token for authenticated user
      const token = generateToken(req.user);
      
      // Update last login timestamp
      req.user.lastLogin = new Date();
      await req.user.save();

      // Redirect to frontend with JWT token
      const redirectUrl = `${process.env.CLIENT_URL}/auth/success?token=${token}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
    }
  }
);

// Get authenticated OAuth user information
router.get('/me', 
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select('-password');
      
      res.status(200).json({
        success: true,
        data: {
          user,
          loginMethod: 'oauth'
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// OAuth logout (JWT tokens are stateless, so this is informational only)
router.post('/logout', 
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Note: JWT logout is handled client-side by removing the token
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  }
);

export default router;
