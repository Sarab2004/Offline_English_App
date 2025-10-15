import { useEffect, useState } from 'react';

const THEME_STORAGE_KEY = 'industrial-lexicon-theme';

const isBrowser = typeof window !== 'undefined';

const getStoredTheme = () => {
  if (!isBrowser) return null;
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (value === 'dark' || value === 'light') {
      return value;
    }
  } catch (error) {
    // Ignore storage access errors (e.g., Safari private mode)
  }

  return null;
};

const getSystemTheme = () => {
  if (!isBrowser) return 'light';
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch (error) {
    return 'light';
  }
};

export const applyTheme = (theme) => {
  if (typeof document === 'undefined') return;
  const normalized = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', normalized);
};

export const getPreferredTheme = () => {
  const stored = getStoredTheme();
  if (stored) {
    return stored;
  }

  return getSystemTheme();
};

export const ensureInitialTheme = () => {
  if (typeof document === 'undefined') return 'light';

  const current = document.documentElement.getAttribute('data-theme');
  if (current === 'dark' || current === 'light') {
    return current;
  }

  const initial = getPreferredTheme();
  applyTheme(initial);
  return initial;
};

const persistTheme = (theme) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    // Ignore storage access errors
  }
};

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof document !== 'undefined') {
      const existing = document.documentElement.getAttribute('data-theme');
      if (existing === 'dark' || existing === 'light') {
        return existing;
      }
    }
    return getPreferredTheme();
  });

  useEffect(() => {
    applyTheme(theme);
    persistTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme };
};

