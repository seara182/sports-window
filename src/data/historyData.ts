// Hardcoded historical data for the History section (trendline, pennant
// rail, scoring chart, franchise records, and the Season Drilldown panel).
// ESPN does not cleanly serve 13 seasons of per-season records, so this
// dataset is the source of truth; live data is layered on top only where the
// spec calls for it (current-season top performers).

import type { SportKey } from '../types/domain';

export type SeasonResult = 'champion' | 'playoff' | 'missed';

export interface SeasonRecord {
  year: number;
  wins: number;
  losses: number;
  result: SeasonResult;
  outcome: string;
  /** NFL: points per game. MLB: team ERA. */
  keyStat: number;
  keyStatLabel: string;
  /** NFL only: points allowed per game, for the scoring bar chart. */
  pointsAllowed?: number;
  /** MLB only, for the Season Drilldown key stats row. */
  battingAvg?: number;
}

export interface PennantData {
  year: number;
  line2: string;
  tooltip: string;
}

export interface TopPerformer {
  name: string;
  position: string;
  statLine: string;
}

export interface FranchiseRecord {
  label: string;
  value: string;
  description: string;
}

/** NFL: 0-17. MLB: 0-162. */
export const TRENDLINE_Y_MAX: Record<SportKey, number> = { nfl: 17, mlb: 162 };

