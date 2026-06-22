// Defensive parsers: raw ESPN JSON -> normalized domain objects.
// Rules: never throw, tolerate missing fields, and keep each endpoint's
// parse isolated so one broken response cannot blank the whole app.

import type {
  GameResult,
  Player,
  RosterGroup,
  Standings,
  StandingsRow,
  TeamColors,
  TeamData,
  TeamSummary,
  UpcomingGame,
  VenueInfo,
} from '../types/domain';
import type { TeamConfig } from './teamConfig';
import { VENUE_DATA } from './venueData';
import { arr, num, obj, parr, pnum, pobj, pstr, score, str } from './safe';

/** All raw responses needed to build one team's view. */
export interface RawBundle {
  teamHub: unknown;
  /** One or more schedule responses (current season, optionally previous). */
  schedules: unknown[];
  roster: unknown;
  standings: unknown;
}

// ---------------------------------------------------------------------------
// Response-shape guards.
// ESPN can change a response shape rather than failing outright — e.g. return
// an error envelope or a restructured payload. The full parsers tolerate that
// by rendering "—", which silently masks corruption. These lightweight guards
// catch a *completely* wrong top-level shape so the caller can discard it and
// keep the last good cached data instead. They check only the one or two
// top-level keys each parser actually depends on; they do not validate
// nested fields.
// ---------------------------------------------------------------------------

function isPlainObject(json: unknown): json is Record<string, unknown> {
  return typeof json === 'object' && json !== null && !Array.isArray(json);
}

/** Team hub: parseSummary/parseTeamData read `team.*`. */
export function looksLikeTeamHub(json: unknown): boolean {
  return isPlainObject(json) && 'team' in json;
}

/** Schedule: parseGames iterates `events`. */
export function looksLikeSchedule(json: unknown): boolean {
  return isPlainObject(json) && 'events' in json;
}

/** Roster: parseRoster iterates `athletes`. */
export function looksLikeRoster(json: unknown): boolean {
  return isPlainObject(json) && 'athletes' in json;
}

/** Standings: collectEntries walks `standings.entries` and `children`. */
export function looksLikeStandings(json: unknown): boolean {
  return isPlainObject(json) && ('standings' in json || 'children' in json);
}

const normGroup = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '');

/** Pulls the first usable logo href from a team object. */
function teamLogo(team: Record<string, unknown>): string | undefined {
  const logos = arr(team.logos);
  for (const l of logos) {
    const href = pstr(l, 'href');
    if (href) return href;
  }
  return pstr(team, 'logo');
}

export interface ParsedGame {
  completed: boolean;
  state: string;
  result?: GameResult;
  upcoming?: UpcomingGame;
  sortMs: number;
}

