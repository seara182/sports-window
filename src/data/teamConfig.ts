import type { SportKey, StandColumn } from '../types/domain';

export interface TeamConfig {
  sport: SportKey;
  /** Unique id within the app, e.g. "nfl-sf". Used as the persisted selection key. */
  id: string;
  /**
   * Legacy short key. For the two hand-tuned San Francisco teams this stays
   * "niners" / "giants"; for every other team it equals `id`.
   */
  key: string;
  displayName: string;
  shortName: string;
  /**
   * Best-known ESPN abbreviation. The authoritative abbreviation is read from
   * the live team-hub payload at parse time — this is only the cold-start
   * fallback and the seed for division filtering.
   */
  abbr: string;
  /** ESPN path segment, e.g. "football/nfl". */
  league: string;
  /** ESPN team slug used in team/schedule/roster URLs. */
  slug: string;
  divisionName: string;
  /** Abbreviations of every team in the division, used to filter standings. */
  divisionAbbrs: string[];
  /** CSS gradient stops for the hero accent (cold-start / bespoke fallback). */
  gradient: [string, string];
  /** Stat columns shown in the standings table, in order. */
  standingsColumns: StandColumn[];
  /**
   * Maps an ESPN roster group key to a display label and sort order.
   * Groups not listed here fall through with a humanized label.
   */
  rosterGroups: { match: string; label: string }[];
  /**
   * True only for the two hand-tuned San Francisco teams. Bespoke teams keep
   * their hand-picked palette (the easter egg) and render the curated History
   * section, all-time head-to-head series records, and rich venue fun facts.
   * Every other team derives its accent from ESPN's colors and hides those
   * SF-specific sections.
   */
  bespoke: boolean;
}

// ESPN standings stat objects are keyed by their `name` field. The split
// records (Home/Road/division/etc.) use spaced names exactly as below.
const NFL_COLUMNS: StandColumn[] = [
  { key: 'wins', header: 'W', term: 'wins' },
  { key: 'losses', header: 'L', term: 'losses' },
  { key: 'ties', header: 'T', term: 'ties' },
  { key: 'winPercent', header: 'PCT', term: 'pct' },
  { key: 'pointsFor', header: 'PF', term: 'pointsFor' },
  { key: 'pointsAgainst', header: 'PA', term: 'pointsAgainst' },
  { key: 'pointDifferential', header: 'DIFF', term: 'pointDiff' },
  { key: 'Home', header: 'HOME', term: 'homeRecord' },
  { key: 'Road', header: 'AWAY', term: 'awayRecord' },
  { key: 'vs. Div.', header: 'DIV', term: 'divRecord' },
  { key: 'vs. Conf.', header: 'CONF', term: 'confRecord' },
  { key: 'streak', header: 'STRK', term: 'streak' },
];

const MLB_COLUMNS: StandColumn[] = [
  { key: 'wins', header: 'W', term: 'winsMlb' },
  { key: 'losses', header: 'L', term: 'lossesMlb' },
  { key: 'winPercent', header: 'PCT', term: 'pctMlb' },
  { key: 'gamesBehind', header: 'GB', term: 'gamesBack' },
  { key: 'pointDifferential', header: 'RDIFF', term: 'runDiff' },
  { key: 'Home', header: 'HOME', term: 'homeRecord' },
  { key: 'Road', header: 'AWAY', term: 'awayRecord' },
  { key: 'Last Ten Games', header: 'L10', term: 'lastTen' },
  { key: 'streak', header: 'STRK', term: 'streakMlb' },
];

const NFL_ROSTER_GROUPS = [
  { match: 'offense', label: 'Offense' },
  { match: 'defense', label: 'Defense' },
  { match: 'specialteam', label: 'Special Teams' },
  { match: 'injuredreserveorout', label: 'Injured Reserve' },
  { match: 'suspended', label: 'Suspended' },
  { match: 'practicesquad', label: 'Practice Squad' },
];

const MLB_ROSTER_GROUPS = [
  { match: 'pitcher', label: 'Pitchers' },
  { match: 'catcher', label: 'Catchers' },
  { match: 'infielder', label: 'Infield' },
  { match: 'outfielder', label: 'Outfield' },
  { match: 'designatedhitter', label: 'Designated Hitter' },
];

/** Neutral slate gradient used as a cold-start fallback for non-bespoke teams;
 *  the live ESPN colors override the accent at runtime (see ThemeProvider). */
const NEUTRAL_GRADIENT: [string, string] = ['#3a3f4b', '#5a6170'];

// --- The two hand-tuned San Francisco teams (bespoke easter-egg palettes) ---

