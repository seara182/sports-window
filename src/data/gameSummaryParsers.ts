// Parses the ESPN `/summary?event={id}` response into the shapes consumed by
// GameDetailPanel. Same defensive rules as parsers.ts: never throw, tolerate
// missing fields.

import { num, obj, parr, pobj, pstr, str } from './safe';

export interface StatComparisonRow {
  label: string;
  awayDisplay: string;
  homeDisplay: string;
  /** 0-100, share of the bar each side gets. Always sum to 100. */
  awayPct: number;
  homePct: number;
}

export interface PerformerStat {
  label: string;
  value: string;
  name: string;
  position?: string;
}

export interface TeamPerformers {
  abbr: string;
  performers: PerformerStat[];
}

export interface RecapInfo {
  headline: string;
  description: string;
}

export interface NflSummary {
  stats: StatComparisonRow[];
  performers: TeamPerformers[];
  recap?: RecapInfo;
}

export interface LinescoreRow {
  abbr: string;
  innings: string[];
  runs: number;
  hits: number;
  errors: number;
}

export interface PitchingDecision {
  type: 'W' | 'L' | 'S';
  name: string;
  record: string;
}

export interface MlbSummary {
  linescore: LinescoreRow[];
  decisions: PitchingDecision[];
  performers: TeamPerformers[];
}

/** Finds a team's boxscore entry by abbreviation. */
function findTeamStats(boxscore: unknown, abbr: string): Record<string, unknown> | undefined {
  for (const t of parr(boxscore, 'teams')) {
    if (pstr(t, 'team.abbreviation') === abbr) return obj(t);
  }
  return undefined;
}

/** Finds a single statistic entry by name within a team's `statistics` array. */
function findStat(
  team: Record<string, unknown> | undefined,
  name: string,
): Record<string, unknown> | undefined {
  if (!team) return undefined;
  for (const s of parr(team, 'statistics')) {
    if (pstr(s, 'name') === name) return obj(s);
  }
  return undefined;
}

/** Splits "X-Y" into [X, Y] as numbers, or undefined if unparseable. */
function splitPair(display: string | undefined): [number, number] | undefined {
  if (!display) return undefined;
  const m = display.match(/^(\d+)[-:](\d+)/);
  if (!m) return undefined;
  return [Number(m[1]), Number(m[2])];
}

/** "MM:SS" -> total seconds. */
function possessionSeconds(display: string | undefined): number | undefined {
  const pair = splitPair(display);
  if (!pair) return undefined;
  return pair[0] * 60 + pair[1];
}

function pct(away: number, home: number): [number, number] {
  const total = away + home;
  if (total <= 0) return [50, 50];
  const a = (away / total) * 100;
  return [a, 100 - a];
}

interface NflStatRow {
  label: string;
  key: string;
}

const NFL_STAT_ROWS: NflStatRow[] = [
  { label: 'Total Yards', key: 'totalYards' },
  { label: 'Passing Yards', key: 'netPassingYards' },
  { label: 'Rushing Yards', key: 'rushingYards' },
  { label: 'Turnovers', key: 'turnovers' },
  { label: 'Time of Possession', key: 'possessionTime' },
  { label: '3rd Down Eff.', key: 'thirdDownEff' },
  { label: 'Penalties', key: 'totalPenaltiesYards' },
  { label: 'Sacks', key: 'sacks' },
];

const NFL_LEADER_CATEGORIES: { name: string; label: string }[] = [
  { name: 'passingYards', label: 'Passing' },
  { name: 'rushingYards', label: 'Rushing' },
  { name: 'receivingYards', label: 'Receiving' },
];

/** Parses the NFL stat comparison rows, top performers, and recap. */
export function parseNflSummary(summary: unknown, awayAbbr: string, homeAbbr: string): NflSummary {
  const boxscore = pobj(summary, 'boxscore');
  const away = findTeamStats(boxscore, awayAbbr);
  const home = findTeamStats(boxscore, homeAbbr);

  const stats: StatComparisonRow[] = [];
  for (const row of NFL_STAT_ROWS) {
    if (row.key === 'sacks') {
      // Sacks are recorded as the *sacked* team's stat (sacksYardsLost), so
      // a team's sack total comes from its opponent's boxscore entry.
      const awayPair = splitPair(pstr(findStat(home, 'sacksYardsLost'), 'displayValue'));
      const homePair = splitPair(pstr(findStat(away, 'sacksYardsLost'), 'displayValue'));
      const awayVal = awayPair?.[0] ?? 0;
      const homeVal = homePair?.[0] ?? 0;
      const [awayPct, homePct] = pct(awayVal, homeVal);
      stats.push({
        label: row.label,
        awayDisplay: String(awayVal),
        homeDisplay: String(homeVal),
        awayPct,
        homePct,
      });
      continue;
    }

    const awayStat = findStat(away, row.key);
    const homeStat = findStat(home, row.key);
    if (!awayStat || !homeStat) continue;
    const awayDisplay = pstr(awayStat, 'displayValue') ?? '—';
    const homeDisplay = pstr(homeStat, 'displayValue') ?? '—';

    let awayVal: number | undefined;
    let homeVal: number | undefined;
    if (row.key === 'possessionTime') {
      awayVal = possessionSeconds(awayDisplay);
      homeVal = possessionSeconds(homeDisplay);
    } else if (row.key === 'thirdDownEff') {
      const ap = splitPair(awayDisplay);
      const hp = splitPair(homeDisplay);
      awayVal = ap && ap[1] > 0 ? (ap[0] / ap[1]) * 100 : 0;
      homeVal = hp && hp[1] > 0 ? (hp[0] / hp[1]) * 100 : 0;
    } else if (row.key === 'totalPenaltiesYards') {
      awayVal = splitPair(awayDisplay)?.[1];
      homeVal = splitPair(homeDisplay)?.[1];
    } else {
      awayVal = num(pstr(awayStat, 'value')) ?? num((awayStat as Record<string, unknown>).value);
      homeVal = num(pstr(homeStat, 'value')) ?? num((homeStat as Record<string, unknown>).value);
    }

    const [awayPct, homePct] = pct(awayVal ?? 0, homeVal ?? 0);
    stats.push({ label: row.label, awayDisplay, homeDisplay, awayPct, homePct });
  }

  const performers: TeamPerformers[] = [];
  for (const teamLeaders of parr(summary, 'leaders')) {
    const abbr = pstr(teamLeaders, 'team.abbreviation');
    if (!abbr) continue;
    const list: PerformerStat[] = [];
    for (const cat of NFL_LEADER_CATEGORIES) {
      for (const c of parr(teamLeaders, 'leaders')) {
        if (pstr(c, 'name') !== cat.name) continue;
        const leader = pobj(c, 'leaders.0');
        const value = pstr(leader, 'displayValue');
        const name = pstr(leader, 'athlete.displayName');
        if (!value || !name) continue;
        list.push({
          label: cat.label,
          value,
          name,
          position: pstr(leader, 'athlete.position.abbreviation'),
        });
      }
    }
    if (list.length) performers.push({ abbr, performers: list });
  }

  let recap: RecapInfo | undefined;
  const headline = pstr(summary, 'article.headline');
  const description = pstr(summary, 'article.description');
  if (headline) recap = { headline, description: description ?? '' };

  return { stats, performers, recap };
}