export const SEASON_HISTORY: Record<SportKey, SeasonRecord[]> = {
  nfl: [
    {
      year: 2012,
      wins: 11,
      losses: 5,
      result: 'playoff',
      outcome: 'Lost NFC Championship to Falcons, 24–28',
      keyStat: 24.7,
      keyStatLabel: 'PPG',
      pointsAllowed: 17.1,
    },
    {
      year: 2013,
      wins: 12,
      losses: 4,
      result: 'playoff',
      outcome: 'Lost Super Bowl XLVII to Ravens, 31–34',
      keyStat: 25.4,
      keyStatLabel: 'PPG',
      pointsAllowed: 17.0,
    },
    {
      year: 2014,
      wins: 8,
      losses: 8,
      result: 'missed',
      outcome: 'Missed playoffs',
      keyStat: 19.4,
      keyStatLabel: 'PPG',
      pointsAllowed: 21.3,
    },
    {
      year: 2015,
      wins: 5,
      losses: 11,
      result: 'missed',
      outcome: 'Missed playoffs (5–11)',
      keyStat: 16.0,
      keyStatLabel: 'PPG',
      pointsAllowed: 23.4,
    },
    {
      year: 2016,
      wins: 2,
      losses: 14,
      result: 'missed',
      outcome: 'Missed playoffs (2–14)',
      keyStat: 16.4,
      keyStatLabel: 'PPG',
      pointsAllowed: 28.1,
    },
    {
      year: 2017,
      wins: 6,
      losses: 10,
      result: 'missed',
      outcome: 'Missed playoffs (6–10)',
      keyStat: 19.4,
      keyStatLabel: 'PPG',
      pointsAllowed: 23.8,
    },
    {
      year: 2018,
      wins: 4,
      losses: 12,
      result: 'missed',
      outcome: 'Missed playoffs (4–12)',
      keyStat: 18.6,
      keyStatLabel: 'PPG',
      pointsAllowed: 24.6,
    },
    {
      year: 2019,
      wins: 13,
      losses: 3,
      result: 'playoff',
      outcome: 'Lost Super Bowl LIV to Chiefs, 20–31',
      keyStat: 29.9,
      keyStatLabel: 'PPG',
      pointsAllowed: 17.0,
    },
    {
      year: 2020,
      wins: 6,
      losses: 10,
      result: 'missed',
      outcome: 'Missed playoffs (6–10)',
      keyStat: 23.6,
      keyStatLabel: 'PPG',
      pointsAllowed: 25.4,
    },
    {
      year: 2021,
      wins: 10,
      losses: 7,
      result: 'playoff',
      outcome: 'Lost NFC Divisional to Rams, 17–20',
      keyStat: 24.1,
      keyStatLabel: 'PPG',
      pointsAllowed: 21.3,
    },
    {
      year: 2022,
      wins: 13,
      losses: 4,
      result: 'playoff',
      outcome: 'Lost NFC Championship to Eagles, 7–31',
      keyStat: 24.9,
      keyStatLabel: 'PPG',
      pointsAllowed: 17.5,
    },
    {
      year: 2023,
      wins: 12,
      losses: 5,
      result: 'playoff',
      outcome: 'Lost Super Bowl LVIII to Chiefs, 22–25 OT',
      keyStat: 28.9,
      keyStatLabel: 'PPG',
      pointsAllowed: 17.5,
    },
    {
      year: 2024,
      wins: 6,
      losses: 11,
      result: 'missed',
      outcome: 'Season data pending',
      keyStat: 24.6,
      keyStatLabel: 'PPG',
      pointsAllowed: 21.0,
    },
  ],
  mlb: [
    {
      year: 2012,
      wins: 94,
      losses: 68,
      result: 'champion',
      outcome: 'Won World Series vs. Tigers, 4–0',
      keyStat: 3.68,
      keyStatLabel: 'Team ERA',
      battingAvg: 0.255,
    },
    {
      year: 2013,
      wins: 76,
      losses: 86,
      result: 'missed',
      outcome: 'Missed playoffs (76–86)',
      keyStat: 4.0,
      keyStatLabel: 'Team ERA',
      battingAvg: 0.246,
    },
    {
      year: 2014,
      wins: 88,
      losses: 74,
      result: 'champion',
      outcome: 'Won World Series vs. Royals, 4–3',
      keyStat: 3.5,
      keyStatLabel: 'Team ERA',
      battingAvg: 0.255,
    },
    {
      year: 2015,
      wins: 84,
      losses: 78,
      result: 'missed',
      outcome: 'Missed playoffs (84–78)',
      keyStat: 3.73,
      keyStatLabel: 'Team ERA',
      battingAvg: 0.267,
    },
    {
      year: 2016,
      wins: 87,
      losses: 75,
      result: 'playoff',
      outcome: 'Lost NLDS to Cubs, 1–3',
      keyStat: 4.05,
      keyStatLabel: 'Team ERA',
      battingAvg: 0.251,
    },
    {
      year: 2017,
      wins: 64,
      losses: 98,
      result: 'missed',
      outcome: 'Missed playoffs (64–98)',
      keyStat: 4.97,
      keyStatLabel: 'Team ERA',
      battingAvg: 0.243,
    },
    {
      year: 2018,
      wins: 73,
      losses: 89,
      result: 'missed',
      outcome: 'Missed playoffs (73–89)',
      keyStat: 3.95,
      keyStatLabel: 'Team ERA',
      battingAvg: 0.241,
    },
    {
      year: 2019,
      wins: 77,
      losses: 85,
      result: 'missed',
      outcome: 'Missed playoffs (77–85)',
      keyStat: 4.36,
      keyStatLabel: 'Team ERA',
      battingAvg: 0.242,
    },
    {
      year: 2020,
      wins: 29,
      losses: 31,
      result: 'missed',
      outcome: 'Missed playoffs (29–31)',
      keyStat: 3.79,
      keyStatLabel: 'Team ERA',
      battingAvg: 0.246,
    },
    {
      year: 2021,
      wins: 107,
      losses: 55,
      result: 'playoff',
      outcome: 'Lost NLDS to Dodgers, 1–3',
      keyStat: 3.49,
      keyStatLabel: 'Team ERA',
      battingAvg: 0.244,
    },
    {
      year: 2022,
      wins: 81,
      losses: 81,
      result: 'missed',
      outcome: 'Missed playoffs (81–81)',
      keyStat: 3.99,
      keyStatLabel: 'Team ERA',
      battingAvg: 0.238,
    },
    {
      year: 2023,
      wins: 79,
      losses: 83,
      result: 'missed',
      outcome: 'Missed playoffs (79–83)',
      keyStat: 4.21,
      keyStatLabel: 'Team ERA',
      battingAvg: 0.253,
    },
    {
      year: 2024,
      wins: 90,
      losses: 72,
      result: 'missed',
      outcome: 'Season data pending',
      keyStat: 3.96,
      keyStatLabel: 'Team ERA',
      battingAvg: 0.25,
    },
  ],
};

export const PENNANTS: Record<SportKey, PennantData[]> = {
  nfl: [
    { year: 1981, line2: 'SUPER BOWL XVI', tooltip: 'Defeated Bengals 26–21. Joe Montana MVP.' },
    { year: 1984, line2: 'SUPER BOWL XIX', tooltip: 'Defeated Dolphins 38–16. Joe Montana MVP.' },
    { year: 1988, line2: 'SUPER BOWL XXIII', tooltip: 'Defeated Bengals 20–16. Jerry Rice MVP.' },
    { year: 1989, line2: 'SUPER BOWL XXIV', tooltip: 'Defeated Broncos 55–10. Joe Montana MVP.' },
    { year: 1994, line2: 'SUPER BOWL XXIX', tooltip: 'Defeated Chargers 49–26. Steve Young MVP.' },
  ],
  mlb: [
    {
      year: 1954,
      line2: 'WORLD SERIES',
      tooltip: "Defeated Indians 4–0. Willie Mays' famous over-the-shoulder catch.",
    },
    { year: 2010, line2: 'WORLD SERIES', tooltip: 'Defeated Rangers 4–1. Edgar Rentería MVP.' },
    { year: 2012, line2: 'WORLD SERIES', tooltip: 'Defeated Tigers 4–0. Pablo Sandoval MVP.' },
    {
      year: 2014,
      line2: 'WORLD SERIES',
      tooltip: 'Defeated Royals 4–3. Madison Bumgarner legendary relief performance.',
    },
  ],
};