export function parseEvent(ev: unknown, teamAbbr: string): ParsedGame | null {
  const id = pstr(ev, 'id') ?? '';
  const date = pstr(ev, 'date') ?? '';
  const comp = pobj(ev, 'competitions.0');
  const status = pobj(comp, 'status.type');
  const completed = status.completed === true;
  const state = pstr(status, 'state') ?? (completed ? 'post' : 'pre');

  const competitors = parr(comp, 'competitors');
  if (competitors.length < 2) return null;

  let mine: Record<string, unknown> | undefined;
  let opp: Record<string, unknown> | undefined;
  for (const c of competitors) {
    const ab = pstr(c, 'team.abbreviation');
    if (ab === teamAbbr && !mine) mine = obj(c);
    else opp = obj(c);
  }
  // Fall back if our abbreviation was not found (defensive).
  if (!mine) {
    mine = obj(competitors[0]);
    opp = obj(competitors[1]);
  }
  if (!opp) opp = obj(competitors[1]);

  const oppTeam = obj(opp.team);
  const opponentId = str(oppTeam.id);
  const opponentAbbr = str(oppTeam.abbreviation) ?? '—';
  const opponentName =
    str(oppTeam.displayName) ?? str(oppTeam.shortDisplayName) ?? str(oppTeam.name) ?? '—';
  const opponentLogo = teamLogo(oppTeam);
  const homeAway = pstr(mine, 'homeAway') === 'home' ? 'home' : 'away';
  const venue = pstr(comp, 'venue.fullName');
  const weekText = pstr(ev, 'week.text');

  const sortMs = Date.parse(date) || 0;

  if (completed) {
    const teamScore = score(mine.score);
    const opponentScore = score(opp.score);
    let outcome: GameResult['outcome'];
    if (mine.winner === true) outcome = 'W';
    else if (opp.winner === true) outcome = 'L';
    else if (teamScore != null && opponentScore != null) {
      outcome = teamScore > opponentScore ? 'W' : teamScore < opponentScore ? 'L' : 'T';
    }
    const result: GameResult = {
      id,
      date,
      opponentAbbr,
      opponentName,
      opponentLogo,
      opponentId,
      homeAway,
      teamScore,
      opponentScore,
      outcome,
      venue,
      weekText,
    };
    return { completed, state, result, sortMs };
  }

  const broadcasts = parr(comp, 'broadcasts');
  let broadcast: string | undefined;
  for (const b of broadcasts) {
    broadcast =
      pstr(b, 'media.shortName') ?? pstr(b, 'names.0') ?? pstr(b, 'shortName') ?? pstr(b, 'name');
    if (broadcast) break;
  }
  const addr = pobj(comp, 'venue.address');
  const venueCity =
    [str(addr.city), str(addr.state) ?? str(addr.country)].filter(Boolean).join(', ') || undefined;

  const upcoming: UpcomingGame = {
    id,
    date,
    timeTbd: ev != null && (ev as Record<string, unknown>).timeValid === false,
    opponentAbbr,
    opponentName,
    opponentLogo,
    opponentId,
    homeAway,
    venue,
    venueCity,
    broadcast,
    weekText,
  };
  return { completed, state, upcoming, sortMs };
}

/** Merges every schedule response into recent results + upcoming games. */
export function parseGames(
  schedules: unknown[],
  teamAbbr: string,
): {
  recentResults: GameResult[];
  upcomingGames: UpcomingGame[];
} {
  const seen = new Set<string>();
  const parsed: ParsedGame[] = [];
  for (const sched of schedules) {
    for (const ev of parr(sched, 'events')) {
      try {
        const id = pstr(ev, 'id');
        if (id && seen.has(id)) continue;
        const pg = parseEvent(ev, teamAbbr);
        if (!pg) continue;
        if (id) seen.add(id);
        parsed.push(pg);
      } catch {
        /* skip a single malformed event */
      }
    }
  }

  const now = Date.now();
  const recentResults = parsed
    .filter((p) => p.completed && p.result)
    .sort((a, b) => b.sortMs - a.sortMs)
    .slice(0, 5)
    .map((p) => p.result!);

  const upcomingGames = parsed
    .filter(
      (p) => !p.completed && p.upcoming && (p.sortMs === 0 || p.sortMs >= now - 6 * 3600 * 1000),
    )
    .sort((a, b) => a.sortMs - b.sortMs)
    .map((p) => p.upcoming!);

  return { recentResults, upcomingGames };
}

/** Recursively collects standings entries from the children tree. */
function collectEntries(node: unknown, out: unknown[]): void {
  const entries = parr(node, 'standings.entries');
  for (const e of entries) out.push(e);
  for (const child of parr(node, 'children')) collectEntries(child, out);
}

interface DivisionGroup {
  name?: string;
  entries: unknown[];
}

/** Flattens the standings tree into its leaf division groups (nodes that carry
 *  their own `standings.entries`), preserving each group's display name. */
function collectGroups(node: unknown, out: DivisionGroup[]): void {
  const entries = parr(node, 'standings.entries');
  if (entries.length) {
    const name =
      pstr(node, 'name') ?? pstr(node, 'displayName') ?? pstr(node, 'shortName') ?? undefined;
    out.push({ name, entries });
  }
  for (const child of parr(node, 'children')) collectGroups(child, out);
}

