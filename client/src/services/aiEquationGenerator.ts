// AI-powered equation generator for various LaTeX categories

export type LatexCategory = 
  | 'algebra'
  | 'calculus'
  | 'geometry'
  | 'trigonometry'
  | 'statistics'
  | 'linear-algebra'
  | 'differential-equations'
  | 'number-theory'
  | 'discrete-math'
  | 'physics'
  | 'chemistry'
  | 'fractions'
  | 'exponents'
  | 'logarithms'
  | 'matrices'
  | 'integrals'
  | 'derivatives'
  | 'limits'
  | 'series'
  | 'vectors'
  | 'complex-numbers'
  | 'set-theory'
  | 'logic'
  | 'combinatorics'
  | 'probability';

export interface CategoryConfig {
  id: LatexCategory;
  name: string;
  description: string;
  color: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const LATEX_CATEGORIES: CategoryConfig[] = [
  // Basic Math
  {
    id: 'algebra',
    name: 'Algebra',
    description: 'Variables, equations, polynomials',
    color: '#50fa7b',
    difficulty: 'beginner'
  },
  {
    id: 'fractions',
    name: 'Fractions',
    description: 'Simple and complex fractions',
    color: '#8be9fd',
    difficulty: 'beginner'
  },
  {
    id: 'exponents',
    name: 'Exponents',
    description: 'Powers, roots, exponential functions',
    color: '#ffb86c',
    difficulty: 'beginner'
  },
  
  // Intermediate Math
  {
    id: 'calculus',
    name: 'Calculus',
    description: 'Derivatives, integrals, limits',
    color: '#ff79c6',
    difficulty: 'intermediate'
  },
  {
    id: 'trigonometry',
    name: 'Trigonometry',
    description: 'Sin, cos, tan, and identities',
    color: '#bd93f9',
    difficulty: 'intermediate'
  },
  {
    id: 'logarithms',
    name: 'Logarithms',
    description: 'Natural and common logarithms',
    color: '#f1fa8c',
    difficulty: 'intermediate'
  },
  
  // Advanced Math
  {
    id: 'linear-algebra',
    name: 'Linear Algebra',
    description: 'Matrices, vectors, eigenvalues',
    color: '#ff5555',
    difficulty: 'advanced'
  },
  {
    id: 'differential-equations',
    name: 'Differential Equations',
    description: 'ODEs, PDEs, solutions',
    color: '#6272a4',
    difficulty: 'advanced'
  },
  {
    id: 'integrals',
    name: 'Integrals',
    description: 'Definite, indefinite, multiple integrals',
    color: '#44475a',
    difficulty: 'advanced'
  },
  
  // Science Applications
  {
    id: 'physics',
    name: 'Physics',
    description: 'Formulas, equations, constants',
    color: '#50fa7b',
    difficulty: 'intermediate'
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    description: 'Chemical equations, formulas',
    color: '#8be9fd',
    difficulty: 'beginner'
  },
  
  // Specialized Topics
  {
    id: 'statistics',
    name: 'Statistics',
    description: 'Probability, distributions, tests',
    color: '#ffb86c',
    difficulty: 'intermediate'
  },
  {
    id: 'complex-numbers',
    name: 'Complex Numbers',
    description: 'Imaginary numbers, complex plane',
    color: '#ff79c6',
    difficulty: 'intermediate'
  },
  {
    id: 'set-theory',
    name: 'Set Theory',
    description: 'Sets, unions, intersections',
    color: '#bd93f9',
    difficulty: 'intermediate'
  }
];

// Difficulty-based equation patterns
const EASY_PATTERNS: Record<LatexCategory, string[]> = {
  'algebra': [
    'x + y = z',
    'a = b + c',
    'x^2 = 16',
    'y = 2x',
    '3x = 12'
  ],
  'fractions': [
    '\\frac{1}{2}',
    '\\frac{a}{b}',
    '\\frac{x}{y} = \\frac{2}{3}',
    '\\frac{1}{x} + \\frac{1}{y}'
  ],
  'exponents': [
    'x^2',
    'a^3',
    '2^n',
    'x^2 + 1'
  ],
  'calculus': [
    '\\frac{d}{dx} x^2 = 2x',
    '\\int x \\, dx',
    'f\'(x)',
    '\\lim_{x \\to 0} x'
  ],
  'trigonometry': [
    '\\sin x',
    '\\cos \\theta',
    '\\tan x = 1',
    '\\sin^2 x + \\cos^2 x = 1'
  ],
  'logarithms': [
    '\\log x',
    '\\ln e = 1',
    '\\log_{10} 100 = 2'
  ],
  'linear-algebra': [
    'Ax = b',
    '\\vec{v} + \\vec{u}',
    '|\\vec{v}|'
  ],
  'differential-equations': [
    'y\' = y',
    '\\frac{dy}{dx} = x'
  ],
  'integrals': [
    '\\int x \\, dx',
    '\\int_0^1 x \\, dx'
  ],
  'physics': [
    'F = ma',
    'E = mc^2',
    'v = at'
  ],
  'chemistry': [
    'H_2O',
    'NaCl',
    'CO_2'
  ],
  'statistics': [
    '\\bar{x}',
    'P(A)',
    '\\mu'
  ],
  'complex-numbers': [
    'i^2 = -1',
    'z = a + bi'
  ],
  'set-theory': [
    'A \\cup B',
    'x \\in A',
    'A \\cap B'
  ],
  'number-theory': [
    'a | b',
    'p \\text{ prime}'
  ],
  'discrete-math': [
    'n!',
    '2^n'
  ],
  'geometry': [
    'A = \\pi r^2',
    'c^2 = a^2 + b^2'
  ],
  'matrices': [
    'A + B',
    'AB'
  ],
  'derivatives': [
    'f\'(x)',
    '\\frac{dy}{dx}'
  ],
  'limits': [
    '\\lim_{x \\to 0} x',
    '\\lim_{x \\to \\infty} \\frac{1}{x} = 0'
  ],
  'series': [
    '1 + 2 + 3 + \\cdots',
    '\\sum_{n=1}^\\infty \\frac{1}{n^2}'
  ],
  'vectors': [
    '\\vec{a} + \\vec{b}',
    '|\\vec{v}|'
  ],
  'logic': [
    'p \\land q',
    'p \\lor q'
  ],
  'combinatorics': [
    'n!',
    '\\binom{n}{k}'
  ],
  'probability': [
    'P(A)',
    'P(A \\cap B)'
  ]
};

const MEDIUM_PATTERNS: Record<LatexCategory, string[]> = {
  'algebra': [
    'ax^2 + bx + c = 0',
    'y = mx + b',
    '(x + a)(x + b) = x^2 + (a+b)x + ab',
    '|x - a| < \\epsilon'
  ],
  'fractions': [
    '\\frac{a}{b} + \\frac{c}{d} = \\frac{ad + bc}{bd}',
    '\\frac{x^2 - 1}{x + 1} = x - 1',
    '\\frac{1}{\\frac{1}{a} + \\frac{1}{b}} = \\frac{ab}{a + b}'
  ],
  'exponents': [
    'a^m \\cdot a^n = a^{m+n}',
    '(a^m)^n = a^{mn}',
    'a^{-n} = \\frac{1}{a^n}'
  ],
  'calculus': [
    '\\frac{d}{dx} x^n = nx^{n-1}',
    '\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C',
    '\\lim_{x \\to \\infty} \\frac{1}{x} = 0'
  ],
  'trigonometry': [
    '\\sin(A + B) = \\sin A \\cos B + \\cos A \\sin B',
    '\\cos(2x) = \\cos^2 x - \\sin^2 x',
    '\\tan x = \\frac{\\sin x}{\\cos x}'
  ],
  'logarithms': [
    '\\log_b(xy) = \\log_b x + \\log_b y',
    '\\log_b\\left(\\frac{x}{y}\\right) = \\log_b x - \\log_b y',
    '\\log_b(x^n) = n\\log_b x'
  ],
  'linear-algebra': [
    '\\det \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc',
    '\\mathbf{A}\\mathbf{x} = \\mathbf{b}',
    '\\mathbf{A}^T \\mathbf{A}'
  ],
  'differential-equations': [
    'y\'\' + \\omega^2 y = 0',
    '\\frac{dy}{dx} = ky'
  ],
  'integrals': [
    '\\int \\sin x \\, dx = -\\cos x + C',
    '\\int_0^\\pi \\sin x \\, dx = 2'
  ],
  'physics': [
    'F = \\frac{GMm}{r^2}',
    'E = \\frac{1}{2}mv^2 + mgh',
    'p = mv'
  ],
  'chemistry': [
    '2H_2 + O_2 \\rightarrow 2H_2O',
    'pH = -\\log[H^+]'
  ],
  'statistics': [
    '\\mu = \\frac{1}{n} \\sum_{i=1}^n x_i',
    '\\sigma^2 = \\frac{1}{n} \\sum_{i=1}^n (x_i - \\mu)^2'
  ],
  'complex-numbers': [
    'e^{i\\theta} = \\cos\\theta + i\\sin\\theta',
    '|z|^2 = z \\overline{z}'
  ],
  'set-theory': [
    'A \\cup B = \\{x : x \\in A \\text{ or } x \\in B\\}',
    'A \\cap B = \\{x : x \\in A \\text{ and } x \\in B\\}'
  ],
  'number-theory': [
    'a \\equiv b \\pmod{n}',
    '\\gcd(a,b) = \\gcd(b, a \\bmod b)'
  ],
  'discrete-math': [
    '\\binom{n}{k} = \\frac{n!}{k!(n-k)!}',
    '|A \\cup B| = |A| + |B| - |A \\cap B|'
  ],
  'geometry': [
    'V = \\frac{4}{3}\\pi r^3',
    'A = \\frac{1}{2}bh'
  ],
  'matrices': [
    '(AB)^T = B^T A^T',
    'A^{-1}A = I'
  ],
  'derivatives': [
    '\\frac{d}{dx} \\sin x = \\cos x',
    '\\frac{d}{dx} e^x = e^x'
  ],
  'limits': [
    '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1',
    '\\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}'
  ],
  'series': [
    '\\sum_{n=1}^\\infty \\frac{1}{n^2} = \\frac{\\pi^2}{6}',
    '\\sum_{n=0}^\\infty x^n = \\frac{1}{1-x}'
  ],
  'vectors': [
    '\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta',
    '\\vec{a} \\times \\vec{b}'
  ],
  'logic': [
    'p \\implies q',
    '\\forall x \\in A'
  ],
  'combinatorics': [
    'P(n,r) = \\frac{n!}{(n-r)!}',
    'C(n,r) = \\binom{n}{r}'
  ],
  'probability': [
    'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)',
    'E[X] = \\sum x P(X = x)'
  ]
};

const HARD_PATTERNS: Record<LatexCategory, string[]> = {
  'algebra': [
    'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    '\\prod_{i=1}^n (x - x_i)',
    '\\sum_{k=0}^n \\binom{n}{k} x^k y^{n-k} = (x+y)^n'
  ],
  'fractions': [
    '\\frac{d}{dx}\\left[\\frac{f(x)}{g(x)}\\right] = \\frac{f\'(x)g(x) - f(x)g\'(x)}{[g(x)]^2}',
    '\\cfrac{1}{1 + \\cfrac{1}{2 + \\cfrac{1}{3 + \\cdots}}}'
  ],
  'exponents': [
    'e^x = \\sum_{n=0}^\\infty \\frac{x^n}{n!}',
    'a^{b^c} \\neq (a^b)^c'
  ],
  'calculus': [
    '\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}',
    '\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\nabla^2 u',
    '\\oint_C \\vec{F} \\cdot d\\vec{r} = \\iint_S (\\nabla \\times \\vec{F}) \\cdot d\\vec{S}'
  ],
  'trigonometry': [
    '\\sin(nx) = \\sum_{k=0}^{\\lfloor n/2 \\rfloor} \\binom{n}{2k+1} \\cos^{n-2k-1}x \\sin^{2k+1}x (-1)^k',
    'e^{ix} = \\cos x + i \\sin x'
  ],
  'logarithms': [
    '\\int \\frac{1}{x} dx = \\ln|x| + C',
    '\\sum_{n=1}^\\infty \\frac{(-1)^{n+1}}{n} = \\ln 2'
  ],
  'linear-algebra': [
    '\\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}',
    '\\lambda \\mathbf{v} = \\mathbf{A} \\mathbf{v}'
  ],
  'differential-equations': [
    '\\frac{\\partial u}{\\partial t} = k\\frac{\\partial^2 u}{\\partial x^2}',
    '\\nabla^2 \\phi = 0'
  ],
  'integrals': [
    '\\mathcal{L}\\{f(t)\\} = \\int_0^\\infty f(t)e^{-st} dt',
    '\\iint_D f(x,y) \\, dA'
  ],
  'physics': [
    '\\nabla \\cdot \\vec{E} = \\frac{\\rho}{\\epsilon_0}',
    'i\\hbar\\frac{\\partial}{\\partial t}\\Psi = \\hat{H}\\Psi'
  ],
  'chemistry': [
    'K_{eq} = \\frac{[C]^c[D]^d}{[A]^a[B]^b}',
    '\\Delta G = \\Delta H - T\\Delta S'
  ],
  'statistics': [
    'Z = \\frac{X - \\mu}{\\sigma}',
    '\\chi^2 = \\sum_{i=1}^n \\frac{(O_i - E_i)^2}{E_i}'
  ],
  'complex-numbers': [
    '\\oint_C \\frac{f(z)}{z-z_0} dz = 2\\pi i f(z_0)',
    '\\text{Res}(f,z_0) = \\lim_{z \\to z_0} (z-z_0)f(z)'
  ],
  'set-theory': [
    '\\mathcal{P}(A) = \\{B : B \\subseteq A\\}',
    '|\\mathcal{P}(A)| = 2^{|A|}'
  ],
  'number-theory': [
    '\\prod_{p \\text{ prime}} \\frac{1}{1-p^{-s}} = \\sum_{n=1}^\\infty \\frac{1}{n^s}',
    '\\sum_{d|n} \\phi(d) = n'
  ],
  'discrete-math': [
    'G = (V, E)',
    'P(n,k) = \\frac{n!}{(n-k)!}'
  ],
  'geometry': [
    '\\int_0^{2\\pi} \\int_0^R r \\, dr \\, d\\theta = \\pi R^2',
    'ds^2 = dx^2 + dy^2 + dz^2'
  ],
  'matrices': [
    'AB \\neq BA',
    '\\text{rank}(A) + \\text{nullity}(A) = n'
  ],
  'derivatives': [
    '\\frac{\\partial^2 f}{\\partial x \\partial y}',
    '\\nabla f = \\left(\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}\\right)'
  ],
  'limits': [
    '\\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n = e',
    '\\lim_{x \\to 0^+} x \\ln x = 0'
  ],
  'series': [
    '\\zeta(s) = \\sum_{n=1}^\\infty \\frac{1}{n^s}',
    '\\sum_{n=0}^\\infty \\frac{(-1)^n x^{2n+1}}{(2n+1)!} = \\sin x'
  ],
  'vectors': [
    '\\nabla \\times \\vec{F} = \\left|\\begin{array}{ccc} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ \\frac{\\partial}{\\partial x} & \\frac{\\partial}{\\partial y} & \\frac{\\partial}{\\partial z} \\\\ F_x & F_y & F_z \\end{array}\\right|',
    '\\vec{a} \\cdot (\\vec{b} \\times \\vec{c}) = \\vec{b} \\cdot (\\vec{c} \\times \\vec{a})'
  ],
  'logic': [
    '\\forall \\epsilon > 0, \\exists \\delta > 0',
    '\\exists! x \\in A'
  ],
  'combinatorics': [
    '\\text{Stirling}(n,k) = \\frac{1}{k!} \\sum_{j=0}^k (-1)^{k-j} \\binom{k}{j} j^n',
    '\\text{Bell}(n) = \\sum_{k=0}^n \\text{Stirling}(n,k)'
  ],
  'probability': [
    'f_X(x) = \\frac{1}{\\sqrt{2\\pi\\sigma^2}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}',
    '\\mathbb{E}[X|Y] = \\sum_x x P(X=x|Y)'
  ]
};

// AI-powered equation generation patterns
const EQUATION_PATTERNS: Record<LatexCategory, string[]> = {
  'algebra': [
    'ax^2 + bx + c = 0',
    'y = mx + b',
    '(x + a)(x + b) = x^2 + (a+b)x + ab',
    'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    '|x - a| < \\epsilon'
  ],
  'fractions': [
    '\\frac{a}{b} + \\frac{c}{d} = \\frac{ad + bc}{bd}',
    '\\frac{x^2 - 1}{x + 1} = x - 1',
    '\\frac{1}{\\frac{1}{a} + \\frac{1}{b}} = \\frac{ab}{a + b}',
    '\\frac{d}{dx}\\left[\\frac{f(x)}{g(x)}\\right] = \\frac{f\'(x)g(x) - f(x)g\'(x)}{[g(x)]^2}'
  ],
  'calculus': [
    '\\frac{d}{dx}[x^n] = nx^{n-1}',
    '\\int x^n dx = \\frac{x^{n+1}}{n+1} + C',
    '\\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}',
    '\\frac{\\partial^2 f}{\\partial x \\partial y} = \\frac{\\partial^2 f}{\\partial y \\partial x}'
  ],
  'trigonometry': [
    '\\sin^2 x + \\cos^2 x = 1',
    '\\tan x = \\frac{\\sin x}{\\cos x}',
    '\\sin(A \\pm B) = \\sin A \\cos B \\pm \\cos A \\sin B',
    'e^{ix} = \\cos x + i\\sin x'
  ],
  'linear-algebra': [
    '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ax + by \\\\ cx + dy \\end{pmatrix}',
    '\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc',
    '\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta',
    'A\\vec{v} = \\lambda\\vec{v}'
  ],
  // Add more patterns for other categories...
  'exponents': [
    'a^m \\cdot a^n = a^{m+n}',
    '(a^m)^n = a^{mn}',
    '\\sqrt[n]{a^m} = a^{\\frac{m}{n}}',
    'e^{\\ln x} = x'
  ],
  'logarithms': [
    '\\log_b(xy) = \\log_b x + \\log_b y',
    '\\log_b\\left(\\frac{x}{y}\\right) = \\log_b x - \\log_b y',
    '\\log_b(x^n) = n\\log_b x',
    '\\ln(e^x) = x'
  ],
  'geometry': [
    'A = \\pi r^2',
    'c^2 = a^2 + b^2',
    'V = \\frac{4}{3}\\pi r^3',
    'A = \\frac{1}{2}bh'
  ],
  'statistics': [
    '\\bar{x} = \\frac{1}{n}\\sum_{i=1}^n x_i',
    '\\sigma^2 = \\frac{1}{n}\\sum_{i=1}^n (x_i - \\mu)^2',
    'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)',
    'Z = \\frac{X - \\mu}{\\sigma}'
  ],
  'differential-equations': [
    '\\frac{dy}{dx} = ky',
    'y\'\' + \\omega^2 y = 0',
    '\\frac{\\partial u}{\\partial t} = k\\frac{\\partial^2 u}{\\partial x^2}',
    '\\nabla^2 \\phi = 0'
  ],
  'number-theory': [
    'a \\equiv b \\pmod{n}',
    '\\gcd(a,b) = \\gcd(b, a \\bmod b)',
    'p | ab \\Rightarrow p | a \\text{ or } p | b',
    '\\sum_{d|n} \\phi(d) = n'
  ],
  'discrete-math': [
    '\\binom{n}{k} = \\frac{n!}{k!(n-k)!}',
    '|A \\cup B| = |A| + |B| - |A \\cap B|',
    'G = (V, E)',
    'P(n,k) = \\frac{n!}{(n-k)!}'
  ],
  'physics': [
    'F = ma',
    'E = mc^2',
    'p = mv',
    '\\nabla \\cdot \\vec{E} = \\frac{\\rho}{\\epsilon_0}'
  ],
  'chemistry': [
    '2H_2 + O_2 \\rightarrow 2H_2O',
    'pH = -\\log[H^+]',
    'K_{eq} = \\frac{[C]^c[D]^d}{[A]^a[B]^b}',
    '\\Delta G = \\Delta H - T\\Delta S'
  ],
  'integrals': [
    '\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}',
    '\\int \\sin x \\, dx = -\\cos x + C',
    '\\iint_D f(x,y) \\, dA',
    '\\oint_C \\vec{F} \\cdot d\\vec{r}'
  ],
  'derivatives': [
    '\\frac{d}{dx}[\\sin x] = \\cos x',
    '\\frac{d}{dx}[e^x] = e^x',
    '\\frac{d}{dx}[\\ln x] = \\frac{1}{x}',
    '\\frac{d}{dx}[uv] = u\'v + uv\''
  ],
  'limits': [
    '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1',
    '\\lim_{x \\to \\infty} \\left(1 + \\frac{1}{x}\\right)^x = e',
    '\\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}',
    '\\lim_{x \\to a} f(x) = L'
  ],
  'series': [
    '\\sum_{n=1}^\\infty \\frac{1}{n^2} = \\frac{\\pi^2}{6}',
    'e^x = \\sum_{n=0}^\\infty \\frac{x^n}{n!}',
    '\\sin x = \\sum_{n=0}^\\infty \\frac{(-1)^n x^{2n+1}}{(2n+1)!}',
    '\\sum_{n=0}^\\infty ar^n = \\frac{a}{1-r}'
  ],
  'vectors': [
    '\\vec{a} \\times \\vec{b} = |\\vec{a}||\\vec{b}|\\sin\\theta \\hat{n}',
    '\\nabla f = \\left(\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, \\frac{\\partial f}{\\partial z}\\right)',
    '\\vec{v} = v_x\\hat{i} + v_y\\hat{j} + v_z\\hat{k}',
    '\\text{div}(\\vec{F}) = \\nabla \\cdot \\vec{F}'
  ],
  'complex-numbers': [
    'z = re^{i\\theta}',
    'z^* = a - bi',
    '|z|^2 = z \\cdot z^*',
    'e^{i\\pi} + 1 = 0'
  ],
  'set-theory': [
    'A \\subseteq B \\iff \\forall x (x \\in A \\Rightarrow x \\in B)',
    '|A \\times B| = |A| \\cdot |B|',
    '\\mathcal{P}(A) = \\{S : S \\subseteq A\\}',
    'A \\setminus B = \\{x : x \\in A \\land x \\notin B\\}'
  ],
  'logic': [
    'p \\land q \\Rightarrow p',
    '\\forall x \\exists y (P(x,y))',
    '\\neg(p \\land q) \\equiv \\neg p \\lor \\neg q',
    'p \\Rightarrow q \\equiv \\neg p \\lor q'
  ],
  'combinatorics': [
    'C(n,k) = \\binom{n}{k}',
    'P(n,k) = \\frac{n!}{(n-k)!}',
    '\\sum_{k=0}^n \\binom{n}{k} = 2^n',
    'C(n,k) = C(n,n-k)'
  ],
  'probability': [
    'P(A|B) = \\frac{P(A \\cap B)}{P(B)}',
    'E[X] = \\sum_{x} x \\cdot P(X = x)',
    '\\text{Var}(X) = E[X^2] - (E[X])^2',
    'P(X = k) = \\binom{n}{k}p^k(1-p)^{n-k}'
  ],
  'matrices': [
    'AB \\neq BA',
    '(AB)^T = B^T A^T',
    'A^{-1}A = I',
    '\\text{rank}(A) + \\text{nullity}(A) = n'
  ]
};

export function generateEquation(categories: LatexCategory[], difficulty: 'easy' | 'medium' | 'hard' = 'medium', excludedEquations: string[] = []): string {
  // If no categories selected, use algebra as default
  if (categories.length === 0) {
    categories = ['algebra'];
  }
  
  // Select pattern pool based on difficulty
  let allPatterns: string[] = [];
  
  categories.forEach(category => {
    let patterns: string[];
    switch (difficulty) {
      case 'easy':
        patterns = EASY_PATTERNS[category] || EASY_PATTERNS['algebra'];
        break;
      case 'hard':
        patterns = HARD_PATTERNS[category] || HARD_PATTERNS['algebra'];
        break;
      case 'medium':
      default:
        patterns = MEDIUM_PATTERNS[category] || MEDIUM_PATTERNS['algebra'];
        break;
    }
    allPatterns.push(...patterns);
  });
  
  if (allPatterns.length === 0) {
    return 'x = y'; // fallback
  }
  
  // Try to find a pattern that hasn't been used
  let attempts = 0;
  let equation = '';
  
  while (attempts < 100) { // Prevent infinite loop
    const randomIndex = Math.floor(Math.random() * allPatterns.length);
    const pattern = allPatterns[randomIndex];
    equation = addVariability(pattern, difficulty);
    
    // If this equation hasn't been used, return it
    if (!excludedEquations.includes(equation)) {
      return equation;
    }
    
    attempts++;
  }
  
  // If we can't find a unique equation after 100 attempts, return any equation
  const randomIndex = Math.floor(Math.random() * allPatterns.length);
  const pattern = allPatterns[randomIndex];
  return addVariability(pattern, difficulty);
}

function addVariability(pattern: string, difficulty: 'easy' | 'medium' | 'hard'): string {
  let result = pattern;
  
  // Replace generic variables with random ones based on difficulty
  const variables = difficulty === 'easy' ? ['x', 'y', 'z', 'a', 'b'] : 
                   difficulty === 'medium' ? ['x', 'y', 'z', 'a', 'b', 'c', 't', 'u', 'v'] :
                   ['x', 'y', 'z', 'a', 'b', 'c', 't', 'u', 'v', 'w', 'p', 'q', 'r', 's'];
  
  const numbers = difficulty === 'easy' ? [1, 2, 3, 4, 5] :
                 difficulty === 'medium' ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] :
                 [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  
  // Replace variables with variety
  result = result.replace(/\ba\b/g, () => variables[Math.floor(Math.random() * variables.length)]);
  result = result.replace(/\bb\b/g, () => variables[Math.floor(Math.random() * variables.length)]);
  result = result.replace(/\bc\b/g, () => numbers[Math.floor(Math.random() * numbers.length)].toString());
  result = result.replace(/\bd\b/g, () => numbers[Math.floor(Math.random() * numbers.length)].toString());
  result = result.replace(/\be\b/g, () => variables[Math.floor(Math.random() * variables.length)]);
  result = result.replace(/\bf\b/g, () => variables[Math.floor(Math.random() * variables.length)]);
  result = result.replace(/\bg\b/g, () => variables[Math.floor(Math.random() * variables.length)]);
  result = result.replace(/\bh\b/g, () => variables[Math.floor(Math.random() * variables.length)]);
  
  // Add random numbers where appropriate
  result = result.replace(/\bn\b/g, () => numbers[Math.floor(Math.random() * numbers.length)].toString());
  result = result.replace(/\bk\b/g, () => numbers[Math.floor(Math.random() * numbers.length)].toString());
  result = result.replace(/\bm\b/g, () => numbers[Math.floor(Math.random() * numbers.length)].toString());
  
  // Add some Greek letters for advanced equations
  if (difficulty === 'hard') {
    const greekLetters = ['\\alpha', '\\beta', '\\gamma', '\\delta', '\\epsilon', '\\theta', '\\lambda', '\\mu', '\\sigma', '\\phi', '\\psi', '\\omega'];
    result = result.replace(/\\omega/g, () => greekLetters[Math.floor(Math.random() * greekLetters.length)]);
  }
  
  return result;
}

export function getCategoriesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): CategoryConfig[] {
  return LATEX_CATEGORIES.filter(cat => cat.difficulty === difficulty);
}

export function getCategoryById(id: LatexCategory): CategoryConfig | undefined {
  return LATEX_CATEGORIES.find(cat => cat.id === id);
}
