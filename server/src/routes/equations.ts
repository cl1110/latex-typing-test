

import express from 'express';
import { Equation } from '../models/Equations';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const { mode } = req.query;
    const filter: any = { active: true };

    if (mode) {
      filter.difficulty = mode;
    }

    const equations = await Equation.find(filter);
    res.json(equations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch equations' });
  }
});


router.post('/', async (req, res) => {
  try {
    const { latex, difficulty } = req.body;
    const newEquation = await Equation.create({ latex, difficulty, active: true });
    res.status(201).json(newEquation);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create equation' });
  }
});

export default router;
