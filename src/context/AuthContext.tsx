import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { UserRole } from '../types';
import { authApi } from '../api/auth';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isModerator: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const userData = await authApi.getProfile();
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback((userData: User) => {
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    authApi.logout().finally(() => {
      setUser(null);
    });
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await authApi.getProfile();
      setUser(userData);
    } catch {
      setUser(null);
    }
  }, []);

  const value = {
    user,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    isLoading,
    isAdmin: user?.role === UserRole.ADMIN,
    isModerator: user?.role === UserRole.MODERATOR || user?.role === UserRole.ADMIN,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
