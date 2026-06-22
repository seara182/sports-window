// Orchestrates the per-team ESPN fetches into a RawBundle, then into TeamData.
// Each endpoint is fetched independently; a single failure degrades to
// undefined (the parsers tolerate it) rather than failing the whole refresh.
//
// Resilience precedence (live -> retry -> cache -> honest "old data" state):
// 1. Live fetch, retried with backoff on transient failure (tryFetchWithRetry).
// 2. Shape-validated: an ESPN response that comes back malformed is discarded
//    rather than trusted (ensureShape), same as a network failure.
// 3. DataProvider only overwrites the on-disk cache when a fetch is
//    "meaningful" (isMeaningful in DataProvider.tsx) — a bad fetch leaves the
//    last good cache in place.
// 4. The UI never blanks: it shows cache instantly on launch, then a "Stale"
//    badge once a failed refresh's cache exceeds 72h (isStale in lib/format.ts).
// There is no secondary NFL data source — ESPN's public API is the only free
// one available, and standing up a self-hosted proxy/mirror would require paid
// hosting, which is off the table for this project (see the roadmap's Phase 8
// cost constraints). This is an accepted, documented risk, not an oversight.

import type { SportKey, TeamData } from '../types/domain';
import { fetchJson } from './http';
import {
  looksLikeRoster,
  looksLikeSchedule,
  looksLikeStandings,
  looksLikeTeamHub,
  parseTeamData,
  type RawBundle,
} from './parsers';
import type { TeamConfig } from './teamConfig';
import { parr, pbool, pnum } from './safe';

const LEAGUE: Record<SportKey, string> = {
  nfl: 'football/nfl',
  mlb: 'baseball/mlb',
};

const SITE = 'https://site.api.espn.com/apis/site/v2/sports';
const CORE = 'https://site.api.espn.com/apis/v2/sports';
// The site.api.espn.com athlete-stats endpoint 404s; this common/v3 host
// serves the same kind of categories/statistics/totals payload and works.
const WEB = 'https://site.web.api.espn.com/apis/common/v3/sports';

const teamHubUrl = (c: TeamConfig) => `${SITE}/${c.league}/teams/${c.slug}`;
const rosterUrl = (c: TeamConfig) => `${SITE}/${c.league}/teams/${c.slug}/roster`;
const standingsUrl = (c: TeamConfig) => `${CORE}/${c.league}/standings`;
const scheduleUrl = (c: TeamConfig, season?: number) =>
  `${SITE}/${c.league}/teams/${c.slug}/schedule` + (season ? `?season=${season}` : '');
const summaryUrl = (sport: SportKey, gameId: string) =>
  `${SITE}/${LEAGUE[sport]}/summary?event=${gameId}`;
const athleteStatsUrl = (sport: SportKey, athleteId: string) =>
  `${WEB}/${LEAGUE[sport]}/athletes/${athleteId}/stats`;
const teamScheduleUrl = (sport: SportKey, slug: string, season?: number) =>
  `${SITE}/${LEAGUE[sport]}/teams/${slug}/schedule` + (season ? `?season=${season}` : '');
const PLAYOFF_SCOREBOARD_URL: Record<SportKey, string> = {
  nfl: 'https://site.api.espn.com/apis/v2/sports/football/nfl/scoreboard?groups=4&seasontype=3',
  mlb: 'https://site.api.espn.com/apis/v2/sports/baseball/mlb/scoreboard?seasontype=3',
};

/** Fetches a URL, swallowing errors into undefined and logging a warning. */
async function tryFetch(url: string): Promise<unknown | undefined> {
  try {
    return await fetchJson(url);
  } catch (err) {
    console.warn(`[espn] fetch failed: ${url}`, err);
    return undefined;
  }
}

const RETRIES = 3;
const RETRY_BASE_MS = 2000;

/**
 * Retries a failed fetch with exponential backoff (2s, 4s between attempts).
 * Handles transient network errors and brief ESPN hiccups so the user never
 * sees stale data for a blip. Intentionally NOT used for the athlete-stats
 * fan-out, which is lazy-loaded per player — retrying there would stall a
 * roster open when offline.
 */
