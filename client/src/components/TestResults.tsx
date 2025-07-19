import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Target, Zap, TrendingUp, RefreshCw, RotateCcw, Clock, Hash, CheckCircle, XCircle } from 'lucide-react';

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
  wpmHistory?: { time: number; wpm: number; rawWpm: number }[];
}

interface TestResultsProps {
  result: TestResult;
  onRestart: () => void;
  personalBest?: number;
  correctEquations: number;
  incorrectEquations: number;
  skippedEquations: number;
  totalKeystrokes: number;
  backspaces: number;
}

const TestResults: React.FC<TestResultsProps> = ({
  result,
  onRestart,
  personalBest,
  correctEquations,
  incorrectEquations,
  skippedEquations,
  totalKeystrokes,
  backspaces
}) => {
  const isNewPersonalBest = personalBest && result.wpm > personalBest;

  // Handle Tab key for restart
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        onRestart();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onRestart]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="h-full flex flex-col overflow-hidden p-4"
    >
      {/* Header */}
      <div className="text-center mb-4 flex-shrink-0">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-2xl font-bold text-[var(--color-text)] mb-2"
        >
          Test Complete
        </motion.h1>
        {isNewPersonalBest && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
            className="text-[var(--color-correct)] text-lg font-semibold mb-4"
          >
            🎉 New Personal Best!
          </motion.div>
        )}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-6">

        {/* Main Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4"
        >
          <div className="bg-[var(--color-box)] rounded-lg p-3 text-center border border-[var(--color-border-sub)]">
            <Zap className="text-[var(--color-main)] mx-auto mb-1" size={20} />
            <div className="text-2xl font-bold text-[var(--color-text)] mb-1">
              {result.wpm.toFixed(0)}
            </div>
            <div className="text-[var(--color-sub)] text-xs font-medium">WPM</div>
          </div>

          <div className="bg-[var(--color-box)] rounded-lg p-3 text-center border border-[var(--color-border-sub)]">
            <Target className="text-[var(--color-main)] mx-auto mb-1" size={20} />
            <div className="text-2xl font-bold text-[var(--color-text)] mb-1">
              {result.accuracy.toFixed(1)}%
            </div>
            <div className="text-[var(--color-sub)] text-xs font-medium">Accuracy</div>
          </div>

          <div className="bg-[var(--color-box)] rounded-lg p-3 text-center border border-[var(--color-border-sub)]">
            <TrendingUp className="text-[var(--color-main)] mx-auto mb-1" size={20} />
            <div className="text-2xl font-bold text-[var(--color-text)] mb-1">
              {result.rawWpm.toFixed(0)}
            </div>
            <div className="text-[var(--color-sub)] text-xs font-medium">Raw WPM</div>
          </div>

          <div className="bg-[var(--color-box)] rounded-lg p-3 text-center border border-[var(--color-border-sub)]">
            <Trophy className="text-[var(--color-main)] mx-auto mb-1" size={20} />
            <div className="text-2xl font-bold text-[var(--color-text)] mb-1">
              {result.consistency.toFixed(0)}%
            </div>
            <div className="text-[var(--color-sub)] text-xs font-medium">Consistency</div>
          </div>
        </motion.div>

        {/* Detailed Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4"
        >
          {/* Equation Stats */}
          <div className="bg-[var(--color-box)] rounded-lg p-3 border border-[var(--color-border-sub)]">
            <h3 className="text-sm font-semibold text-[var(--color-text)] mb-2 flex items-center gap-2">
              <Hash size={16} />
              Equations
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-[var(--color-sub)] flex items-center gap-1">
                  <CheckCircle size={12} className="text-[var(--color-correct)]" />
                  Correct
                </span>
                <span className="text-[var(--color-text)] font-semibold">{correctEquations}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--color-sub)] flex items-center gap-1">
                  <XCircle size={12} className="text-[var(--color-error)]" />
                  Incorrect
                </span>
                <span className="text-[var(--color-text)] font-semibold">{incorrectEquations}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--color-sub)] flex items-center gap-1">
                  <RotateCcw size={12} className="text-orange-500" />
                  Skipped
                </span>
                <span className="text-[var(--color-text)] font-semibold">{skippedEquations}</span>
              </div>
            </div>
          </div>

          {/* Typing Stats */}
          <div className="bg-[var(--color-box)] rounded-lg p-3 border border-[var(--color-border-sub)]">
            <h3 className="text-sm font-semibold text-[var(--color-text)] mb-2 flex items-center gap-2">
              <Clock size={16} />
              Details
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-[var(--color-sub)]">Time</span>
                <span className="text-[var(--color-text)] font-semibold">{result.time.toFixed(1)}s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--color-sub)]">Characters</span>
                <span className="text-[var(--color-text)] font-semibold">
                  <span className="text-[var(--color-correct)]">{result.correctChars}</span>
                  <span className="text-[var(--color-sub)]">/</span>
                  <span className="text-[var(--color-error)]">{result.incorrectChars}</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--color-sub)]">Keystrokes</span>
                <span className="text-[var(--color-text)] font-semibold">{totalKeystrokes}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performance Graph */}
        {result.wpmHistory && result.wpmHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-[var(--color-box)] rounded-lg p-3 border border-[var(--color-border-sub)] mb-4"
          >
            <h3 className="text-sm font-semibold text-[var(--color-text)] mb-2">Performance Chart</h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={result.wpmHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-sub)" opacity={0.3} />
                  <XAxis 
                    dataKey="time" 
                    stroke="var(--color-sub)"
                    tick={{ fill: 'var(--color-sub)', fontSize: 10 }}
                  />
                  <YAxis 
                    stroke="var(--color-sub)"
                    tick={{ fill: 'var(--color-sub)', fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-sub)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    itemStyle={{ color: 'var(--color-text)' }}
                    labelStyle={{ color: 'var(--color-sub)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="wpm"
                    stroke="var(--color-main)"
                    strokeWidth={2}
                    dot={false}
                    name="WPM"
                  />
                  <Line
                    type="monotone"
                    dataKey="rawWpm"
                    stroke="var(--color-sub)"
                    strokeWidth={2}
                    dot={false}
                    name="Raw WPM"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
        </div>
      </div>

      {/* Action Button - Fixed at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-center flex-shrink-0 pt-3"
      >
        <button
          onClick={onRestart}
          className="px-4 py-2 bg-[var(--color-main)] text-[var(--color-bg)] rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto font-semibold text-sm"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
        <div className="mt-1 text-[var(--color-sub)] text-xs">
          Press <kbd className="bg-[var(--color-box)] px-1 py-0.5 rounded text-xs">Tab</kbd> to restart
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TestResults;
