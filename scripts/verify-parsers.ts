// Headless verification of the Phase 1 parsers against real saved responses.
// Run: npx tsx scripts/verify-parsers.ts
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseTeamData, type RawBundle } from '../src/data/parsers';
import { GIANTS, NINERS } from '../src/data/teamConfig';

const SAMPLES = resolve(import.meta.dirname, '..', 'testing_Variants', '_api_samples');
const load = (f: string) => JSON.parse(readFileSync(resolve(SAMPLES, f), 'utf8'));

function report(name: string, bundle: RawBundle, cfg: typeof NINERS) {
  const t = parseTeamData(cfg, bundle);
  console.log(`\n================ ${name} ================`);
  console.log('summary:', t.summary);
  console.log(
    'hero.upcoming:',
    t.hero.upcoming
      ? `${t.hero.upcoming.homeAway === 'home' ? 'vs' : '@'} ${t.hero.upcoming.opponentAbbr} on ${t.hero.upcoming.date} @ ${t.hero.upcoming.venue ?? '—'} (${t.hero.upcoming.broadcast ?? 'no TV'})`
      : 'none',
  );
  console.log(
    'hero.lastResult:',
    t.hero.lastResult
      ? `${t.hero.lastResult.outcome} ${t.hero.lastResult.teamScore}-${t.hero.lastResult.opponentScore} vs ${t.hero.lastResult.opponentAbbr}`
      : 'none',
  );
  console.log(`recentResults (${t.recentResults.length}):`);
  for (const r of t.recentResults)
    console.log(
      `   ${r.outcome ?? '?'} ${r.teamScore ?? '—'}-${r.opponentScore ?? '—'} ${r.homeAway === 'home' ? 'vs' : '@'} ${r.opponentAbbr}  (${r.date.slice(0, 10)})`,
    );
  console.log(`upcomingGames (${t.upcomingGames.length}), first 3:`);
  for (const u of t.upcomingGames.slice(0, 3))
    console.log(
      `   ${u.homeAway === 'home' ? 'vs' : '@'} ${u.opponentAbbr}  ${u.date}  ${u.weekText ?? ''}`,
    );
  console.log(`standings "${t.standings.divisionName}" (${t.standings.rows.length} rows):`);
  const cols = t.standings.columns.map((c) => c.header).join('  ');
  console.log('   ', 'TEAM'.padEnd(5), cols);
  for (const row of t.standings.rows) {
    const vals = t.standings.columns.map((c) => row.stats[c.key] ?? '—').join('  ');
    console.log('   ', `${row.abbr}${row.isUserTeam ? '*' : ''}`.padEnd(5), vals);
  }
  console.log(`roster groups (${t.roster.length}):`);
  for (const g of t.roster) {
    console.log(`   ${g.label}: ${g.players.length} players`);
  }
  const sample = t.roster[0]?.players[0];
  if (sample)
    console.log('   sample player:', {
      name: sample.name,
      jersey: sample.jersey,
      pos: sample.positionAbbr,
      age: sample.age,
      h: sample.heightDisplay,
      w: sample.weightDisplay,
      headshot: sample.headshot ? 'yes' : 'no',
      inj: sample.injuryStatus ?? '—',
    });
}

// The saved API responses are a local dev convenience and aren't tracked in
// git (see README). When they're present, run the full inspection report;
// when they're not (e.g. in CI), skip straight to the garbage smoke test
// below, which is the part that actually needs to pass everywhere.
if (existsSync(SAMPLES)) {
  const niners: RawBundle = {
    teamHub: load('nfl_team.json'),
    schedules: [load('nfl_schedule.json'), load('nfl_schedule_2025.json')],
    roster: load('nfl_roster.json'),
    standings: load('nfl_standings.json'),
  };
  const giants: RawBundle = {
    teamHub: load('mlb_team.json'),
    schedules: [load('mlb_schedule.json')],
    roster: load('mlb_roster.json'),
    standings: load('mlb_standings.json'),
  };

  report('49ers (NFL)', niners, NINERS);
  report('Giants (MLB)', giants, GIANTS);
} else {
  console.log(`\nNo sample responses at ${SAMPLES} — skipping the live-data report.`);
  console.log('(Drop saved API responses there to run it; CI only needs the smoke test.)');
}

// Defensive smoke test: every parser must survive garbage input.
const garbage: RawBundle = {
  teamHub: {},
  schedules: [{}, null],
  roster: { athletes: 'nope' },
  standings: 42,
};
const safe = parseTeamData(NINERS, garbage);
console.log('\n================ GARBAGE INPUT (must not crash) ================');
console.log('ok:', {
  summary: safe.summary,
  results: safe.recentResults.length,
  upcoming: safe.upcomingGames.length,
  standings: safe.standings.rows.length,
  roster: safe.roster.length,
});
