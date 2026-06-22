// Shared "card-flip" detail overlay. Rendered once via DetailOverlayProvider
// and reused for every clickable card in the app (game results, roster rows,
// spotlight card, history data points, etc.) — see useDetailOverlay.tsx.
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type AnimationEvent,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { CloseIcon } from './Icons';
import { useSettings } from '../state/SettingsProvider';
import './DetailOverlay.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** Called once the close animation has finished and the panel has unmounted. */
  onClosed: () => void;
  originRect?: DOMRect;
  children: ReactNode;
}

const PANEL_MAX_WIDTH = 680;
const PANEL_EST_HEIGHT = 520;

export function DetailOverlay({ isOpen, onClose, onClosed, originRect, children }: Props) {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [rendered, setRendered] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setRendered(true);
      setClosing(false);
    } else if (rendered) {
      setClosing(true);
    }
  }, [isOpen, rendered]);

  useEffect(() => {
    if (isOpen && rendered) {
      closeBtnRef.current?.focus();
    }
  }, [isOpen, rendered]);

  useEffect(() => {
    if (!rendered) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [rendered, onClose]);

  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;
    if (rendered) root.setAttribute('aria-hidden', 'true');
    else root.removeAttribute('aria-hidden');
    return () => root.removeAttribute('aria-hidden');
  }, [rendered]);

  const originVars = useMemo<CSSProperties>(() => {
    if (!originRect) return {};
    const vpCx = window.innerWidth / 2;
    const vpCy = window.innerHeight / 2;
    const panelW = Math.min(PANEL_MAX_WIDTH, window.innerWidth - 48);
    const panelH = PANEL_EST_HEIGHT;
    const startX = originRect.left + originRect.width / 2 - vpCx;
    const startY = originRect.top + originRect.height / 2 - vpCy;
    const startSx = originRect.width / panelW;
    const startSy = originRect.height / Math.max(panelH, 200);
    return {
      '--start-x': `${startX}px`,
      '--start-y': `${startY}px`,
      '--start-sx': startSx,
      '--start-sy': startSy,
    } as CSSProperties;
  }, [originRect]);

  if (!rendered) return null;

  const handleAnimationEnd = (e: AnimationEvent<HTMLDivElement>) => {
    if (!closing) return;
    if (e.animationName === 'card-flip-out' || e.animationName === 'card-flip-out-center') {
      setRendered(false);
      setClosing(false);
      onClosed();
    }
  };

  const hasOrigin = !!originRect;
  const panelClass = [
    'detail-overlay__panel',
    hasOrigin ? 'has-origin' : 'no-origin',
    closing ? 'is-closing' : 'is-opening',
  ].join(' ');

  return createPortal(
    <div className="detail-overlay" data-font-size={settings.fontSize}>
      <div
        className={`detail-overlay__backdrop${closing ? ' is-closing' : ''}`}
        onClick={onClose}
      />
      <div className="detail-overlay__wrap">
        <div
          className={panelClass}
          style={originVars}
          role="dialog"
          aria-modal="true"
          onAnimationEnd={handleAnimationEnd}
        >
          <button
            ref={closeBtnRef}
            className="detail-overlay__close"
            onClick={onClose}
            aria-label={t('common.close')}
          >
            <CloseIcon size={18} />
          </button>
          <div className="detail-overlay__body">{children}</div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
