import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import Footer from '../components/Footer';

interface Player {
  id: string;
  username: string;
  rating: number;
  progress: number;
  wpm: number;
  accuracy: number;
  finished: boolean;
  finishTime?: number;
}

interface GameRoom {
  id: string;
  players: Player[];
  equations: any[];
  status: 'waiting' | 'countdown' | 'playing' | 'finished';
  startTime?: number;
  mode: 'sprint' | 'time';
  settings: {
    equationCount?: number;
    timeLimit?: number;
  };
}

const MultiplayerPage: React.FC = () => {
  const { user } = useAuth();
  const [gameState, setGameState] = useState<'menu' | 'queue' | 'room' | 'playing'>('menu');
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);
  const [userInput, setUserInput] = useState('');
  const [currentEquationIndex, setCurrentEquationIndex] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [gameResults, setGameResults] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  
  // Mock socket for now - in a real implementation, you'd use socket.io-client
  const socketRef = useRef<any>(null);

  const renderLatex = (latex: string) => {
    try {
      return katex.renderToString(latex, {
        throwOnError: false,
        displayMode: true
      });
    } catch (e) {
      return '<span>Invalid LaTeX</span>';
    }
  };

  const joinQueue = (mode: 'sprint' | 'time') => {
    setGameState('queue');
    // In a real implementation, emit to socket
    // socketRef.current?.emit('queue:join', { userId: user?.id, mode });
    
    // Mock: automatically create a room after 2 seconds
    setTimeout(() => {
      const mockRoom: GameRoom = {
        id: 'room-123',
        players: [
          {
            id: '1',
            username: user?.username || 'You',
            rating: 1200,
            progress: 0,
            wpm: 0,
            accuracy: 100,
            finished: false
          },
          {
            id: '2',
            username: 'Opponent',
            rating: 1150,
            progress: 0,
            wpm: 0,
            accuracy: 100,
            finished: false
          }
        ],
        equations: [
          { id: '1', latex: 'E = mc^2', difficulty: 'easy' },
          { id: '2', latex: '\\int_0^1 x^2 dx', difficulty: 'medium' },
          { id: '3', latex: '\\frac{d}{dx} e^x = e^x', difficulty: 'medium' }
        ],
        status: 'waiting',
        mode,
        settings: mode === 'sprint' ? { equationCount: 5 } : { timeLimit: 60 }
      };
      setCurrentRoom(mockRoom);
      setGameState('room');
    }, 2000);
  };

  const leaveQueue = () => {
    setGameState('menu');
    // socketRef.current?.emit('queue:leave');
  };

  const leaveRoom = () => {
    setGameState('menu');
    setCurrentRoom(null);
    setUserInput('');
    setCurrentEquationIndex(0);
    // socketRef.current?.emit('room:leave');
  };

  const startGame = () => {
    if (currentRoom) {
      setGameState('playing');
      setCountdown(3);
      
      // Countdown timer
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev === 1) {
            clearInterval(countdownInterval);
            return null;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);
    }
  };

  const handleInputChange = (value: string) => {
    setUserInput(value);
    
    if (currentRoom && currentRoom.equations[currentEquationIndex]) {
      const targetLatex = currentRoom.equations[currentEquationIndex].latex;
      
      // Check if equation is completed
      if (value.trim() === targetLatex.trim()) {
        const nextIndex = currentEquationIndex + 1;
        if (nextIndex < currentRoom.equations.length) {
          setCurrentEquationIndex(nextIndex);
          setUserInput('');
        } else {
          // Game finished
          setGameResults({
            place: 1,
            wpm: 45,
            accuracy: 98,
            time: 120
          });
          setGameState('menu');
        }
      }
    }
  };

  const currentEquation = currentRoom?.equations[currentEquationIndex];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-[var(--color-main)]">Multiplayer</h1>
          <p className="text-[var(--color-sub)]">Compete against other players in real-time LaTeX typing races</p>
        </div>

        {/* Menu State */}
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Game Mode Selection */}
            <div className="bg-[var(--color-box)] rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Choose Game Mode</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => joinQueue('sprint')}
                  className="bg-[var(--color-main)] text-[var(--color-bg)] p-4 rounded-lg hover:opacity-80 transition-opacity"
                >
                  <h3 className="text-xl font-semibold mb-2">Sprint Mode</h3>
                  <p className="text-sm opacity-80">Race to complete 5 equations first</p>
                </button>
                <button
                  onClick={() => joinQueue('time')}
                  className="bg-[var(--color-main)] text-[var(--color-bg)] p-4 rounded-lg hover:opacity-80 transition-opacity"
                >
                  <h3 className="text-xl font-semibold mb-2">Time Attack</h3>
                  <p className="text-sm opacity-80">Complete as many equations as possible in 60 seconds</p>
                </button>
              </div>
            </div>

            {/* Recent Results */}
            {gameResults && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[var(--color-box)] rounded-lg p-6"
              >
                <h2 className="text-2xl font-semibold mb-4">Last Game Results</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[var(--color-main)]">#{gameResults.place}</div>
                    <div className="text-[var(--color-sub)]">Place</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[var(--color-main)]">{gameResults.wpm}</div>
                    <div className="text-[var(--color-sub)]">WPM</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[var(--color-main)]">{gameResults.accuracy}%</div>
                    <div className="text-[var(--color-sub)]">Accuracy</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[var(--color-main)]">{gameResults.time}s</div>
                    <div className="text-[var(--color-sub)]">Time</div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Queue State */}
        {gameState === 'queue' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="bg-[var(--color-box)] rounded-lg p-8">
              <div className="animate-spin w-12 h-12 border-4 border-[var(--color-main)] border-t-transparent rounded-full mx-auto mb-4"></div>
              <h2 className="text-2xl font-semibold mb-2">Finding opponents...</h2>
              <p className="text-[var(--color-sub)] mb-6">Please wait while we match you with players of similar skill</p>
              <button
                onClick={leaveQueue}
                className="bg-[var(--color-error)] text-white px-6 py-2 rounded-lg hover:opacity-80 transition-opacity"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Room State */}
        {gameState === 'room' && currentRoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-[var(--color-box)] rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Room {currentRoom.id}</h2>
                <button
                  onClick={leaveRoom}
                  className="bg-[var(--color-error)] text-white px-4 py-2 rounded-lg text-sm hover:opacity-80 transition-opacity"
                >
                  Leave Room
                </button>
              </div>
              
              {/* Players */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {currentRoom.players.map((player) => (
                  <div key={player.id} className="bg-[var(--color-bg)] rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{player.username}</span>
                      <span className="text-[var(--color-sub)]">Rating: {player.rating}</span>
                    </div>
                    <div className="w-full bg-[var(--color-sub)] rounded-full h-2 mt-2">
                      <div 
                        className={`bg-[var(--color-main)] h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${player.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Game Info */}
              <div className="text-center">
                <p className="text-[var(--color-sub)] mb-4">
                  Mode: {currentRoom.mode === 'sprint' ? 'Sprint' : 'Time Attack'} | 
                  {currentRoom.mode === 'sprint' 
                    ? ` ${currentRoom.settings.equationCount} equations`
                    : ` ${currentRoom.settings.timeLimit}s`
                  }
                </p>
                
                {currentRoom.players.length >= 2 && (
                  <button
                    onClick={startGame}
                    className="bg-[var(--color-main)] text-[var(--color-bg)] px-8 py-3 rounded-lg text-lg font-semibold hover:opacity-80 transition-opacity"
                  >
                    Start Game
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Playing State */}
        {gameState === 'playing' && currentRoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Countdown */}
            <AnimatePresence>
              {countdown && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                  <div className="text-8xl font-bold text-[var(--color-main)]">
                    {countdown}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Game UI */}
            {!countdown && (
              <>
                {/* Progress Bar */}
                <div className="bg-[var(--color-box)] rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span>Progress: {currentEquationIndex + 1} / {currentRoom.equations.length}</span>
                    <button
                      onClick={leaveRoom}
                      className="bg-[var(--color-error)] text-white px-3 py-1 rounded text-sm hover:opacity-80 transition-opacity"
                    >
                      Quit
                    </button>
                  </div>
                  <div className="w-full bg-[var(--color-sub)] rounded-full h-3">
                    <div 
                      className={`bg-[var(--color-main)] h-3 rounded-full transition-all duration-300`}
                      style={{ width: `${((currentEquationIndex) / currentRoom.equations.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Current Equation */}
                {currentEquation && (
                  <div className="bg-[var(--color-box)] rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-center">EQUATION</h3>
                    <div 
                      className="text-center text-3xl mb-6"
                      dangerouslySetInnerHTML={{ __html: renderLatex(currentEquation.latex) }}
                    />
                  </div>
                )}

                {/* Input Area */}
                <div className="bg-[var(--color-box)] rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-center">INPUT</h3>
                  <textarea
                    value={userInput}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-full min-h-[120px] p-4 bg-transparent border border-[var(--color-sub)] rounded-lg text-[var(--color-text)] font-mono text-lg resize-none focus:outline-none focus:border-[var(--color-main)]"
                    placeholder="Type the LaTeX code here..."
                    autoFocus
                  />
                </div>

                {/* Players Status */}
                <div className="bg-[var(--color-box)] rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Players</h3>
                  <div className="space-y-3">
                    {currentRoom.players.map((player) => (
                      <div key={player.id} className="flex items-center justify-between">
                        <span>{player.username}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-[var(--color-sub)]">{player.wpm} WPM</span>
                          <div className="w-32 bg-[var(--color-sub)] rounded-full h-2">
                            <div 
                              className={`bg-[var(--color-main)] h-2 rounded-full transition-all duration-300`}
                              style={{ width: `${player.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MultiplayerPage;