export const NINERS: TeamConfig = {
  sport: 'nfl',
  id: 'nfl-sf',
  key: 'niners',
  displayName: 'San Francisco 49ers',
  shortName: '49ers',
  abbr: 'SF',
  league: 'football/nfl',
  slug: 'sf',
  divisionName: 'NFC West',
  divisionAbbrs: ['SF', 'SEA', 'LAR', 'ARI'],
  gradient: ['#AA0000', '#B3995D'],
  standingsColumns: NFL_COLUMNS,
  rosterGroups: NFL_ROSTER_GROUPS,
  bespoke: true,
};

export const GIANTS: TeamConfig = {
  sport: 'mlb',
  id: 'mlb-sf',
  key: 'giants',
  displayName: 'San Francisco Giants',
  shortName: 'Giants',
  abbr: 'SF',
  league: 'baseball/mlb',
  slug: 'sf',
  divisionName: 'NL West',
  divisionAbbrs: ['SF', 'LAD', 'SD', 'ARI', 'COL'],
  gradient: ['#FD5A1E', '#FDB827'],
  standingsColumns: MLB_COLUMNS,
  rosterGroups: MLB_ROSTER_GROUPS,
  bespoke: true,
};

// --- The full league registry -------------------------------------------------
// Per-team data is deliberately minimal: identifiers + division. Everything
// that rarely changes (colors, logos) is read for free from the team-hub /
// standings payloads we already fetch, so adding a team never adds ESPN calls.
// `[abbr, slug, displayName, shortName]` rows, grouped by division.

type TeamRow = [abbr: string, slug: string, displayName: string, shortName: string];

const NFL_DIVISIONS: Record<string, TeamRow[]> = {
  'AFC East': [
    ['BUF', 'buf', 'Buffalo Bills', 'Bills'],
    ['MIA', 'mia', 'Miami Dolphins', 'Dolphins'],
    ['NE', 'ne', 'New England Patriots', 'Patriots'],
    ['NYJ', 'nyj', 'New York Jets', 'Jets'],
  ],
  'AFC North': [
    ['BAL', 'bal', 'Baltimore Ravens', 'Ravens'],
    ['CIN', 'cin', 'Cincinnati Bengals', 'Bengals'],
    ['CLE', 'cle', 'Cleveland Browns', 'Browns'],
    ['PIT', 'pit', 'Pittsburgh Steelers', 'Steelers'],
  ],
  'AFC South': [
    ['HOU', 'hou', 'Houston Texans', 'Texans'],
    ['IND', 'ind', 'Indianapolis Colts', 'Colts'],
    ['JAX', 'jax', 'Jacksonville Jaguars', 'Jaguars'],
    ['TEN', 'ten', 'Tennessee Titans', 'Titans'],
  ],
  'AFC West': [
    ['DEN', 'den', 'Denver Broncos', 'Broncos'],
    ['KC', 'kc', 'Kansas City Chiefs', 'Chiefs'],
    ['LV', 'lv', 'Las Vegas Raiders', 'Raiders'],
    ['LAC', 'lac', 'Los Angeles Chargers', 'Chargers'],
  ],
  'NFC East': [
    ['DAL', 'dal', 'Dallas Cowboys', 'Cowboys'],
    ['NYG', 'nyg', 'New York Giants', 'Giants'],
    ['PHI', 'phi', 'Philadelphia Eagles', 'Eagles'],
    ['WSH', 'wsh', 'Washington Commanders', 'Commanders'],
  ],
  'NFC North': [
    ['CHI', 'chi', 'Chicago Bears', 'Bears'],
    ['DET', 'det', 'Detroit Lions', 'Lions'],
    ['GB', 'gb', 'Green Bay Packers', 'Packers'],
    ['MIN', 'min', 'Minnesota Vikings', 'Vikings'],
  ],
  'NFC South': [
    ['ATL', 'atl', 'Atlanta Falcons', 'Falcons'],
    ['CAR', 'car', 'Carolina Panthers', 'Panthers'],
    ['NO', 'no', 'New Orleans Saints', 'Saints'],
    ['TB', 'tb', 'Tampa Bay Buccaneers', 'Buccaneers'],
  ],
  'NFC West': [
    ['ARI', 'ari', 'Arizona Cardinals', 'Cardinals'],
    ['LAR', 'lar', 'Los Angeles Rams', 'Rams'],
    ['SF', 'sf', 'San Francisco 49ers', '49ers'],
    ['SEA', 'sea', 'Seattle Seahawks', 'Seahawks'],
  ],
};

