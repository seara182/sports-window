# Sports Window

A free, no-account desktop dashboard for two San Francisco sports teams — the
49ers (NFL) and the Giants (MLB). One window: live scores, standings, roster,
upcoming games, head-to-head history, venue info, and player stats, all with
plain-language tooltips on the stats and terms that need them.

It only ever talks to ESPN's and MLB's public score APIs. No account, no
tracking, no analytics.

## Download

Grab the latest installer from the
**[Releases page](https://github.com/seara182/sports-window/releases/latest)**:

- **Windows:** `Sports Window_1.0.0_x64-setup.exe`
- **macOS (Apple Silicon — M1/M2/M3/M4):** `Sports Window_1.0.0_aarch64.dmg`
- **macOS (Intel):** `Sports Window_1.0.0_x64.dmg`

The Windows installer bundles the WebView2 runtime, so it works fully
offline — no extra downloads during setup, even on a machine without
internet access.

> **No Windows installer on the Releases page yet?** You can build one
> yourself: download this project (green **Code** button → **Download ZIP**),
> unzip it, and double-click **`build-windows.bat`**. It installs what's
> needed and produces the `.exe` for you. (Most people won't need this — it's
> only here until a prebuilt Windows installer is attached to a release.)

The app is unsigned (no paid developer certificate — see [Why no
signing?](#why-no-signing) below), so your OS will warn you on first launch.
That's expected; here's how to get past it:

**Windows (SmartScreen):** click **More info**, then **Run anyway**.

**macOS (Gatekeeper):** right-click the app in Applications and choose
**Open**, then confirm. If that doesn't work, run:

```bash
xattr -dr com.apple.quarantine "/Applications/Sports Window.app"
```

Once installed, Sports Window checks for updates on launch and offers a
one-click install when a new version is out — you only have to repeat the
unsigned-app step once, on first install.

## Mobile

There's no iOS or Android version, and there isn't a firm plan for one. A
real public mobile release needs a paid Apple Developer account (and likely
some paid hosting down the line) — both ongoing costs that an independent,
currently-still-studying developer can't take on right now. If that changes
— sponsorship, a free/low-cost signing path, or just more income later —
mobile is still the plan. Until then, desktop is the only supported
platform.

## Why no signing?

Code-signing certificates cost money every year, for both Windows and macOS.
This is a free hobby project with no revenue, so it ships unsigned and relies
on the OS's standard "are you sure?" prompts instead. The
[`tauri-plugin-updater`](https://v2.tauri.app/plugin/updater/) flow still
cryptographically verifies that every update actually comes from this
project before installing it — unsigned just means the OS doesn't recognize
the publisher, not that updates are unverified.

## Found a bug?

Open a [GitHub Issue](https://github.com/seara182/sports-window/issues). If
you can, open the in-app settings and use **Copy log to send to Mika** under
"Support" — paste that into the issue. It has no personal data, just the app
version, your settings, and recent fetch errors, and it's usually enough to
tell what went wrong.

---

## Building from source

Want to run it from source, or contribute? You'll need:

- [Node.js](https://nodejs.org/) ≥ 20
- [Rust toolchain](https://www.rust-lang.org/tools/install) (required by Tauri)
- Platform-specific Tauri dependencies — see the
  [Tauri prerequisites guide](https://v2.tauri.app/start/prerequisites/) for
  your OS

```bash
git clone https://github.com/seara182/sports-window.git
cd sports-window
npm install
npx tauri dev      # hot-reloading dev window
```

```bash
npx tauri build    # release installer for your current platform
```

### Checks

```bash
npx tsc --noEmit                    # typecheck
npx eslint .                        # lint
npx prettier --check .              # format check
npx vitest run                      # unit tests
npx tsx scripts/verify-parsers.ts   # parses sample API responses + a garbage smoke test
npx tsx scripts/audit-glossary.ts   # every UI term resolves to a glossary entry
```

`verify-parsers.ts` expects a local `testing_Variants/_api_samples/`
directory of saved API responses (not tracked in git, optional). Everything
else runs with no setup. All of the above run in CI on every push/PR.

### Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for how data flows through the app,
the resilience/caching design, and the repo layout.

### Demo Mode

Demo Mode replaces live data with a bundled static dataset (one full season
per team) — useful for offline use, screenshots, or trying the app without
network access. Toggle it from in-app settings.

### Releasing updates (maintainers)

Sports Window has a built-in, cross-device update check (desktop only). On
launch it asks the latest [GitHub
Release](https://github.com/seara182/sports-window/releases) whether a newer
**signed** build exists; if so, it shows a one-click "Update available"
prompt that downloads, verifies, installs, and relaunches. The check is
configured in `src-tauri/tauri.conf.json` under `plugins.updater` (the
`endpoints` URL and the public verification key), and wired up in
`src/lib/updateCheck.ts`.

A signing keypair was generated with `npx tauri signer generate`. The
**public** key lives in `tauri.conf.json` (`plugins.updater.pubkey`); the
**private** key is kept out of git (stored locally, e.g.
`~/.tauri/sports-window.key`). Keep it safe — losing it means already-installed
apps can no longer accept updates from this key.

**Automated (recommended).** `.github/workflows/release.yml` builds the macOS
(`.dmg`) and Windows (`.exe`) installers on GitHub's runners and attaches
them — plus the signed `latest.json`/`.sig` updater artifacts — to a draft
GitHub Release. This is what gets installers in front of users without
needing both a Mac and a Windows machine on hand. To cut a release:

1. Bump the version in **all three** of `src-tauri/tauri.conf.json`
   (`version`), `src-tauri/Cargo.toml` (`package.version`), and
   `package.json` so they match.
2. One-time setup: add two repo secrets (Settings → Secrets and variables →
   Actions) so the cloud build can sign updater artifacts —
   `TAURI_SIGNING_PRIVATE_KEY` (the contents of `~/.tauri/sports-window.key`)
   and `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` (empty string if the key has none).
3. Tag and push:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
4. The workflow builds all platforms and creates a **draft** release with the
   installers attached. Review it on GitHub and publish when ready. On next
   launch, existing installs see the newer version in `latest.json` and show
   the update prompt.

**Manual fallback.** You can also build locally (`npx tauri build` with the
signing env vars set — see the workflow file for the exact variable names) and
attach the bundle, its `.sig`, and `latest.json` to a release by hand. Note
that a bundle must be built **on** the platform it targets — macOS can't
produce a Windows installer, and vice versa — which is the whole reason the
automated cloud build above exists.

### Known limitations

- The app relies on ESPN's undocumented public JSON API (with the MLB Stats
  API as a Giants fallback). These aren't official, documented APIs —
  endpoints could change or rate-limit without notice. Fetches retry with
  backoff and validate response shape before accepting them; if all of that
  fails, the app falls back to cached data and shows a "stale" indicator
  rather than going blank.
- Teams are user-selectable (any NFL/MLB team), but only the two SF teams
  get the hand-tuned easter-egg visuals.

### License

Sports Window is source-available, not open source: you can read it, build
it, and run it for personal use, but redistribution and commercial use
aren't permitted. See [LICENSE](LICENSE) for the exact terms.

This project isn't affiliated with, endorsed by, or sponsored by the NFL,
MLB, ESPN, or any team or league it displays information from.
