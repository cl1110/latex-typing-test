import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);
  
  const { login, register } = useAuth();

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Form states
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    login: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear message when user starts typing
    if (message) setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'login') {
        const result = await login(formData.login, formData.password);
        if (result.success) {
          onClose();
          setFormData({ username: '', email: '', password: '', confirmPassword: '', login: '' });
        } else {
          setMessage({ text: result.message || 'Login failed', type: 'error' });
        }
      } else if (mode === 'register') {
        // Client-side validation with helpful messages
        if (formData.password !== formData.confirmPassword) {
          setMessage({ text: 'Passwords do not match', type: 'error' });
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setMessage({ text: 'Password must be at least 6 characters long', type: 'error' });
          setLoading(false);
          return;
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
          setMessage({ 
            text: 'Password must contain at least one lowercase letter, one uppercase letter, and one number', 
            type: 'error' 
          });
          setLoading(false);
          return;
        }

        // Check username format before sending to server
        if (!/^[a-zA-Z0-9_\- ]+$/.test(formData.username)) {
          setMessage({ 
            text: 'Username can only contain letters, numbers, underscores (_), hyphens (-), and spaces.', 
            type: 'error' 
          });
          setLoading(false);
          return;
        }

        if (formData.username.length < 3) {
          setMessage({ text: 'Username must be at least 3 characters long', type: 'error' });
          setLoading(false);
          return;
        }

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
          setMessage({ text: 'Please enter a valid email address', type: 'error' });
          setLoading(false);
          return;
        }

        const result = await register(formData.username, formData.email, formData.password);
        if (result.success) {
          setMessage({ 
            text: result.message || 'Registration successful! Please check your email for verification.', 
            type: 'success' 
          });
          // Don't close modal immediately to show success message
          setTimeout(() => {
            onClose();
            setFormData({ username: '', email: '', password: '', confirmPassword: '', login: '' });
          }, 2000);
        } else {
          setMessage({ text: result.message || 'Registration failed', type: 'error' });
        }
      }
    } catch (error) {
      setMessage({ text: 'An unexpected error occurred', type: 'error' });
    }

    setLoading(false);
  };

  const switchMode = (newMode: 'login' | 'register' | 'forgot') => {
    setMode(newMode);
    setMessage(null);
    setFormData({ username: '', email: '', password: '', confirmPassword: '', login: '' });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-80"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[var(--color-bg)] rounded-xl shadow-2xl border border-[var(--color-sub)] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">
                {mode === 'login' && 'Welcome Back'}
                {mode === 'register' && 'Create Account'}
                {mode === 'forgot' && 'Reset Password'}
              </h2>
              <p className="text-[var(--color-sub)]">
                {mode === 'login' && 'Sign in to your account'}
                {mode === 'register' && 'Join the LATEXER community'}
                {mode === 'forgot' && 'Enter your email to reset your password'}
              </p>
            </div>

            {/* Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${
                  message.type === 'error' 
                    ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                    : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                }`}
              >
                {message.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                )}
                <span className="text-sm">{message.text}</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1 flex items-center gap-2">
                    <User className="w-4 h-4 text-[var(--color-sub)]" />
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[var(--color-box)] border border-[var(--color-sub)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[var(--color-text)] placeholder-[var(--color-sub)]"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              )}

              {(mode === 'register' || mode === 'forgot') && (
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[var(--color-sub)]" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[var(--color-box)] border border-[var(--color-sub)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[var(--color-text)] placeholder-[var(--color-sub)]"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              )}

              {mode === 'login' && (
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1 flex items-center gap-2">
                    <User className="w-4 h-4 text-[var(--color-sub)]" />
                    Username or Email
                  </label>
                  <input
                    type="text"
                    name="login"
                    value={formData.login}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[var(--color-box)] border border-[var(--color-sub)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[var(--color-text)] placeholder-[var(--color-sub)]"
                    placeholder="Enter username or email"
                    required
                  />
                </div>
              )}

              {(mode === 'login' || mode === 'register') && (
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[var(--color-sub)]" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 bg-[var(--color-box)] border border-[var(--color-sub)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[var(--color-text)] placeholder-[var(--color-sub)]"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-sub)] hover:text-[var(--color-text)]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[var(--color-sub)]" />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 bg-[var(--color-box)] border border-[var(--color-sub)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[var(--color-text)] placeholder-[var(--color-sub)]"
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-sub)] hover:text-[var(--color-text)]"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {mode === 'login' && 'Sign In'}
                    {mode === 'register' && 'Create Account'}
                    {mode === 'forgot' && 'Send Reset Link'}
                  </>
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center space-y-2">
              {mode === 'login' && (
                <>
                  <button
                    onClick={() => switchMode('forgot')}
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Forgot your password?
                  </button>
                  <div className="text-sm text-[var(--color-sub)]">
                    Don't have an account?{' '}
                    <button
                      onClick={() => switchMode('register')}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Sign up
                    </button>
                  </div>
                </>
              )}

              {mode === 'register' && (
                <div className="text-sm text-[var(--color-sub)]">
                  Already have an account?{' '}
                  <button
                    onClick={() => switchMode('login')}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Sign in
                  </button>
                </div>
              )}

              {mode === 'forgot' && (
                <div className="text-sm text-[var(--color-sub)]">
                  Remember your password?{' '}
                  <button
                    onClick={() => switchMode('login')}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Sign in
                  </button>
                </div>
              )}
            </div>

            {/* Google OAuth Button (Placeholder) */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--color-sub)]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[var(--color-bg)] text-[var(--color-sub)]">Or continue with</span>
                </div>
              </div>
              
              <button
                type="button"
                disabled
                className="mt-4 w-full py-2 px-4 border border-[var(--color-sub)] rounded-lg text-[var(--color-text)] hover:bg-[var(--color-box)] transition-colors duration-200 flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google (Coming Soon)
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