function groupContainsTeam(
  g: DivisionGroup,
  teamAbbr: string,
  teamId: string | undefined,
): boolean {
  for (const e of g.entries) {
    const team = pobj(e, 'team');
    if ((teamId && str(team.id) === teamId) || str(team.abbreviation) === teamAbbr) return true;
  }
  return false;
}

/** Finds the division group containing the user's team, matched by ESPN team id
 *  (authoritative) or abbreviation. The standings tree often nests divisions
 *  inside conference nodes that *also* carry every conference team, so prefer
 *  the smallest matching group (the division, not the whole conference). */
function findDivision(
  raw: unknown,
  teamAbbr: string,
  teamId: string | undefined,
): DivisionGroup | undefined {
  const groups: DivisionGroup[] = [];
  try {
    collectGroups(raw, groups);
  } catch {
    return undefined;
  }
  let best: DivisionGroup | undefined;
  for (const g of groups) {
    // ESPN's standings feed usually only nests to the conference/league level
    // (15-16 teams) with no per-division node; a real division has at most a
    // handful of teams. Ignore conference-sized groups so the caller falls back
    // to the hardcoded division roster.
    if (g.entries.length > 6) continue;
    if (!groupContainsTeam(g, teamAbbr, teamId)) continue;
    if (!best || g.entries.length < best.entries.length) best = g;
  }
  return best;
}

/** Formats a division games-back value: 0 -> "—", 1.5 -> "1.5", 2 -> "2". */
function formatGamesBack(gb: number): string {
  if (gb <= 0) return '—';
  const r = Math.round(gb * 2) / 2;
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
}

interface StandRow extends StandingsRow {
  _winPct: number;
  _wins: number;
  _losses: number;
}

export function parseStandings(
  raw: unknown,
  cfg: TeamConfig,
  teamAbbr: string = cfg.abbr,
  teamId?: string,
): Standings {
  const rows: StandRow[] = [];

  // Prefer the division the user's team actually sits in (works for any team);
  // fall back to the hardcoded division abbreviations from the config.
  const division = findDivision(raw, teamAbbr, teamId);
  let divisionName = cfg.divisionName;
  let entries: unknown[];
  let allow: Set<string> | null = null;
  if (division) {
    entries = division.entries;
    if (division.name) divisionName = division.name;
  } else {
    entries = [];
    try {
      collectEntries(raw, entries);
    } catch {
      /* leave entries empty */
    }
    allow = new Set(cfg.divisionAbbrs);
  }

  for (const e of entries) {
    try {
      const team = pobj(e, 'team');
      const abbr = str(team.abbreviation) ?? '';
      if (allow && !allow.has(abbr)) continue;

      const display: Record<string, string> = {};
      let winPct = 0;
      let wins = 0;
      let losses = 0;
      for (const stat of parr(e, 'stats')) {
        const name = pstr(stat, 'name');
        if (!name) continue;
        const dv = pstr(stat, 'displayValue');
        if (dv != null) display[name] = dv;
        if (name === 'winPercent') winPct = pnum(stat, 'value') ?? 0;
        if (name === 'wins') wins = pnum(stat, 'value') ?? 0;
        if (name === 'losses') losses = pnum(stat, 'value') ?? 0;
      }

      rows.push({
        teamId: str(team.id) ?? abbr,
        abbr,
        name: str(team.displayName) ?? str(team.shortDisplayName) ?? abbr,
        logo: teamLogo(team),
        isUserTeam: (teamId != null && str(team.id) === teamId) || abbr === teamAbbr,
        stats: display,
        _winPct: winPct,
        _wins: wins,
        _losses: losses,
      });
    } catch {
      /* skip a single malformed entry */
    }
  }

  rows.sort((a, b) => b._winPct - a._winPct || b._wins - a._wins);

  // ESPN's gamesBehind in the league-wide feed is relative to the whole
  // league, not the division. Recompute it against the division leader so the
  // leader reads "—" and the rest are correct.
  const leader = rows[0];
  if (leader) {
    for (const r of rows) {
      const gb = (leader._wins - r._wins + (r._losses - leader._losses)) / 2;
      r.stats['gamesBehind'] = formatGamesBack(gb);
    }
  }

  return {
    divisionName,
    columns: cfg.standingsColumns,
    rows: rows.map(({ _winPct, _wins, _losses, ...r }) => r),
  };
}

