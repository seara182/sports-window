// Shared lazy-fetch + cache hook for ESPN athlete season stats. Used by both
// the Spotlight card and PlayerDetailPanel so the two stay in sync and only
// fetch once per player/season.
import { useEffect, useState } from 'react';
import type { SportKey } from '../types/domain';
import { fetchAthleteStats } from '../data/espnApi';
import { getCachedDetail, setCachedDetail } from '../data/detailCache';
import { parsePlayerStats, type PlayerStatsData } from '../data/playerStatsParsers';

export type PlayerStatsState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; data: PlayerStatsData | null };

const SIX_HOURS = 6 * 60 * 60 * 1000;

export function usePlayerStats(
  sport: SportKey,
  athleteId: string | undefined,
  positionAbbr: string,
  attempt = 0,
): PlayerStatsState {
  const [state, setState] = useState<PlayerStatsState>({ status: 'loading' });

  useEffect(() => {
    if (!athleteId) {
      setState({ status: 'error' });
      return;
    }
    let cancelled = false;
    setState({ status: 'loading' });
    const seasonYear = new Date().getFullYear();
    const cacheKey = `player_stats_${athleteId}_${seasonYear}`;

    (async () => {
      const cached = await getCachedDetail<{ ts: number; raw: unknown }>(cacheKey);
      if (cached && Date.now() - cached.ts < SIX_HOURS) {
        if (!cancelled)
          setState({ status: 'ready', data: parsePlayerStats(cached.raw, sport, positionAbbr) });
        return;
      }
      try {
        const fresh = await fetchAthleteStats(sport, athleteId);
        if (cancelled) return;
        setState({ status: 'ready', data: parsePlayerStats(fresh, sport, positionAbbr) });
        void setCachedDetail(cacheKey, { ts: Date.now(), raw: fresh });
      } catch {
        if (!cancelled) setState({ status: 'error' });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sport, athleteId, positionAbbr, attempt]);

  return state;
}
