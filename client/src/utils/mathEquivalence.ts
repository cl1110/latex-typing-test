// Mathematical equivalence checker for LaTeX expressions
// Lightweight version without external dependencies

export interface EquivalenceResult {
  isEquivalent: boolean;
  method: 'exact' | 'normalized' | 'numeric' | 'symbolic';
  confidence: number; // 0-1 scale
  details?: string;
}

/**
 * Main function to check if two LaTeX expressions are mathematically equivalent
 */
export function checkMathEquivalence(
  target: string, 
  userInput: string, 
  options: {
    tolerance?: number;
    variables?: string[];
    domain?: { min: number; max: number };
    numericSamples?: number;
  } = {}
): EquivalenceResult {
  const {
    tolerance = 1e-10,
    variables = ['x', 'y', 'z', 't', 'a', 'b', 'c'],
    domain = { min: -10, max: 10 },
    numericSamples = 20
  } = options;

  try {
    // Step 1: Normalize both expressions
    const normalizedTarget = normalizeLatexExpression(target);
    const normalizedUser = normalizeLatexExpression(userInput);

    // Step 2: Check exact match after normalization
    if (normalizedTarget === normalizedUser) {
      return {
        isEquivalent: true,
        method: 'exact',
        confidence: 1.0,
        details: 'Exact match after normalization'
      };
    }

    // Step 3: Check for common equivalent patterns
    const patternResult = checkCommonPatterns(normalizedTarget, normalizedUser);
    if (patternResult.isEquivalent) {
      return patternResult;
    }

    // Step 4: Try numeric equivalence for simple expressions
    const numericResult = checkSimpleNumericEquivalence(
      normalizedTarget, 
      normalizedUser, 
      variables, 
      domain, 
      numericSamples, 
      tolerance
    );
    
    return numericResult;

  } catch (error) {
    console.warn('Math equivalence check failed:', error);
    return {
      isEquivalent: false,
      method: 'exact',
      confidence: 0,
      details: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Normalize LaTeX expressions for comparison
 */
function normalizeLatexExpression(latex: string): string {
  return latex
    // Remove all whitespace
    .replace(/\s+/g, '')
    // Normalize multiplication operators
    .replace(/\\\cdot/g, '*')
    .replace(/\\\times/g, '*')
    .replace(/\\cdot/g, '*')
    .replace(/\\times/g, '*')
    // Normalize division
    .replace(/\\\div/g, '/')
    .replace(/\\div/g, '/')
    // Normalize fractions - convert \frac{a}{b} to (a)/(b)
    .replace(/\\frac\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, '(($1))/($2)')
    // Normalize powers
    .replace(/\^(\d+)/g, '^$1')
    .replace(/\^{([^}]+)}/g, '^($1)')
    // Normalize square roots
    .replace(/\\sqrt\{([^}]+)\}/g, 'sqrt($1)')
    .replace(/\\sqrt\[(\d+)\]\{([^}]+)\}/g, '($2)^(1/$1)')
    // Normalize trig functions
    .replace(/\\sin/g, 'sin')
    .replace(/\\cos/g, 'cos')
    .replace(/\\tan/g, 'tan')
    .replace(/\\log/g, 'log')
    .replace(/\\ln/g, 'ln')
    // Normalize constants
    .replace(/\\pi/g, 'pi')
    .replace(/\\e/g, 'e')
    // Remove unnecessary parentheses around single terms
    .replace(/\(([a-zA-Z0-9\.]+)\)/g, '$1')
    // Normalize implicit multiplication (2x -> 2*x)
    .replace(/(\d+)([a-zA-Z])/g, '$1*$2')
    .replace(/([a-zA-Z])(\d+)/g, '$1*$2')
    .replace(/([a-zA-Z])([a-zA-Z])/g, '$1*$2')
    // Normalize decimal numbers
    .replace(/(\d+)\.(\d+)/g, '$1.$2')
    .toLowerCase();
}

/**
 * Check for common equivalent patterns
 */
