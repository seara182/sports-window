// Formatting helpers: relative time, staleness, localized game date/time, and
// metric unit conversions. Relative-time + date formatting are language-aware
// (driven by i18n); see setFormatLocale, called from App's language sync.
import i18n from '../i18n';

// 72h, not 24h: ESPN outages last minutes to hours, not days. A 3-day window
// keeps the app reading "fresh" through an entire weekend outage before the
// cache is treated as stale.
const STALE_MS = 72 * 60 * 60 * 1000;

/** True when the last successful fetch is older than the stale threshold (72h). */
export function isStale(fetchedAt: number | null): boolean {
  if (!fetchedAt) return true;
  return Date.now() - fetchedAt > STALE_MS;
}

/** e.g. "just now", "3 minutes ago", "2 hours ago", "yesterday". Localized. */
export function relativeTime(fetchedAt: number | null, now = Date.now()): string {
  const t = i18n.t.bind(i18n);
  if (!fetchedAt) return t('format.never');
  const diff = Math.max(0, now - fetchedAt);
  const min = Math.floor(diff / 60000);
  if (min < 1) return t('format.justNow');
  if (min < 60) return t('format.minutesAgo', { count: min });
  const hr = Math.floor(min / 60);
  if (hr < 24) return t('format.hoursAgo', { count: hr });
  const day = Math.floor(hr / 24);
  if (day === 1) return t('format.yesterday');
  if (day < 7) return t('format.daysAgo', { count: day });
  const wk = Math.floor(day / 7);
  return t('format.weeksAgo', { count: wk });
}

// Date/time formatters are rebuilt whenever the UI language changes so game
// dates read naturally in German ("So., 14. Sep.") vs English ("Sun, Sep 14").
const LOCALES: Record<string, string> = { en: 'en-US', de: 'de-DE' };
let activeLocale: string | undefined;
let dayFmt: Intl.DateTimeFormat;
let timeFmt: Intl.DateTimeFormat;
let fullDateFmt: Intl.DateTimeFormat;

function buildFormatters(): void {
  dayFmt = new Intl.DateTimeFormat(activeLocale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  timeFmt = new Intl.DateTimeFormat(activeLocale, { hour: 'numeric', minute: '2-digit' });
  fullDateFmt = new Intl.DateTimeFormat(activeLocale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
buildFormatters();

/** Sets the locale used for game date/time formatting (e.g. "en", "de"). */
export function setFormatLocale(lang: string): void {
  activeLocale = LOCALES[lang] ?? lang;
  buildFormatters();
}

function parse(iso: string): Date | null {
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? new Date(ms) : null;
}

/** "Sun, Sep 14" — localized to the system timezone. */
export function gameDay(iso: string): string {
  const d = parse(iso);
  return d ? dayFmt.format(d) : '—';
}

/** "Sunday, September 14, 2025" — localized to the system timezone. */
export function fullDate(iso: string): string {
  const d = parse(iso);
  return d ? fullDateFmt.format(d) : '—';
}

export function dayAndTime(iso: string): string {
  const d = parse(iso);
  if (!d) return '—';
  return `${dayFmt.format(d)} · ${timeFmt.format(d)}`;
}

// ----- metric conversions (computed, never stored in the glossary) -----

/** Converts an ESPN height in total inches to a metric string, e.g. "1.93 m". */
export function inchesToMeters(totalInches?: number): string | null {
  if (!totalInches || totalInches <= 0) return null;
  const m = totalInches * 0.0254;
  return `${m.toFixed(2)} m`;
}

/** Converts pounds to a metric string, e.g. "91 kg". */
export function lbsToKg(lbs?: number): string | null {
  if (!lbs || lbs <= 0) return null;
  return `${Math.round(lbs * 0.453592)} kg`;
}
