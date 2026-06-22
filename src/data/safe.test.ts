import { describe, expect, it } from 'vitest';
import { arr, bool, num, obj, parr, path, pbool, pnum, pobj, pstr, score, str } from './safe';

describe('obj/arr', () => {
  it('passes through plain objects and arrays', () => {
    expect(obj({ a: 1 })).toEqual({ a: 1 });
    expect(arr([1, 2])).toEqual([1, 2]);
  });

  it('falls back to empty container for the wrong shape', () => {
    expect(obj([1, 2])).toEqual({});
    expect(obj(null)).toEqual({});
    expect(arr({ a: 1 })).toEqual([]);
    expect(arr(undefined)).toEqual([]);
  });
});

describe('str/num/bool', () => {
  it('coerces sane values', () => {
    expect(str('hi')).toBe('hi');
    expect(str(42)).toBe('42');
    expect(num(42)).toBe(42);
    expect(num('42')).toBe(42);
    expect(num('  42  ')).toBe(42);
    expect(bool(true)).toBe(true);
  });

  it('rejects garbage instead of coercing it', () => {
    expect(str(null)).toBeUndefined();
    expect(str({})).toBeUndefined();
    expect(num('not a number')).toBeUndefined();
    expect(num('')).toBeUndefined();
    expect(num(NaN)).toBeUndefined();
    expect(num(Infinity)).toBeUndefined();
    expect(bool('true')).toBeUndefined();
    expect(bool(1)).toBeUndefined();
  });
});

describe('path', () => {
  const data = {
    competitions: [{ status: { type: { completed: true } } }],
    season: { year: 2026 },
  };

  it('walks dotted paths through objects and arrays', () => {
    expect(path(data, 'competitions.0.status.type.completed')).toBe(true);
    expect(path(data, 'season.year')).toBe(2026);
  });

  it('returns undefined on any miss instead of throwing', () => {
    expect(path(data, 'nope')).toBeUndefined();
    expect(path(data, 'competitions.5.status')).toBeUndefined();
    expect(path(data, 'season.year.nested')).toBeUndefined();
    expect(path(null, 'a.b.c')).toBeUndefined();
    expect(path(data, 'competitions.notAnIndex')).toBeUndefined();
  });
});

describe('pstr/pnum/pbool/parr/pobj', () => {
  const root = {
    a: { b: '5', flag: false, list: [1, 2, 3], obj: { x: 1 } },
  };

  it('combines path + coercion', () => {
    expect(pstr(root, 'a.b')).toBe('5');
    expect(pnum(root, 'a.b')).toBe(5);
    expect(pbool(root, 'a.flag')).toBe(false);
    expect(parr(root, 'a.list')).toEqual([1, 2, 3]);
    expect(pobj(root, 'a.obj')).toEqual({ x: 1 });
  });

  it('degrades gracefully when the path is missing', () => {
    expect(pstr(root, 'a.missing')).toBeUndefined();
    expect(pnum(root, 'a.missing')).toBeUndefined();
    expect(pbool(root, 'a.missing')).toBeUndefined();
    expect(parr(root, 'a.missing')).toEqual([]);
    expect(pobj(root, 'a.missing')).toEqual({});
  });
});

describe('score', () => {
  it('reads a bare number', () => {
    expect(score(7)).toBe(7);
  });

  it('reads ESPN-shaped { value } or { displayValue } objects', () => {
    expect(score({ value: 7 })).toBe(7);
    expect(score({ displayValue: '7' })).toBe(7);
  });

  it('returns undefined for anything else', () => {
    expect(score(null)).toBeUndefined();
    expect(score('garbage')).toBeUndefined();
    expect(score({})).toBeUndefined();
  });
});
