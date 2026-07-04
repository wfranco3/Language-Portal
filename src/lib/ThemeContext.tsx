import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppTheme = 'classic' | 'premium';

interface ThemeContextProps {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>('classic');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('idiomas_theme');
      if (stored === 'classic' || stored === 'premium') {
        setThemeState(stored as AppTheme);
        applyThemeClass(stored as AppTheme);
      } else {
        applyThemeClass('classic');
      }
    } catch (e) {
      console.error('Error recovering theme:', e);
    }
  }, []);

  const applyThemeClass = (activeTheme: AppTheme) => {
    if (activeTheme === 'premium') {
      document.body.classList.add('theme-premium');
    } else {
      document.body.classList.remove('theme-premium');
    }
  };

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    applyThemeClass(newTheme);
    try {
      localStorage.setItem('idiomas_theme', newTheme);
    } catch (e) {
      console.error('Error saving theme:', e);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
}
