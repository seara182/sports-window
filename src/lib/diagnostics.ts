// Rolling in-memory diagnostics log + "Copy log" support, for a free-
// sideloaded/unsigned app with no crash reporting. The user is the support
// channel: this gives them a paste-able, no-personal-data snapshot of what
// the app saw right before something went wrong.
//
// Captures console.warn/console.error globally (every module already logs
// its own failures with a `[scope]` prefix — espnApi, cache, settings,
// updater, autostart, glossary, playoffs, etc.) rather than threading a
// logger through each call site.

interface LogEntry {
  ts: number;
  level: 'warn' | 'error';
  text: string;
}

const MAX_ENTRIES = 200;
const buffer: LogEntry[] = [];
let installed = false;

function record(level: LogEntry['level'], args: unknown[]): void {
  const text = args
    .map((a) => {
      if (a instanceof Error) return a.stack ?? a.message;
      if (typeof a === 'string') return a;
      try {
        return JSON.stringify(a);
      } catch {
        return String(a);
      }
    })
    .join(' ');
  buffer.push({ ts: Date.now(), level, text });
  if (buffer.length > MAX_ENTRIES) buffer.shift();
}

/** Wraps console.warn/error once at app startup. Safe to call multiple times. */
export function installDiagnosticsLogger(): void {
  if (installed) return;
  installed = true;
  const origWarn = console.warn.bind(console);
  const origError = console.error.bind(console);
  console.warn = (...args: unknown[]) => {
    record('warn', args);
    origWarn(...args);
  };
  console.error = (...args: unknown[]) => {
    record('error', args);
    origError(...args);
  };
}

export interface DiagnosticsContext {
  appVersion: string;
  platform: string;
  selectedNfl: string;
  selectedMlb: string;
  demoMode: boolean;
  language: string;
  lastRefreshAt: number | null;
  stale: boolean;
}

/** Builds a plain-text diagnostics report: app/device state + the rolling log. */
export function buildDiagnosticsReport(ctx: DiagnosticsContext): string {
  const lines: string[] = [];
  lines.push('Sports Window diagnostics');
  lines.push(`generated: ${new Date().toISOString()}`);
  lines.push(`app version: ${ctx.appVersion}`);
  lines.push(`platform: ${ctx.platform}`);
  lines.push(`language: ${ctx.language}`);
  lines.push(`selected teams: nfl=${ctx.selectedNfl} mlb=${ctx.selectedMlb}`);
  lines.push(`demo mode: ${ctx.demoMode}`);
  lines.push(
    `last successful refresh: ${ctx.lastRefreshAt ? new Date(ctx.lastRefreshAt).toISOString() : 'never'}`,
  );
  lines.push(`showing stale data: ${ctx.stale}`);
  lines.push('');
  lines.push(`recent log (${buffer.length} entries):`);
  if (buffer.length === 0) {
    lines.push('(none)');
  } else {
    for (const e of buffer) {
      lines.push(`[${new Date(e.ts).toISOString()}] ${e.level.toUpperCase()} ${e.text}`);
    }
  }
  return lines.join('\n');
}

/** Copies text to the clipboard. Falls back to a hidden textarea + execCommand
 *  if the async Clipboard API isn't available in the webview. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path below */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
