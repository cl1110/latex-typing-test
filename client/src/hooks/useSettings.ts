import { useState, useEffect } from 'react';

interface Settings {
  testMode: 'time' | 'equations';
  testDuration: number;
  equationCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  practiceMode: boolean;
  category: string;
  theme: string;
  font: string;
  fontSize: number;
  smoothCaret: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  soundTheme: string;
  quickRestart: boolean;
  hideTimer: boolean;
  hideLiveWpm: boolean;
  blindMode: boolean;
}

const defaultSettings: Settings = {
  testMode: 'equations',
  testDuration: 30,
  equationCount: 10,
  difficulty: 'medium',
  practiceMode: true,
  category: 'mixed',
  theme: 'serika-dark',
  font: 'JetBrains Mono',
  fontSize: 16,
  smoothCaret: true,
  soundEnabled: false,
  soundVolume: 50,
  soundTheme: 'typewriter',
  quickRestart: true,
  hideTimer: false,
  hideLiveWpm: false,
  blindMode: false,
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  return { settings, updateSettings };
};