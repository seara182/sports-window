import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { TeamData } from '../types/domain';
import { loadCache, saveCache } from '../data/cache';
import { fetchTeam } from '../data/espnApi';
import { teamById } from '../data/teamConfig';
import { onRateLimit } from '../data/rateLimit';
import i18n from '../i18n';
import { isStale } from '../lib/format';
import { useSettings } from './SettingsProvider';

interface DataContextValue {
  nfl: TeamData | null;
  mlb: TeamData | null;
  fetchedAt: number | null;
  /** True only on a cold start with no cache, before any data arrives. */
  loading: boolean;
  refreshing: boolean;
  /** True when the most recent refresh produced no usable data. */
  stale: boolean;
  /** Transient notice shown when ESPN rate-limits us; null when clear. */
  rateLimitedMessage: string | null;
  refresh: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

/** A fetch is only trusted if it actually carried content for the team. */
function isMeaningful(td: TeamData): boolean {
  return (
    td.roster.length > 0 ||
    td.standings.rows.length > 0 ||
    td.recentResults.length > 0 ||
    td.upcomingGames.length > 0
  );
}

const BACKOFF_BASE_MS = 1000;
const BACKOFF_MAX_MS = 60000;
const TOAST_THROTTLE_MS = 30000;

export function DataProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings();
  const [nfl, setNfl] = useState<TeamData | null>(null);
  const [mlb, setMlb] = useState<TeamData | null>(null);
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastFetchFailed, setLastFetchFailed] = useState(false);
  const [rateLimitedMessage, setRateLimitedMessage] = useState<string | null>(null);

  // Latest values, so refresh() can merge without stale closures.
  const latest = useRef({ nfl, mlb });
  latest.current = { nfl, mlb };

  // Mirrors settings for use inside doFetch without re-creating it.
  const demoModeRef = useRef(settings.demoMode);
  demoModeRef.current = settings.demoMode;
  const cfgRef = useRef({
    nfl: teamById('nfl', settings.selectedNfl),
    mlb: teamById('mlb', settings.selectedMlb),
  });
  cfgRef.current = {
    nfl: teamById('nfl', settings.selectedNfl),
    mlb: teamById('mlb', settings.selectedMlb),
  };

  // Exponential-backoff bookkeeping for ESPN 429 responses.
  const backoffRef = useRef(0);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastToastRef = useRef(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doFetch = useCallback(async () => {
    if (demoModeRef.current) return;
    setRefreshing(true);
    const [nflRes, mlbRes] = await Promise.allSettled([
      fetchTeam(cfgRef.current.nfl),
      fetchTeam(cfgRef.current.mlb),
    ]);

    let nextNfl = latest.current.nfl;
    let nextMlb = latest.current.mlb;
    let anySuccess = false;

    if (nflRes.status === 'fulfilled' && isMeaningful(nflRes.value)) {
      nextNfl = nflRes.value;
      anySuccess = true;
    }
    if (mlbRes.status === 'fulfilled' && isMeaningful(mlbRes.value)) {
      nextMlb = mlbRes.value;
      anySuccess = true;
    }

    if (anySuccess) {
      const now = Date.now();
      setNfl(nextNfl);
      setMlb(nextMlb);
      setFetchedAt(now);
      setLastFetchFailed(false);
      // A good response clears any active backoff.
      backoffRef.current = 0;
      void saveCache(nextNfl, nextMlb, now);
    } else {
      setLastFetchFailed(true);
    }
    setRefreshing(false);
    setLoading(false);
  }, []);

  // Listen for HTTP 429s surfaced by the fetch layer: show a throttled toast and
  // schedule a single exponential-backoff retry rather than hammering ESPN.
  useEffect(() => {
    return onRateLimit(() => {
      const now = Date.now();
      const delay =
        backoffRef.current === 0
          ? BACKOFF_BASE_MS
          : Math.min(backoffRef.current * 2, BACKOFF_MAX_MS);
      backoffRef.current = delay;

      if (now - lastToastRef.current > TOAST_THROTTLE_MS) {
        lastToastRef.current = now;
        setRateLimitedMessage(i18n.t('data.rateLimited'));
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setRateLimitedMessage(null), 6000);
      }

      if (retryTimer.current) clearTimeout(retryTimer.current);
      retryTimer.current = setTimeout(() => {
        if (!demoModeRef.current) void doFetch();
      }, delay);
    });
  }, [doFetch]);

  // Cold-launch sequence: show cache instantly, then fetch fresh.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cached = await loadCache();
      if (!cancelled && cached) {
        setNfl(cached.nfl);
        setMlb(cached.mlb);
        setFetchedAt(cached.fetchedAt);
        setLoading(false);
      }
      void doFetch();
    })();
    return () => {
      cancelled = true;
    };
  }, [doFetch]);

  const refresh = useCallback(() => {
    if (!refreshing && !demoModeRef.current) void doFetch();
  }, [refreshing, doFetch]);

  // Disabling Demo Mode triggers an immediate live refresh.
  const prevDemoMode = useRef(settings.demoMode);
  useEffect(() => {
    if (prevDemoMode.current && !settings.demoMode) {
      void doFetch();
    }
    prevDemoMode.current = settings.demoMode;
  }, [settings.demoMode, doFetch]);

  // Re-fetch when the selected team for a sport changes. Clear that slot first
  // so the UI shows a loading state instead of the previous team's data.
  const prevSel = useRef({ nfl: settings.selectedNfl, mlb: settings.selectedMlb });
  useEffect(() => {
    const nflChanged = prevSel.current.nfl !== settings.selectedNfl;
    const mlbChanged = prevSel.current.mlb !== settings.selectedMlb;
    if (!nflChanged && !mlbChanged) return;
    prevSel.current = { nfl: settings.selectedNfl, mlb: settings.selectedMlb };
    if (settings.demoMode) return;
    if (nflChanged) setNfl(null);
    if (mlbChanged) setMlb(null);
    setLoading(true);
    void doFetch();
  }, [settings.selectedNfl, settings.selectedMlb, settings.demoMode, doFetch]);

  // Tidy up any pending timers on unmount.
  useEffect(() => {
    return () => {
      if (retryTimer.current) clearTimeout(retryTimer.current);
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const stale = lastFetchFailed && isStale(fetchedAt);

  return (
    <DataContext.Provider
      value={{ nfl, mlb, fetchedAt, loading, refreshing, stale, rateLimitedMessage, refresh }}
    >
      {children}
    </DataContext.Provider>
  );
}
