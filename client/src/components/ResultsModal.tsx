
import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Target, Zap, TrendingUp, RefreshCw, X } from 'lucide-react';

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

interface ResultsModalProps {
  result: TestResult;
  onClose: () => void;
  onRestart: () => void;
  personalBest?: number;
  isMultiplayer?: boolean;
  opponent?: {
    username: string;
    wpm: number;
    accuracy: number;
  };
}

const ResultsModal: React.FC<ResultsModalProps> = ({
  result,
  onClose,
  onRestart,
  personalBest,
  isMultiplayer,
  opponent
}) => {
  const isNewPersonalBest = personalBest && result.wpm > personalBest;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-[var(--color-bg)] rounded-lg shadow-xl max-w-4xl w-full mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-text)]">
            {isMultiplayer ? 'Match Results' : 'Test Complete'}
          </h2>
          <button
          title="Closed Settings"
            onClick={onClose}
            className="text-[var(--color-sub)] hover:text-[var(--color-text)] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[var(--color-sub)] bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Zap className="text-[var(--color-main)]" size={20} />
              <span className="text-xs text-[var(--color-sub)]">WPM</span>
            </div>
            <div className="text-3xl font-bold text-[var(--color-text)]">
              {result.wpm.toFixed(0)}
            </div>
            {isNewPersonalBest && (
              <div className="text-xs text-[var(--color-correct)] mt-1">New PB!</div>
            )}
          </div>

          <div className="bg-[var(--color-sub)] bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="text-[var(--color-main)]" size={20} />
              <span className="text-xs text-[var(--color-sub)]">Accuracy</span>
            </div>
            <div className="text-3xl font-bold text-[var(--color-text)]">
              {result.accuracy.toFixed(1)}%
            </div>
          </div>

          <div className="bg-[var(--color-sub)] bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="text-[var(--color-main)]" size={20} />
              <span className="text-xs text-[var(--color-sub)]">Raw WPM</span>
            </div>
            <div className="text-3xl font-bold text-[var(--color-text)]">
              {result.rawWpm.toFixed(0)}
            </div>
          </div>

          <div className="bg-[var(--color-sub)] bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="text-[var(--color-main)]" size={20} />
              <span className="text-xs text-[var(--color-sub)]">Consistency</span>
            </div>
            <div className="text-3xl font-bold text-[var(--color-text)]">
              {result.consistency.toFixed(0)}%
            </div>
          </div>
        </div>

      
        {isMultiplayer && opponent && (
          <div className="mb-6 p-4 bg-[var(--color-sub)] bg-opacity-10 rounded-lg">
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">Match Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-[var(--color-sub)]">You</div>
                <div className="text-xl font-bold text-[var(--color-text)]">{result.wpm} WPM</div>
                <div className="text-sm text-[var(--color-sub)]">{result.accuracy}% accuracy</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-[var(--color-sub)]">{opponent.username}</div>
                <div className="text-xl font-bold text-[var(--color-text)]">{opponent.wpm} WPM</div>
                <div className="text-sm text-[var(--color-sub)]">{opponent.accuracy}% accuracy</div>
              </div>
            </div>
            <div className="mt-3 text-center">
              {result.wpm > opponent.wpm ? (
                <span className="text-[var(--color-correct)] font-bold">Victory!</span>
              ) : result.wpm < opponent.wpm ? (
                <span className="text-[var(--color-error)] font-bold">Defeat</span>
              ) : (
                <span className="text-[var(--color-main)] font-bold">Draw</span>
              )}
            </div>
          </div>
        )}

     
        {result.wpmHistory && result.wpmHistory.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">Performance Graph</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={result.wpmHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-sub)" opacity={0.3} />
                  <XAxis 
                    dataKey="time" 
                    stroke="var(--color-sub)"
                    tick={{ fill: 'var(--color-sub)' }}
                  />
                  <YAxis 
                    stroke="var(--color-sub)"
                    tick={{ fill: 'var(--color-sub)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-sub)',
                      borderRadius: '4px'
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
          </div>
        )}

       
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div>
              <span className="text-[var(--color-sub)]">Test Mode: </span>
              <span className="text-[var(--color-text)]">{result.mode}</span>
            </div>
            <div>
              <span className="text-[var(--color-sub)]">Time: </span>
              <span className="text-[var(--color-text)]">{result.time.toFixed(1)}s</span>
            </div>
            <div>
              <span className="text-[var(--color-sub)]">Characters: </span>
              <span className="text-[var(--color-correct)]">{result.correctChars}</span>
              <span className="text-[var(--color-sub)]">/</span>
              <span className="text-[var(--color-error)]">{result.incorrectChars}</span>
            </div>
          </div>
        </div>

       
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-[var(--color-sub)] hover:text-[var(--color-text)] transition-colors"
          >
            Close
          </button>
          <button
            onClick={onRestart}
            className="px-6 py-2 bg-[var(--color-main)] text-[var(--color-bg)] rounded hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <RefreshCw size={16} />
            {isMultiplayer ? 'Find New Match' : 'Restart'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResultsModal;