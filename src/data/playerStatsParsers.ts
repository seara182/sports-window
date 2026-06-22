// Parses the ESPN "common/v3" athlete stats payload (categories / names /
// labels / statistics / totals) into position-appropriate stat chips,
// career-vs-season comparisons, and a career sparkline series.
// Defensive throughout: a missing category or stat simply yields an empty
// result rather than throwing.

import type { SportKey } from '../types/domain';
import { num, parr, pnum, pstr, str } from './safe';

export interface StatChip {
  label: string;
  value: string;
}

export interface ComparisonBar {
  label: string;
  seasonValue: number;
  careerBest: number;
  higherIsBetter: boolean;
}

export interface SparklinePoint {
  season: number;
  value: number;
}

export interface CareerLine {
  text: string;
  arrow: '▲' | '▼' | '';
  direction: 'up' | 'down' | 'flat';
}

export interface PlayerStatsData {
  chips: StatChip[];
  comparisons: ComparisonBar[];
  sparkline: SparklinePoint[];
  sparklineLabel: string;
  careerLine?: CareerLine;
  seasonYear?: number;
}

type StatGroup = 'QB' | 'RB' | 'RECEIVER' | 'SP' | 'RP' | 'HITTER' | 'OTHER';

export function statGroup(sport: SportKey, positionAbbr: string): StatGroup {
  const pos = (positionAbbr || '').toUpperCase();
  if (sport === 'nfl') {
    if (pos === 'QB') return 'QB';
    if (pos === 'RB' || pos === 'FB' || pos === 'HB') return 'RB';
    if (pos === 'WR' || pos === 'TE') return 'RECEIVER';
    return 'OTHER';
  }
  if (pos === 'SP') return 'SP';
  if (pos === 'RP' || pos === 'CP') return 'RP';
  if (pos === 'P') return 'SP';
  return 'HITTER';
}

interface ChipDef {
  label: string;
  category: string;
  key: string;
}

const CHIP_DEFS: Record<StatGroup, ChipDef[]> = {
  QB: [
    { label: 'COMP%', category: 'passing', key: 'completionPct' },
    { label: 'PASS YDS', category: 'passing', key: 'passingYards' },
    { label: 'TD', category: 'passing', key: 'passingTouchdowns' },
    { label: 'INT', category: 'passing', key: 'interceptions' },
    { label: 'RATING', category: 'passing', key: 'QBRating' },
  ],
  RB: [
    { label: 'RUSH YDS', category: 'rushing', key: 'rushingYards' },
    { label: 'YPC', category: 'rushing', key: 'yardsPerRushAttempt' },
    { label: 'TD', category: 'rushing', key: 'rushingTouchdowns' },
  ],
  RECEIVER: [
    { label: 'REC', category: 'receiving', key: 'receptions' },
    { label: 'REC YDS', category: 'receiving', key: 'receivingYards' },
    { label: 'YPR', category: 'receiving', key: 'yardsPerReception' },
    { label: 'TD', category: 'receiving', key: 'receivingTouchdowns' },
  ],
  SP: [
    { label: 'ERA', category: 'pitching', key: 'ERA' },
    { label: 'K', category: 'pitching', key: 'strikeouts' },
    { label: 'WHIP', category: 'pitching', key: 'WHIP' },
  ],
  RP: [
    { label: 'ERA', category: 'pitching', key: 'ERA' },
    { label: 'SV', category: 'pitching', key: 'saves' },
  ],
  HITTER: [
    { label: 'AVG', category: 'career-batting', key: 'avg' },
    { label: 'HR', category: 'career-batting', key: 'homeRuns' },
    { label: 'RBI', category: 'career-batting', key: 'RBIs' },
    { label: 'OPS', category: 'career-batting', key: 'OPS' },
  ],
  OTHER: [],
};

interface Headline {
  label: string;
  category: string;
  key: string;
  higherIsBetter: boolean;
  decimals: number;
}

const HEADLINE: Record<StatGroup, Headline | null> = {
  QB: { label: 'Rating', category: 'passing', key: 'QBRating', higherIsBetter: true, decimals: 1 },
  RB: {
    label: 'Rush Yds',
    category: 'rushing',
    key: 'rushingYards',
    higherIsBetter: true,
    decimals: 0,
  },
  RECEIVER: {
    label: 'Rec Yds',
    category: 'receiving',
    key: 'receivingYards',
    higherIsBetter: true,
    decimals: 0,
  },
  SP: { label: 'ERA', category: 'pitching', key: 'ERA', higherIsBetter: false, decimals: 2 },
  RP: { label: 'ERA', category: 'pitching', key: 'ERA', higherIsBetter: false, decimals: 2 },
  HITTER: {
    label: 'AVG',
    category: 'career-batting',
    key: 'avg',
    higherIsBetter: true,
    decimals: 3,
  },
  OTHER: null,
};

interface Category {
  name: string;
  names: string[];
  labels: string[];
  statistics: { year: number; stats: string[] }[];
}

function parseCategories(raw: unknown): Category[] {
  const out: Category[] = [];
  for (const c of parr(raw, 'categories')) {
    const name = pstr(c, 'name');
    if (!name) continue;
    const names = parr(c, 'names').map((x) => str(x) ?? '');
    const labels = parr(c, 'labels').map((x) => str(x) ?? '');
    const statistics: { year: number; stats: string[] }[] = [];
    for (const s of parr(c, 'statistics')) {
      const year = pnum(s, 'season.year');
      const stats = parr(s, 'stats').map((x) => str(x) ?? '');
      if (year != null) statistics.push({ year, stats });
    }
    statistics.sort((a, b) => a.year - b.year);
    out.push({ name, names, labels, statistics });
  }
  return out;
}

function findCategory(categories: Category[], name: string): Category | undefined {
  return categories.find((c) => c.name === name);
}

function statIndex(cat: Category, key: string): number {
  let idx = cat.names.indexOf(key);
  if (idx === -1) idx = cat.labels.indexOf(key);
  return idx;
}

/** Reads a single season's display value (string, as ESPN formats it). */
function seasonDisplay(cat: Category, key: string, seasonIdx: number): string | undefined {
  const idx = statIndex(cat, key);
  if (idx === -1) return undefined;
  const season = cat.statistics[seasonIdx];
  return season?.stats[idx];
}

/** Numeric series across every season for a given stat key. */
function series(cat: Category, key: string): SparklinePoint[] {
  const idx = statIndex(cat, key);
  if (idx === -1) return [];
  const out: SparklinePoint[] = [];
  for (const s of cat.statistics) {
    const v = num(s.stats[idx]);
    if (v != null) out.push({ season: s.year, value: v });
  }
  return out;
}

export function parsePlayerStats(
  raw: unknown,
  sport: SportKey,
  positionAbbr: string,
): PlayerStatsData | null {
  const categories = parseCategories(raw);
  if (!categories.length) return null;

  const group = statGroup(sport, positionAbbr);
  const chips: StatChip[] = [];
  const comparisons: ComparisonBar[] = [];
  let seasonYear: number | undefined;

  for (const def of CHIP_DEFS[group]) {
    const cat = findCategory(categories, def.category);
    if (!cat || !cat.statistics.length) continue;
    const lastIdx = cat.statistics.length - 1;
    const display = seasonDisplay(cat, def.key, lastIdx);
    if (display == null) continue;
    seasonYear = cat.statistics[lastIdx].year;
    chips.push({ label: def.label, value: display });

    const ser = series(cat, def.key);
    if (ser.length > 1) {
      const seasonValue = ser[ser.length - 1].value;
      const past = ser.slice(0, -1).map((p) => p.value);
      const careerBest = past.length ? Math.max(...past, seasonValue) : seasonValue;
      const careerWorst = past.length ? Math.min(...past, seasonValue) : seasonValue;
      comparisons.push({
        label: def.label,
        seasonValue,
        careerBest: def.label === 'ERA' || def.label === 'WHIP' ? careerWorst : careerBest,
        higherIsBetter: !(def.label === 'ERA' || def.label === 'WHIP' || def.label === 'INT'),
      });
    }
  }

  // SP: append a computed W-L chip from the pitching category.
  if (group === 'SP') {
    const cat = findCategory(categories, 'pitching');
    if (cat && cat.statistics.length) {
      const lastIdx = cat.statistics.length - 1;
      const w = seasonDisplay(cat, 'wins', lastIdx);
      const l = seasonDisplay(cat, 'losses', lastIdx);
      if (w != null && l != null) chips.push({ label: 'W-L', value: `${w}-${l}` });
    }
  }

  // RP: append a K/9 chip from the expanded-pitching category.
  if (group === 'RP') {
    const cat = findCategory(categories, 'expanded-pitching');
    if (cat && cat.statistics.length) {
      const lastIdx = cat.statistics.length - 1;
      const k9 =
        seasonDisplay(cat, 'K/9', lastIdx) ??
        seasonDisplay(cat, 'strikeoutsPerNineInnings', lastIdx);
      if (k9 != null) chips.push({ label: 'K/9', value: k9 });
    }
  }

  // Career-vs-season headline + sparkline.
  let sparkline: SparklinePoint[] = [];
  let sparklineLabel = '';
  let careerLine: CareerLine | undefined;
  const headline = HEADLINE[group];
  if (headline) {
    const cat = findCategory(categories, headline.category);
    if (cat) {
      sparkline = series(cat, headline.key);
      sparklineLabel = headline.label;
      if (sparkline.length > 1) {
        const seasonValue = sparkline[sparkline.length - 1].value;
        const past = sparkline.slice(0, -1).map((p) => p.value);
        const careerAvg = past.reduce((a, b) => a + b, 0) / past.length;
        const fmt = (v: number) =>
          headline.decimals === 3
            ? v.toFixed(3).replace(/^0\./, '.')
            : v.toFixed(headline.decimals);
        const better = headline.higherIsBetter ? seasonValue > careerAvg : seasonValue < careerAvg;
        const worse = headline.higherIsBetter ? seasonValue < careerAvg : seasonValue > careerAvg;
        const arrow: CareerLine['arrow'] = better ? '▲' : worse ? '▼' : '';
        const direction = better ? 'up' : worse ? 'down' : 'flat';
        careerLine = {
          text: `Career ${headline.label} ${fmt(careerAvg)} · This season ${fmt(seasonValue)}`,
          arrow,
          direction,
        };
      }
    }
  }

  return { chips, comparisons, sparkline, sparklineLabel, careerLine, seasonYear };
}
