import { Schema, model } from 'mongoose';

export interface IEquation {
  latex: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  length: number;
  tags: string[];
  usage: number;
  successRate: number;
  averageTime: number;
  active: boolean;
  createdAt: Date;
}

const equationSchema = new Schema<IEquation>({
  latex: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    enum: ['algebra', 'calculus', 'geometry', 'statistics', 'linear-algebra', 'discrete-math']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard']
  },
  length: {
    type: Number,
    required: true
  },
  tags: [String],
  usage: {
    type: Number,
    default: 0
  },
  successRate: {
    type: Number,
    default: 0
  },
  averageTime: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

equationSchema.index({ category: 1, difficulty: 1 });
equationSchema.index({ active: 1, usage: 1 });

export const Equation = model<IEquation>('Equation', equationSchema);