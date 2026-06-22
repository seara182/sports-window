// Head-to-head matchup history: last 5 completed games against a given
// opponent, pulled from the active team's schedule across recent seasons,
// plus a hardcoded all-time series record string per the v4 spec.

import type { GameResult, SportKey } from '../types/domain';
import { fetchTeamSchedule } from './espnApi';
import { parseEvent } from './parsers';
import { getCachedDetail, setCachedDetail } from './detailCache';
import { parr, pnum } from './safe';
import i18n from '../i18n';

const SERIES_RECORDS: Record<SportKey, Record<string, string>> = {
  nfl: {
    '26': '49ers trail all-time series 28–34',
    '14': '49ers lead all-time series 73–68',
    '22': '49ers lead all-time series 40–27',
  },
  mlb: {
    '19': 'Giants trail all-time series 1,102–1,126',
    '25': 'Giants lead all-time series 282–248',
    '27': 'Giants lead all-time series 219–178',
    '29': 'Giants lead all-time series 178–151',
  },
};

/** Hardcoded all-time series record string for the given opponent. The bespoke
 *  SF series facts stay as written; only the fallback is localized. */
export function seriesRecordFor(sport: SportKey, opponentId?: string): string {
  const na = i18n.t('h2h.seriesNa');
  if (!opponentId) return na;
  return SERIES_RECORDS[sport][opponentId] ?? na;
}

export interface HeadToHeadData {
  matchups: GameResult[];
  seriesRecord: string;
}

const SIX_HOURS = 6 * 60 * 60 * 1000;

/** Fetches and caches the last 5 completed matchups against `opponentId`. */
export async function fetchHeadToHead(
  sport: SportKey,
  slug: string,
  teamAbbr: string,
  opponentId: string | undefined,
): Promise<HeadToHeadData> {
  const seriesRecord = seriesRecordFor(sport, opponentId);
  if (!opponentId) return { matchups: [], seriesRecord };

  const cacheKey = `h2h_${sport}_${slug}_${opponentId}`;
  const cached = await getCachedDetail<{ ts: number; matchups: GameResult[] }>(cacheKey);
  if (cached && Date.now() - cached.ts < SIX_HOURS) {
    return { matchups: cached.matchups, seriesRecord };
  }

  const matchups: GameResult[] = [];
  let season: number | undefined;

  for (let i = 0; i < 4 && matchups.length < 5; i++) {
    const raw = await fetchTeamSchedule(sport, slug, season);
    if (!raw) break;
    if (season == null) {
      season =
        pnum(raw, 'requestedSeason.year') ?? pnum(raw, 'season.year') ?? new Date().getFullYear();
    }
    for (const ev of parr(raw, 'events')) {
      try {
        const pg = parseEvent(ev, teamAbbr);
        if (!pg?.completed || !pg.result) continue;
        if (pg.result.opponentId !== opponentId) continue;
        matchups.push(pg.result);
      } catch {
        /* skip malformed event */
      }
    }
    season -= 1;
  }

  matchups.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  const top5 = matchups.slice(0, 5);
  void setCachedDetail(cacheKey, { ts: Date.now(), matchups: top5 });
  return { matchups: top5, seriesRecord };
}
