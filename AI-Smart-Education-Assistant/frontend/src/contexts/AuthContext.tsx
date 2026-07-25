import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, AuthState } from '@/types';
import { STORAGE_KEYS } from '@/constants';
import { storage } from '@/utils/storage';
import { authService } from '@/services';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const init = () => {
      const token = storage.get<string>(STORAGE_KEYS.TOKEN);
      const user = storage.get<User>(STORAGE_KEYS.USER);
      if (token && user) {
        setState({ user, token, isAuthenticated: true, isLoading: false });
      } else {
        setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    };
    init();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const { user, token } = await authService.login(email, password);
      storage.set(STORAGE_KEYS.TOKEN, token);
      storage.set(STORAGE_KEYS.USER, user);
      setState({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const { user, token } = await authService.register(name, email, password);
      storage.set(STORAGE_KEYS.TOKEN, token);
      storage.set(STORAGE_KEYS.USER, user);
      setState({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await authService.logout();
    } catch {
      // ignore logout API errors, still clear local state
    } finally {
      storage.clear();
      setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const user = await authService.getCurrentUser();
      storage.set(STORAGE_KEYS.USER, user);
      setState((prev) => ({ ...prev, user }));
    } catch (error) {
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
