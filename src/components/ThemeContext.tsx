'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  pointer: string;
};

type ThemeContextType = {
  colors: ThemeColors;
  updateColor: (key: keyof ThemeColors, value: string) => void;
  resetTheme: () => void;
};

const defaultColors: ThemeColors = {
  primary: '#4f46e5',   // Indigo
  secondary: '#9333ea', // Purple
  accent: '#db2777',    // Pink
  background: '#030014', // Deep Space
  text: '#ffffff',
  pointer: '#4f46e5',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colors, setColors] = useState<ThemeColors>(defaultColors);

  useEffect(() => {
    // Load from local storage
    const saved = localStorage.getItem('theme-colors');
    if (saved) {
      setColors(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Apply CSS variables
    const root = document.documentElement;
    root.style.setProperty('--primary-color', colors.primary);
    root.style.setProperty('--secondary-color', colors.secondary);
    root.style.setProperty('--accent-color', colors.accent);
    root.style.setProperty('--bg-color', colors.background);
    root.style.setProperty('--text-color', colors.text);
    root.style.setProperty('--pointer-color', colors.pointer);
    
    // Save to local storage
    localStorage.setItem('theme-colors', JSON.stringify(colors));
  }, [colors]);

  const updateColor = (key: keyof ThemeColors, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
  };

  const resetTheme = () => {
    setColors(defaultColors);
  };

  return (
    <ThemeContext.Provider value={{ colors, updateColor, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
