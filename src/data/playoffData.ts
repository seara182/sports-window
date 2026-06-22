// Types and parsing for the Playoff Bracket section. The ESPN scoreboard
// endpoint (seasontype=3) is a flat list of games, not a bracket — this
// module reshapes it into a fixed-slot bracket grid per sport, and falls
// back to an empty (TBD) skeleton when there is no postseason data yet.

import type { SportKey } from '../types/domain';
import { bool, parr, path, pnum, pobj, pstr } from './safe';

function pbool(root: unknown, p: string): boolean | undefined {
  return bool(path(root, p));
}

export type BracketSide = 'left' | 'right' | 'center';

export interface BracketTeam {
  abbr: string;
  name: string;
  seed?: number;
  score?: number;
  isUserTeam: boolean;
  eliminated: boolean;
}

export interface BracketSlot {
  round: number;
  side: BracketSide;
  index: number;
  top?: BracketTeam;
  bottom?: BracketTeam;
  completed: boolean;
}

export interface Bracket {
  sport: SportKey;
  /** Round labels, top to bottom (last entry is the final round). */
  rounds: string[];
  /** Label shown centered above the final slot, e.g. "SUPER BOWL". */
  finalLabel: string;
  slots: BracketSlot[];
}

interface RoundShape {
  label: string;
  left: number;
  right: number;
}

const NFL_ROUNDS: RoundShape[] = [
  { label: 'Wild Card', left: 3, right: 3 },
  { label: 'Divisional', left: 2, right: 2 },
  { label: 'Conference Championship', left: 1, right: 1 },
  { label: 'Super Bowl', left: 0, right: 0 },
];

const MLB_ROUNDS: RoundShape[] = [
  { label: 'Wild Card Series', left: 2, right: 2 },
  { label: 'Division Series', left: 2, right: 2 },
  { label: 'Championship Series', left: 1, right: 1 },
  { label: 'World Series', left: 0, right: 0 },
];

const ROUNDS: Record<SportKey, RoundShape[]> = { nfl: NFL_ROUNDS, mlb: MLB_ROUNDS };
const FINAL_LABEL: Record<SportKey, string> = { nfl: 'SUPER BOWL', mlb: 'WORLD SERIES' };

// Static league structure, used to place a game on the left/right side of
// the bracket. The "left" side is the user's team's conference/league.
const NFC: ReadonlySet<string> = new Set([
  'ARI',
  'ATL',
  'CAR',
  'CHI',
  'DAL',
  'DET',
  'GB',
  'LAR',
  'MIN',
  'NO',
  'NYG',
  'PHI',
  'SEA',
  'SF',
  'TB',
  'WSH',
]);
const NL: ReadonlySet<string> = new Set([
  'ARI',
  'ATL',
  'CHC',
  'CIN',
  'COL',
  'LAD',
  'MIA',
  'MIL',
  'NYM',
  'PHI',
  'PIT',
  'SD',
  'SF',
  'STL',
  'WSH',
]);

function leftSideAbbrs(sport: SportKey): ReadonlySet<string> {
  return sport === 'nfl' ? NFC : NL;
}

/** Builds an all-TBD bracket of the right shape for the given sport. */
export function emptyBracket(sport: SportKey): Bracket {
  const shapes = ROUNDS[sport];
  const slots: BracketSlot[] = [];
  shapes.forEach((shape, round) => {
    for (let i = 0; i < shape.left; i++)
      slots.push({ round, side: 'left', index: i, completed: false });
    for (let i = 0; i < shape.right; i++)
      slots.push({ round, side: 'right', index: i, completed: false });
    if (round === shapes.length - 1)
      slots.push({ round, side: 'center', index: 0, completed: false });
  });
  return { sport, rounds: shapes.map((s) => s.label), finalLabel: FINAL_LABEL[sport], slots };
}

function matchRound(
  sport: SportKey,
  headline: string | undefined,
  week: number | undefined,
): number {
  const text = (headline ?? '').toLowerCase();
  if (sport === 'nfl') {
    if (text.includes('super bowl')) return 3;
    if (text.includes('conference championship')) return 2;
    if (text.includes('divisional')) return 1;
    if (text.includes('wild card')) return 0;
    if (week === 5) return 3;
    if (week === 3) return 2;
    if (week === 2) return 1;
    if (week === 1) return 0;
    return -1;
  }
  if (text.includes('world series')) return 3;
  if (
    text.includes('championship series') ||
    text.includes('ncs') ||
    text.includes('alcs') ||
    text.includes('nlcs')
  )
    return 2;
  if (text.includes('division series') || text.includes('alds') || text.includes('nlds')) return 1;
  if (text.includes('wild card')) return 0;
  return -1;
}

function buildTeam(c: unknown, userAbbr: string, completed: boolean): BracketTeam {
  const abbr = pstr(c, 'team.abbreviation') ?? '?';
  return {
    abbr,
    name: pstr(c, 'team.shortDisplayName') ?? pstr(c, 'team.displayName') ?? abbr,
    seed: pnum(c, 'curatedRank.current'),
    score: completed ? pnum(c, 'score') : undefined,
    isUserTeam: abbr === userAbbr,
    eliminated: completed && pbool(c, 'winner') === false,
  };
}

/**
 * Reshapes the seasontype=3 scoreboard response into a Bracket. Returns
 * null when there is no postseason data yet (the normal/offseason case).
 * Throws if the response has games but none can be placed into the bracket
 * shape — callers should fall back to the empty skeleton + an error note.
 */
export function parseScoreboardToBracket(
  sport: SportKey,
  raw: unknown,
  userAbbr: string,
): Bracket | null {
  const events = parr(raw, 'events');
  if (events.length === 0) return null;

  const bracket = emptyBracket(sport);
  const leftAbbrs = leftSideAbbrs(sport);
  let placed = 0;

  for (const event of events) {
    const comp = pobj(event, 'competitions.0');
    const competitors = parr(comp, 'competitors');
    if (competitors.length < 2) continue;

    const completed = pbool(comp, 'status.type.completed') === true;
    const headline = pstr(event, 'notes.0.headline') ?? pstr(comp, 'notes.0.headline');
    const week = pnum(event, 'week.number');
    const round = matchRound(sport, headline, week);
    if (round < 0) continue;

    const [a, b] = competitors;
    const aAbbr = pstr(a, 'team.abbreviation') ?? '';
    const side: BracketSide =
      round === bracket.rounds.length - 1 ? 'center' : leftAbbrs.has(aAbbr) ? 'left' : 'right';

    const candidates = bracket.slots.filter(
      (s) => s.round === round && s.side === side && s.top === undefined,
    );
    const slot = candidates[0];
    if (!slot) continue;

    slot.top = buildTeam(a, userAbbr, completed);
    slot.bottom = buildTeam(b, userAbbr, completed);
    slot.completed = completed;
    placed++;
  }

  if (placed === 0) throw new Error('playoff bracket: no events matched a known round');
  return bracket;
}
