import { Equation } from '../../../shared/Equations';
import { defaultEquations } from '../../../shared/Equations';

export interface EquationGeneratorOptions {
  count: number;
  difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
  category?: string;
  excludeIds?: string[];
}

export class EquationGenerator {
  private equations: Equation[];

  constructor(customEquations?: Equation[]) {
    this.equations = customEquations || defaultEquations;
  }


  getEquations(options: EquationGeneratorOptions): Equation[] {
    let pool = [...this.equations];

   
    if (options.difficulty && options.difficulty !== 'mixed') {
      pool = pool.filter(eq => eq.difficulty === options.difficulty);
    }

   
    if (options.category) {
      pool = pool.filter(eq => eq.category === options.category);
    }

  
    if (options.excludeIds && options.excludeIds.length > 0) {
      pool = pool.filter(eq => !options.excludeIds!.includes(eq.id));
    }

   
    pool = this.shuffle(pool);

   
    return pool.slice(0, options.count);
  }

 
  getBalancedSet(count: number): Equation[] {
    const easyCount = Math.floor(count * 0.4);
    const mediumCount = Math.floor(count * 0.4);
    const hardCount = count - easyCount - mediumCount;

    const easy = this.getEquations({ count: easyCount, difficulty: 'easy' });
    const medium = this.getEquations({ count: mediumCount, difficulty: 'medium' });
    const hard = this.getEquations({ count: hardCount, difficulty: 'hard' });

    return this.shuffle([...easy, ...medium, ...hard]);
  }

 
  getTestEquations(mode: 'practice' | 'test' | 'multiplayer', duration?: number): Equation[] {
    switch (mode) {
      case 'practice':
      
        return this.getEquations({ count: 10, difficulty: 'easy' });
      
      case 'test':
       
        const count = duration ? Math.ceil(duration / 3) : 20; // Assume ~3 seconds per equation
        return this.getBalancedSet(count);
      
      case 'multiplayer':
     
        return this.getBalancedSet(20);
      
      default:
        return this.getBalancedSet(10);
    }
  }

 
  private shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }


  async generateWithAI(options: EquationGeneratorOptions): Promise<Equation[]> {
  
    console.log('AI generator not yet implemented, using default equations');
    return this.getEquations(options);
  }
}


export const equationGenerator = new EquationGenerator();