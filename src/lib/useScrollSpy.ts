// Tracks which of a set of section ids is currently scrolled to the top of
// a scroll container, for sidebar "active link" highlighting.
import { useEffect, useState, type RefObject } from 'react';

export function useScrollSpy(
  containerRef: RefObject<HTMLElement | null>,
  sectionIds: readonly string[],
  resetKey?: unknown,
): string {
  const [active, setActive] = useState<string>(sectionIds[0]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const top = visible.reduce((a, b) =>
          a.boundingClientRect.top <= b.boundingClientRect.top ? a : b,
        );
        setActive(top.target.id);
      },
      { root, rootMargin: '0px 0px -70% 0px', threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [containerRef, sectionIds, resetKey]);

  return active;
}
