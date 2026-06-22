import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { resolveTheme, systemTheme, type ResolvedTheme, type ThemePref } from '../lib/theme';

interface ThemeContextValue {
  pref: ThemePref;
  resolved: ResolvedTheme;
  setPref: (p: ThemePref) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

function applyTheme(pref: ThemePref, resolved: ResolvedTheme) {
  document.documentElement.dataset.theme = resolved;
  // Keep the native (frameless) chrome — scrollbars, menus — in step. For an
  // explicit override we force the window theme; for "system" we release it
  // (null) so the OS drives both the chrome AND the webview's
  // prefers-color-scheme. (Forcing a theme would otherwise pin
  // prefers-color-scheme and break a later switch back to System.)
  try {
    void getCurrentWindow().setTheme(pref === 'system' ? null : resolved);
  } catch {
    /* not running under Tauri (e.g. plain vite preview) */
  }
}

interface Props {
  children: ReactNode;
  initialPref?: ThemePref;
  onPrefChange?: (p: ThemePref) => void;
}

export function ThemeProvider({ children, initialPref = 'system', onPrefChange }: Props) {
  const [pref, setPrefState] = useState<ThemePref>(initialPref);
  const [resolved, setResolved] = useState<ResolvedTheme>(() => resolveTheme(initialPref));

  // Keep state in sync when a persisted preference loads in later.
  useEffect(() => {
    setPrefState(initialPref);
  }, [initialPref]);

  // Apply on every change and re-resolve "system" when the OS theme flips.
  useEffect(() => {
    const next = resolveTheme(pref);
    setResolved(next);
    applyTheme(pref, next);

    if (pref !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const sys = systemTheme();
      setResolved(sys);
      applyTheme('system', sys);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [pref]);

  const setPref = useCallback(
    (p: ThemePref) => {
      setPrefState(p);
      onPrefChange?.(p);
    },
    [onPrefChange],
  );

  const value = useMemo(() => ({ pref, resolved, setPref }), [pref, resolved, setPref]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
