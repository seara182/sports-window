import { useCallback, useEffect, useState } from 'react';
import { disable, enable, isEnabled } from '@tauri-apps/plugin-autostart';

interface AutostartState {
  /** null while the current registry state is still being read. */
  enabled: boolean | null;
  busy: boolean;
  toggle: () => void;
}

/** Reads and toggles the OS "launch at startup" registration. */
export function useAutostart(): AutostartState {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    isEnabled()
      .then((v) => !cancelled && setEnabled(v))
      .catch(() => !cancelled && setEnabled(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = useCallback(() => {
    if (busy || enabled === null) return;
    setBusy(true);
    const action = enabled ? disable() : enable();
    action
      .then(() => setEnabled(!enabled))
      .catch((err) => console.warn('[autostart] toggle failed', err))
      .finally(() => setBusy(false));
  }, [busy, enabled]);

  return { enabled, busy, toggle };
}
