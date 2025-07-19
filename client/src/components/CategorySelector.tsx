import React, { useState } from 'react';
import { LatexCategory, LATEX_CATEGORIES, CategoryConfig } from '../services/aiEquationGenerator';

interface CategorySelectorProps {
  selectedCategories: LatexCategory[];
  onCategoriesChange: (categories: LatexCategory[]) => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategories,
  onCategoriesChange,
  isVisible,
  onToggleVisibility
}) => {
  const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const filteredCategories = filter === 'all' 
    ? LATEX_CATEGORIES 
    : LATEX_CATEGORIES.filter(cat => cat.difficulty === filter);

  const toggleCategory = (categoryId: LatexCategory) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoriesChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      onCategoriesChange([...selectedCategories, categoryId]);
    }
  };

  const selectAll = () => {
    const allIds = filteredCategories.map(cat => cat.id);
    const uniqueCategories = [...selectedCategories];
    allIds.forEach(id => {
      if (!uniqueCategories.includes(id)) {
        uniqueCategories.push(id);
      }
    });
    onCategoriesChange(uniqueCategories);
  };

  const clearAll = () => {
    const filteredIds = filteredCategories.map(cat => cat.id);
    onCategoriesChange(selectedCategories.filter(id => !filteredIds.includes(id)));
  };

  const getCategoryIcon = (category: CategoryConfig) => {
    const icons: Record<LatexCategory, string> = {
      'algebra': 'Alg',
      'calculus': 'Cal',
      'geometry': 'Geo',
      'trigonometry': 'Trig',
      'statistics': 'Stat',
      'linear-algebra': 'LinAlg',
      'differential-equations': 'DiffEq',
      'number-theory': 'NumTh',
      'discrete-math': 'Disc',
      'physics': 'Phys',
      'chemistry': 'Chem',
      'fractions': 'Frac',
      'exponents': 'Exp',
      'logarithms': 'Log',
      'matrices': 'Mat',
      'integrals': 'Int',
      'derivatives': 'Der',
      'limits': 'Lim',
      'series': 'Ser',
      'vectors': 'Vec',
      'complex-numbers': 'Comp',
      'set-theory': 'Set',
      'logic': 'Log',
      'combinatorics': 'Comb',
      'probability': 'Prob'
    };
    return icons[category.id] || 'Cat';
  };

  return (
    <>
      {/* Simple Category Button */}
      <div>
        <button
          onClick={onToggleVisibility}
          className="px-4 py-2 bg-[var(--color-main)] text-[var(--color-bg)] hover:opacity-80 transition-opacity rounded-lg font-medium"
        >
          Categories {selectedCategories.length > 0 && `(${selectedCategories.length})`}
        </button>
      </div>

      {/* Popup Overlay */}
      {isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onToggleVisibility}>
          <div 
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl max-h-[90vh] mx-4 bg-[var(--color-menu)] border border-[var(--color-border)] rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-[var(--color-text)]">Select Categories</h3>
                <button
                  onClick={onToggleVisibility}
                  className="text-[var(--color-sub)] hover:text-[var(--color-text)] transition-colors"
                >
                  ✕
                </button>
              </div>
              
              {selectedCategories.length > 0 && (
                <div className="flex gap-1 mt-3 flex-wrap">
                  {selectedCategories.slice(0, 8).map(catId => {
                    const category = LATEX_CATEGORIES.find(c => c.id === catId);
                    return category ? (
                      <span
                        key={catId}
                        className="px-2 py-1 text-xs rounded"
                        style={{ backgroundColor: category.color + '20', color: category.color }}
                      >
                        {getCategoryIcon(category)} {category.name}
                      </span>
                    ) : null;
                  })}
                  {selectedCategories.length > 8 && (
                    <span className="px-2 py-1 text-xs text-[var(--color-sub)]">
                      +{selectedCategories.length - 8} more
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Filter Buttons */}
            <div className="px-6 py-4 border-b border-[var(--color-border)]">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    filter === 'all' 
                      ? 'bg-[var(--color-main)] text-[var(--color-bg)]' 
                      : 'bg-[var(--color-sub)] text-[var(--color-text)] hover:bg-[var(--color-main)] hover:text-[var(--color-bg)]'
                  }`}
                >
                  All ({LATEX_CATEGORIES.length})
                </button>
                <button
                  onClick={() => setFilter('beginner')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    filter === 'beginner' 
                      ? 'bg-[var(--color-main)] text-[var(--color-bg)]' 
                      : 'bg-[var(--color-sub)] text-[var(--color-text)] hover:bg-[var(--color-main)] hover:text-[var(--color-bg)]'
                  }`}
                >
                  Beginner ({LATEX_CATEGORIES.filter(c => c.difficulty === 'beginner').length})
                </button>
                <button
                  onClick={() => setFilter('intermediate')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    filter === 'intermediate' 
                      ? 'bg-[var(--color-main)] text-[var(--color-bg)]' 
                      : 'bg-[var(--color-sub)] text-[var(--color-text)] hover:bg-[var(--color-main)] hover:text-[var(--color-bg)]'
                  }`}
                >
                  Intermediate ({LATEX_CATEGORIES.filter(c => c.difficulty === 'intermediate').length})
                </button>
                <button
                  onClick={() => setFilter('advanced')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    filter === 'advanced' 
                      ? 'bg-[var(--color-main)] text-[var(--color-bg)]' 
                      : 'bg-[var(--color-sub)] text-[var(--color-text)] hover:bg-[var(--color-main)] hover:text-[var(--color-bg)]'
                  }`}
                >
                  Advanced ({LATEX_CATEGORIES.filter(c => c.difficulty === 'advanced').length})
                </button>
                
                <div className="ml-auto flex gap-2">
                  <button
                    onClick={selectAll}
                    className="px-3 py-1 rounded text-sm bg-[var(--color-correct)] text-[var(--color-bg)] hover:opacity-80 transition-opacity"
                  >
                    Select All
                  </button>
                  <button
                    onClick={clearAll}
                    className="px-3 py-1 rounded text-sm bg-[var(--color-error)] text-white hover:opacity-80 transition-opacity"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>

            {/* Category Grid */}
            <div className="px-6 py-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {filteredCategories.map((category) => {
                  const isSelected = selectedCategories.includes(category.id);
                  return (
                    <button
                      key={category.id}
                      onClick={() => toggleCategory(category.id)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 text-left hover:scale-105 ${
                        isSelected
                          ? 'border-[var(--color-main)] bg-[var(--color-main)] bg-opacity-20'
                          : 'border-[var(--color-border)] bg-[var(--color-box)] hover:border-[var(--color-sub)]'
                      }`}
                      style={{
                        borderColor: isSelected ? category.color : undefined,
                        backgroundColor: isSelected ? category.color + '20' : undefined
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono bg-[var(--color-sub)] text-[var(--color-bg)] px-1 rounded">
                          {getCategoryIcon(category)}
                        </span>
                        <span 
                          className={`font-medium text-sm ${
                            isSelected ? 'text-[var(--color-text)]' : 'text-[var(--color-text)]'
                          }`}
                        >
                          {category.name}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-sub)] mb-2 leading-tight">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span 
                          className="text-xs px-2 py-1 rounded font-medium"
                          style={{ 
                            backgroundColor: category.color + '30',
                            color: category.color
                          }}
                        >
                          {category.difficulty}
                        </span>
                        {isSelected && (
                          <span className="text-[var(--color-main)] text-sm">✓</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