const MLB_DIVISIONS: Record<string, TeamRow[]> = {
  'AL East': [
    ['BAL', 'bal', 'Baltimore Orioles', 'Orioles'],
    ['BOS', 'bos', 'Boston Red Sox', 'Red Sox'],
    ['NYY', 'nyy', 'New York Yankees', 'Yankees'],
    ['TB', 'tb', 'Tampa Bay Rays', 'Rays'],
    ['TOR', 'tor', 'Toronto Blue Jays', 'Blue Jays'],
  ],
  'AL Central': [
    ['CHW', 'chw', 'Chicago White Sox', 'White Sox'],
    ['CLE', 'cle', 'Cleveland Guardians', 'Guardians'],
    ['DET', 'det', 'Detroit Tigers', 'Tigers'],
    ['KC', 'kc', 'Kansas City Royals', 'Royals'],
    ['MIN', 'min', 'Minnesota Twins', 'Twins'],
  ],
  'AL West': [
    ['HOU', 'hou', 'Houston Astros', 'Astros'],
    ['LAA', 'laa', 'Los Angeles Angels', 'Angels'],
    ['ATH', 'oak', 'Athletics', 'Athletics'],
    ['SEA', 'sea', 'Seattle Mariners', 'Mariners'],
    ['TEX', 'tex', 'Texas Rangers', 'Rangers'],
  ],
  'NL East': [
    ['ATL', 'atl', 'Atlanta Braves', 'Braves'],
    ['MIA', 'mia', 'Miami Marlins', 'Marlins'],
    ['NYM', 'nym', 'New York Mets', 'Mets'],
    ['PHI', 'phi', 'Philadelphia Phillies', 'Phillies'],
    ['WSH', 'wsh', 'Washington Nationals', 'Nationals'],
  ],
  'NL Central': [
    ['CHC', 'chc', 'Chicago Cubs', 'Cubs'],
    ['CIN', 'cin', 'Cincinnati Reds', 'Reds'],
    ['MIL', 'mil', 'Milwaukee Brewers', 'Brewers'],
    ['PIT', 'pit', 'Pittsburgh Pirates', 'Pirates'],
    ['STL', 'stl', 'St. Louis Cardinals', 'Cardinals'],
  ],
  'NL West': [
    ['ARI', 'ari', 'Arizona Diamondbacks', 'D-backs'],
    ['COL', 'col', 'Colorado Rockies', 'Rockies'],
    ['LAD', 'lad', 'Los Angeles Dodgers', 'Dodgers'],
    ['SD', 'sd', 'San Diego Padres', 'Padres'],
    ['SF', 'sf', 'San Francisco Giants', 'Giants'],
  ],
};

function buildLeague(
  sport: SportKey,
  league: string,
  divisions: Record<string, TeamRow[]>,
  columns: StandColumn[],
  rosterGroups: { match: string; label: string }[],
  bespoke: Record<string, TeamConfig>,
): TeamConfig[] {
  const out: TeamConfig[] = [];
  for (const [divisionName, rows] of Object.entries(divisions)) {
    const divisionAbbrs = rows.map((r) => r[0]);
    for (const [abbr, slug, displayName, shortName] of rows) {
      const id = `${sport}-${slug}`;
      // Keep the two hand-tuned SF configs verbatim (palette + bespoke flag).
      if (bespoke[id]) {
        out.push(bespoke[id]);
        continue;
      }
      out.push({
        sport,
        id,
        key: id,
        displayName,
        shortName,
        abbr,
        league,
        slug,
        divisionName,
        divisionAbbrs,
        gradient: NEUTRAL_GRADIENT,
        standingsColumns: columns,
        rosterGroups,
        bespoke: false,
      });
    }
  }
  out.sort((a, b) => a.displayName.localeCompare(b.displayName));
  return out;
}

export const NFL_TEAMS: TeamConfig[] = buildLeague(
  'nfl',
  'football/nfl',
  NFL_DIVISIONS,
  NFL_COLUMNS,
  NFL_ROSTER_GROUPS,
  { 'nfl-sf': NINERS },
);

export const MLB_TEAMS: TeamConfig[] = buildLeague(
  'mlb',
  'baseball/mlb',
  MLB_DIVISIONS,
  MLB_COLUMNS,
  MLB_ROSTER_GROUPS,
  { 'mlb-sf': GIANTS },
);

export const TEAMS_BY_SPORT: Record<SportKey, TeamConfig[]> = {
  nfl: NFL_TEAMS,
  mlb: MLB_TEAMS,
};

const TEAM_BY_ID: Record<string, TeamConfig> = {};
for (const t of [...NFL_TEAMS, ...MLB_TEAMS]) TEAM_BY_ID[t.id] = t;

/** The default (San Francisco) team for each sport. */
export const DEFAULT_TEAM: Record<SportKey, TeamConfig> = {
  nfl: NINERS,
  mlb: GIANTS,
};

/** Resolves a persisted team id to its config, falling back to the SF default. */
export function teamById(sport: SportKey, id: string | undefined): TeamConfig {
  return (id && TEAM_BY_ID[id]) || DEFAULT_TEAM[sport];
}

/**
 * Back-compat: the SF defaults keyed by sport. Demo Mode and the headless
 * parser scripts use this; live code resolves the *selected* team instead.
 */
export const TEAM_CONFIGS: Record<SportKey, TeamConfig> = {
  nfl: NINERS,
  mlb: GIANTS,
};
