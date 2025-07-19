import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Equation } from '../models/Equations';
import { defaultEquations } from '../../../shared/Equations';

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/latex-typing-test');
    
    console.log('Connected to MongoDB');
    
    
    await Equation.deleteMany({});
    
   
    const equations = defaultEquations.map(eq => ({
      ...eq,
      length: eq.latex.length,
      usage: 0,
      successRate: 0,
      averageTime: 0,
      active: true
    }));
    
    await Equation.insertMany(equations);
    
    console.log(`Seeded ${equations.length} equations`);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();