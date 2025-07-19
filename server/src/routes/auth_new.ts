import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { User } from '../models/User';

const router = express.Router();

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 registration attempts per hour
  message: 'Too many registration attempts, please try again later',
});

// Helper function to generate JWT
const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'fallback_secret', { 
    expiresIn: '7d' 
  });
};

// Helper function to sanitize user data
const sanitizeUser = (user: any) => {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
    level: user.level,
    experience: user.experience,
    stats: user.stats,
    settings: user.settings,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt
  };
};

// Register with email
router.post('/register', 
  registerLimiter,
  [
    body('username')
      .isLength({ min: 3, max: 20 })
      .withMessage('Username must be between 3 and 20 characters')
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.array() 
        });
      }

      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [{ username }, { email }] 
      });
      
      if (existingUser) {
        if (existingUser.username === username) {
          return res.status(400).json({ message: 'Username already taken' });
        }
        if (existingUser.email === email) {
          return res.status(400).json({ message: 'Email already registered' });
        }
      }

      // Generate email verification token
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');

      const newUser = new User({ 
        username, 
        email, 
        password,
        emailVerificationToken,
        isEmailVerified: false
      });
      
      await newUser.save();

      // Generate JWT token
      const token = generateToken(newUser._id.toString());

      // TODO: Send verification email
      console.log(`Email verification token for ${email}: ${emailVerificationToken}`);

      res.status(201).json({ 
        message: 'User registered successfully. Please check your email for verification.',
        token,
        user: sanitizeUser(newUser)
      });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

// Login with email or username
router.post('/login', 
  authLimiter,
  [
    body('login')
      .notEmpty()
      .withMessage('Username or email is required'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.array() 
        });
      }

      const { login, password } = req.body;

      // Find user by username or email
      const user = await User.findOne({
        $or: [
          { username: login },
          { email: login }
        ]
      });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check if user has a password (not OAuth-only account)
      if (!user.password) {
        return res.status(401).json({ 
          message: 'This account was created with Google. Please use Google Sign-In.' 
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Update last active timestamp
      user.lastActive = new Date();
      await user.save();

      const token = generateToken(user._id.toString());

      res.json({ 
        token, 
        user: sanitizeUser(user)
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// Verify email
router.get('/verify-email/:token', async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error('Email verification error:', err);
    res.status(500).json({ error: 'Email verification failed' });
  }
});

// Request password reset
router.post('/forgot-password',
  authLimiter,
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.array() 
        });
      }

      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        // Don't reveal if email exists or not
        return res.json({ 
          message: 'If an account with that email exists, a password reset link has been sent.' 
        });
      }

      // Generate password reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.passwordResetToken = resetToken;
      user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
      await user.save();

      // TODO: Send password reset email
      console.log(`Password reset token for ${email}: ${resetToken}`);

      res.json({ 
        message: 'If an account with that email exists, a password reset link has been sent.' 
      });
    } catch (err) {
      console.error('Password reset request error:', err);
      res.status(500).json({ error: 'Password reset request failed' });
    }
  }
);

// Reset password
router.post('/reset-password',
  authLimiter,
  [
    body('token')
      .notEmpty()
      .withMessage('Reset token is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.array() 
        });
      }

      const { token, password } = req.body;

      const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: new Date() }
      });

      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }

      user.password = password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      res.json({ message: 'Password reset successfully' });
    } catch (err) {
      console.error('Password reset error:', err);
      res.status(500).json({ error: 'Password reset failed' });
    }
  }
);

// Google OAuth routes (placeholder - requires passport packages)
router.get('/google', (req: Request, res: Response) => {
  res.status(501).json({ 
    message: 'Google OAuth not yet configured. Install passport packages first.' 
  });
});

router.get('/google/callback', (req: Request, res: Response) => {
  res.status(501).json({ 
    message: 'Google OAuth callback not yet configured. Install passport packages first.' 
  });
});

// Get current user
router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
