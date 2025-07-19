import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';

interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar?: string;
  wpm: number;
  accuracy: number;
  consistency: number;
  testsCompleted: number;
  totalTime: string;
  rating: number;
  isCurrentUser?: boolean;
  country?: string;
  joinDate: string;
  lastActive: string;
  badge?: string;
  streak: number;
}

interface LeaderboardFilter {
  category: 'wpm' | 'accuracy' | 'consistency' | 'tests' | 'time' | 'rating';
  timeframe: 'daily' | 'weekly' | 'monthly' | 'all-time';
  mode: 'all' | 'practice' | 'normal';
  difficulty: 'all' | 'easy' | 'medium' | 'hard';
}

const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<LeaderboardFilter>({
    category: 'wpm',
    timeframe: 'all-time',
    mode: 'all',
    difficulty: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');

  // Mock leaderboard data
  const [leaderboardData] = useState<LeaderboardEntry[]>([
    {
      rank: 1,
      username: "LaTeXLegend",
      wpm: 94.2,
      accuracy: 98.7,
      consistency: 93.4,
      testsCompleted: 2847,
      totalTime: "312h 45m",
      rating: 2156,
      country: "🇺🇸",
      joinDate: "2023-01-15",
      lastActive: "2025-01-18",
      badge: "👑",
      streak: 89
    },
    {
      rank: 2,
      username: "EquationExpert",
      wpm: 91.8,
      accuracy: 97.9,
      consistency: 91.2,
      testsCompleted: 1923,
      totalTime: "287h 12m",
      rating: 2089,
      country: "🇩🇪",
      joinDate: "2023-03-22",
      lastActive: "2025-01-18",
      badge: "🥈",
      streak: 67
    },
    {
      rank: 3,
      username: "MathMaster",
      wpm: 89.4,
      accuracy: 98.1,
      consistency: 89.7,
      testsCompleted: 1745,
      totalTime: "198h 33m",
      rating: 2034,
      country: "🇯🇵",
      joinDate: "2023-05-10",
      lastActive: "2025-01-17",
      badge: "🥉",
      streak: 43
    },
    {
      rank: 4,
      username: "AlgebraAce",
      wpm: 87.6,
      accuracy: 96.8,
      consistency: 88.3,
      testsCompleted: 1567,
      totalTime: "203h 18m",
      rating: 1987,
      country: "🇫🇷",
      joinDate: "2023-02-08",
      lastActive: "2025-01-18",
      streak: 28
    },
    {
      rank: 5,
      username: "CalculusChamp",
      wpm: 85.9,
      accuracy: 97.3,
      consistency: 86.9,
      testsCompleted: 1432,
      totalTime: "176h 42m",
      rating: 1934,
      country: "🇬🇧",
      joinDate: "2023-04-17",
      lastActive: "2025-01-18",
      streak: 21
    },
    {
      rank: 6,
      username: user?.username || "YourUsername",
      wpm: 67.3,
      accuracy: 96.8,
      consistency: 82.1,
      testsCompleted: 1247,
      totalTime: "127h 34m",
      rating: 1456,
      country: "🇺🇸",
      joinDate: "2024-09-15",
      lastActive: "2025-01-18",
      isCurrentUser: true,
      streak: 12
    },
    {
      rank: 7,
      username: "FormulaFast",
      wpm: 83.7,
      accuracy: 95.4,
      consistency: 84.2,
      testsCompleted: 1298,
      totalTime: "145h 23m",
      rating: 1867,
      country: "🇨🇦",
      joinDate: "2023-06-03",
      lastActive: "2025-01-17",
      streak: 15
    },
    {
      rank: 8,
      username: "GeometryGuru",
      wpm: 81.2,
      accuracy: 96.1,
      consistency: 83.5,
      testsCompleted: 1156,
      totalTime: "132h 17m",
      rating: 1823,
      country: "🇦🇺",
      joinDate: "2023-07-21",
      lastActive: "2025-01-16",
      streak: 9
    },
    {
      rank: 9,
      username: "StatsSensei",
      wpm: 79.8,
      accuracy: 97.6,
      consistency: 81.9,
      testsCompleted: 1087,
      totalTime: "119h 54m",
      rating: 1789,
      country: "🇰🇷",
      joinDate: "2023-08-14",
      lastActive: "2025-01-18",
      streak: 33
    },
    {
      rank: 10,
      username: "TrigTitan",
      wpm: 78.3,
      accuracy: 95.8,
      consistency: 80.4,
      testsCompleted: 945,
      totalTime: "98h 27m",
      rating: 1745,
      country: "🇧🇷",
      joinDate: "2023-09-05",
      lastActive: "2025-01-17",
      streak: 7
    }
  ]);

  const filteredData = leaderboardData.filter(entry => {
    if (searchQuery && !entry.username.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCountry !== 'all' && entry.country !== selectedCountry) {
      return false;
    }
    return true;
  });

  const getSortValue = (entry: LeaderboardEntry) => {
    switch (filter.category) {
      case 'wpm': return entry.wpm;
      case 'accuracy': return entry.accuracy;
      case 'consistency': return entry.consistency;
      case 'tests': return entry.testsCompleted;
      case 'rating': return entry.rating;
      default: return entry.wpm;
    }
  };

  const formatRank = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getPerformanceColor = (value: number, category: string) => {
    switch (category) {
      case 'wpm':
        if (value >= 80) return 'text-[var(--color-main)]';
        if (value >= 60) return 'text-yellow-400';
        return 'text-[var(--color-text)]';
      case 'accuracy':
        if (value >= 97) return 'text-[var(--color-main)]';
        if (value >= 95) return 'text-yellow-400';
        return 'text-[var(--color-text)]';
      case 'consistency':
        if (value >= 85) return 'text-[var(--color-main)]';
        if (value >= 75) return 'text-yellow-400';
        return 'text-[var(--color-text)]';
      default:
        return 'text-[var(--color-text)]';
    }
  };

  const countries = ['🇺🇸', '🇩🇪', '🇯🇵', '🇫🇷', '🇬🇧', '🇨🇦', '🇦🇺', '🇰🇷', '🇧🇷'];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-[var(--color-main)]">Leaderboard</h1>
          <p className="text-[var(--color-sub)]">Compete with the best LaTeX typists worldwide</p>
        </div>

        {/* Filters */}
        <div className="bg-[var(--color-box)] rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={filter.category}
                onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value as any }))}
                aria-label="Category filter"
                className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-sub)] rounded-lg focus:border-[var(--color-main)] outline-none"
              >
                <option value="wpm">Words Per Minute</option>
                <option value="accuracy">Accuracy</option>
                <option value="consistency">Consistency</option>
                <option value="tests">Tests Completed</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            {/* Timeframe Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Timeframe</label>
              <select
                value={filter.timeframe}
                onChange={(e) => setFilter(prev => ({ ...prev, timeframe: e.target.value as any }))}
                aria-label="Timeframe filter"
                className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-sub)] rounded-lg focus:border-[var(--color-main)] outline-none"
              >
                <option value="daily">Today</option>
                <option value="weekly">This Week</option>
                <option value="monthly">This Month</option>
                <option value="all-time">All Time</option>
              </select>
            </div>

            {/* Mode Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Mode</label>
              <select
                value={filter.mode}
                onChange={(e) => setFilter(prev => ({ ...prev, mode: e.target.value as any }))}
                aria-label="Mode filter"
                className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-sub)] rounded-lg focus:border-[var(--color-main)] outline-none"
              >
                <option value="all">All Modes</option>
                <option value="practice">Practice Mode</option>
                <option value="normal">Normal Mode</option>
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Difficulty</label>
              <select
                value={filter.difficulty}
                onChange={(e) => setFilter(prev => ({ ...prev, difficulty: e.target.value as any }))}
                aria-label="Difficulty filter"
                className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-sub)] rounded-lg focus:border-[var(--color-main)] outline-none"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Search and Country Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search Player</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter username..."
                className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-sub)] rounded-lg focus:border-[var(--color-main)] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                aria-label="Country filter"
                className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-sub)] rounded-lg focus:border-[var(--color-main)] outline-none"
              >
                <option value="all">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {filteredData.slice(0, 3).map((entry, index) => (
            <motion.div
              key={entry.username}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-[var(--color-box)] rounded-lg p-6 text-center relative ${
                entry.isCurrentUser ? 'ring-2 ring-[var(--color-main)]' : ''
              } ${index === 0 ? 'md:order-2 md:scale-110' : index === 1 ? 'md:order-1' : 'md:order-3'}`}
            >
              {entry.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-3xl">
                  {entry.badge}
                </div>
              )}
              
              <div className="w-16 h-16 bg-[var(--color-main)] rounded-full flex items-center justify-center text-[var(--color-bg)] text-2xl font-bold mx-auto mb-4 mt-2">
                {entry.username.charAt(0).toUpperCase()}
              </div>
              
              <h3 className="text-xl font-bold mb-2">{entry.username}</h3>
              <div className="text-3xl font-bold text-[var(--color-main)] mb-2">
                {getSortValue(entry)}{filter.category === 'wpm' ? '' : filter.category === 'rating' ? '' : '%'}
              </div>
              <div className="text-[var(--color-sub)] text-sm">
                {filter.category === 'wpm' ? 'WPM' : 
                 filter.category === 'accuracy' ? 'Accuracy' :
                 filter.category === 'consistency' ? 'Consistency' :
                 filter.category === 'tests' ? 'Tests' :
                 'Rating'}
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-[var(--color-sub)]">Tests</div>
                  <div className="font-semibold">{entry.testsCompleted}</div>
                </div>
                <div>
                  <div className="text-[var(--color-sub)]">Streak</div>
                  <div className="font-semibold">{entry.streak}🔥</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Full Leaderboard Table */}
        <div className="bg-[var(--color-box)] rounded-lg overflow-hidden">
          <div className="p-6 border-b border-[var(--color-sub)]">
            <h2 className="text-2xl font-semibold">Full Rankings</h2>
            <p className="text-[var(--color-sub)] text-sm">
              Showing {filteredData.length} players • Updated every hour
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--color-bg)]">
                <tr>
                  <th className="text-left py-4 px-6">Rank</th>
                  <th className="text-left py-4 px-6">Player</th>
                  <th className="text-left py-4 px-6">WPM</th>
                  <th className="text-left py-4 px-6">Accuracy</th>
                  <th className="text-left py-4 px-6">Consistency</th>
                  <th className="text-left py-4 px-6">Tests</th>
                  <th className="text-left py-4 px-6">Time</th>
                  <th className="text-left py-4 px-6">Rating</th>
                  <th className="text-left py-4 px-6">Streak</th>
                  <th className="text-left py-4 px-6">Last Active</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredData.map((entry, index) => (
                    <motion.tr
                      key={entry.username}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border-b border-[var(--color-sub)] border-opacity-30 hover:bg-[var(--color-bg)] hover:bg-opacity-50 transition-colors ${
                        entry.isCurrentUser ? 'bg-[var(--color-main)] bg-opacity-10' : ''
                      }`}
                    >
                      <td className="py-4 px-6">
                        <span className="text-lg font-bold">
                          {formatRank(entry.rank)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-[var(--color-main)] rounded-full flex items-center justify-center text-[var(--color-bg)] text-sm font-bold">
                            {entry.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold flex items-center space-x-2">
                              <span>{entry.username}</span>
                              {entry.country && <span>{entry.country}</span>}
                              {entry.isCurrentUser && <span className="text-[var(--color-main)]">(You)</span>}
                            </div>
                            <div className="text-[var(--color-sub)] text-xs">
                              Joined {entry.joinDate}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={`py-4 px-6 font-semibold ${getPerformanceColor(entry.wpm, 'wpm')}`}>
                        {entry.wpm}
                      </td>
                      <td className={`py-4 px-6 font-semibold ${getPerformanceColor(entry.accuracy, 'accuracy')}`}>
                        {entry.accuracy}%
                      </td>
                      <td className={`py-4 px-6 font-semibold ${getPerformanceColor(entry.consistency, 'consistency')}`}>
                        {entry.consistency}%
                      </td>
                      <td className="py-4 px-6 font-semibold">
                        {entry.testsCompleted.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-[var(--color-sub)]">
                        {entry.totalTime}
                      </td>
                      <td className="py-4 px-6 font-semibold text-[var(--color-main)]">
                        {entry.rating}
                      </td>
                      <td className="py-4 px-6">
                        <span className="flex items-center space-x-1">
                          <span>{entry.streak}</span>
                          <span>🔥</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[var(--color-sub)] text-sm">
                        {entry.lastActive}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Statistics Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[var(--color-box)] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[var(--color-main)]">{leaderboardData.length}</div>
            <div className="text-[var(--color-sub)] text-sm">Total Players</div>
          </div>
          <div className="bg-[var(--color-box)] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[var(--color-main)]">
              {Math.round(leaderboardData.reduce((sum, entry) => sum + entry.wpm, 0) / leaderboardData.length)}
            </div>
            <div className="text-[var(--color-sub)] text-sm">Average WPM</div>
          </div>
          <div className="bg-[var(--color-box)] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[var(--color-main)]">
              {Math.round(leaderboardData.reduce((sum, entry) => sum + entry.accuracy, 0) / leaderboardData.length)}%
            </div>
            <div className="text-[var(--color-sub)] text-sm">Average Accuracy</div>
          </div>
          <div className="bg-[var(--color-box)] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[var(--color-main)]">
              {leaderboardData.reduce((sum, entry) => sum + entry.testsCompleted, 0).toLocaleString()}
            </div>
            <div className="text-[var(--color-sub)] text-sm">Total Tests</div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LeaderboardPage;
