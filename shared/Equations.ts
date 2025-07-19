export interface Equation {
  id: string;
  latex: string;
  category: 'algebra' | 'calculus' | 'geometry' | 'statistics' | 'linear-algebra' | 'discrete-math';
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export const defaultEquations: Equation[] = [
 
  { id: 'e1', latex: 'a + b = c', category: 'algebra', difficulty: 'easy', tags: ['addition'] },
  { id: 'e2', latex: 'x^2 + y^2 = r^2', category: 'geometry', difficulty: 'easy', tags: ['circle'] },
  { id: 'e3', latex: 'E = mc^2', category: 'algebra', difficulty: 'easy', tags: ['physics'] },
  { id: 'e4', latex: '\\sin^2 x + \\cos^2 x = 1', category: 'algebra', difficulty: 'easy', tags: ['trigonometry'] },
  { id: 'e5', latex: 'a^2 + b^2 = c^2', category: 'geometry', difficulty: 'easy', tags: ['pythagorean'] },
  { id: 'e6', latex: 'F = ma', category: 'algebra', difficulty: 'easy', tags: ['physics'] },
  { id: 'e7', latex: 'v = \\frac{d}{t}', category: 'algebra', difficulty: 'easy', tags: ['physics'] },
  { id: 'e8', latex: 'A = \\pi r^2', category: 'geometry', difficulty: 'easy', tags: ['area'] },
  { id: 'e9', latex: 'C = 2\\pi r', category: 'geometry', difficulty: 'easy', tags: ['circumference'] },
  { id: 'e10', latex: 'V = \\frac{4}{3}\\pi r^3', category: 'geometry', difficulty: 'easy', tags: ['volume'] },


  { id: 'm1', latex: '\\int_0^1 x^2 dx = \\frac{1}{3}', category: 'calculus', difficulty: 'medium', tags: ['integral'] },
  { id: 'm2', latex: '\\frac{d}{dx} e^x = e^x', category: 'calculus', difficulty: 'medium', tags: ['derivative'] },
  { id: 'm3', latex: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1', category: 'calculus', difficulty: 'medium', tags: ['limit'] },
  { id: 'm4', latex: '\\sum_{i=1}^n i = \\frac{n(n+1)}{2}', category: 'discrete-math', difficulty: 'medium', tags: ['summation'] },
  { id: 'm5', latex: '\\det \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc', category: 'linear-algebra', difficulty: 'medium', tags: ['determinant'] },
  { id: 'm6', latex: '\\mu = \\frac{1}{n} \\sum_{i=1}^n x_i', category: 'statistics', difficulty: 'medium', tags: ['mean'] },
  { id: 'm7', latex: '\\sigma^2 = \\frac{1}{n} \\sum_{i=1}^n (x_i - \\mu)^2', category: 'statistics', difficulty: 'medium', tags: ['variance'] },
  { id: 'm8', latex: '\\binom{n}{k} = \\frac{n!}{k!(n-k)!}', category: 'discrete-math', difficulty: 'medium', tags: ['combination'] },
  { id: 'm9', latex: '\\int \\sin x \\, dx = -\\cos x + C', category: 'calculus', difficulty: 'medium', tags: ['integral'] },
  { id: 'm10', latex: '\\nabla \\cdot \\vec{F} = \\frac{\\partial F_x}{\\partial x} + \\frac{\\partial F_y}{\\partial y} + \\frac{\\partial F_z}{\\partial z}', category: 'calculus', difficulty: 'medium', tags: ['divergence'] },

 
  { id: 'h1', latex: '\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}', category: 'calculus', difficulty: 'hard', tags: ['gaussian'] },
  { id: 'h2', latex: '\\sum_{n=1}^\\infty \\frac{1}{n^2} = \\frac{\\pi^2}{6}', category: 'calculus', difficulty: 'hard', tags: ['basel'] },
  { id: 'h3', latex: 'e^{i\\pi} + 1 = 0', category: 'algebra', difficulty: 'hard', tags: ['euler'] },
  { id: 'h4', latex: '\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\nabla^2 u', category: 'calculus', difficulty: 'hard', tags: ['wave'] },
  { id: 'h5', latex: '\\oint_C \\vec{F} \\cdot d\\vec{r} = \\iint_S (\\nabla \\times \\vec{F}) \\cdot d\\vec{S}', category: 'calculus', difficulty: 'hard', tags: ['stokes'] },
  { id: 'h6', latex: '\\mathcal{L}\\{f(t)\\} = \\int_0^\\infty f(t)e^{-st} dt', category: 'calculus', difficulty: 'hard', tags: ['laplace'] },
  { id: 'h7', latex: '\\prod_{p \\text{ prime}} \\frac{1}{1-p^{-s}} = \\sum_{n=1}^\\infty \\frac{1}{n^s}', category: 'discrete-math', difficulty: 'hard', tags: ['euler-product'] },
  { id: 'h8', latex: '\\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}', category: 'linear-algebra', difficulty: 'hard', tags: ['rotation'] },
  { id: 'h9', latex: '\\chi^2 = \\sum_{i=1}^n \\frac{(O_i - E_i)^2}{E_i}', category: 'statistics', difficulty: 'hard', tags: ['chi-squared'] },
  { id: 'h10', latex: '\\nabla^2 \\phi = \\frac{1}{r^2} \\frac{\\partial}{\\partial r} \\left(r^2 \\frac{\\partial \\phi}{\\partial r}\\right) + \\frac{1}{r^2 \\sin\\theta} \\frac{\\partial}{\\partial \\theta} \\left(\\sin\\theta \\frac{\\partial \\phi}{\\partial \\theta}\\right) + \\frac{1}{r^2 \\sin^2\\theta} \\frac{\\partial^2 \\phi}{\\partial \\phi^2}', category: 'calculus', difficulty: 'hard', tags: ['laplacian-spherical'] }
];

