// Resolves the accent + hero gradient for the active team.
//
// The two hand-tuned San Francisco teams keep their bespoke palettes (the
// easter egg). Every other team derives its accent from the official colors
// ESPN ships in the team-hub payload — with a readability guard so near-white
// or near-black team colors don't produce an invisible accent.

import type { SportKey, TeamData } from '../types/domain';

export interface TeamThemeVars {
  gradient: string;
  accent: string;
}

// Hand-tuned SF palettes, keyed by registry id. These reference the gradient
// custom properties already defined in tokens.css.
const BESPOKE: Record<string, TeamThemeVars> = {
  'nfl-sf': { gradient: 'var(--grad-niners)', accent: '#aa0000' },
  'mlb-sf': { gradient: 'var(--grad-giants)', accent: '#fd5a1e' },
};

const NEUTRAL: TeamThemeVars = {
  gradient: 'linear-gradient(135deg, #3a3f4b 0%, #5a6170 100%)',
  accent: '#5a6170',
};

interface Rgb {
  r: number;
  g: number;
  b: number;
}

function parseHex(hex: string | undefined): Rgb | null {
  if (!hex) return null;
  const h = hex.trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function toHex({ r, g, b }: Rgb): string {
  const c = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

/** Relative luminance (0 = black, 1 = white) per the sRGB formula. */
function luminance({ r, g, b }: Rgb): number {
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function scale({ r, g, b }: Rgb, factor: number): Rgb {
  return { r: r * factor, g: g * factor, b: b * factor };
}

/** Pulls a too-light/too-dark color back into a range that reads as an accent on
 *  both light and dark surfaces; returns null if it can't be salvaged. */
function makeReadable(rgb: Rgb): Rgb | null {
  let out = rgb;
  let lum = luminance(out);
  // Near-white: darken until it has enough presence.
  for (let i = 0; i < 6 && lum > 0.6; i++) {
    out = scale(out, 0.8);
    lum = luminance(out);
  }
  // Near-black: lighten so it isn't lost against dark chrome.
  for (let i = 0; i < 6 && lum < 0.05; i++) {
    out = { r: out.r + 28, g: out.g + 28, b: out.b + 28 };
    lum = luminance(out);
  }
  return lum > 0.6 || lum < 0.04 ? null : out;
}

export function teamThemeVars(team: TeamData | null, sport: SportKey): TeamThemeVars {
  // Before any data arrives, show the sport's SF default palette.
  if (!team) return sport === 'nfl' ? BESPOKE['nfl-sf'] : BESPOKE['mlb-sf'];
  if (team.bespoke && BESPOKE[team.configId]) return BESPOKE[team.configId];

  const primary = makeReadable(parseHex(team.colors?.primary) ?? { r: 0, g: 0, b: 0 });
  if (!primary || !team.colors?.primary) return NEUTRAL;
  const accent = toHex(primary);

  // Prefer a distinct alternate for the gradient's second stop; otherwise
  // derive a lighter tint of the primary.
  const altRaw = parseHex(team.colors?.alternate);
  const second = altRaw ? toHex(altRaw) : toHex(scale(primary, 1.4));

  return {
    accent,
    gradient: `linear-gradient(135deg, ${accent} 0%, ${second} 100%)`,
  };
}
