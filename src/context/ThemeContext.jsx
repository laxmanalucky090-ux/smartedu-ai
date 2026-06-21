import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

const darkColors = {
  bg: '#0A0A0A', card: '#111111', cardAlt: '#181818',
  border: 'rgba(255,255,255,0.08)',
  accent: '#D7FF3E', accentDark: '#A8E000',
  text: '#FFFFFF', textMuted: '#A1A1AA',
  success: '#4ADE80', successBg: 'rgba(74,222,128,0.1)', successBorder: 'rgba(74,222,128,0.35)',
  error: '#F87171', errorBg: 'rgba(248,113,113,0.1)', errorBorder: 'rgba(248,113,113,0.35)',
  inputBg: '#181818',
};

const lightColors = {
  bg: '#F7F7F2', card: '#FFFFFF', cardAlt: '#F1F1EC',
  border: 'rgba(0,0,0,0.08)',
  accent: '#A8E000', accentDark: '#7DB300',
  text: '#0A0A0A', textMuted: '#6B7280',
  success: '#16A34A', successBg: '#DCFCE7', successBorder: '#86EFAC',
  error: '#DC2626', errorBg: '#FEF2F2', errorBorder: '#FECACA',
  inputBg: '#FFFFFF',
};

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('smartedu_theme');
    if (saved === 'light' || saved === 'dark') setMode(saved);
  }, []);

  const toggleTheme = () => {
    setMode(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('smartedu_theme', next);
      return next;
    });
  };

  const COLORS = mode === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, COLORS }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}