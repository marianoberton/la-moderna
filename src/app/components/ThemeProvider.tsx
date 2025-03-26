'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme] = useState<Theme>('light');

  useEffect(() => {
    localStorage.setItem('theme', 'light');
    
    const root = document.documentElement;
    root.removeAttribute('data-theme');
    document.documentElement.classList.remove('dark');
  }, []);

  const setTheme = () => {
    // No hacer nada - siempre mantenemos el tema claro
  };

  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
} 