import { describe, expect, it } from 'vitest';
import {
  dayAndTime,
  fullDate,
  gameDay,
  inchesToMeters,
  isStale,
  lbsToKg,
  relativeTime,
  setFormatLocale,
} from './format';

describe('isStale', () => {
  const HOUR = 60 * 60 * 1000;

  it('treats a missing fetch time as stale', () => {
    expect(isStale(null)).toBe(true);
  });

  it('is fresh within the 72h tolerance and stale beyond it', () => {
    expect(isStale(Date.now() - 71 * HOUR)).toBe(false);
    expect(isStale(Date.now() - 73 * HOUR)).toBe(true);
  });
});

describe('relativeTime', () => {
  it('buckets elapsed time into human phrases', () => {
    const now = Date.now();
    expect(relativeTime(null, now)).toBe('never');
    expect(relativeTime(now - 30_000, now)).toBe('just now');
    expect(relativeTime(now - 5 * 60_000, now)).toBe('5 minutes ago');
    expect(relativeTime(now - 3 * 60 * 60_000, now)).toBe('3 hours ago');
    expect(relativeTime(now - 24 * 60 * 60_000, now)).toBe('yesterday');
    expect(relativeTime(now - 3 * 24 * 60 * 60_000, now)).toBe('3 days ago');
    expect(relativeTime(now - 14 * 24 * 60 * 60_000, now)).toBe('2 weeks ago');
  });
});

describe('date formatters', () => {
  setFormatLocale('en');
  const iso = '2026-09-14T18:00:00Z';

  it('formats valid ISO timestamps', () => {
    expect(gameDay(iso)).not.toBe('—');
    expect(fullDate(iso)).not.toBe('—');
    expect(dayAndTime(iso)).toContain('·');
  });

  it('falls back to an em dash for unparsable input', () => {
    expect(gameDay('not a date')).toBe('—');
    expect(fullDate('not a date')).toBe('—');
    expect(dayAndTime('not a date')).toBe('—');
  });
});

describe('metric conversions', () => {
  it('converts height and weight', () => {
    expect(inchesToMeters(74)).toBe('1.88 m');
    expect(lbsToKg(200)).toBe('91 kg');
  });

  it('returns null for absent or non-positive input', () => {
    expect(inchesToMeters(undefined)).toBeNull();
    expect(inchesToMeters(0)).toBeNull();
    expect(inchesToMeters(-5)).toBeNull();
    expect(lbsToKg(undefined)).toBeNull();
    expect(lbsToKg(0)).toBeNull();
  });
});
