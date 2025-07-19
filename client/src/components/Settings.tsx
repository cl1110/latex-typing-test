import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../hooks/useSettings';
import { useTheme } from '../contexts/ThemeContext';
import { themes } from '../themes/themes';
import { X } from 'lucide-react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useSettings();
  const { themeName, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'behavior' | 'sound'>('general');

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'behavior', label: 'Behavior' },
    { id: 'sound', label: 'Sound' },
  ] as const;

  const fonts = [
    'JetBrains Mono',
    'Fira Code',
    'Source Code Pro',
    'Consolas',
    'Monaco',
    'Ubuntu Mono',
    'Roboto Mono',
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[var(--color-bg)] rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-[var(--color-sub)]">
              <h2 className="text-2xl font-bold text-[var(--color-text)]">Settings</h2>
              <button title="Close Settings"onClick={onClose} className="text-[var(--color-sub)] hover:text-[var(--color-text)]">
                <X size={24} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--color-sub)]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-[var(--color-main)] border-b-2 border-[var(--color-main)]'
                      : 'text-[var(--color-sub)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  {/* Number of Equations */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Number of Equations
                    </label>
                    <div className="flex gap-2">
                      {[10, 50, 100].map((count) => (
                        <button
                          key={count}
                          onClick={() => updateSettings({ equationCount: count })}
                          className={`px-4 py-2 rounded ${
                            settings.equationCount === count
                              ? 'bg-[var(--color-main)] text-[var(--color-bg)]'
                              : 'bg-[var(--color-sub)] text-[var(--color-text)]'
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Difficulty</label>
                    <div className="flex gap-4">
                      {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
                        <button
                          key={difficulty}
                          onClick={() => updateSettings({ difficulty })}
                          className={`px-4 py-2 rounded capitalize ${
                            settings.difficulty === difficulty
                              ? 'bg-[var(--color-main)] text-[var(--color-bg)]'
                              : 'bg-[var(--color-sub)] text-[var(--color-text)]'
                          }`}
                        >
                          {difficulty}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  {/* Theme */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Theme</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {Object.entries(themes).map(([key, theme]) => (
                        <button
                          key={key}
                          onClick={() => setTheme(key)}
                          className={`p-3 rounded border-2 transition-all ${
                            themeName === key
                              ? 'border-[var(--color-main)]'
                              : 'border-[var(--color-sub)] hover:border-[var(--color-text)]'
                          }`}
                        >
                          <div className="text-sm text-[var(--color-text)]">{theme.displayName}</div>
                          <div className="flex gap-1 mt-2">
                            <div className="w-4 h-4 rounded" />
                            <div className="w-4 h-4 rounded"  />
                            <div className="w-4 h-4 rounded"  />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Font</label>
                    <select title="Select"
                      value={settings.font}
                      onChange={(e) => updateSettings({ font: e.target.value })}
                      className="w-full p-2 rounded bg-[var(--color-sub)] text-[var(--color-text)]"
                    >
                      {fonts.map((font) => (
                        <option key={font} value={font}>
                          {font}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Font Size */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Font Size: {settings.fontSize}px
                    </label>
                    <input 
                    title="input"
                      type="range"
                      min="12"
                      max="24"
                      value={settings.fontSize}
                      onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'behavior' && (
                <div className="space-y-4">
                  {(['smoothCaret', 'quickRestart', 'hideTimer', 'hideLiveWpm', 'blindMode'] as const).map((key) => (
                    <label key={key} className="flex items-center justify-between">
                      <span className="text-[var(--color-text)]">{key}</span>
                      <input
                        type="checkbox"
                        checked={settings[key]}
                        onChange={(e) => updateSettings({ [key]: e.target.checked })}
                        className="w-5 h-5 rounded"
                      />
                    </label>
                  ))}
                </div>
              )}

              {activeTab === 'sound' && (
                <div className="space-y-6">
                  <label className="flex items-center justify-between">
                    <span className="text-[var(--color-text)]">Enable Sounds</span>
                    <input
                      type="checkbox"
                      checked={settings.soundEnabled}
                      onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                      className="w-5 h-5 rounded"
                    />
                  </label>

                  {settings.soundEnabled && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                          Volume: {settings.soundVolume}%
                        </label>
                        <input
                        title="input2"
                          type="range"
                          min="0"
                          max="100"
                          value={settings.soundVolume}
                          onChange={(e) => updateSettings({ soundVolume: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Sound Theme</label>
                        <select
                        title="select2"
                          value={settings.soundTheme}
                          onChange={(e) => updateSettings({ soundTheme: e.target.value })}
                          className="w-full p-2 rounded bg-[var(--color-sub)] text-[var(--color-text)]"
                        >
                          <option value="typewriter">Typewriter</option>
                          <option value="mechanical">Mechanical</option>
                          <option value="soft">Soft</option>
                          <option value="piano">Piano</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Settings;
