

import express, { Request, Response } from 'express';
import { TestResult } from '../models/TestResult';
import { User } from '../models/User';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { wpm, rawWpm, accuracy, correctChars, incorrectChars, consistency, time, mode } = req.body;

    // Save the test result
    const result = await TestResult.create({
      user: userId,
      wpm,
      rawWpm,
      accuracy,
      correctChars,
      incorrectChars,
      consistency,
      time,
      mode
    });

    // Update user stats
    const user = await User.findById(userId);
    if (user) {
      // Update stats
      user.stats.testsCompleted += 1;
      user.stats.totalTime += time; // Add actual play time (in seconds)
      user.stats.totalKeystrokes += correctChars + incorrectChars;
      
      // Update best scores
      if (wpm > user.stats.bestWpm) {
        user.stats.bestWpm = wpm;
      }
      if (accuracy > user.stats.bestAccuracy) {
        user.stats.bestAccuracy = accuracy;
      }
      
      // Update averages
      user.stats.averageWpm = ((user.stats.averageWpm * (user.stats.testsCompleted - 1)) + wpm) / user.stats.testsCompleted;
      user.stats.averageAccuracy = ((user.stats.averageAccuracy * (user.stats.testsCompleted - 1)) + accuracy) / user.stats.testsCompleted;
      
      // Update last active time
      user.lastActive = new Date();
      
      await user.save();
    }

    res.status(201).json(result);
  } catch (err) {
    console.error('Error saving test result:', err);
    res.status(500).json({ error: 'Failed to save result' });
  }
});

router.get('/my', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const results = await TestResult.find({ user: userId }).sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

export default router;
