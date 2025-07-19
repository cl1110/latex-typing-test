import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// User interface
interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  level: number;
  experience: number;
  stats: {
    testsCompleted: number;
    totalTime: number;
    totalKeystrokes: number;
    bestWpm: number;
    bestAccuracy: number;
    averageWpm: number;
    averageAccuracy: number;
  };
  settings: {
    theme: string;
    font: string;
    fontSize: number;
    smoothCaret: boolean;
    soundEnabled: boolean;
    soundVolume: number;
    quickRestart: boolean;
    hideTimer: boolean;
    hideLiveWpm: boolean;
    blindMode: boolean;
  };
  isEmailVerified: boolean;
  createdAt: string;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
  token: string | null;
  login: (login: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check for existing token and validate user on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        try {
          const response = await axios.get(`${API_BASE_URL}/auth/me`);
          setUser(response.data.user);
          setToken(storedToken);
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('authToken');
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (login: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        login,
        password
      });

      const { token: newToken, user: userData } = response.data;
      
      // Store token and user data
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setUser(userData);
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Register function
  const register = async (username: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      console.log('Attempting registration with:', { username, email, password: '***' });
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        username,
        email,
        password
      });

      const { token: newToken, user: userData, message } = response.data;
      
      // Store token and user data
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setUser(userData);
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      return { success: true, message };
    } catch (error: any) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      return { 
        success: false, 
        message: error.response?.data?.message || error.response?.data?.errors?.join(', ') || 'Registration failed' 
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Update user function
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    token,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
