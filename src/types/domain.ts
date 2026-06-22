// Normalized domain model. Both NFL and MLB raw ESPN responses are mapped
// into these shapes so the UI never has to know which sport it is rendering.

export type SportKey = 'nfl' | 'mlb';

export interface TeamSummary {
  /** e.g. "14-3" (NFL) or "40-25" (MLB). "—" when unknown. */
  record: string;
  /** ESPN's standingSummary text, e.g. "2nd in NFC West". "—" when unknown. */
  divisionRank: string;
  /** e.g. "W3" / "L1". "—" when unknown. */
  streak: string;
}

export type GameOutcome = 'W' | 'L' | 'T';

export interface GameResult {
  id: string;
  /** ISO timestamp in UTC, as ESPN returns it. */
  date: string;
  opponentAbbr: string;
  opponentName: string;
  opponentLogo?: string;
  /** ESPN team id of the opponent, used for head-to-head lookups. */
  opponentId?: string;
  homeAway: 'home' | 'away';
  teamScore?: number;
  opponentScore?: number;
  outcome?: GameOutcome;
  venue?: string;
  /** NFL only: "Week 1", "Wild Card", etc. */
  weekText?: string;
}

export interface UpcomingGame {
  id: string;
  /** ISO timestamp in UTC; localized for display by the UI. */
  date: string;
  /** True when ESPN flags the time as TBD/not yet scheduled. */
  timeTbd?: boolean;
  opponentAbbr: string;
  opponentName: string;
  opponentLogo?: string;
  /** ESPN team id of the opponent, used for head-to-head lookups. */
  opponentId?: string;
  homeAway: 'home' | 'away';
  venue?: string;
  venueCity?: string;
  broadcast?: string;
  weekText?: string;
}

export interface StandColumn {
  /** Key into StandingsRow.stats. */
  key: string;
  /** Column header text shown in the table. */
  header: string;
  /** Glossary term id for the hoverable header. */
  term: string;
}

export interface StandingsRow {
  teamId: string;
  abbr: string;
  name: string;
  logo?: string;
  isUserTeam: boolean;
  /** displayValue keyed by the column keys in StandColumn. */
  stats: Record<string, string>;
}

export interface Standings {
  divisionName: string;
  columns: StandColumn[];
  rows: StandingsRow[];
}

export interface Player {
  id: string;
  name: string;
  jersey?: string;
  positionAbbr: string;
  positionName: string;
  age?: number;
  /** As ESPN returns it, e.g. `6' 0"`. */
  heightDisplay?: string;
  heightInches?: number;
  /** As ESPN returns it, e.g. "200 lbs". */
  weightDisplay?: string;
  weightLbs?: number;
  headshot?: string;
  /** MLB only. */
  bats?: string;
  throws?: string;
  injuryStatus?: string;
  /** ISO date string, e.g. "1998-03-17T08:00Z". */
  dateOfBirth?: string;
  /** "City, ST" or "City, Country". */
  birthPlace?: string;
  college?: string;
  /** Years of pro experience (ESPN's `experience.years`). */
  experienceYears?: number;
  /** ESPN's roster status, e.g. "Active". */
  status?: string;
  /** Demo Mode only: a precomputed stat line shown in place of live stats. */
  demoStatLine?: string;
}

export interface RosterGroup {
  /** Human label, e.g. "Offense", "Pitchers". */
  label: string;
  players: Player[];
}

export interface HeroState {
  upcoming?: UpcomingGame;
  lastResult?: GameResult;
}

/** A team's official colors (hex, with leading "#"), as ESPN reports them. */
export interface TeamColors {
  primary?: string;
  alternate?: string;
}

export interface VenueInfo {
  name: string;
  stats: { label: string; value: string }[];
  /** Curated trivia. Empty for teams without a hand-written entry. */
  funFacts: string[];
}

export interface TeamData {
  sport: SportKey;
  /** ESPN numeric team id, used for schedule/depth-chart/H2H lookups. */
  teamId?: string;
  /** App registry id of the selected team, e.g. "nfl-sea". */
  configId: string;
  /** Authoritative ESPN abbreviation from the team-hub payload. */
  teamAbbr: string;
  displayName: string;
  shortName: string;
  /** ESPN team slug, carried so H2H lookups can refetch this team's schedule. */
  slug: string;
  /** True for the two hand-tuned SF teams (curated history/series/fun facts). */
  bespoke: boolean;
  /** Official team colors from the live payload; drives adaptive theming. */
  colors?: TeamColors;
  /** Venue facts: curated for bespoke teams, else derived from the team hub. */
  venue?: VenueInfo;
  summary: TeamSummary;
  hero: HeroState;
  recentResults: GameResult[];
  upcomingGames: UpcomingGame[];
  standings: Standings;
  roster: RosterGroup[];
}

export interface AppData {
  nfl: TeamData | null;
  mlb: TeamData | null;
  /** Epoch ms of the last successful fetch, or null if never fetched. */
  fetchedAt: number | null;
}
