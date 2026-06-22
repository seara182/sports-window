// Persisted user settings (theme preference + default tab), stored separately
// from the data cache so clearing one never disturbs the other.
import { load, type Store } from '@tauri-apps/plugin-store';
import type { ThemePref } from '../lib/theme';
import type { SportKey } from '../types/domain';

export type DefaultTabPref = 'niners' | 'giants' | 'last';
export type FontSizePref = 'small' | 'medium' | 'large';
export type LanguagePref = 'en' | 'de';

export interface Settings {
  themePref: ThemePref;
  defaultTab: DefaultTabPref;
  /** The most recently viewed tab, used when defaultTab is "last". */
  lastTab: SportKey;
  /** Text size for the right-column content. */
  fontSize: FontSizePref;
  /** When true, all sections show bundled demo data instead of live ESPN data. */
  demoMode: boolean;
  /** Registry id of the selected NFL team, e.g. "nfl-sea". Defaults to the 49ers. */
  selectedNfl: string;
  /** Registry id of the selected MLB team, e.g. "mlb-lad". Defaults to the Giants. */
  selectedMlb: string;
  /** UI language. */
  language: LanguagePref;
  /** Sidebar frosted-background gradient preset id for the NFL tab (see sidebarBackgrounds.ts). */
  sidebarGradientNfl: string;
  /** Sidebar frosted-background gradient preset id for the MLB tab. */
  sidebarGradientMlb: string;
  /** Whether the faint iconized football shows over the NFL sidebar gradient. */
  sidebarIconNfl: boolean;
  /** Whether the faint iconized baseball shows over the MLB sidebar gradient. */
  sidebarIconMlb: boolean;
  /** Easter egg: render the bespoke SF skyline scenes instead of the gradient.
   *  Only has any effect when BOTH SF teams (nfl-sf + mlb-sf) are selected. */
  sfSpecialGraphics: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  themePref: 'system',
  defaultTab: 'last',
  lastTab: 'nfl',
  fontSize: 'medium',
  demoMode: false,
  selectedNfl: 'nfl-sf',
  selectedMlb: 'mlb-sf',
  language: 'en',
  sidebarGradientNfl: 'auto',
  sidebarGradientMlb: 'auto',
  sidebarIconNfl: true,
  sidebarIconMlb: true,
  sfSpecialGraphics: true,
};

const FILE = 'sports-window-settings.json';
const KEY = 'settings';

let storePromise: Promise<Store> | null = null;
const getStore = () => (storePromise ??= load(FILE));

export async function loadSettings(): Promise<Settings> {
  try {
    const store = await getStore();
    const saved = await store.get<Partial<Settings>>(KEY);
    return { ...DEFAULT_SETTINGS, ...(saved ?? {}) };
  } catch (err) {
    console.warn('[settings] load failed', err);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  try {
    const store = await getStore();
    await store.set(KEY, settings);
    await store.save();
  } catch (err) {
    console.warn('[settings] save failed', err);
  }
}

/** Resolves the tab to open on launch from the persisted preference. */
export function initialTab(settings: Settings): SportKey {
  if (settings.defaultTab === 'niners') return 'nfl';
  if (settings.defaultTab === 'giants') return 'mlb';
  return settings.lastTab;
}
