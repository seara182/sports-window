import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { platform } from '@tauri-apps/plugin-os';
import {
  BaseballIcon,
  BatIcon,
  CloseIcon,
  FootballIcon,
  GearIcon,
  MinimizeIcon,
  RefreshIcon,
  StaleIcon,
} from './Icons';
import type { SportKey } from '../types/domain';
import './TitleBar.css';

interface Props {
  sport: SportKey;
  updatedLabel: string;
  stale: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onOpenSettings: () => void;
  /** Layout-only: ≤768px renders the mobile header (hamburger, no window controls). */
  isMobile: boolean;
  /** Layout-only: whether the mobile nav drawer is open (for the hamburger's aria state). */
  navOpen: boolean;
  /** Layout-only: toggle the mobile nav drawer. */
  onToggleNav: () => void;
}

/** Inline hamburger — kept local to TitleBar to avoid touching Icons.tsx. */
function MenuIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

type Payoff = 'idle' | 'bb-windup' | 'bb-launch' | 'fb-tumble' | 'pop';

const PAYOFF_CLICKS = 10;

export function TitleBar({
  sport,
  updatedLabel,
  stale,
  refreshing,
  onRefresh,
  onOpenSettings,
  isMobile,
  navOpen,
  onToggleNav,
}: Props) {
  const win = getCurrentWindow();

  // On mobile there is no window chrome to drag, so the drag region is dropped
  // entirely; on desktop the whole bar stays draggable.
  const dragProps = isMobile ? {} : { 'data-tauri-drag-region': '' };

  const iconRef = useRef<HTMLButtonElement>(null);
  const clicksRef = useRef(0);
  const [payoff, setPayoff] = useState<Payoff>('idle');
  const payoffTimers = useRef<number[]>([]);

  // macOS renders native traffic-light buttons (decorations + overlay title bar),
  // so the custom minimize/close controls are Windows/Linux-only. Any platform
  // other than macOS falls back to the Windows behavior.
  const [os, setOs] = useState<string>('windows');
  useEffect(() => {
    try {
      setOs(platform());
    } catch {
      /* OS plugin unavailable (e.g. plain vite preview) — keep Windows fallback */
    }
  }, []);
  const isMac = os === 'macos';

  // Reset the click counter (and any in-flight animation) when the team changes.
  useEffect(() => {
    clicksRef.current = 0;
    // FIX: pending payoff setTimeouts survived a team switch and re-triggered the
    // "pop"/"idle" states on the new team's icon — clear them on reset.
    payoffTimers.current.forEach((id) => window.clearTimeout(id));
    payoffTimers.current = [];
    setPayoff('idle');
    iconRef.current?.classList.remove('titlebar__icon--wobble');
  }, [sport]);

  const handleIconClick = () => {
    if (payoff !== 'idle') return;

    const next = clicksRef.current + 1;
    if (next < PAYOFF_CLICKS) {
      clicksRef.current = next;
      const el = iconRef.current;
      if (el) {
        el.classList.remove('titlebar__icon--wobble');
        void el.offsetWidth;
        el.classList.add('titlebar__icon--wobble');
      }
      return;
    }

    clicksRef.current = 0;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const el = iconRef.current;
    if (sport === 'mlb') {
      if (el) {
        const rect = el.getBoundingClientRect();
        const originX = rect.left + rect.width / 2;
        el.style.setProperty('--bb-launch-x', `calc(100vw - ${originX}px)`);
      }
      setPayoff('bb-windup');
      payoffTimers.current.push(window.setTimeout(() => setPayoff('bb-launch'), 80));
    } else {
      setPayoff('fb-tumble');
    }
    payoffTimers.current.push(window.setTimeout(() => setPayoff('pop'), 600));
    payoffTimers.current.push(window.setTimeout(() => setPayoff('idle'), 800));
  };

  const { t } = useTranslation();
  const SportIcon = sport === 'mlb' ? BaseballIcon : FootballIcon;
  const teamLabel = sport === 'mlb' ? 'Giants' : '49ers';

  return (
    <header
      className={`titlebar${isMobile ? ' titlebar--mobile' : ''}${isMac ? ' titlebar--mac' : ''}`}
      {...dragProps}
    >
      {isMobile && (
        <button
          type="button"
          className="tb-btn titlebar__hamburger"
          onClick={onToggleNav}
          aria-label={t('titlebar.toggleNav')}
          aria-expanded={navOpen}
          title={t('titlebar.menu')}
        >
          <MenuIcon size={20} />
        </button>
      )}
      <div className="titlebar__brand" {...dragProps}>
        <span className="titlebar__dot" />
        Sports Window
        <span className="titlebar__mascot">
          {sport === 'mlb' && (
            <BatIcon
              size={22}
              className={`titlebar__bat${payoff === 'bb-launch' ? ' is-active' : ''}`}
            />
          )}
          {sport === 'nfl' && (
            <span
              className={`titlebar__goalposts${payoff === 'fb-tumble' ? ' is-active' : ''}`}
              aria-hidden
            >
              <span className="titlebar__goalpost-line" />
              <span className="titlebar__goalpost-line" />
            </span>
          )}
          <button
            type="button"
            className={`titlebar__icon titlebar__icon--${sport}${
              payoff !== 'idle' ? ` titlebar__icon--${payoff}` : ''
            }`}
            ref={iconRef}
            onClick={handleIconClick}
            aria-label={`${teamLabel} mascot icon`}
            title={teamLabel}
          >
            <SportIcon size={20} />
          </button>
        </span>
      </div>

      <div className="titlebar__spacer" {...dragProps} />

      <div className="titlebar__status" {...dragProps}>
        {stale && (
          <span className="titlebar__stale" title={t('titlebar.stale')}>
            <StaleIcon size={13} />
            {t('titlebar.staleBadge')}
          </span>
        )}
        <span>{t('titlebar.updated', { time: updatedLabel })}</span>
      </div>

      <div className="titlebar__controls">
        <button
          className={`tb-btn tb-btn--refresh${refreshing ? ' is-refreshing' : ''}`}
          onClick={onRefresh}
          disabled={refreshing}
          aria-label={t('titlebar.refreshData')}
          title={t('titlebar.refresh')}
        >
          <RefreshIcon size={17} />
        </button>
        <button
          className="tb-btn"
          onClick={() => onOpenSettings()}
          aria-label={t('titlebar.settings')}
          title={t('titlebar.settings')}
        >
          <GearIcon size={17} />
        </button>
        {!isMac && !isMobile && (
          <>
            <button
              className="tb-btn"
              onClick={() => void win.minimize()}
              aria-label={t('titlebar.minimize')}
              title={t('titlebar.minimize')}
            >
              <MinimizeIcon size={17} />
            </button>
            <button
              className="tb-btn tb-btn--close"
              onClick={() => void win.close()}
              aria-label={t('titlebar.close')}
              title={t('titlebar.close')}
            >
              <CloseIcon size={17} />
            </button>
          </>
        )}
      </div>
    </header>
  );
}
