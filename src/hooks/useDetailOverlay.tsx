// Central context for the shared card-flip detail overlay (see
// DetailOverlay.tsx). Any component can call open() with the panel content
// and the triggering element's bounding rect, without prop-drilling.
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { DetailOverlay } from '../components/DetailOverlay';

interface DetailOverlayContextValue {
  open: (content: ReactNode, originRect?: DOMRect) => void;
  close: () => void;
}

const DetailOverlayContext = createContext<DetailOverlayContextValue | null>(null);

export function useDetailOverlay(): DetailOverlayContextValue {
  const ctx = useContext(DetailOverlayContext);
  if (!ctx) throw new Error('useDetailOverlay must be used within DetailOverlayProvider');
  return ctx;
}

export function DetailOverlayProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ReactNode>(null);
  const [isOpen, setIsOpen] = useState(false);
  const originRect = useRef<DOMRect | undefined>(undefined);
  const triggerEl = useRef<HTMLElement | null>(null);

  const open = useCallback((node: ReactNode, rect?: DOMRect) => {
    triggerEl.current = (document.activeElement as HTMLElement) ?? null;
    originRect.current = rect;
    setContent(node);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleClosed = useCallback(() => {
    setContent(null);
    triggerEl.current?.focus?.();
    triggerEl.current = null;
  }, []);

  const value = useMemo<DetailOverlayContextValue>(() => ({ open, close }), [open, close]);

  return (
    <DetailOverlayContext.Provider value={value}>
      {children}
      <DetailOverlay
        isOpen={isOpen}
        onClose={close}
        onClosed={handleClosed}
        originRect={originRect.current}
      >
        {content}
      </DetailOverlay>
    </DetailOverlayContext.Provider>
  );
}
