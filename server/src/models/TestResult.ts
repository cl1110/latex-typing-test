import { Schema, model, Types } from 'mongoose';

export interface ITestResult {
  user: Types.ObjectId;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  consistency: number;
  time: number;
  mode: string;
  difficulty: string;
  equations: {
    id: string;
    latex: string;
    userInput: string;
    correct: boolean;
    time: number;
  }[];
  timestamp: Date;
}

const testResultSchema = new Schema<ITestResult>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wpm: {
    type: Number,
    required: true
  },
  rawWpm: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  correctChars: {
    type: Number,
    required: true
  },
  incorrectChars: {
    type: Number,
    required: true
  },
  consistency: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  time: {
    type: Number,
    required: true
  },
  mode: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  equations: [{
    id: String,
    latex: String,
    userInput: String,
    correct: Boolean,
    time: Number
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

testResultSchema.index({ user: 1, timestamp: -1 });
testResultSchema.index({ wpm: -1 });
testResultSchema.index({ mode: 1, wpm: -1 });

export const TestResult = model<ITestResult>('TestResult', testResultSchema);