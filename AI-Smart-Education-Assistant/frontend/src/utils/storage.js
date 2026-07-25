import { STORAGE_KEYS } from "@/constants";

export const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch {
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error("Failed to save to localStorage");
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      console.error("Failed to remove from localStorage");
    }
  },

  clear() {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch {
      console.error("Failed to clear localStorage");
    }
  },
};

export const sessionStorage = {
  get(key, defaultValue = null) {
    try {
      const item = window.sessionStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch {
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error("Failed to save to sessionStorage");
    }
  },

  remove(key) {
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      console.error("Failed to remove from sessionStorage");
    }
  },
};
