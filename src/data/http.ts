// Thin wrapper over the Tauri HTTP plugin (CORS-free, runs through Rust/reqwest).
import { fetch as tauriFetch } from '@tauri-apps/plugin-http';
import { notifyRateLimit } from './rateLimit';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 SportsWindow/1.0';

/** Error thrown on a non-2xx response; carries the HTTP status code. */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    url: string,
  ) {
    super(`HTTP ${status} for ${url}`);
    this.name = 'HttpError';
  }
}

/** GETs a URL and parses JSON. Throws on network error or non-2xx. */
export async function fetchJson(url: string, timeoutMs = 15000): Promise<unknown> {
  const res = await tauriFetch(url, {
    method: 'GET',
    headers: { 'User-Agent': UA, Accept: 'application/json' },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) {
    // Surface rate limiting so the UI can back off and show a gentle notice
    // instead of silently hammering ESPN or blanking the view.
    if (res.status === 429) notifyRateLimit();
    throw new HttpError(res.status, url);
  }
  return res.json();
}
