import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ActiveTab } from '../types';

export type ColorMode = 'dark' | 'light';
export type ThemeTabKey = 'home' | 'handfilm' | 'rawx' | 'apps';

const THEME_STORAGE_KEY = 'hh_master_theme_mode';

export function resolveThemeTabKey(tab: ActiveTab): ThemeTabKey {
  if (tab === 'handfilm') return 'handfilm';
  if (tab === 'rawx-showcase') return 'rawx';
  if (tab === 'ecosystem') return 'apps';
  return 'home';
}

export interface TabThemePalette {
  tabKey: ThemeTabKey;
  colorMode: ColorMode;
  bg: string;
  surface: string;
  surfaceElevated: string;
  accent: string;
  secondaryAccent: string;
  text: string;
  muted: string;
  border: string;
}

const TAB_PALETTES: Record<ThemeTabKey, Record<ColorMode, Omit<TabThemePalette, 'tabKey' | 'colorMode'>>> = {
  home: {
    dark: {
      bg: '#09090b',
      surface: '#121216',
      surfaceElevated: '#1a1a20',
      accent: '#e11d48',
      secondaryAccent: '#f59e0b',
      text: '#f4f4f5',
      muted: '#a1a1aa',
      border: 'rgba(244, 244, 245, 0.12)',
    },
    light: {
      bg: '#fafafa',
      surface: '#ffffff',
      surfaceElevated: '#f1f5f9',
      accent: '#be123c',
      secondaryAccent: '#d97706',
      text: '#0f172a',
      muted: '#475569',
      border: 'rgba(15, 23, 42, 0.12)',
    },
  },
  handfilm: {
    dark: {
      bg: '#0a0c10',
      surface: '#131720',
      surfaceElevated: '#1a202c',
      accent: '#06b6d4',
      secondaryAccent: '#8b5cf6',
      text: '#f8fafc',
      muted: '#94a3b8',
      border: 'rgba(248, 250, 252, 0.12)',
    },
    light: {
      bg: '#ffffff',
      surface: '#f4f6f9',
      surfaceElevated: '#e9eef5',
      accent: '#0284c7',
      secondaryAccent: '#7c3aed',
      text: '#111827',
      muted: '#4b5563',
      border: 'rgba(17, 24, 39, 0.10)',
    },
  },
  rawx: {
    dark: {
      bg: '#0c0b0a',
      surface: '#171513',
      surfaceElevated: '#211e1b',
      accent: '#d97706',
      secondaryAccent: '#a1a1aa',
      text: '#f4f0e8',
      muted: '#a1a1aa',
      border: 'rgba(244, 240, 232, 0.13)',
    },
    light: {
      bg: '#f5f2eb',
      surface: '#eae5d9',
      surfaceElevated: '#dfd8c8',
      accent: '#b45309',
      secondaryAccent: '#292524',
      text: '#292524',
      muted: '#57534e',
      border: 'rgba(41, 37, 36, 0.16)',
    },
  },
  apps: {
    dark: {
      bg: '#09090b',
      surface: '#121216',
      surfaceElevated: '#18181d',
      accent: '#10b981',
      secondaryAccent: '#f59e0b',
      text: '#f3efe6',
      muted: '#a1a1aa',
      border: 'rgba(243, 239, 230, 0.12)',
    },
    light: {
      bg: '#fafafa',
      surface: '#ffffff',
      surfaceElevated: '#f3f4f6',
      accent: '#059669',
      secondaryAccent: '#0f172a',
      text: '#0f172a',
      muted: '#475569',
      border: 'rgba(15, 23, 42, 0.12)',
    },
  },
};

interface ThemeContextValue {
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
  themeTabKey: ThemeTabKey;
  palette: TabThemePalette;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  activeTab: ActiveTab;
  children: React.ReactNode;
}

export function ThemeProvider({ activeTab, children }: ThemeProviderProps) {
  const [colorMode, setColorModeState] = useState<ColorMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // ignore storage errors
    }
    return 'dark';
  });

  const themeTabKey = resolveThemeTabKey(activeTab);

  const setColorMode = useCallback((mode: ColorMode) => {
    setColorModeState(mode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // ignore storage errors
    }
  }, []);

  const toggleColorMode = useCallback(() => {
    setColorMode(colorMode === 'dark' ? 'light' : 'dark');
  }, [colorMode, setColorMode]);

  const palette = useMemo<TabThemePalette>(() => {
    const tokens = TAB_PALETTES[themeTabKey][colorMode];
    return {
      tabKey: themeTabKey,
      colorMode,
      ...tokens,
    };
  }, [themeTabKey, colorMode]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(colorMode);
    root.setAttribute('data-theme', colorMode);
    root.setAttribute('data-tab', themeTabKey);
    root.style.colorScheme = colorMode;

    const metaScheme = document.querySelector('meta[name="color-scheme"]');
    if (metaScheme) {
      metaScheme.setAttribute('content', colorMode);
    }
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', palette.bg);
    }
  }, [colorMode, themeTabKey, palette.bg]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      colorMode,
      setColorMode,
      toggleColorMode,
      themeTabKey,
      palette,
      isDark: colorMode === 'dark',
    }),
    [colorMode, setColorMode, toggleColorMode, themeTabKey, palette]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside a ThemeProvider');
  }
  return ctx;
}
// END OF FILE: src/context/ThemeContext.tsx
