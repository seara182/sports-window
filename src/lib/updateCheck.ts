import { platform } from '@tauri-apps/plugin-os';
import { check } from '@tauri-apps/plugin-updater';
import { ask } from '@tauri-apps/plugin-dialog';
import { relaunch } from '@tauri-apps/plugin-process';

const DESKTOP_PLATFORMS = new Set(['macos', 'windows', 'linux']);

/**
 * Cross-device update sync (Phase 4) — desktop only.
 *
 * On launch we silently ask the configured GitHub Releases `latest.json` whether a
 * newer, signed build exists. If one does, we show a single native prompt; on
 * "Update" the updater plugin downloads the bundle for this platform, verifies it
 * against the public key in `tauri.conf.json`, installs it, and relaunches the app
 * on the new version. No update, "Not now", mobile, or running outside Tauri
 * (e.g. `vite preview`) are all no-ops — the app just renders on the current
 * version and the check runs again next launch.
 */
export async function runDesktopUpdateCheck(): Promise<void> {
  // Guard to desktop. On mobile the updater plugin is not registered, and outside
  // Tauri `platform()` throws — either way there is nothing to check.
  let os: string;
  try {
    os = platform();
  } catch {
    return;
  }
  if (!DESKTOP_PLATFORMS.has(os)) return;

  try {
    const update = await check();
    if (!update) return;

    const accepted = await ask('A newer version of Sports Window is ready. Install it now?', {
      title: 'Update available',
      kind: 'info',
      okLabel: 'Update',
      cancelLabel: 'Not now',
    });
    if (!accepted) return;

    await update.downloadAndInstall();
    await relaunch();
  } catch (err) {
    // A failed or unreachable update check must never disrupt the app.
    console.warn('[updater] check failed', err);
  }
}
