import React, { useState } from 'react';
import TypingTest from '../components/TypingTest';
import Settings from '../components/Settings';
import Footer from '../components/Footer';
import { CategorySelector } from '../components/CategorySelector';
import { useSettings } from '../contexts/SettingsContext';
import { Settings as SettingsIcon } from 'lucide-react';
import { LatexCategory } from '../services/aiEquationGenerator';

const HomePage = () => {
  const { settings, updateSettings } = useSettings();
  const [showSettings, setShowSettings] = useState(false);
  
  // Category state
  const [selectedCategories, setSelectedCategories] = useState<LatexCategory[]>(['algebra']);
  const [isCategorySelectorVisible, setIsCategorySelectorVisible] = useState(false);

  // Test function to verify button clicks
  const handlePracticeModeClick = () => {
    console.log('Practice button clicked, current practiceMode:', settings.practiceMode);
    updateSettings({ practiceMode: true });
    console.log('After update, should be true');
  };

  const handleChallengeModeClick = () => {
    console.log('Challenge button clicked, current practiceMode:', settings.practiceMode);
    updateSettings({ practiceMode: false });
    console.log('After update, should be false');
  };

  const equationModes = [10, 50, 100];
  const difficulties = [
    { value: 'easy' as const, label: 'Easy' },
    { value: 'medium' as const, label: 'Medium' },
    { value: 'hard' as const, label: 'Hard' }
  ];

  return (
    <div className="h-[calc(100vh-6rem)] max-h-[calc(100vh-6rem)] flex flex-col overflow-hidden">
      {/* Category Selector */}
      <div className="flex-shrink-0 mt-12 mb-8 flex justify-center">
        <CategorySelector
          selectedCategories={selectedCategories}
          onCategoriesChange={setSelectedCategories}
          isVisible={isCategorySelectorVisible}
          onToggleVisibility={() => setIsCategorySelectorVisible(!isCategorySelectorVisible)}
        />
      </div>

      {/* Unified Mode Selection - Monkeytype Style */}
      <div className="flex-shrink-0 mb-6 flex justify-center">
        <div className={`flex items-center bg-[var(--color-menu)] rounded-lg p-1 transition-opacity duration-300 ${
          settings.isTestActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}>
          
          {/* Difficulty Selection */}
          <div className="flex items-center">
            {difficulties.map((diff, index) => (
              <button
                key={diff.value}
                onClick={() => updateSettings({ difficulty: diff.value })}
                className={`px-3 py-2 text-sm transition-colors ${
                  settings.difficulty === diff.value
                    ? 'text-[var(--color-main)]'
                    : 'text-[var(--color-text)] hover:text-[var(--color-main)]'
                }`}
              >
                {diff.label}
              </button>
            ))}
          </div>

          {/* Separator */}
          <div className="h-6 w-px bg-[var(--color-sub)] bg-opacity-30 mx-2"></div>

          {/* Normal/Practice Mode */}
          <div className="flex items-center">
            <button
              onClick={handleChallengeModeClick}
              className={`px-3 py-2 text-sm transition-colors ${
                !settings.practiceMode
                  ? 'text-[var(--color-main)]'
                  : 'text-[var(--color-text)] hover:text-[var(--color-main)]'
              }`}
            >
              Normal
            </button>
            <button
              onClick={handlePracticeModeClick}
              className={`px-3 py-2 text-sm transition-colors ${
                settings.practiceMode
                  ? 'text-[var(--color-main)]'
                  : 'text-[var(--color-text)] hover:text-[var(--color-main)]'
              }`}
            >
              Practice
            </button>
          </div>

          {/* Separator */}
          <div className="h-6 w-px bg-[var(--color-sub)] bg-opacity-30 mx-2"></div>

          {/* Duration/Count Selection */}
          <div className="flex items-center">
            {equationModes.map(count => (
              <button
                key={count}
                onClick={() => updateSettings({ equationCount: count })}
                className={`px-3 py-2 text-sm transition-colors ${
                  settings.equationCount === count
                    ? 'text-[var(--color-main)]'
                    : 'text-[var(--color-text)] hover:text-[var(--color-main)]'
                }`}
              >
                {count}
              </button>
            ))}
          </div>

          {/* Separator */}
          <div className="h-6 w-px bg-[var(--color-sub)] bg-opacity-30 mx-2"></div>

          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-1 px-3 py-2 text-sm text-[var(--color-text)] hover:text-[var(--color-main)] transition-colors"
          >
            <SettingsIcon size={14} />
            Settings
          </button>
        </div>
      </div>

      {/* Typing Test - Takes remaining space */}
      <div className="flex-1 flex flex-col min-h-0 mb-8">
        <div className="w-full">
          <TypingTest 
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
          />
        </div>
      </div>

      {/* Settings Modal */}
      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />
      
      {/* Footer - Fixed at bottom */}
      <div className="flex-shrink-0">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;