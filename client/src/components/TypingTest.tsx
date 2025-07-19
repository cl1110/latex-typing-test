
import React, { useState, useEffect, useRef, useCallback } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { calculateWPM, calculateAccuracy } from '../utils/stats';
import { quickEquivalenceCheck, getEquivalenceExplanation } from '../utils/mathEquivalence';
import { generateEquation, LatexCategory } from '../services/aiEquationGenerator';
import TestResults from '../components/TestResults';

interface Equation {
  id: string;
  latex: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface TestResult {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  consistency: number;
  time: number;
  mode: string;
  timestamp: Date;
}

interface TypingTestProps {
  selectedCategories: LatexCategory[];
  onCategoriesChange: (categories: LatexCategory[]) => void;
}

const TypingTest: React.FC<TypingTestProps> = ({ selectedCategories, onCategoriesChange }) => {
  const { settings, updateSettings } = useSettings();
  const { user } = useAuth();
  
  const [equations, setEquations] = useState<Equation[]>([]);
  const [currentEquationIndex, setCurrentEquationIndex] = useState(0);
  const [completedEquationIds, setCompletedEquationIds] = useState<Set<string>>(new Set());
  const [usedEquations, setUsedEquations] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTestActive, setIsTestActive] = useState(false);
  const [testStartTime, setTestStartTime] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [equivalenceStatus, setEquivalenceStatus] = useState<'checking' | 'equivalent' | 'different' | null>(null);
  const [showCorrectBorder, setShowCorrectBorder] = useState(false);
  const [showIncorrectBorder, setShowIncorrectBorder] = useState(false);
  const [showSkippedBorder, setShowSkippedBorder] = useState(false);
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false);
  const [pendingValidation, setPendingValidation] = useState(false);
  const [enterHoldStart, setEnterHoldStart] = useState<number | null>(null);
  const [isSkipping, setIsSkipping] = useState(false);
  
  
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [keystrokes, setKeystrokes] = useState<number[]>([]);
  const [correctEquations, setCorrectEquations] = useState(0);
  const [incorrectEquations, setIncorrectEquations] = useState(0);
  const [skippedEquations, setSkippedEquations] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [backspaces, setBackspaces] = useState(0);
  

  const inputRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<number | null>(null);
  const skipTimerRef = useRef<number | null>(null);

  
 
  const currentEquation = equations[currentEquationIndex];
  const currentLatex = currentEquation?.latex || '';
  
 
  const renderLatex = useCallback((latex: string) => {
    try {
      return katex.renderToString(latex, {
        throwOnError: false,
        displayMode: true
      });
    } catch (e) {
      return '<span>Invalid LaTeX</span>';
    }
  }, []);
  
  
  // Global keyboard detection to start test on any typing
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Check if any modal is open by looking for high z-index elements
      const modalElements = document.querySelectorAll('[class*="z-[9999]"], [class*="modal"], [class*="Modal"]');
      const isModalOpen = modalElements.length > 0;
      
      // Don't interfere with special keys, shortcuts, if already active, or if modal is open
      if (isTestActive || isModalOpen || e.ctrlKey || e.metaKey || e.altKey || e.key === 'Tab' || e.key === 'Escape') {
        return;
      }
      
      // Start test on any alphanumeric key or common LaTeX characters
      if (e.key.length === 1 || e.key === 'Backspace') {
        startTest();
        // Focus the textarea after starting
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isTestActive]);

  // Auto-focus textarea when test becomes active
  useEffect(() => {
    if (isTestActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTestActive]);

  useEffect(() => {
    generateAIEquations();
  }, [settings.difficulty, settings.category, selectedCategories]);
  
  const generateAIEquations = async () => {
    // Generate a larger pool of equations to avoid repetition
    const poolSize = Math.max(settings.equationCount * 3, 50); // At least 3x the needed amount
    const difficulty = settings.difficulty;
    
    const aiEquations: Equation[] = [];
    const baseTimestamp = Date.now();
    
    for (let i = 0; i < poolSize; i++) {
      // Generate equation with exclusion list
      const latex = generateEquation(selectedCategories, difficulty, usedEquations);
      aiEquations.push({
        id: `ai-${Date.now()}-${i}-${Math.random()}`, // Simple unique ID
        latex,
        difficulty
      });
      // Add to used equations to prevent repetition
      setUsedEquations(prev => [...prev, latex]);
    }
    
    setEquations(aiEquations);
    setCurrentEquationIndex(0);
  };
  

  const startTest = useCallback(() => {
    setIsTestActive(true);
    updateSettings({ isTestActive: true });
    setTestStartTime(Date.now());
    setTimeElapsed(0);
    setUserInput('');
    setCorrectChars(0);
    setIncorrectChars(0);
    setKeystrokes([]);
    setCurrentEquationIndex(0);
    setCorrectEquations(0);
    setIncorrectEquations(0);
    setSkippedEquations(0);
    setCompletedEquationIds(new Set());
    setTotalKeystrokes(0);
    setBackspaces(0);
    setShowCorrectBorder(false);
    setShowIncorrectBorder(false);
    setShowSkippedBorder(false);
    setIsProcessingAnswer(false);
    setPendingValidation(false);
    setEquivalenceStatus(null);
    setEnterHoldStart(null);
    setIsSkipping(false);
    inputRef.current?.focus();
    
  
    timerRef.current = window.setInterval(() => {
      setTimeElapsed(prev => prev + 0.1);
    }, 100);
  }, [updateSettings]);
  
  const getNextAvailableEquation = useCallback(() => {
    // Start searching from the next equation after current
    const startIndex = currentEquationIndex + 1;
    
    // Find the first equation after current that hasn't been completed
    for (let i = startIndex; i < equations.length; i++) {
      if (!completedEquationIds.has(equations[i].id)) {
        return i;
      }
    }
    
    // If no equations found after current, search from beginning (but skip current)
    for (let i = 0; i < currentEquationIndex; i++) {
      if (!completedEquationIds.has(equations[i].id)) {
        return i;
      }
    }
    
    // If we've used all equations, generate more
    const additionalCount = Math.max(settings.equationCount, 20);
    const difficulty = settings.difficulty;
    const newEquations: Equation[] = [];
    const baseTimestamp = Date.now();
    
    for (let i = 0; i < additionalCount; i++) {
      // Generate equation with exclusion list
      const latex = generateEquation(selectedCategories, difficulty, usedEquations);
      newEquations.push({
        id: `ai-${Date.now()}-${equations.length + i}-${Math.random()}`,
        latex,
        difficulty
      });
      // Add to used equations to prevent repetition
      setUsedEquations(prev => [...prev, latex]);
    }
    
    setEquations(prev => [...prev, ...newEquations]);
    return equations.length; // Return index of first new equation
  }, [equations, completedEquationIds, settings.equationCount, settings.difficulty, selectedCategories, currentEquationIndex]);
  

  const endTest = useCallback(() => {
    setIsTestActive(false);
    updateSettings({ isTestActive: false });
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    if (skipTimerRef.current) {
      window.clearTimeout(skipTimerRef.current);
    }
    

    const testTime = (Date.now() - (testStartTime || 0)) / 1000;
    const wpm = calculateWPM(correctChars, testTime / 60); // Convert to minutes
    const rawWpm = calculateWPM(correctChars + incorrectChars, testTime / 60); // Convert to minutes
    const accuracy = calculateAccuracy(correctChars, correctChars + incorrectChars);
    
    const result: TestResult = {
      wpm,
      rawWpm,
      accuracy,
      correctChars,
      incorrectChars,
      consistency: calculateConsistency(keystrokes),
      time: testTime,
      mode: `${settings.equationCount} equations ${settings.difficulty}`,
      timestamp: new Date()
    };
    
    setTestResult(result);
    setShowResults(true);
    
   
    if (user) {
      saveTestResult(result);
    }
  }, [testStartTime, correctChars, incorrectChars, keystrokes, settings, user, updateSettings]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (!isTestActive) {
      if (e.key === ' ' || e.key === 'Enter') {
        startTest();
      }
      return;
    }
    
    // Quick restart with Tab
    if (e.key === 'Tab' && settings.quickRestart) {
      e.preventDefault();
      resetTest();
      return;
    }

    // Record keystroke timing
    setKeystrokes(prev => [...prev, Date.now()]);
    
    // Track total keystrokes and backspaces
    if (e.key === 'Backspace') {
      setBackspaces(prev => prev + 1);
    }
    setTotalKeystrokes(prev => prev + 1);

    // Handle Enter key for validation/skipping
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Prevent spam clicking while processing
      if (isProcessingAnswer || isSkipping) {
        return;
      }
      
      // Single Enter = Validate answer (only if there's input)
      if (userInput.trim()) {
        setIsProcessingAnswer(true);
        
        const isCorrect = quickEquivalenceCheck(currentLatex, userInput.trim());
        
        if (isCorrect) {
          // Correct - show green border and advance
          setShowCorrectBorder(true);
          setCorrectChars(prev => prev + userInput.trim().length);
          
          // Mark current equation as completed
          setCompletedEquationIds(prev => {
            const newSet = new Set(prev);
            newSet.add(currentEquation.id);
            return newSet;
          });
          
          setCorrectEquations(prev => {
            const newCorrect = prev + 1;
            // Check if we've reached the target number of questions
            if (newCorrect + skippedEquations >= settings.equationCount) {
              setTimeout(() => endTest(), 1000);
            }
            return newCorrect;
          });
          
          setTimeout(() => {
            setShowCorrectBorder(false);
            setIsProcessingAnswer(false);
            if (correctEquations + 1 + skippedEquations < settings.equationCount) {
              const nextIndex = getNextAvailableEquation();
              setCurrentEquationIndex(nextIndex);
              setUserInput('');
            }
          }, 800);
          
        } else {
          // Incorrect - show red border but DON'T advance
          setShowIncorrectBorder(true);
          setIncorrectChars(prev => prev + userInput.trim().length);
          setIncorrectEquations(prev => {
            const newIncorrect = prev + 1;
            // Check if we've reached the target number of questions (only count attempts that advance)
            if (correctEquations + skippedEquations >= settings.equationCount) {
              setTimeout(() => endTest(), 1200);
            }
            return newIncorrect;
          });
          
          setTimeout(() => {
            setShowIncorrectBorder(false);
            setIsProcessingAnswer(false);
            // DON'T advance to next equation - let user try again
            // DON'T clear input - let user modify their answer
          }, 1000);
          
          // Don't reset test on hard mode anymore
        }
      }
      
      return;
    }
  }, [isTestActive, currentLatex, userInput, currentEquationIndex, equations.length, settings, timeElapsed, startTest, endTest, isSkipping, skippedEquations, currentEquation, getNextAvailableEquation]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isTestActive || e.key !== 'Enter' || isProcessingAnswer || isSkipping) {
      return;
    }

    // Start the skip timer on Enter key down
    if (!enterHoldStart) {
      setEnterHoldStart(Date.now());
      
      skipTimerRef.current = window.setTimeout(() => {
        // Skip the equation after 1 second
        setIsSkipping(true);
        setShowSkippedBorder(true);
        
        // Mark current equation as completed (skipped)
        setCompletedEquationIds(prev => {
          const newSet = new Set(prev);
          newSet.add(currentEquation.id);
          return newSet;
        });
        
        setSkippedEquations(prev => {
          const newSkipped = prev + 1;
          // Check if we've reached the target number of questions
          if (correctEquations + newSkipped >= settings.equationCount) {
            setTimeout(() => endTest(), 1000);
          }
          return newSkipped;
        });
        
        setTimeout(() => {
          setShowSkippedBorder(false);
          setIsSkipping(false);
          setEnterHoldStart(null);
          if (correctEquations + skippedEquations + 1 < settings.equationCount) {
            const nextIndex = getNextAvailableEquation();
            setCurrentEquationIndex(nextIndex);
            setUserInput('');
          }
        }, 800);
      }, 1000);
    }
  }, [isTestActive, isProcessingAnswer, isSkipping, enterHoldStart, correctEquations, incorrectEquations, skippedEquations, settings.equationCount, currentEquationIndex, equations.length, endTest, currentEquation, getNextAvailableEquation]);

  const handleKeyUp = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && enterHoldStart && skipTimerRef.current) {
      // Cancel the skip if Enter is released before 1 second
      const holdDuration = Date.now() - enterHoldStart;
      if (holdDuration < 1000) {
        window.clearTimeout(skipTimerRef.current);
        setEnterHoldStart(null);
        
        // Process as normal Enter press if released quickly and there's input
        if (userInput.trim() && !isProcessingAnswer && !isSkipping) {
          handleKeyPress(e);
        }
      }
    }
  }, [enterHoldStart, userInput, isProcessingAnswer, isSkipping, handleKeyPress]);
  
 
  const resetTest = () => {
    setIsTestActive(false);
    updateSettings({ isTestActive: false });
    setUserInput('');
    setTimeElapsed(0);
    setCorrectChars(0);
    setIncorrectChars(0);
    setCorrectEquations(0);
    setIncorrectEquations(0);
    setSkippedEquations(0);
    setCompletedEquationIds(new Set());
    setUsedEquations([]); // Clear used equations for new test
    setTotalKeystrokes(0);
    setBackspaces(0);
    setCurrentEquationIndex(0);
    setShowCorrectBorder(false);
    setShowIncorrectBorder(false);
    setShowSkippedBorder(false);
    setIsProcessingAnswer(false);
    setPendingValidation(false);
    setEquivalenceStatus(null);
    setEnterHoldStart(null);
    setIsSkipping(false);
    setShowResults(false);
    setTestResult(null);
    
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    if (skipTimerRef.current) {
      window.clearTimeout(skipTimerRef.current);
    }
  };
  
  
  const calculateConsistency = (keystrokes: number[]): number => {
    if (keystrokes.length < 2) return 100;
    
    const intervals: number[] = [];
    for (let i = 1; i < keystrokes.length; i++) {
      intervals.push(keystrokes[i] - keystrokes[i - 1]);
    }
    
    const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) => {
      return sum + Math.pow(interval - mean, 2);
    }, 0) / intervals.length;
    
    const stdDev = Math.sqrt(variance);
    const cv = (stdDev / mean) * 100;
    
    return Math.max(0, Math.min(100, 100 - cv));
  };
  
 
  const saveTestResult = async (result: TestResult) => {
    try {
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(result)
      });
      
      if (!response.ok) {
        console.error('Failed to save test result');
      }
    } catch (error) {
      console.error('Error saving test result:', error);
    }
  };
  
  
  const renderCharacter = (char: string, index: number) => {
    const inputChar = userInput[index];
    let className = 'text-gray-500';
    
    if (index < userInput.length) {
      if (inputChar === char) {
        className = 'text-green-500';
      } else {
        className = 'text-red-500 bg-red-100 dark:bg-red-900';
      }
    } else if (index === userInput.length) {
      className = 'text-gray-300 dark:text-gray-600 border-b-2 border-yellow-400';
    }
    
    return (
      <span key={index} className={className}>
        {char}
      </span>
    );
  };
  
  return (
    <div className="h-full flex flex-col">
      <AnimatePresence mode="wait">
        {showResults && testResult ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="h-full overflow-hidden"
          >
            <TestResults
              result={testResult}
              onRestart={() => {
                setShowResults(false);
                resetTest();
                startTest();
              }}
              correctEquations={correctEquations}
              incorrectEquations={incorrectEquations}
              skippedEquations={skippedEquations}
              totalKeystrokes={totalKeystrokes}
              backspaces={backspaces}
            />
          </motion.div>
        ) : (
          <motion.div
            key="test"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="h-full flex flex-col items-center justify-center select-none overflow-hidden"
            onContextMenu={(e) => e.preventDefault()}
            onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          >
            {/* Mode Display - Show above equation when test is active */}
            {isTestActive && (
              <div className="mb-1 text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {settings.equationCount} equations
                </div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {correctEquations} | {correctEquations + skippedEquations}
                </div>
              </div>
            )}
            
            {/* Combined Equation Display */}
            {currentEquation && (
              <div className="mb-4 w-full max-w-4xl">
              <div className="bg-[var(--color-box)] rounded-lg p-2 min-h-[120px] relative transition-all duration-300">
                {/* Green success border that appears when answer is correct */}
                {showCorrectBorder && (
                  <div className="absolute inset-2 border-2 border-[var(--color-correct)] rounded-md pointer-events-none correct-border"></div>
                )}
                
                {/* Red error border that appears when answer is wrong */}
                {showIncorrectBorder && (
                  <div className="absolute inset-2 border-2 border-[var(--color-error)] rounded-md pointer-events-none incorrect-border"></div>
                )}
                
                {/* Orange skip border that appears when equation is skipped */}
                {showSkippedBorder && (
                  <div className="absolute inset-2 border-2 border-orange-500 rounded-md pointer-events-none skipped-border"></div>
                )}
                
                <div className="grid grid-cols-2 gap-0 h-full">
                  {/* Target Equation (Left) */}
                  <div className="text-center pr-6">
                    <h3 className="text-lg font-semibold mb-4 text-[var(--color-text)]">EQUATION</h3>
                    <div 
                      className="flex items-center justify-center select-none min-h-[80px] py-2"
                      onContextMenu={(e) => e.preventDefault()}
                      onCopy={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                    >
                      <div 
                        className="text-2xl select-none max-w-full overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: renderLatex(currentLatex) }}
                      />
                    </div>
                  </div>
                  
                  {/* Your Input (Right) */}
                  <div className="text-center pl-6">
                    <h3 className="text-lg font-semibold mb-4 text-[var(--color-text)]">OUTPUT</h3>
                    <div 
                      className="flex items-center justify-center select-none min-h-[80px] py-2"
                      onContextMenu={(e) => e.preventDefault()}
                      onCopy={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                    >
                      <div 
                        className="text-2xl select-none flex items-center justify-center h-full max-w-full overflow-hidden"
                        dangerouslySetInnerHTML={{ 
                          __html: userInput.trim() ? renderLatex(userInput) : '<span class="text-gray-400 text-xl">...</span>' 
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Vertical Divider Line */}
                <div className="absolute left-1/2 top-6 bottom-6 w-px bg-[var(--color-sub)] opacity-30 transform -translate-x-px"></div>
              </div>
            </div>
          )}

          {/* Centered Overlay Typing Area */}
          <div className="w-full max-w-4xl mx-auto">
            {currentEquation && (
              <div className="relative max-w-2xl mx-auto">
                {/* Accuracy Display - Left of textbox */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full pr-4">
                  <div className="text-right">
                    <div className="text-lg font-mono text-[var(--color-text)]">
                      {isTestActive && totalKeystrokes > 0
                        ? `${Math.max(0, Math.round(((totalKeystrokes - backspaces) / totalKeystrokes) * 100))}%`
                        : "0%"
                      }
                    </div>
                    <div className="text-xs text-[var(--color-sub)]">accuracy</div>
                  </div>
                </div>

                {/* Duration Display - Right of textbox */}
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-full pl-4">
                  <div className="text-left">
                    <div className="text-lg font-mono text-[var(--color-text)]">
                      {isTestActive 
                        ? `${timeElapsed.toFixed(1)}s`
                        : "0.0s"
                      }
                    </div>
                    <div className="text-xs text-[var(--color-sub)]">
                      duration
                    </div>
                  </div>
                </div>
                {/* Background LaTeX code with character highlighting - ONLY in Practice Mode */}
                {settings.practiceMode && (
                  <div 
                    className="absolute top-0 left-0 w-full bg-[var(--color-box)] rounded-lg p-4 font-mono text-xl leading-relaxed select-none z-10 pointer-events-none text-center"
                    onContextMenu={(e) => e.preventDefault()}
                    onCopy={(e) => e.preventDefault()}
                    onCut={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                  >
                    <div className="min-h-[120px] flex items-center justify-center">
                      <div className="inline-block">
                        {currentLatex.split('').map((char, index) => {
                          const inputChar = userInput[index];
                          let className = 'text-gray-400 bg-transparent';
                          
                          if (index < userInput.length) {
                            if (inputChar === char) {
                              className = 'text-green-500 bg-green-100 dark:bg-green-900/20';
                            } else {
                              className = 'text-red-500 bg-red-100 dark:bg-red-900/20';
                            }
                          } else if (index === userInput.length && isTestActive) {
                            className = 'text-gray-300 dark:text-gray-500 bg-yellow-100 dark:bg-yellow-900/20 border-b-2 border-yellow-400';
                          }
                          
                          return (
                            <span 
                              key={index} 
                              className={`${className} transition-all duration-150 px-0.5 rounded`}
                            >
                              {char === ' ' ? '\u00A0' : char}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Ghost text for Normal Mode when test is not active */}
                {!settings.practiceMode && !isTestActive && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-5">
                    <span className="text-[var(--color-sub)] text-lg font-mono">
                      press any key to start
                    </span>
                  </div>
                )}
                
                {/* Textbox container */}
                <div className="relative">
                  {/* Invisible textarea for input capture */}
                  <textarea
                    ref={inputRef as any}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => {
                      handleKeyDown(e);
                      handleKeyPress(e);
                    }}
                    onKeyUp={handleKeyUp}
                    onPaste={(e) => e.preventDefault()}
                    onCopy={(e) => e.preventDefault()}
                    onCut={(e) => e.preventDefault()}
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                    onDrop={(e) => e.preventDefault()}
                    disabled={!isTestActive}
                    aria-label="Typing input area"
                    className={`w-full min-h-[120px] p-3 font-mono text-lg leading-relaxed rounded-lg focus:outline-none focus:ring-0 resize-none relative text-center typing-input ${
                      settings.practiceMode 
                        ? 'bg-transparent text-transparent z-20 selection:bg-transparent caret-transparent' 
                        : 'bg-[var(--color-box)] text-[var(--color-text)] z-10'
                    }`}
                    autoFocus
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Controls */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={resetTest}
              className="px-4 py-2 text-sm text-[var(--color-sub)] hover:text-[var(--color-text)] transition-colors"
            >
              <span className="text-xs bg-[var(--color-sub)] text-[var(--color-bg)] px-1 rounded">tab</span> - restart
            </button>
            <button
              onClick={() => {/* Open settings */}}
              className="px-4 py-2 text-sm text-[var(--color-sub)] hover:text-[var(--color-text)] transition-colors"
            >
              <span className="text-xs bg-[var(--color-sub)] text-[var(--color-bg)] px-1 rounded">esc</span> - settings
            </button>
            <button
              className="px-4 py-2 text-sm text-[var(--color-sub)] hover:text-[var(--color-text)] transition-colors"
            >
              <span className="text-xs bg-[var(--color-sub)] text-[var(--color-bg)] px-1 rounded">hold enter</span> - skip
            </button>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TypingTest;