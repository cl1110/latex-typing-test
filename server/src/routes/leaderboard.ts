import express, { Request, Response } from 'express';
import { TestResult } from '../models/TestResult';

const router = express.Router();

// GET /api/leaderboard - Get top results
router.get('/', async (req: Request, res: Response) => {
  try {
    const results = await TestResult.find()
      .populate('user', 'username')
      .sort({ wpm: -1 })
      .limit(100);
    
    res.json(results);
  } catch (err) {
    console.error('Leaderboard fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// GET /api/leaderboard/category/:category - Get leaderboard for specific category
router.get('/category/:category', async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const results = await TestResult.find({ category })
      .populate('user', 'username')
      .sort({ wpm: -1 })
      .limit(50);
    
    res.json(results);
  } catch (err) {
    console.error('Category leaderboard fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch category leaderboard' });
  }
});

export default router;