function checkCommonPatterns(expr1: string, expr2: string): EquivalenceResult {
  // Pattern 1: Different fraction formats
  // 1/2 vs 0.5
  const fractionToDecimal = (expr: string) => {
    return expr.replace(/(\d+)\/(\d+)/g, (match, num, den) => {
      const result = parseFloat(num) / parseFloat(den);
      return result.toString();
    });
  };

  if (fractionToDecimal(expr1) === fractionToDecimal(expr2)) {
    return {
      isEquivalent: true,
      method: 'normalized',
      confidence: 0.9,
      details: 'Equivalent fraction/decimal forms'
    };
  }

  // Pattern 2: Expanded vs factored forms
  // x^2+2*x+1 vs (x+1)^2
  const expandedPatterns = [
    // (a+b)^2 = a^2 + 2ab + b^2
    {
      pattern: /\(([^)]+)\+([^)]+)\)\^2/g,
      expansion: (a: string, b: string) => `${a}^2+2*${a}*${b}+${b}^2`
    },
    // (a-b)^2 = a^2 - 2ab + b^2
    {
      pattern: /\(([^)]+)-([^)]+)\)\^2/g,
      expansion: (a: string, b: string) => `${a}^2-2*${a}*${b}+${b}^2`
    }
  ];

  for (const { pattern, expansion } of expandedPatterns) {
    const matches1 = expr1.match(pattern);
    const matches2 = expr2.match(pattern);
    
    if (matches1 || matches2) {
      // Try expanding one form and comparing
      // This is a simplified version - in practice you'd need more robust expansion
      return {
        isEquivalent: false,
        method: 'symbolic',
        confidence: 0.3,
        details: 'Potential algebraic equivalence detected but needs full expansion'
      };
    }
  }

  return {
    isEquivalent: false,
    method: 'normalized',
    confidence: 0,
    details: 'No common patterns matched'
  };
}

/**
 * Simple numeric equivalence for basic expressions
 */
function checkSimpleNumericEquivalence(
  expr1: string,
  expr2: string,
  variables: string[],
  domain: { min: number; max: number },
  samples: number,
  tolerance: number
): EquivalenceResult {
  try {
    // Only handle very simple expressions for now
    const isSimple = (expr: string) => {
      return /^[\d\.\+\-\*\/\^x\(\)]+$/.test(expr) && !expr.includes('sin') && !expr.includes('cos');
    };

    if (!isSimple(expr1) || !isSimple(expr2)) {
      return {
        isEquivalent: false,
        method: 'numeric',
        confidence: 0,
        details: 'Expressions too complex for simple numeric check'
      };
    }

    let matchingPoints = 0;
    let totalPoints = 0;

    // Test with random values for x (main variable)
    for (let i = 0; i < samples; i++) {
      const x = domain.min + Math.random() * (domain.max - domain.min);
      
      try {
        const val1 = evaluateSimpleExpression(expr1, x);
        const val2 = evaluateSimpleExpression(expr2, x);

        if (val1 !== null && val2 !== null) {
          totalPoints++;
          if (Math.abs(val1 - val2) <= tolerance) {
            matchingPoints++;
          }
        }
      } catch {
        continue;
      }
    }

    const confidence = totalPoints > 0 ? matchingPoints / totalPoints : 0;
    const isEquivalent = confidence >= 0.95;

    return {
      isEquivalent,
      method: 'numeric',
      confidence,
      details: `${matchingPoints}/${totalPoints} test points matched`
    };

  } catch (error) {
    return {
      isEquivalent: false,
      method: 'numeric',
      confidence: 0,
      details: 'Numeric evaluation failed'
    };
  }
}

/**
 * Simple expression evaluator for basic math
 */
function evaluateSimpleExpression(expr: string, x: number): number | null {
  try {
    // Replace x with the actual value
    let evalExpr = expr.replace(/x/g, x.toString());
    
    // Replace ^ with **
    evalExpr = evalExpr.replace(/\^/g, '**');
    
    // Basic safety check - only allow safe characters
    if (!/^[\d\.\+\-\*\/\(\)\s\*]+$/.test(evalExpr)) {
      return null;
    }
    
    // Use Function constructor for evaluation (safer than eval)
    const result = new Function('return ' + evalExpr)();
    
    return typeof result === 'number' && isFinite(result) ? result : null;
  } catch {
    return null;
  }
}

/**
 * Quick check for common equivalent forms
 */
export function quickEquivalenceCheck(target: string, userInput: string): boolean {
  const result = checkMathEquivalence(target, userInput);
  return result.isEquivalent && result.confidence >= 0.8;
}

/**
 * Get detailed explanation of why expressions are or aren't equivalent
 */
export function getEquivalenceExplanation(target: string, userInput: string): string {
  const result = checkMathEquivalence(target, userInput);
  
  if (result.isEquivalent) {
    switch (result.method) {
      case 'exact':
        return 'Expressions are identical after normalization.';
      case 'symbolic':
        return 'Expressions are algebraically equivalent.';
      case 'numeric':
        return 'Expressions produce the same values when tested.';
      case 'normalized':
        return 'Expressions are equivalent after formatting normalization.';
    }
  } else {
    return `Expressions are not equivalent. ${result.details || ''}`;
  }
}
