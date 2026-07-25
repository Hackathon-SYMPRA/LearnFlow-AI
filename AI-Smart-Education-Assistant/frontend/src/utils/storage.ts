import { STORAGE_KEYS } from '@/constants';

export const storage = {
  get<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error('Failed to save to localStorage');
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      console.error('Failed to remove from localStorage');
    }
  },

  clear(): void {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch {
      console.error('Failed to clear localStorage');
    }
  },
};

export const sessionStorage = {
  get<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const item = window.sessionStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error('Failed to save to sessionStorage');
    }
  },

  remove(key: string): void {
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      console.error('Failed to remove from sessionStorage');
    }
  },
};
