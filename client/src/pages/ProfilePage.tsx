import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

interface StatCard {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

interface TestResult {
  date: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  mode: string;
  difficulty: string;
  equations: number;
  time: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number;
  maxProgress?: number;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'achievements' | 'settings'>('overview');
  
  // Helper function to format time from seconds to readable format
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${Math.round(seconds)}s`;
    }
  };
  
  // Mock data - in real app, this would come from API
  const [profileStats] = useState({
    // Basic Stats
    testsCompleted: 1247,
    timeTyping: "127h 34m",
    averageWpm: 67.3,
    bestWpm: 94.2,
    averageAccuracy: 96.8,
    bestAccuracy: 99.4,
    averageConsistency: 82.1,
    bestConsistency: 95.7,
    
    // Advanced Stats
    keystrokes: 487592,
    charactersTyped: 97518,
    correctCharacters: 94361,
    incorrectCharacters: 3157,
    correctKeystrokes: 471834,
    incorrectKeystrokes: 15758,
    
    // Streak Stats
    currentStreak: 12,
    longestStreak: 45,
    dailyGoal: 10,
    dailyProgress: 7,
    
    // Performance by Mode
    practiceMode: {
      tests: 623,
      avgWpm: 72.1,
      avgAccuracy: 97.2,
      bestWpm: 94.2
    },
    normalMode: {
      tests: 624,
      avgWpm: 62.5,
      avgAccuracy: 96.4,
      bestWpm: 87.3
    },
    
    // Performance by Difficulty
    easy: { tests: 312, avgWpm: 78.4, avgAccuracy: 98.1 },
    medium: { tests: 567, avgWpm: 65.2, avgAccuracy: 96.7 },
    hard: { tests: 368, avgWpm: 58.9, avgAccuracy: 95.1 },
    
    // Time-based Stats
    last7Days: { tests: 23, avgWpm: 68.1, totalTime: "4h 12m" },
    last30Days: { tests: 89, avgWpm: 67.8, totalTime: "18h 45m" },
    allTime: { tests: 1247, avgWpm: 67.3, totalTime: "127h 34m" },
    
    // Peak Performance
    peakWpm: { value: 94.2, date: "2025-01-15" },
    peakAccuracy: { value: 99.4, date: "2025-01-12" },
    peakConsistency: { value: 95.7, date: "2025-01-18" },
    
    // Session Stats
    averageSessionLength: "12m 34s",
    longestSession: "1h 47m",
    shortestSession: "2m 15s",
    
    // Error Analysis
    commonErrors: [
      { character: "\\", count: 234, percentage: 14.8 },
      { character: "{", count: 187, percentage: 11.9 },
      { character: "^", count: 156, percentage: 9.9 },
      { character: "_", count: 134, percentage: 8.5 },
    ],
    
    // Monthly Progress
    monthlyProgress: [
      { month: "Sep", wpm: 58.2, accuracy: 94.1, tests: 97 },
      { month: "Oct", wpm: 62.4, accuracy: 95.3, tests: 108 },
      { month: "Nov", wpm: 65.1, accuracy: 96.2, tests: 124 },
      { month: "Dec", wpm: 66.8, accuracy: 96.5, tests: 142 },
      { month: "Jan", wpm: 67.3, accuracy: 96.8, tests: 156 },
    ]
  });

  const [recentTests] = useState<TestResult[]>([
    { date: "2025-01-18", wpm: 72.4, rawWpm: 76.8, accuracy: 94.3, consistency: 87.2, mode: "Practice", difficulty: "Medium", equations: 5, time: 180 },
    { date: "2025-01-18", wpm: 68.9, rawWpm: 73.1, accuracy: 94.3, consistency: 85.6, mode: "Normal", difficulty: "Hard", equations: 3, time: 165 },
    { date: "2025-01-17", wpm: 71.2, rawWpm: 74.5, accuracy: 95.6, consistency: 89.1, mode: "Practice", difficulty: "Easy", equations: 8, time: 210 },
    { date: "2025-01-17", wpm: 64.8, rawWpm: 69.2, accuracy: 93.7, consistency: 82.4, mode: "Normal", difficulty: "Medium", equations: 4, time: 145 },
    { date: "2025-01-16", wpm: 69.3, rawWpm: 72.8, accuracy: 95.1, consistency: 86.8, mode: "Practice", difficulty: "Medium", equations: 6, time: 195 },
  ]);

  const [achievements] = useState<Achievement[]>([
    { id: "1", name: "First Steps", description: "Complete your first test", icon: "🎯", unlocked: true, unlockedDate: "2024-09-15" },
    { id: "2", name: "Speed Demon", description: "Reach 70 WPM", icon: "⚡", unlocked: true, unlockedDate: "2024-11-23" },
    { id: "3", name: "Accuracy Master", description: "Achieve 95% accuracy", icon: "🎯", unlocked: true, unlockedDate: "2024-10-08" },
    { id: "4", name: "Consistency King", description: "Achieve 90% consistency", icon: "📊", unlocked: false, progress: 82, maxProgress: 90 },
    { id: "5", name: "Marathon Runner", description: "Type for 100 hours total", icon: "🏃", unlocked: true, unlockedDate: "2025-01-10" },
    { id: "6", name: "Perfectionist", description: "Get 100% accuracy in a test", icon: "💎", unlocked: false, progress: 99.4, maxProgress: 100 },
    { id: "7", name: "Streak Master", description: "Maintain a 30-day streak", icon: "🔥", unlocked: false, progress: 12, maxProgress: 30 },
    { id: "8", name: "Lightning Fast", description: "Reach 90 WPM", icon: "⚡", unlocked: true, unlockedDate: "2025-01-15" },
  ]);

  const statCards: StatCard[] = [
    { 
      title: "Tests Completed", 
      value: user?.stats?.testsCompleted?.toLocaleString() || '0', 
      trend: "up", 
      trendValue: "+23 this week" 
    },
    { 
      title: "Average WPM", 
      value: user?.stats?.averageWpm?.toFixed(1) || '0', 
      trend: "up", 
      trendValue: "+2.1 this month" 
    },
    { 
      title: "Best WPM", 
      value: user?.stats?.bestWpm?.toFixed(1) || '0', 
      subtitle: "Personal Record" 
    },
    { 
      title: "Average Accuracy", 
      value: `${user?.stats?.averageAccuracy?.toFixed(1) || '0'}%`, 
      trend: "up", 
      trendValue: "+1.2% this month" 
    },
    { 
      title: "Time Playing", 
      value: formatTime(user?.stats?.totalTime || 0), 
      trend: "up", 
      trendValue: "+12h this month" 
    },
    { 
      title: "Total Keystrokes", 
      value: user?.stats?.totalKeystrokes?.toLocaleString() || '0', 
      trend: "up", 
      trendValue: "All time" 
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-[var(--color-main)] rounded-full flex items-center justify-center text-[var(--color-bg)] text-2xl font-bold">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user?.username || 'User'}</h1>
              <p className="text-[var(--color-sub)]">Member since September 2024</p>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-[var(--color-box)] rounded-lg p-1">
            {(['overview', 'history', 'achievements', 'settings'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-md transition-colors capitalize ${
                  activeTab === tab 
                    ? 'bg-[var(--color-main)] text-[var(--color-bg)]' 
                    : 'text-[var(--color-sub)] hover:text-[var(--color-text)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {statCards.map((stat, index) => (
                <div key={index} className="bg-[var(--color-box)] rounded-lg p-4">
                  <h3 className="text-[var(--color-sub)] text-sm font-medium mb-1">{stat.title}</h3>
                  <div className="text-2xl font-bold text-[var(--color-text)] mb-1">{stat.value}</div>
                  {stat.subtitle && <p className="text-[var(--color-sub)] text-xs">{stat.subtitle}</p>}
                  {stat.trend && (
                    <div className={`text-xs flex items-center ${
                      stat.trend === 'up' ? 'text-[var(--color-correct)]' : 
                      stat.trend === 'down' ? 'text-[var(--color-error)]' : 'text-[var(--color-sub)]'
                    }`}>
                      {stat.trend === 'up' && '↗'} {stat.trend === 'down' && '↘'} {stat.trendValue}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Performance by Mode */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[var(--color-box)] rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Performance by Mode</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Practice Mode</span>
                    <div className="text-right">
                      <div className="text-[var(--color-main)] font-semibold">{profileStats.practiceMode.avgWpm} WPM</div>
                      <div className="text-[var(--color-sub)] text-sm">{profileStats.practiceMode.tests} tests</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Normal Mode</span>
                    <div className="text-right">
                      <div className="text-[var(--color-main)] font-semibold">{profileStats.normalMode.avgWpm} WPM</div>
                      <div className="text-[var(--color-sub)] text-sm">{profileStats.normalMode.tests} tests</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--color-box)] rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Performance by Difficulty</h2>
                <div className="space-y-4">
                  {Object.entries(profileStats).filter(([key]) => ['easy', 'medium', 'hard'].includes(key)).map(([difficulty, stats]) => (
                    <div key={difficulty} className="flex justify-between items-center">
                      <span className="capitalize">{difficulty}</span>
                      <div className="text-right">
                        <div className="text-[var(--color-main)] font-semibold">{(stats as any).avgWpm} WPM</div>
                        <div className="text-[var(--color-sub)] text-sm">{(stats as any).tests} tests</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-[var(--color-box)] rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Keystroke Analysis</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Keystrokes</span>
                    <span className="text-[var(--color-main)]">{profileStats.keystrokes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Correct</span>
                    <span className="text-[var(--color-correct)]">{profileStats.correctKeystrokes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Incorrect</span>
                    <span className="text-[var(--color-error)]">{profileStats.incorrectKeystrokes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy Rate</span>
                    <span className="text-[var(--color-main)]">{((profileStats.correctKeystrokes / profileStats.keystrokes) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--color-box)] rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Session Statistics</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Average Session</span>
                    <span className="text-[var(--color-main)]">{profileStats.averageSessionLength}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Longest Session</span>
                    <span className="text-[var(--color-main)]">{profileStats.longestSession}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Streak</span>
                    <span className="text-[var(--color-correct)]">{profileStats.currentStreak} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Longest Streak</span>
                    <span className="text-[var(--color-main)]">{profileStats.longestStreak} days</span>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--color-box)] rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Peak Performance</h2>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between">
                      <span>Peak WPM</span>
                      <span className="text-[var(--color-main)]">{profileStats.peakWpm.value}</span>
                    </div>
                    <div className="text-[var(--color-sub)] text-xs">{profileStats.peakWpm.date}</div>
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span>Peak Accuracy</span>
                      <span className="text-[var(--color-main)]">{profileStats.peakAccuracy.value}%</span>
                    </div>
                    <div className="text-[var(--color-sub)] text-xs">{profileStats.peakAccuracy.date}</div>
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span>Peak Consistency</span>
                      <span className="text-[var(--color-main)]">{profileStats.peakConsistency.value}%</span>
                    </div>
                    <div className="text-[var(--color-sub)] text-xs">{profileStats.peakConsistency.date}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Common Errors */}
            <div className="bg-[var(--color-box)] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Most Common Errors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {profileStats.commonErrors.map((error, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-mono bg-[var(--color-bg)] rounded-lg p-4 mb-2">{error.character}</div>
                    <div className="text-[var(--color-error)] font-semibold">{error.count} errors</div>
                    <div className="text-[var(--color-sub)] text-sm">{error.percentage}% of mistakes</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-[var(--color-box)] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Test Results</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--color-sub)]">
                      <th className="text-left py-3">Date</th>
                      <th className="text-left py-3">Mode</th>
                      <th className="text-left py-3">Difficulty</th>
                      <th className="text-left py-3">WPM</th>
                      <th className="text-left py-3">Raw WPM</th>
                      <th className="text-left py-3">Accuracy</th>
                      <th className="text-left py-3">Consistency</th>
                      <th className="text-left py-3">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTests.map((test, index) => (
                      <tr key={index} className="border-b border-[var(--color-sub)] border-opacity-30">
                        <td className="py-3">{test.date}</td>
                        <td className="py-3">{test.mode}</td>
                        <td className="py-3">{test.difficulty}</td>
                        <td className="py-3 text-[var(--color-main)] font-semibold">{test.wpm}</td>
                        <td className="py-3">{test.rawWpm}</td>
                        <td className="py-3">{test.accuracy}%</td>
                        <td className="py-3">{test.consistency}%</td>
                        <td className="py-3">{test.time}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Monthly Progress Chart */}
            <div className="bg-[var(--color-box)] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Monthly Progress</h2>
              <div className="grid grid-cols-5 gap-4">
                {profileStats.monthlyProgress.map((month, index) => (
                  <div key={index} className="text-center">
                    <div className="text-[var(--color-sub)] text-sm mb-2">{month.month}</div>
                    <div className="text-[var(--color-main)] text-xl font-bold">{month.wpm}</div>
                    <div className="text-[var(--color-sub)] text-xs">WPM</div>
                    <div className="text-[var(--color-sub)] text-xs">{month.tests} tests</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-[var(--color-box)] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`p-4 rounded-lg border-2 ${
                      achievement.unlocked 
                        ? 'border-[var(--color-main)] bg-[var(--color-main)] bg-opacity-10' 
                        : 'border-[var(--color-sub)] bg-[var(--color-bg)]'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${achievement.unlocked ? 'text-[var(--color-main)]' : 'text-[var(--color-sub)]'}`}>
                          {achievement.name}
                        </h3>
                        {achievement.unlocked && achievement.unlockedDate && (
                          <p className="text-[var(--color-sub)] text-xs">Unlocked {achievement.unlockedDate}</p>
                        )}
                      </div>
                    </div>
                    <p className="text-[var(--color-sub)] text-sm mb-2">{achievement.description}</p>
                    
                    {!achievement.unlocked && achievement.progress !== undefined && achievement.maxProgress && (
                      <div>
                        <div className="flex justify-between text-xs text-[var(--color-sub)] mb-1">
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <div className="w-full bg-[var(--color-sub)] rounded-full h-2">
                          <div 
                            className={`bg-[var(--color-main)] h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-[var(--color-box)] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <input 
                    type="text" 
                    defaultValue={user?.username || ''} 
                    placeholder="Enter your username"
                    aria-label="Username"
                    className="w-full max-w-md px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-sub)] rounded-lg focus:border-[var(--color-main)] outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Daily Goal (tests per day)</label>
                  <input 
                    type="number" 
                    defaultValue={profileStats.dailyGoal} 
                    placeholder="Enter daily goal"
                    aria-label="Daily Goal"
                    className="w-full max-w-md px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-sub)] rounded-lg focus:border-[var(--color-main)] outline-none"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Privacy Settings</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span>Show profile on leaderboards</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span>Allow others to view detailed statistics</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4" />
                      <span>Share achievements on social media</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4">
                  <button className="bg-[var(--color-main)] text-[var(--color-bg)] px-6 py-2 rounded-lg hover:opacity-80 transition-opacity">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProfilePage;
