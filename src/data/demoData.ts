// Bundled static datasets used by Demo Mode. Builds TeamData shapes from
// hand-curated JSON so the whole app can render without any ESPN calls.
import type { GameResult, Player, RosterGroup, SportKey, TeamData } from '../types/domain';
import { TEAM_CONFIGS } from './teamConfig';
import { VENUE_DATA } from './venueData';
import niners2023 from './demo/niners-2023.json';
import giants2014 from './demo/giants-2014.json';

export interface DemoPlayoffGame {
  round: string;
  opponent: string;
  result: 'W' | 'L';
  score: string;
}

export interface DemoRosterPlayer {
  name: string;
  position: string;
  stats: string;
}

export interface DemoResult {
  date: string;
  opponent: string;
  homeAway: 'home' | 'away';
  score: string;
  result: 'W' | 'L';
}

export interface DemoDataset {
  season: string;
  label: string;
  record: { wins: number; losses: number };
  standing: string;
  playoffPath: DemoPlayoffGame[];
  rosterSpotlight: DemoRosterPlayer[];
  teamStats: Record<string, number>;
  recentResults: DemoResult[];
  historyWins: number[];
}

export const DEMO_DATASETS: Record<SportKey, DemoDataset> = {
  nfl: niners2023 as DemoDataset,
  mlb: giants2014 as DemoDataset,
};

const OPPONENT_ABBR: Record<string, string> = {
  'Los Angeles Rams': 'LAR',
  'Washington Commanders': 'WSH',
  'Baltimore Ravens': 'BAL',
  'Arizona Cardinals': 'ARI',
  'Seattle Seahawks': 'SEA',
  'Green Bay Packers': 'GB',
  'Detroit Lions': 'DET',
  'Kansas City Chiefs': 'KC',
  'Colorado Rockies': 'COL',
  'San Diego Padres': 'SD',
  'Pittsburgh Pirates': 'PIT',
  'Washington Nationals': 'WSH',
  'St. Louis Cardinals': 'STL',
  'Kansas City Royals': 'KC',
};

function opponentAbbr(name: string): string {
  return OPPONENT_ABBR[name] ?? name.slice(0, 3).toUpperCase();
}

const MONTHS: Record<string, string> = {
  Jan: '01',
  Feb: '02',
  Mar: '03',
  Apr: '04',
  May: '05',
  Jun: '06',
  Jul: '07',
  Aug: '08',
  Sep: '09',
  Oct: '10',
  Nov: '11',
  Dec: '12',
};

/** "Jan 7 2024" -> "2024-01-07T20:00:00.000Z" */
function toIsoDate(display: string): string {
  const [mon, day, year] = display.split(' ');
  const month = MONTHS[mon] ?? '01';
  return `${year}-${month}-${day.padStart(2, '0')}T20:00:00.000Z`;
}

/** Splits "21–20" into [21, 20] (team score first, opponent second). */
function splitScore(score: string): [number, number] {
  const [a, b] = score.split(/[–-]/).map((n) => parseInt(n.trim(), 10));
  return [a, b];
}

function formatPct(wins: number, losses: number): string {
  const pct = wins / (wins + losses);
  return pct.toFixed(3).replace(/^0/, '');
}

const POSITION_NAMES: Record<string, string> = {
  QB: 'Quarterback',
  RB: 'Running Back',
  TE: 'Tight End',
  WR: 'Wide Receiver',
  SP: 'Starting Pitcher',
  C: 'Catcher',
  '1B': 'First Baseman',
  '2B': 'Second Baseman',
  '3B': 'Third Baseman',
  SS: 'Shortstop',
  LF: 'Left Fielder',
  CF: 'Center Fielder',
  RF: 'Right Fielder',
  DH: 'Designated Hitter',
};

/** Which roster group a demo player's position belongs to. */
function groupLabel(sport: SportKey, position: string): string {
  if (sport === 'nfl') return 'Offense';
  if (position === 'SP' || position === 'RP' || position === 'CP' || position === 'P')
    return 'Pitchers';
  if (position === 'C') return 'Catchers';
  if (['1B', '2B', '3B', 'SS'].includes(position)) return 'Infield';
  if (['LF', 'CF', 'RF', 'OF'].includes(position)) return 'Outfield';
  if (position === 'DH') return 'Designated Hitter';
  return 'Infield';
}

function buildRoster(sport: SportKey, dataset: DemoDataset): RosterGroup[] {
  const groups = new Map<string, Player[]>();
  for (const p of dataset.rosterSpotlight) {
    const label = groupLabel(sport, p.position);
    const player: Player = {
      id: '',
      name: p.name,
      positionAbbr: p.position,
      positionName: POSITION_NAMES[p.position] ?? p.position,
      demoStatLine: p.stats,
    };
    const list = groups.get(label) ?? [];
    list.push(player);
    groups.set(label, list);
  }
  return Array.from(groups.entries()).map(([label, players]) => ({ label, players }));
}

function buildResults(dataset: DemoDataset): GameResult[] {
  return dataset.recentResults.map((r, i) => {
    const [teamScore, opponentScore] = splitScore(r.score);
    return {
      id: `demo-${i}`,
      date: toIsoDate(r.date),
      opponentAbbr: opponentAbbr(r.opponent),
      opponentName: r.opponent,
      homeAway: r.homeAway,
      teamScore,
      opponentScore,
      outcome: r.result,
    };
  });
}

/** Builds a full TeamData from the bundled demo dataset for the given team. */
export function buildDemoTeamData(sport: SportKey): TeamData {
  const cfg = TEAM_CONFIGS[sport];
  const dataset = DEMO_DATASETS[sport];
  const results = buildResults(dataset);

  return {
    sport,
    configId: cfg.id,
    teamAbbr: cfg.abbr,
    displayName: cfg.displayName,
    shortName: cfg.shortName,
    slug: cfg.slug,
    bespoke: cfg.bespoke,
    venue: VENUE_DATA[sport],
    summary: {
      record: `${dataset.record.wins}-${dataset.record.losses}`,
      divisionRank: dataset.standing,
      streak: '—',
    },
    hero: {
      lastResult: results[0],
    },
    recentResults: results,
    upcomingGames: [],
    standings: {
      divisionName: cfg.divisionName,
      columns: cfg.standingsColumns,
      rows: [
        {
          teamId: '',
          abbr: cfg.abbr,
          name: cfg.displayName,
          isUserTeam: true,
          stats: {
            wins: String(dataset.record.wins),
            losses: String(dataset.record.losses),
            ties: '0',
            winPercent: formatPct(dataset.record.wins, dataset.record.losses),
          },
        },
      ],
    },
    roster: buildRoster(sport, dataset),
  };
}
