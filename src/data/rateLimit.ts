// A tiny pub/sub bridge so the low-level HTTP layer can tell the DataProvider
// that ESPN returned an HTTP 429 (rate limited), without the data/parser
// modules needing to know about React. The provider shows a toast and applies
// exponential backoff; see DataProvider.tsx.

type Listener = () => void;

const listeners = new Set<Listener>();

/** Subscribe to rate-limit (429) events. Returns an unsubscribe function. */
export function onRateLimit(cb: Listener): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/** Fired by the HTTP layer whenever a request comes back 429. */
export function notifyRateLimit(): void {
  for (const cb of listeners) {
    try {
      cb();
    } catch {
      /* a listener throwing must never break a fetch path */
    }
  }
}
