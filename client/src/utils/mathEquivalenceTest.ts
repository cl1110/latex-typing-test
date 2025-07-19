// Test the mathematical equivalence checker
import { checkMathEquivalence, quickEquivalenceCheck, getEquivalenceExplanation } from './mathEquivalence';

// Test cases to demonstrate the equivalence checker
const testCases = [
  // Exact matches after normalization
  { target: 'x^2 + 2x + 1', userInput: 'x^2+2x+1', expected: true },
  { target: 'E = mc^2', userInput: 'E=mc^2', expected: true },
  
  // Different spacing
  { target: 'a + b', userInput: 'a+b', expected: true },
  { target: 'x * y', userInput: 'x*y', expected: true },
  
  // Different multiplication notation
  { target: '2 \\cdot x', userInput: '2*x', expected: true },
  { target: '2 \\times x', userInput: '2*x', expected: true },
  
  // Fraction equivalence
  { target: '\\frac{1}{2}', userInput: '0.5', expected: true },
  { target: '\\frac{a}{b}', userInput: 'a/b', expected: true },
  
  // Power notation
  { target: 'x^{2}', userInput: 'x^2', expected: true },
  { target: 'e^{x}', userInput: 'e^x', expected: true },
  
  // Square root equivalence
  { target: '\\sqrt{x}', userInput: 'x^(1/2)', expected: true },
  { target: '\\sqrt{4}', userInput: '2', expected: true },
  
  // Function equivalence
  { target: '\\sin(x)', userInput: 'sin(x)', expected: true },
  
  // Constants
  { target: '\\pi', userInput: 'pi', expected: true },
  { target: '\\e', userInput: 'e', expected: true },
  
  // Simple algebraic equivalence (for basic expressions)
  { target: 'x + x', userInput: '2*x', expected: true },
  { target: '2*3', userInput: '6', expected: true },
  
  // Non-equivalent expressions
  { target: 'x^2', userInput: 'x^3', expected: false },
  { target: 'a + b', userInput: 'a * b', expected: false },
  { target: 'sin(x)', userInput: 'cos(x)', expected: false }
];

function runTests() {
  console.log('🧮 Testing Mathematical Equivalence Checker\n');
  
  let passed = 0;
  let total = testCases.length;
  
  testCases.forEach((testCase, index) => {
    const result = quickEquivalenceCheck(testCase.target, testCase.userInput);
    const detailedResult = checkMathEquivalence(testCase.target, testCase.userInput);
    const explanation = getEquivalenceExplanation(testCase.target, testCase.userInput);
    
    const success = result === testCase.expected;
    if (success) passed++;
    
    console.log(`Test ${index + 1}: ${success ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  Target: "${testCase.target}"`);
    console.log(`  Input:  "${testCase.userInput}"`);
    console.log(`  Expected: ${testCase.expected}, Got: ${result}`);
    console.log(`  Method: ${detailedResult.method}, Confidence: ${detailedResult.confidence.toFixed(2)}`);
    console.log(`  Explanation: ${explanation}`);
    console.log('');
  });
  
  console.log(`\n📊 Results: ${passed}/${total} tests passed (${((passed/total)*100).toFixed(1)}%)`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! The equivalence checker is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. The equivalence checker may need adjustments.');
  }
}

// Export for use in browser console or testing
if (typeof window !== 'undefined') {
  (window as any).runEquivalenceTests = runTests;
  console.log('💡 Run window.runEquivalenceTests() in the browser console to test the equivalence checker!');
}

export { runTests };
