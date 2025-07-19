import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  username: string;
  email: string;
  password?: string;
  googleId?: string;
  avatar?: string;
  bio?: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  level: number;
  experience: number;
  stats: {
    testsCompleted: number;
    totalTime: number;
    totalKeystrokes: number;
    bestWpm: number;
    bestAccuracy: number;
    averageWpm: number;
    averageAccuracy: number;
  };
  multiplayer: {
    rating: number;
    gamesPlayed: number;
    wins: number;
    losses: number;
    streak: number;
    bestStreak: number;
  };
  settings: {
    theme: string;
    font: string;
    fontSize: number;
    smoothCaret: boolean;
    soundEnabled: boolean;
    soundVolume: number;
    quickRestart: boolean;
    hideTimer: boolean;
    hideLiveWpm: boolean;
    blindMode: boolean;
  };
  createdAt: Date;
  lastActive: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: false,
    minlength: 6
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  avatar: String,
  bio: {
    type: String,
    maxlength: 200
  },
  level: {
    type: Number,
    default: 1
  },
  experience: {
    type: Number,
    default: 0
  },
  stats: {
    testsCompleted: { type: Number, default: 0 },
    totalTime: { type: Number, default: 0 },
    totalKeystrokes: { type: Number, default: 0 },
    bestWpm: { type: Number, default: 0 },
    bestAccuracy: { type: Number, default: 0 },
    averageWpm: { type: Number, default: 0 },
    averageAccuracy: { type: Number, default: 0 }
  },
  multiplayer: {
    rating: { type: Number, default: 1200 },
    gamesPlayed: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 }
  },
  settings: {
    theme: { type: String, default: 'serika-dark' },
    font: { type: String, default: 'JetBrains Mono' },
    fontSize: { type: Number, default: 16 },
    smoothCaret: { type: Boolean, default: true },
    soundEnabled: { type: Boolean, default: false },
    soundVolume: { type: Number, default: 50 },
    quickRestart: { type: Boolean, default: true },
    hideTimer: { type: Boolean, default: false },
    hideLiveWpm: { type: Boolean, default: false },
    blindMode: { type: Boolean, default: false }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});


userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});


userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

export const User = model<IUser>('User', userSchema);