export const TOP_PERFORMERS: Record<SportKey, Record<number, TopPerformer[]>> = {
  nfl: {
    2012: [
      { name: 'Colin Kaepernick', position: 'QB', statLine: '1,814 pass yds + 415 rush yds' },
      { name: 'Frank Gore', position: 'RB', statLine: '1,214 rush yds' },
      { name: 'Vernon Davis', position: 'TE', statLine: '41 rec, 733 yds' },
    ],
    2013: [
      { name: 'Colin Kaepernick', position: 'QB', statLine: '3,197 pass yds, 21 TD' },
      { name: 'Frank Gore', position: 'RB', statLine: '1,128 rush yds' },
      { name: 'Anquan Boldin', position: 'WR', statLine: '85 rec, 1,179 yds' },
    ],
    2019: [
      { name: 'Jimmy Garoppolo', position: 'QB', statLine: '3,978 yds, 27 TD' },
      { name: 'Raheem Mostert', position: 'RB', statLine: '772 rush yds' },
      { name: 'George Kittle', position: 'TE', statLine: '85 rec, 1,053 yds' },
    ],
    2021: [
      { name: 'Deebo Samuel', position: 'WR', statLine: '77 rec, 1,405 yds' },
      { name: 'Elijah Mitchell', position: 'RB', statLine: '963 rush yds' },
      { name: 'George Kittle', position: 'TE', statLine: '71 rec, 910 yds' },
    ],
    2022: [
      { name: 'Brock Purdy', position: 'QB', statLine: '1,374 yds, 13 TD in 5 games' },
      { name: 'Christian McCaffrey', position: 'RB', statLine: '510 rush yds post-trade' },
      { name: 'George Kittle', position: 'TE', statLine: '60 rec, 765 yds' },
    ],
  },
  mlb: {
    2012: [
      { name: 'Matt Cain', position: 'SP', statLine: '16-5, 2.79 ERA' },
      { name: 'Buster Posey', position: 'C', statLine: '.336 AVG, 24 HR' },
      { name: 'Ryan Vogelsong', position: 'SP', statLine: '14-9, 3.37 ERA' },
    ],
    2014: [
      { name: 'Madison Bumgarner', position: 'SP', statLine: '18-10, 2.98 ERA' },
      { name: 'Buster Posey', position: 'C', statLine: '.311 AVG, 22 HR' },
      { name: 'Hunter Pence', position: 'RF', statLine: '.277 AVG, 20 HR' },
    ],
    2016: [
      { name: 'Madison Bumgarner', position: 'SP', statLine: '15-9, 2.74 ERA' },
      { name: 'Buster Posey', position: 'C', statLine: '.288 AVG, 14 HR' },
      { name: 'Johnny Cueto', position: 'SP', statLine: '18-5, 2.79 ERA' },
    ],
    2021: [
      { name: 'Kevin Gausman', position: 'SP', statLine: '14-6, 2.81 ERA' },
      { name: 'Buster Posey', position: 'C', statLine: '.304 AVG, 18 HR' },
      { name: 'Brandon Crawford', position: 'SS', statLine: '.298 AVG, 24 HR' },
    ],
  },
};

export const FRANCHISE_RECORDS: Record<SportKey, FranchiseRecord[]> = {
  nfl: [
    { label: 'All-Time Wins', value: '622', description: 'Through 2024' },
    { label: 'Best Season', value: '15 wins', description: '2019' },
    { label: 'Longest Win Streak', value: '18 games', description: '1989–90' },
    { label: 'Last Championship', value: '1994', description: 'Super Bowl XXIX' },
  ],
  mlb: [
    { label: 'All-Time Wins', value: '9,917', description: 'Through 2024' },
    { label: 'Best Modern Season', value: '107 wins', description: '2021' },
    { label: 'Longest Win Streak', value: '26 games', description: '1916' },
    { label: 'Last Championship', value: '2014', description: 'World Series' },
  ],
};

/** Years (within SEASON_HISTORY range) that ended with a championship. */
export function championshipYears(sport: SportKey): Set<number> {
  return new Set(SEASON_HISTORY[sport].filter((s) => s.result === 'champion').map((s) => s.year));
}

/** The pennant matching a championship season, if any. */
export function pennantForSeason(sport: SportKey, year: number): PennantData | undefined {
  return PENNANTS[sport].find((p) => p.year === year);
}
