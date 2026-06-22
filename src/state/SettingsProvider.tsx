import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  type DefaultTabPref,
  type FontSizePref,
  type LanguagePref,
  type Settings,
} from '../data/settings';
import type { ThemePref } from '../lib/theme';
import type { SportKey } from '../types/domain';

interface SettingsContextValue {
  settings: Settings;
  loaded: boolean;
  setThemePref: (p: ThemePref) => void;
  setDefaultTab: (d: DefaultTabPref) => void;
  setLastTab: (t: SportKey) => void;
  setFontSize: (f: FontSizePref) => void;
  setDemoMode: (d: boolean) => void;
  setSelectedTeam: (sport: SportKey, teamId: string) => void;
  setLanguage: (l: LanguagePref) => void;
  setSidebarGradient: (sport: SportKey, presetId: string) => void;
  setSidebarIcon: (sport: SportKey, on: boolean) => void;
  setSfSpecialGraphics: (on: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadSettings().then((s) => {
      if (!cancelled) setSettings(s);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const patch = useCallback((p: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...(prev ?? DEFAULT_SETTINGS), ...p };
      void saveSettings(next);
      return next;
    });
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings: settings ?? DEFAULT_SETTINGS,
      loaded: settings !== null,
      setThemePref: (themePref) => patch({ themePref }),
      setDefaultTab: (defaultTab) => patch({ defaultTab }),
      setLastTab: (lastTab) => patch({ lastTab }),
      setFontSize: (fontSize) => patch({ fontSize }),
      setDemoMode: (demoMode) => patch({ demoMode }),
      setSelectedTeam: (sport, teamId) =>
        patch(sport === 'nfl' ? { selectedNfl: teamId } : { selectedMlb: teamId }),
      setLanguage: (language) => patch({ language }),
      setSidebarGradient: (sport, presetId) =>
        patch(
          sport === 'nfl' ? { sidebarGradientNfl: presetId } : { sidebarGradientMlb: presetId },
        ),
      setSidebarIcon: (sport, on) =>
        patch(sport === 'nfl' ? { sidebarIconNfl: on } : { sidebarIconMlb: on }),
      setSfSpecialGraphics: (sfSpecialGraphics) => patch({ sfSpecialGraphics }),
    }),
    [settings, patch],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