/** Parses the MLB linescore, pitching decisions, and top batters. */
export function parseMlbSummary(summary: unknown, awayAbbr: string, homeAbbr: string): MlbSummary {
  const linescore: LinescoreRow[] = [];
  for (const c of parr(summary, 'header.competitions.0.competitors')) {
    const abbr = pstr(c, 'team.abbreviation');
    if (!abbr) continue;
    let hits = 0;
    let errors = 0;
    const innings: string[] = [];
    for (const ls of parr(c, 'linescores')) {
      innings.push(pstr(ls, 'displayValue') ?? '-');
      hits += num((obj(ls) as Record<string, unknown>).hits) ?? 0;
      errors += num((obj(ls) as Record<string, unknown>).errors) ?? 0;
    }
    const runs = num((obj(c) as Record<string, unknown>).score) ?? 0;
    linescore.push({ abbr, innings, runs, hits, errors });
  }
  // Order: away first, then home (matches typical linescore presentation).
  linescore.sort((a, b) => {
    const score = (abbr: string) => (abbr === awayAbbr ? 0 : abbr === homeAbbr ? 1 : 2);
    return score(a.abbr) - score(b.abbr);
  });

  const decisions: PitchingDecision[] = [];
  const performers: TeamPerformers[] = [];

  for (const team of parr(summary, 'boxscore.players')) {
    const abbr = pstr(team, 'team.abbreviation');
    if (!abbr) continue;

    for (const group of parr(team, 'statistics')) {
      const labels = parr(group, 'labels').map((l) => str(l) ?? '');
      const isPitching = labels.includes('IP');
      const isBatting = labels.includes('AB') && labels.includes('H');

      for (const a of parr(group, 'athletes')) {
        const name = pstr(a, 'athlete.displayName');
        if (!name) continue;

        if (isPitching) {
          for (const note of parr(a, 'note')) {
            if (pstr(note, 'type') !== 'pitchingDecision') continue;
            const text = pstr(note, 'text') ?? '';
            const m = text.match(/^(W|L|S),\s*(.+)$/);
            if (!m) continue;
            decisions.push({ type: m[1] as 'W' | 'L' | 'S', name, record: m[2] });
          }
        }

        if (isBatting) {
          const stats = parr(a, 'stats').map((s) => str(s) ?? '');
          const idx = (label: string) => labels.indexOf(label);
          const hAb = stats[idx('H-AB')];
          const rbi = num(stats[idx('RBI')]) ?? 0;
          const hr = num(stats[idx('HR')]) ?? 0;
          const h = num(stats[idx('H')]) ?? 0;
          const score = hr * 4 + rbi * 2 + h;
          if (score <= 0 || !hAb) continue;
          const parts = [`${hAb}, ${rbi} RBI`];
          if (hr > 0) parts.push(`${hr} HR`);
          let team = performers.find((p) => p.abbr === abbr);
          if (!team) {
            team = { abbr, performers: [] };
            performers.push(team);
          }
          team.performers.push({ label: '', value: parts.join(', '), name, position: undefined });
          (team as unknown as { _scores: number[] })._scores ??= [];
          (team as unknown as { _scores: number[] })._scores.push(score);
        }
      }
    }
  }

  // Keep the top 3 batters per team by impact score.
  for (const team of performers) {
    const scores = (team as unknown as { _scores: number[] })._scores ?? [];
    const ranked = team.performers
      .map((p, i) => ({ p, score: scores[i] ?? 0 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => x.p);
    team.performers = ranked;
    delete (team as unknown as { _scores?: number[] })._scores;
  }

  return { linescore, decisions, performers };
}