async function tryFetchWithRetry(
  url: string,
  retries = RETRIES,
  delayMs = RETRY_BASE_MS,
): Promise<unknown | undefined> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const result = await tryFetch(url);
    if (result !== undefined) return result;
    if (attempt < retries - 1) {
      await new Promise((r) => setTimeout(r, delayMs * 2 ** attempt));
    }
  }
  return undefined;
}

/**
 * Discards a response whose top-level shape is implausible. Returns the
 * payload untouched when it passes, or `undefined` (same signal as a network
 * failure) when it doesn't — `isMeaningful()` then keeps the cache.
 */
function ensureShape(
  json: unknown | undefined,
  guard: (j: unknown) => boolean,
  url: string,
): unknown | undefined {
  if (json === undefined) return undefined;
  if (!guard(json)) {
    console.warn(`[espn] unexpected response shape, discarding: ${url}`);
    return undefined;
  }
  return json;
}

function countCompleted(schedule: unknown): number {
  let n = 0;
  for (const ev of parr(schedule, 'events')) {
    if (pbool(ev, 'competitions.0.status.type.completed') === true) n++;
  }
  return n;
}

function currentSeasonYear(schedule: unknown): number {
  return (
    pnum(schedule, 'requestedSeason.year') ??
    pnum(schedule, 'season.year') ??
    new Date().getFullYear()
  );
}

async function fetchTeamData(cfg: TeamConfig): Promise<TeamData> {
  // Primary endpoints get retry-with-backoff and a shape guard; a bad shape is
  // treated the same as a failed fetch so the cache survives.
  const [teamHub, currentSchedule, roster, standings] = await Promise.all([
    tryFetchWithRetry(teamHubUrl(cfg)).then((j) =>
      ensureShape(j, looksLikeTeamHub, teamHubUrl(cfg)),
    ),
    tryFetchWithRetry(scheduleUrl(cfg)).then((j) =>
      ensureShape(j, looksLikeSchedule, scheduleUrl(cfg)),
    ),
    tryFetchWithRetry(rosterUrl(cfg)).then((j) => ensureShape(j, looksLikeRoster, rosterUrl(cfg))),
    tryFetchWithRetry(standingsUrl(cfg)).then((j) =>
      ensureShape(j, looksLikeStandings, standingsUrl(cfg)),
    ),
  ]);

  const schedules: unknown[] = [];
  if (currentSchedule) schedules.push(currentSchedule);

  // During an offseason (or very early season) the current schedule has too
  // few finished games to fill the "recent results" strip, so pull last
  // season as well.
  if (countCompleted(currentSchedule) < 5) {
    const prev = currentSeasonYear(currentSchedule) - 1;
    const prevSchedule = await tryFetchWithRetry(scheduleUrl(cfg, prev)).then((j) =>
      ensureShape(j, looksLikeSchedule, scheduleUrl(cfg, prev)),
    );
    if (prevSchedule) schedules.push(prevSchedule);
  }

  const bundle: RawBundle = { teamHub, schedules, roster, standings };
  return parseTeamData(cfg, bundle);
}

/** Fetches one team's fresh data for the given (selected) team config. */
export function fetchTeam(cfg: TeamConfig): Promise<TeamData> {
  return fetchTeamData(cfg);
}

/** Fetches the ESPN box score / recap summary for a single completed game. */
export function fetchGameSummary(sport: SportKey, gameId: string): Promise<unknown> {
  return fetchJson(summaryUrl(sport, gameId));
}

/** Fetches a player's career + season stat categories. */
export function fetchAthleteStats(sport: SportKey, athleteId: string): Promise<unknown> {
  return fetchJson(athleteStatsUrl(sport, athleteId));
}

/** Fetches a team's schedule for a given season (used for head-to-head lookups). */
export function fetchTeamSchedule(
  sport: SportKey,
  slug: string,
  season?: number,
): Promise<unknown> {
  return fetchJson(teamScheduleUrl(sport, slug, season));
}

/** Fetches the postseason (seasontype=3) scoreboard for a sport. */
export function fetchPlayoffScoreboard(sport: SportKey): Promise<unknown> {
  return fetchJson(PLAYOFF_SCOREBOARD_URL[sport]);
}

/** ESPN CDN headshot URL for a given player. */
export function headshotUrl(sport: SportKey, athleteId: string): string {
  const league = sport === 'nfl' ? 'nfl' : 'mlb';
  return `https://a.espncdn.com/i/headshots/${league}/players/full/${athleteId}.png`;
}
