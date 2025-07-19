import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const Navigation: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <>
      <nav className="px-4 py-6">
        <div className="container mx-auto flex justify-center items-center relative">
          <div className="flex gap-6 items-center">
            <Link to="/" className="text-xl font-bold text-[var(--color-main)]">
              LATEXER
            </Link>
            <Link to="/leaderboard" className="text-[var(--color-text)] hover:text-[var(--color-main)] transition-colors">
              Leaderboard
            </Link>
            <Link to="/multiplayer" className="text-[var(--color-text)] hover:text-[var(--color-main)] transition-colors">
              Multiplayer
            </Link>
            <Link to="/cheatsheet" className="text-[var(--color-text)] hover:text-[var(--color-main)] transition-colors">
              Library
            </Link>
            
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-[var(--color-text)] hover:text-[var(--color-main)] transition-colors"
                >
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.username}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                  <span>{user.username}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--color-bg)] border border-[var(--color-sub)] rounded-lg shadow-lg py-2 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-[var(--color-text)] hover:bg-[var(--color-box)] transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-[var(--color-text)] hover:bg-[var(--color-box)] transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <hr className="my-2 border-[var(--color-sub)]" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-[var(--color-text)] hover:bg-[var(--color-box)] transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={handleAuthClick}
                className="px-4 py-2 bg-[var(--color-main)] text-[var(--color-bg)] rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Close user menu when clicking outside */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default Navigation;