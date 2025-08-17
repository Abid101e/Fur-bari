import mongoose, { Document, Schema } from 'mongoose';
import crypto from 'crypto';
import { PasswordService } from '../../utils/password.js';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  role: 'user' | 'admin' | 'moderator';
  isVerified: boolean;
  isActive: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  refreshTokens: string[];
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Instance methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  createPasswordResetToken(): string;
  createEmailVerificationToken(): string;
  addRefreshToken(token: string): void;
  removeRefreshToken(token: string): void;
  clearRefreshTokens(): void;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name must be less than 50 characters long'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please provide a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false, // Don't return password by default
  },
  phone: {
    type: String,
    sparse: true, // Allow multiple documents with null/undefined phone
    trim: true,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please provide a valid phone number'],
  },
  avatar: {
    type: String,
    default: null,
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio must be less than 500 characters long'],
    trim: true,
  },
  location: {
    city: {
      type: String,
      trim: true,
      maxlength: [100, 'City name must be less than 100 characters'],
    },
    state: {
      type: String,
      trim: true,
      maxlength: [100, 'State name must be less than 100 characters'],
    },
    country: {
      type: String,
      trim: true,
      maxlength: [100, 'Country name must be less than 100 characters'],
    },
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  emailVerificationToken: {
    type: String,
    select: false,
  },
  emailVerificationExpires: {
    type: Date,
    select: false,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
  refreshTokens: {
    type: [String],
    default: [],
    select: false,
  },
  lastLogin: {
    type: Date,
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      if (ret.__v !== undefined) delete ret.__v;
      if (ret.password !== undefined) delete ret.password;
      if (ret.refreshTokens !== undefined) delete ret.refreshTokens;
      if (ret.emailVerificationToken !== undefined) delete ret.emailVerificationToken;
      if (ret.emailVerificationExpires !== undefined) delete ret.emailVerificationExpires;
      if (ret.passwordResetToken !== undefined) delete ret.passwordResetToken;
      if (ret.passwordResetExpires !== undefined) delete ret.passwordResetExpires;
      return ret;
    },
  },
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  try {
    // Hash the password with cost of 12
    this.password = await PasswordService.hash(this.password);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return PasswordService.compare(candidatePassword, this.password);
};

// Instance method to create password reset token
userSchema.methods.createPasswordResetToken = function(): string {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  return resetToken;
};

// Instance method to create email verification token
userSchema.methods.createEmailVerificationToken = function(): string {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  return verificationToken;
};

// Instance method to add refresh token
userSchema.methods.addRefreshToken = function(token: string): void {
  this.refreshTokens.push(token);
  
  // Keep only the last 5 refresh tokens
  if (this.refreshTokens.length > 5) {
    this.refreshTokens = this.refreshTokens.slice(-5);
  }
};

// Instance method to remove refresh token
userSchema.methods.removeRefreshToken = function(token: string): void {
  this.refreshTokens = this.refreshTokens.filter((t: string) => t !== token);
};

// Instance method to clear all refresh tokens
userSchema.methods.clearRefreshTokens = function(): void {
  this.refreshTokens = [];
};

export const User = mongoose.model<IUser>('User', userSchema);
