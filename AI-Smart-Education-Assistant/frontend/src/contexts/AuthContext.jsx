import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { STORAGE_KEYS } from "@/constants";
import { storage } from "@/utils/storage";
import { authService } from "@/services";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const init = () => {
      const token = storage.get(STORAGE_KEYS.TOKEN);
      const user = storage.get(STORAGE_KEYS.USER);
      if (token && user) {
        setState({ user, token, isAuthenticated: true, isLoading: false });
      } else {
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };
    init();
  }, []);

  const login = useCallback(async (email, password) => {
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

  const register = useCallback(async (name, email, password) => {
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
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
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
    <AuthContext.Provider
      value={{ ...state, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
