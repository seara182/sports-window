// Persists the parsed app data (plus a fetch timestamp) to disk via the Tauri
// store plugin, so a cold launch can render instantly from the last session.
import { load, type Store } from '@tauri-apps/plugin-store';
import type { AppData, TeamData } from '../types/domain';

const FILE = 'sports-window-cache.json';
const KEY = 'appData';

let storePromise: Promise<Store> | null = null;
function getStore(): Promise<Store> {
  if (!storePromise) storePromise = load(FILE);
  return storePromise;
}

/** Loads the cached AppData, or null if there is none / it is unreadable. */
export async function loadCache(): Promise<AppData | null> {
  try {
    const store = await getStore();
    const data = await store.get<AppData>(KEY);
    return data ?? null;
  } catch (err) {
    console.warn('[cache] load failed', err);
    return null;
  }
}

/** Writes the given teams to the cache with a fresh timestamp. */
export async function saveCache(
  nfl: TeamData | null,
  mlb: TeamData | null,
  fetchedAt: number,
): Promise<void> {
  try {
    const store = await getStore();
    const data: AppData = { nfl, mlb, fetchedAt };
    await store.set(KEY, data);
    await store.save();
  } catch (err) {
    console.warn('[cache] save failed', err);
  }
}
