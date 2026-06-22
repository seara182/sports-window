// Safe accessors for untrusted JSON. ESPN's schema is undocumented and shifts,
// so every field read goes through one of these. Nothing here throws.

export type Json = unknown;

export function isObj(v: Json): v is Record<string, Json> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Returns v as a plain object, or {} if it is not one. */
export function obj(v: Json): Record<string, Json> {
  return isObj(v) ? v : {};
}

/** Returns v as an array, or [] if it is not one. */
export function arr(v: Json): Json[] {
  return Array.isArray(v) ? v : [];
}

/** Coerces strings and finite numbers to string; otherwise undefined. */
export function str(v: Json): string | undefined {
  if (typeof v === 'string') return v;
  if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  return undefined;
}

/** Coerces finite numbers and numeric strings to number; otherwise undefined. */
export function num(v: Json): number | undefined {
  if (typeof v === 'number') return Number.isFinite(v) ? v : undefined;
  if (typeof v === 'string') {
    const t = v.trim();
    if (t === '') return undefined;
    const n = Number(t);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

export function bool(v: Json): boolean | undefined {
  return typeof v === 'boolean' ? v : undefined;
}

/**
 * Walks a dotted path through nested objects/arrays without throwing.
 * Numeric segments index into arrays. Returns undefined on any miss.
 */
export function path(root: Json, p: string): Json {
  let cur: Json = root;
  for (const seg of p.split('.')) {
    if (cur == null) return undefined;
    if (Array.isArray(cur)) {
      const i = Number(seg);
      cur = Number.isInteger(i) ? cur[i] : undefined;
    } else if (isObj(cur)) {
      cur = cur[seg];
    } else {
      return undefined;
    }
  }
  return cur;
}

export const pstr = (root: Json, p: string) => str(path(root, p));
export const pnum = (root: Json, p: string) => num(path(root, p));
export const pbool = (root: Json, p: string) => bool(path(root, p));
export const parr = (root: Json, p: string) => arr(path(root, p));
export const pobj = (root: Json, p: string) => obj(path(root, p));

/**
 * Parses a score that may arrive as a number, a numeric string, or an
 * object like `{ value, displayValue }`. Returns undefined when absent.
 */
export function score(v: Json): number | undefined {
  if (isObj(v)) return num(v.value) ?? num(v.displayValue);
  return num(v);
}