function groupLabel(rawKey: string, cfg: TeamConfig): string {
  const norm = normGroup(rawKey);
  for (const g of cfg.rosterGroups) {
    if (norm.includes(g.match) || g.match.includes(norm)) return g.label;
  }
  // Humanize an unknown key, e.g. "practiceSquad" -> "Practice Squad".
  return rawKey.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^\w/, (c) => c.toUpperCase());
}

export function parseRoster(raw: unknown, cfg: TeamConfig): RosterGroup[] {
  const groups: RosterGroup[] = [];
  for (const grp of parr(raw, 'athletes')) {
    try {
      const rawKey = pstr(grp, 'position') ?? '';
      const label = groupLabel(rawKey, cfg);
      const players: Player[] = [];
      for (const it of parr(grp, 'items')) {
        const id = pstr(it, 'id');
        if (!id) continue;
        const injuries = parr(it, 'injuries');
        const birthCity = pstr(it, 'birthPlace.city');
        const birthRegion = pstr(it, 'birthPlace.state') ?? pstr(it, 'birthPlace.country');
        players.push({
          id,
          name: pstr(it, 'fullName') ?? pstr(it, 'displayName') ?? '—',
          jersey: pstr(it, 'jersey'),
          positionAbbr: pstr(it, 'position.abbreviation') ?? '—',
          positionName: pstr(it, 'position.displayName') ?? pstr(it, 'position.name') ?? '',
          age: pnum(it, 'age'),
          heightDisplay: pstr(it, 'displayHeight'),
          heightInches: pnum(it, 'height'),
          weightDisplay: pstr(it, 'displayWeight'),
          weightLbs: pnum(it, 'weight'),
          headshot: pstr(it, 'headshot.href'),
          bats: pstr(it, 'bats.abbreviation'),
          throws: pstr(it, 'throws.abbreviation'),
          injuryStatus: injuries.length ? pstr(injuries[0], 'status') : undefined,
          dateOfBirth: pstr(it, 'dateOfBirth'),
          birthPlace: [birthCity, birthRegion].filter(Boolean).join(', ') || undefined,
          college: pstr(it, 'college.shortName') ?? pstr(it, 'college.name'),
          experienceYears: pnum(it, 'experience.years'),
          status: pstr(it, 'status.name'),
        });
      }
      if (!players.length) continue;
      players.sort((a, b) => {
        const ja = num(a.jersey);
        const jb = num(b.jersey);
        if (ja != null && jb != null) return ja - jb;
        if (ja != null) return -1;
        if (jb != null) return 1;
        return a.name.localeCompare(b.name);
      });
      groups.push({ label, players });
    } catch {
      /* skip a malformed group */
    }
  }

  // Order groups by the config's declared order; unknowns go last.
  const order = cfg.rosterGroups.map((g) => g.label);
  groups.sort((a, b) => {
    const ia = order.indexOf(a.label);
    const ib = order.indexOf(b.label);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });
  return groups;
}

function parseSummary(teamHub: unknown, userRow: StandingsRow | undefined): TeamSummary {
  const record = userRow?.stats['overall'] ?? '—';
  const streak = userRow?.stats['streak'] ?? '—';
  const divisionRank = pstr(teamHub, 'team.standingSummary') ?? '—';
  return { record, divisionRank, streak };
}

