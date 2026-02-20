'use client';

import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';
import { useUIStore, type ThemePreference } from 'stores/ui-store';

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Theme provider that syncs next-themes with Zustand store.
 *
 * - next-themes handles system detection and CSS class switching
 * - Zustand is the source of truth for the user's theme preference
 * - ThemeSync pushes Zustand changes to next-themes
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const zustandTheme = useUIStore((state) => state.theme);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={zustandTheme}
      enableSystem
      disableTransitionOnChange
    >
      <ThemeSync />
      {children}
    </NextThemesProvider>
  );
}

/**
 * Inner component that syncs Zustand theme to next-themes.
 * Must be inside NextThemesProvider to access the useTheme hook.
 *
 * Zustand is the single source of truth. When the store changes
 * (e.g. ThemeToggle), this effect tells next-themes to update
 * the DOM class and color-scheme.
 */
function ThemeSync() {
  const { setTheme: setNextTheme } = useTheme();
  const zustandTheme = useUIStore((state) => state.theme);
  const prevTheme = useRef(zustandTheme);

  useEffect(() => {
    if (zustandTheme !== prevTheme.current) {
      prevTheme.current = zustandTheme;
      setNextTheme(zustandTheme);
    }
  }, [zustandTheme, setNextTheme]);

  return null;
}
