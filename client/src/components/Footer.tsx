import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const version = "v2.1.3";

  return (
    <footer className="py-2">
      <div className="max-w-7xl mx-auto px-4">
        {/* Compact single line layout */}
        <div className="flex items-center justify-between text-[var(--color-sub)] text-xs">
          {/* Left side - Key links only */}
          <div className="flex items-center space-x-4">
            <a href="#github" className="hover:text-[var(--color-text)] transition-colors">github</a>
            <a href="#discord" className="hover:text-[var(--color-text)] transition-colors">discord</a>
            <a href="#privacy" className="hover:text-[var(--color-text)] transition-colors">privacy</a>
          </div>

          {/* Right side - Version & Copyright */}
          <div className="flex items-center space-x-3">
            <span>{version}</span>
            <span>© {currentYear}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
