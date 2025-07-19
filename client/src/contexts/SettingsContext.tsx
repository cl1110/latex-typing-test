import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

interface Settings {
  difficulty: 'easy' | 'medium' | 'hard';
  testMode: 'time' | 'equations';
  testDuration: number;
  equationCount: number;
  practiceMode: boolean;
  hideTimer: boolean;
  hideLiveWpm: boolean;
  quickRestart: boolean;
  category: string;
  isTestActive: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  difficulty: 'medium',
  testMode: 'equations',
  testDuration: 30,
  equationCount: 10,
  practiceMode: false,
  hideTimer: false,
  hideLiveWpm: false,
  quickRestart: true,
  category: 'algebra',
  isTestActive: false
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {}
});

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const value = useMemo(() => ({
    settings,
    updateSettings
  }), [settings, updateSettings]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
