// Generic cache for lazily-fetched detail data (game summaries, player
// stats) shown in the detail overlay. Kept separate from the main app cache
// (cache.ts) so it can grow independently without bloating the launch-time
// data file.
import { load, type Store } from '@tauri-apps/plugin-store';

const FILE = 'sports-window-detail-cache.json';

let storePromise: Promise<Store> | null = null;
function getStore(): Promise<Store> {
  if (!storePromise) storePromise = load(FILE);
  return storePromise;
}

/** Loads a cached detail value by key, or null if absent / unreadable. */
export async function getCachedDetail<T>(key: string): Promise<T | null> {
  try {
    const store = await getStore();
    const value = await store.get<T>(key);
    return value ?? null;
  } catch (err) {
    console.warn('[detailCache] load failed', err);
    return null;
  }
}

/** Writes a value to the detail cache under the given key. */
export async function setCachedDetail<T>(key: string, value: T): Promise<void> {
  try {
    const store = await getStore();
    await store.set(key, value);
    await store.save();
  } catch (err) {
    console.warn('[detailCache] save failed', err);
  }
}
