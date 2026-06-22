# Architecture

How data flows through Sports Window, and why it's organized this way. For
build/run instructions see [README.md](README.md#building-from-source).

## Stack

- [Tauri 2](https://v2.tauri.app/) — Rust shell, native window, HTTP/store/
  autostart/updater plugins
- React 19 + TypeScript, Vite 7
- `i18next` / `react-i18next` for English/German UI strings

## Data flow

```
espnApi.ts  --fetch-->  parsers.ts  --normalize-->  DataProvider  --cache+expose-->  views
   |                         |                            |
   v                         v                            v
ESPN / MLB Stats API   types/domain.ts            @tauri-apps/plugin-store
(raw, undocumented      (the one shape every            (sports-window-cache.json,
 JSON, shape can         view actually renders)          survives a relaunch)
 shift without notice)
```

1. **`espnApi.ts`** fetches each endpoint a team's view needs (team hub,
   schedule, previous-season schedule, roster, standings) independently, via
   the Tauri HTTP plugin (so requests bypass the browser's CORS). Each
   endpoint is wrapped in `tryFetchWithRetry` — up to 3 attempts with
   exponential backoff (2s, then 4s) — and the response is checked against a
   shape guard (`looksLikeTeamHub`, `looksLikeSchedule`, etc., in
   `parsers.ts`) before being accepted. A response that fails every retry, or
   comes back the wrong shape, resolves to `undefined` rather than throwing —
   the caller treats that exactly like "no new data this round" and falls
   back to whatever's cached.
2. **`parsers.ts`** turns whatever raw JSON did arrive into the normalized
   shapes in `types/domain.ts`. Every read goes through the accessors in
   `safe.ts` (`pstr`, `pnum`, `parr`, `pobj`, `path`, …), which walk a dotted
   path through unknown JSON and return `undefined`/`{}`/`[]` on any miss
   instead of throwing. A parser given a garbage payload renders a team with
   `"—"` placeholders, not a crash — this is deliberate: ESPN's API is
   undocumented and has no SLA, so "missing field" has to be a normal,
   non-fatal case everywhere.
3. **`DataProvider`** (`src/state/DataProvider.tsx`) is the single React
   context that owns live data. On mount it loads the last cached
   `AppData` from disk (instant first paint, even offline), then kicks off a
   background fetch for both selected teams. Each subsequent fetch repeats:
   fetch → merge in whatever endpoints succeeded → write the merged result to
   cache → expose it. `isStale()` (`lib/format.ts`) flags the UI when the
   last _successful_ fetch is more than 72 hours old — long enough to ride
   out a weekend-length ESPN outage without crying wolf, short enough to
   still mean something.
4. **Views** (`src/views/*`) read from `useData()`/`useSettings()` and
   render. They never fetch or parse directly.

### Why cache-first, retry, then honest staleness — and nothing fancier

There's no secondary NFL data source and no proxy backend. Both were
considered and rejected: a second data source means matching two undocumented
schemas; a proxy backend means a server to host and pay for, which is off the
table for a free, independently-run app (see the README's "Why no signing?"
section for the same cost constraint in a different place). So resilience is
entirely client-side: retry with backoff, validate shape, prefer the cache,
and tell the user honestly when data is stale — never blank the screen and
never show data the app isn't confident is current.

## Rate limiting

`rateLimit.ts` is a tiny pub/sub bridge: the low-level HTTP layer
(`data/http.ts`) calls `notifyRateLimit()` whenever ESPN returns a 429,
without needing to know anything about React. `DataProvider` subscribes via
`onRateLimit()` and surfaces a transient "paused" banner instead of hammering
a rate-limited endpoint with retries.

## Settings & theming

`SettingsProvider` persists user choices (selected teams, theme, language,
demo mode, font size, gradient preset, autostart) through the same Tauri
store plugin as the data cache, in a separate key. `ThemeProvider` resolves
"system"/"light"/"dark" against the OS preference and applies CSS custom
properties; `lib/teamTheme.ts` derives a team's gradient from its primary/
secondary color (read straight off the already-fetched team-hub payload —
colors and logos are never fetched separately).

## Diagnostics

`lib/diagnostics.ts` installs a global wrapper around `console.warn`/
`console.error` (`installDiagnosticsLogger()`, called once from `main.tsx`)
that keeps the last 200 entries in a ring buffer. Since there's no crash
reporting for an unsigned, sideloaded-style app, this rolling log _is_ the
support channel: Settings → Support → "Copy log to send to Mika" builds a
plain-text report (app version, platform, language, selected teams, demo
mode, last refresh time, stale flag, plus the rolling log) and copies it to
the clipboard for pasting into a GitHub Issue.

## Repo layout

```
src/
  types/domain.ts        normalized model shared by both sports
  data/
    safe.ts              defensive JSON accessors (never throw)
    parsers.ts           raw ESPN/MLB JSON -> domain objects + shape guards
    espnApi.ts           fetch orchestration: retry, backoff, shape validation
    http.ts               low-level fetch wrapper (Tauri HTTP plugin, 429 hook)
    rateLimit.ts          pub/sub bridge from http.ts to DataProvider
    cache.ts/settings.ts persistence via the Tauri store plugin
    teamConfig.ts         all NFL/MLB teams: slug, abbr, division, columns
    glossary.ts/.de.ts    tooltip definitions for stat terms (bilingual)
    ruleBook.ts/.de.ts    the in-app rules/glossary reference panel content
  lib/
    format.ts             relative time, staleness, localized dates, units
    diagnostics.ts         rolling log + clipboard report for bug reports
    teamTheme.ts           derives gradient/colors from team-hub data
  state/                  React context: theme, settings, data
  hooks/                  shared hooks (pull-to-refresh, scroll-spy, etc.)
  components/             title bar, sidebar, segmented control, settings modal
  views/                  hero card, results strip, standings, roster, etc.
  locales/                en.json / de.json (i18next resources)
  styles/                 design tokens + base + shared primitives + mobile
src-tauri/                Rust/Tauri shell, window config, plugin permissions
  capabilities/           least-privilege permission grants (default + desktop)
scripts/                  headless data-layer checks (verify-parsers, audit-glossary)
```

## Security posture

- **Capabilities** (`src-tauri/capabilities/*.json`) are split by platform:
  `default.json` grants only `core:window:*`, `store:default`, `os:default`,
  and an HTTP allow-list scoped to exactly three hosts
  (`site.api.espn.com`, `site.web.api.espn.com`, `statsapi.mlb.com`).
  `desktop.json` adds `updater:default`/`process:default`/`autostart:default`
  and is only registered on desktop builds.
- **CSP** (`tauri.conf.json` → `app.security.csp`) restricts `connect-src` to
  the same three hosts and `img-src` to `self` plus ESPN's CDN.
- The updater's **private** signing key never enters the repo — only the
  public verification key lives in `tauri.conf.json`; the private key stays
  on the maintainer's machine (see README's "Releasing updates" section).
- Production builds ship without source maps (Vite's default for `build`).
