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
- **macOS:** `Sports Window_1.0.0_x64.dmg`

The Windows installer bundles the WebView2 runtime, so it works fully
offline — no extra downloads during setup, even on a machine without
internet access.

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

To publish a new version:

1. Bump the version in **both** `src-tauri/tauri.conf.json` (`version`) and
   `src-tauri/Cargo.toml` (`package.version`) so they match, and in
   `package.json`.
2. Point the build at the private key (the app verifies signatures against
   the public key it was built with):
   ```bash
   export TAURI_SIGNING_PRIVATE_KEY="$HOME/.tauri/sports-window.key"
   export TAURI_SIGNING_PRIVATE_KEY_PASSWORD=""   # empty if the key has no password
   npx tauri build
   ```
   With `bundle.createUpdaterArtifacts: true` set in `tauri.conf.json`, this
   emits the platform bundle, a detached `.sig` signature, and a
   `latest.json` manifest under the bundle output directory.
3. Create (or update) the GitHub Release for that version tag (e.g.
   `v1.1.0`) and attach the platform bundle, its `.sig`, and `latest.json`.
4. On next launch, other installs see the newer version in `latest.json` and
   show the update prompt.

> **Per-platform builds:** a bundle must be built **on** the platform it
> targets — Windows cannot produce a macOS bundle, and vice versa. A release
> only delivers an installable update to the platforms it has assets for;
> until a given version's macOS build is published, a Mac can detect a newer
> version exists but has nothing to install yet — an acceptable interim
> state.

### Known limitations

- The app relies on ESPN's undocumented public JSON API (with the MLB Stats
  API as a Giants fallback). These aren't official, documented APIs —
  endpoints could change or rate-limit without notice. Fetches retry with
  backoff and validate response shape before accepting them; if all of that
  fails, the app falls back to cached data and shows a "stale" indicator
  rather than going blank.
- Teams are user-selectable (any NFL/MLB team), but only the two SF teams
  get the hand-tuned easter-egg visuals.
- Updates are built and signed by hand per platform — there's no CI pipeline
  that builds and signs every platform's release artifact automatically yet.

### License

Sports Window is source-available, not open source: you can read it, build
it, and run it for personal use, but redistribution and commercial use
aren't permitted. See [LICENSE](LICENSE) for the exact terms.

This project isn't affiliated with, endorsed by, or sponsored by the NFL,
MLB, ESPN, or any team or league it displays information from.
