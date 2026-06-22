import { useEffect, useRef, useState, type RefObject } from 'react';

const TRIGGER_PX = 70;
const MAX_PULL_PX = 110;
/** Drag resistance: actual finger travel needed per px of visible pull. */
const RESISTANCE = 2.2;

interface PullToRefreshOptions<T extends HTMLElement> {
  /** The scrollable container to attach the gesture to. */
  containerRef: RefObject<T | null>;
  /** Disabled outside the mobile breakpoint, or while a refresh is in flight. */
  enabled: boolean;
  onRefresh: () => void;
}

/**
 * Native-feeling swipe-down-to-refresh for a scrollable container. Only
 * engages when the container is already scrolled to the top — otherwise an
 * ordinary downward scroll would get hijacked. Visual pull distance is capped
 * and grows slower than the finger (RESISTANCE) so it reads as "give", not a
 * 1:1 drag. Crossing TRIGGER_PX and releasing fires `onRefresh` once.
 */
export function usePullToRefresh<T extends HTMLElement>({
  containerRef,
  enabled,
  onRefresh,
}: PullToRefreshOptions<T>) {
  const [pull, setPull] = useState(0);
  const triggeredRef = useRef(false);
  const startYRef = useRef<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !enabled) return;

    const onTouchStart = (e: TouchEvent) => {
      if (el.scrollTop <= 0) {
        startYRef.current = e.touches[0].clientY;
        triggeredRef.current = false;
      } else {
        startYRef.current = null;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (startYRef.current === null) return;
      const delta = e.touches[0].clientY - startYRef.current;
      if (delta <= 0) {
        setPull(0);
        return;
      }
      // Still at the top and pulling down: this gesture is ours, not the
      // page's — block the native overscroll/bounce so our indicator drives it.
      if (el.scrollTop <= 0) {
        e.preventDefault();
        setPull(Math.min(delta / RESISTANCE, MAX_PULL_PX));
      }
    };

    const onTouchEnd = () => {
      if (startYRef.current === null) return;
      startYRef.current = null;
      setPull((current) => {
        if (current >= TRIGGER_PX && !triggeredRef.current) {
          triggeredRef.current = true;
          onRefresh();
        }
        return 0;
      });
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('touchcancel', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [containerRef, enabled, onRefresh]);

  return { pull, triggerPx: TRIGGER_PX };
}