/** Normalizes ESPN's color (a bare 6-hex string) into a "#rrggbb" CSS value. */
function normHex(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const h = raw.trim().replace(/^#/, '');
  return /^[0-9a-fA-F]{6}$/.test(h) ? `#${h.toLowerCase()}` : undefined;
}

function parseColors(teamHub: unknown): TeamColors | undefined {
  const primary = normHex(pstr(teamHub, 'team.color'));
  const alternate = normHex(pstr(teamHub, 'team.alternateColor'));
  if (!primary && !alternate) return undefined;
  return { primary, alternate };
}

/** Builds venue facts from the live team-hub payload for non-bespoke teams.
 *  Bespoke (SF) teams use the curated VENUE_DATA instead. */
function parseVenue(teamHub: unknown): VenueInfo | undefined {
  const v = pobj(teamHub, 'team.franchise.venue');
  const venue = Object.keys(v).length ? v : pobj(teamHub, 'team.venue');
  const name = pstr(venue, 'fullName');
  if (!name) return undefined;

  const stats: VenueInfo['stats'] = [];
  const capacity = pnum(venue, 'capacity');
  if (capacity) stats.push({ label: 'Capacity', value: capacity.toLocaleString('en-US') });
  const grass = (venue as Record<string, unknown>).grass;
  if (typeof grass === 'boolean') {
    stats.push({ label: 'Surface', value: grass ? 'Natural grass' : 'Artificial turf' });
  }
  const indoor = (venue as Record<string, unknown>).indoor;
  if (typeof indoor === 'boolean') {
    stats.push({ label: 'Roof', value: indoor ? 'Indoor' : 'Open-air' });
  }
  const city = pstr(venue, 'address.city');
  const region = pstr(venue, 'address.state') ?? pstr(venue, 'address.country');
  const location = [city, region].filter(Boolean).join(', ');
  if (location) stats.push({ label: 'Location', value: location });

  return { name, stats, funFacts: [] };
}

export function parseTeamData(cfg: TeamConfig, bundle: RawBundle): TeamData {
  // The team-hub payload carries the authoritative abbreviation + id; fall back
  // to the static config on a cold/garbage response.
  const teamId = pstr(bundle.teamHub, 'team.id');
  const teamAbbr = pstr(bundle.teamHub, 'team.abbreviation') ?? cfg.abbr;
  const displayName = pstr(bundle.teamHub, 'team.displayName') ?? cfg.displayName;
  const shortName =
    pstr(bundle.teamHub, 'team.shortDisplayName') ??
    pstr(bundle.teamHub, 'team.name') ??
    cfg.shortName;

  let standings: Standings = {
    divisionName: cfg.divisionName,
    columns: cfg.standingsColumns,
    rows: [],
  };
  try {
    standings = parseStandings(bundle.standings, cfg, teamAbbr, teamId);
  } catch {
    /* keep empty standings */
  }

  let recentResults: GameResult[] = [];
  let upcomingGames: UpcomingGame[] = [];
  try {
    const g = parseGames(bundle.schedules, teamAbbr);
    recentResults = g.recentResults;
    upcomingGames = g.upcomingGames;
  } catch {
    /* keep empty games */
  }

  let roster: RosterGroup[] = [];
  try {
    roster = parseRoster(bundle.roster, cfg);
  } catch {
    /* keep empty roster */
  }

  const userRow = standings.rows.find((r) => r.isUserTeam);
  const summary = parseSummary(bundle.teamHub, userRow);
  const colors = cfg.bespoke ? undefined : parseColors(bundle.teamHub);
  const venue = cfg.bespoke ? VENUE_DATA[cfg.sport] : parseVenue(bundle.teamHub);

  return {
    sport: cfg.sport,
    teamId,
    configId: cfg.id,
    teamAbbr,
    displayName,
    shortName,
    slug: cfg.slug,
    bespoke: cfg.bespoke,
    colors,
    venue,
    summary,
    hero: {
      upcoming: upcomingGames[0],
      lastResult: recentResults[0],
    },
    recentResults,
    upcomingGames,
    standings,
    roster,
  };
}
