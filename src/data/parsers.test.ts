import { describe, expect, it } from 'vitest';
import {
  looksLikeRoster,
  looksLikeSchedule,
  looksLikeStandings,
  looksLikeTeamHub,
} from './parsers';

describe('response-shape guards', () => {
  it('accept the shape each parser actually depends on', () => {
    expect(looksLikeTeamHub({ team: {} })).toBe(true);
    expect(looksLikeSchedule({ events: [] })).toBe(true);
    expect(looksLikeRoster({ athletes: [] })).toBe(true);
    expect(looksLikeStandings({ standings: {} })).toBe(true);
    expect(looksLikeStandings({ children: [] })).toBe(true);
  });

  it('reject responses missing the key fields the parsers read', () => {
    expect(looksLikeTeamHub({ other: 1 })).toBe(false);
    expect(looksLikeSchedule({ other: 1 })).toBe(false);
    expect(looksLikeRoster({ other: 1 })).toBe(false);
    expect(looksLikeStandings({ other: 1 })).toBe(false);
  });

  it('reject non-object payloads instead of throwing (arrays, null, primitives)', () => {
    for (const guard of [
      looksLikeTeamHub,
      looksLikeSchedule,
      looksLikeRoster,
      looksLikeStandings,
    ]) {
      expect(guard(null)).toBe(false);
      expect(guard(undefined)).toBe(false);
      expect(guard([])).toBe(false);
      expect(guard('error envelope')).toBe(false);
      expect(guard(42)).toBe(false);
    }
  });
});
