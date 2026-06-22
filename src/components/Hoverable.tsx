import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { getGlossary, statChipTerm } from '../data/glossary';

interface Props {
  /** Glossary key. */
  term: string;
  children: ReactNode;
  /** Override the glossary lookup with explicit content (e.g. unit conversions). */
  title?: string;
  body?: string;
}

const OPEN_DELAY = 150;
const GAP = 8;
const MARGIN = 8;

export function Hoverable({ term, children, title, body }: Props) {
  const { i18n } = useTranslation();
  const entry = title && body ? { title, body } : getGlossary(term, i18n.language);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({
    top: -9999,
    left: -9999,
  });
  const tooltipId = useId();

  // Touch devices never fire hover events, so the tooltip is tap-toggled there
  // instead. Evaluated once on mount and stable for the component's lifetime.
  const [isTouch] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches,
  );

  const show = useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), OPEN_DELAY);
  }, []);
  const hide = useCallback(() => {
    window.clearTimeout(timer.current);
    setOpen(false);
  }, []);

  // Touch: first tap opens, second tap (or tap on the trigger) toggles it shut.
  const toggle = useCallback(() => {
    window.clearTimeout(timer.current);
    setOpen((o) => !o);
  }, []);

  // Touch: a tap anywhere outside the trigger and the tooltip dismisses it.
  useEffect(() => {
    if (!isTouch || !open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target) || tipRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [isTouch, open]);

  // Position after render so we can measure the tooltip and flip near edges.
  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !tipRef.current) return;
    const t = triggerRef.current.getBoundingClientRect();
    const tip = tipRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let top = t.bottom + GAP;
    if (top + tip.height > vh - MARGIN) {
      const above = t.top - tip.height - GAP;
      if (above >= MARGIN) top = above;
    }
    let left = t.left;
    left = Math.min(left, vw - tip.width - MARGIN);
    left = Math.max(MARGIN, left);

    setCoords({ top, left });
  }, [open]);

  if (!entry) {
    // A term in the UI with no glossary entry is a bug — surface it loudly in
    // dev, but never break the render.
    if (import.meta.env.DEV) console.warn(`[glossary] missing entry: "${term}"`);
    return <>{children}</>;
  }

  return (
    <>
      <span
        ref={triggerRef}
        className="hoverable"
        tabIndex={0}
        role="button"
        aria-describedby={open ? tooltipId : undefined}
        onClick={isTouch ? toggle : undefined}
        onMouseEnter={isTouch ? undefined : show}
        onMouseLeave={isTouch ? undefined : hide}
        onFocus={isTouch ? undefined : show}
        onBlur={isTouch ? undefined : hide}
      >
        {children}
      </span>
      {open &&
        createPortal(
          <div
            ref={tipRef}
            id={tooltipId}
            role="tooltip"
            className="tooltip tooltip--enter"
            style={{ top: coords.top, left: coords.left }}
          >
            <div className="tooltip__term">{entry.title}</div>
            <div className="tooltip__body">{entry.body}</div>
          </div>,
          document.body,
        )}
    </>
  );
}

/** Wraps a player-card stat-chip / comparison-bar / sparkline label in a
 * Hoverable if a glossary entry exists for it; otherwise renders plain text. */
export function HoverableStatLabel({ label }: { label: string }) {
  const term = statChipTerm(label);
  return term ? <Hoverable term={term}>{label}</Hoverable> : <>{label}</>;
}
