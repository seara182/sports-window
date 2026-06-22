// Audits that every term the UI can render has a glossary entry.
// Run: npx tsx scripts/audit-glossary.ts
import { GLOSSARY } from '../src/data/glossary';
import { NINERS, GIANTS } from '../src/data/teamConfig';

const MLB_REMAP: Record<string, string> = { C: 'CmlB', SS: 'SS_MLB', P: 'P_MLB' };
const positionTerm = (sport: 'nfl' | 'mlb', abbr: string) =>
  sport === 'mlb' ? (MLB_REMAP[abbr] ?? abbr) : abbr;

// Position codes observed across both real rosters (plus likely variants).
const NFL_POS = 'C CB DE DT FB G LB LS OT P PK QB RB S TE WR ATH DB FS SS NT OLB ILB OL DL'.split(
  ' ',
);
const MLB_POS = '1B 2B 3B C CF DH RF RP SP SS LF P CP IF OF UTIL'.split(' ');

const required = new Set<string>();

// Standings column terms from both teams.
for (const c of NINERS.standingsColumns) required.add(c.term);
for (const c of GIANTS.standingsColumns) required.add(c.term);

// Division names.
required.add('nfcWest');
required.add('nlWest');

// Roster header terms.
['jersey', 'position', 'age', 'height', 'weight'].forEach((t) => required.add(t));

// Position codes mapped through the same logic the UI uses.
for (const p of NFL_POS) required.add(positionTerm('nfl', p));
for (const p of MLB_POS) required.add(positionTerm('mlb', p));

const missing = [...required].filter((t) => !(t in GLOSSARY));

console.log(`Required UI terms checked: ${required.size}`);
console.log(`Glossary entries total:    ${Object.keys(GLOSSARY).length}`);
if (missing.length) {
  console.log('MISSING ENTRIES:', missing);
  process.exit(1);
} else {
  console.log('OK — every UI term resolves to a glossary entry.');
}
