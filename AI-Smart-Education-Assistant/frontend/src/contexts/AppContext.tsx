import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { InternetStatus, AIStatus } from '@/types';

interface AppContextType {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  currentSubject: string | null;
  setCurrentSubject: (subject: string | null) => void;
  internetStatus: InternetStatus;
  aiStatus: AIStatus;
  aiDisabled: boolean;
  globalSearchOpen: boolean;
  openGlobalSearch: () => void;
  closeGlobalSearch: () => void;
  toggleGlobalSearch: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsedState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('edumind_sidebar_collapsed');
      return stored ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });

  const [currentSubject, setCurrentSubjectState] = useState<string | null>(() => {
    try {
      return localStorage.getItem('edumind_current_subject');
    } catch {
      return null;
    }
  });

  const [internetStatus, setInternetStatus] = useState<InternetStatus>({ isOnline: navigator.onLine });

  const [aiStatus] = useState<AIStatus>({ isReady: true, activeModels: 3 });

  const [aiDisabled, setAiDisabled] = useState<boolean>(!navigator.onLine);

  const [globalSearchOpen, setGlobalSearchOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setInternetStatus({ isOnline: true });
      setAiDisabled(false);
    };
    const handleOffline = () => {
      setInternetStatus({ isOnline: false });
      setAiDisabled(true);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const openGlobalSearch = useCallback(() => setGlobalSearchOpen(true), []);
  const closeGlobalSearch = useCallback(() => setGlobalSearchOpen(false), []);
  const toggleGlobalSearch = useCallback(() => setGlobalSearchOpen((o) => !o), []);

  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setSidebarCollapsedState(collapsed);
    try {
      localStorage.setItem('edumind_sidebar_collapsed', JSON.stringify(collapsed));
    } catch {
      // ignore
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(!sidebarCollapsed);
  }, [sidebarCollapsed, setSidebarCollapsed]);

  const setCurrentSubject = useCallback((subject: string | null) => {
    setCurrentSubjectState(subject);
    try {
      if (subject) {
        localStorage.setItem('edumind_current_subject', subject);
      } else {
        localStorage.removeItem('edumind_current_subject');
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar,
        currentSubject,
        setCurrentSubject,
        internetStatus,
        aiStatus,
        aiDisabled,
        globalSearchOpen,
        openGlobalSearch,
        closeGlobalSearch,
        toggleGlobalSearch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
