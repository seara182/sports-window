import type { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { SportKey, TeamData } from '../types/domain';
import { useSettings } from '../state/SettingsProvider';
import { resolveGradient } from '../lib/sidebarBackgrounds';
import { NextGameWidget } from './NextGameWidget';
import { BaseballScene, FootballScene, GradientScene } from './WpaScenes';
import './Sidebar.css';

const NAV_LINKS = [
  { key: 'nav.dashboard', targetId: 'section-dashboard' },
  { key: 'nav.spotlight', targetId: 'section-spotlight' },
  { key: 'nav.formation', mlbKey: 'nav.lineup', targetId: 'section-formation' },
  { key: 'nav.standings', targetId: 'section-standings' },
  { key: 'nav.venue', targetId: 'section-venue' },
  { key: 'nav.history', targetId: 'section-history' },
  { key: 'nav.playoffs', targetId: 'section-playoffs' },
  { key: 'nav.teamHub', targetId: 'section-roster' },
  { key: 'nav.teamSelector', targetId: null },
] as const;

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

interface Props {
  sport: SportKey;
  teamName: string;
  team: TeamData | null;
  activeSection: string;
  /** Opens the team-selector panel anchored to the sidebar nav button. */
  onOpenTeamSelector: (anchor: HTMLElement) => void;
  /** Layout-only: at ≤768px the rail renders as an off-canvas drawer. */
  isMobile: boolean;
  /** Layout-only: whether the mobile drawer is currently open. */
  navOpen: boolean;
  /** Layout-only: dismiss the mobile drawer (tap a link, the scrim, or outside). */
  onCloseNav: () => void;
}

export function Sidebar({
  sport,
  teamName,
  team,
  activeSection,
  onOpenTeamSelector,
  isMobile,
  navOpen,
  onCloseNav,
}: Props) {
  const { t } = useTranslation();
  const { settings } = useSettings();

  // The bespoke SF skyline scenes are an easter egg: only when BOTH SF teams are
  // selected AND the toggle is on. Any other team (or the toggle off) gets the
  // user's chosen preset gradient + optional sport icon for the current tab.
  const bothSF = settings.selectedNfl === 'nfl-sf' && settings.selectedMlb === 'mlb-sf';
  const useSpecial = bothSF && settings.sfSpecialGraphics;
  const SfScene = sport === 'nfl' ? FootballScene : BaseballScene;
  const gradientId = sport === 'nfl' ? settings.sidebarGradientNfl : settings.sidebarGradientMlb;
  const showIcon = sport === 'nfl' ? settings.sidebarIconNfl : settings.sidebarIconMlb;

  // The curated History section only exists for the bespoke SF teams; drop its
  // nav entry for any other selected team.
  const links = NAV_LINKS.filter(
    (l) => l.targetId !== 'section-history' || team?.bespoke !== false,
  );

  // 9 nav items (>5) → off-canvas drawer rather than a bottom bar (per roadmap
  // Task 2). Tapping a link navigates, then closes the drawer on mobile.
  const handleNav = (e: MouseEvent<HTMLButtonElement>, targetId: string | null) => {
    if (targetId) {
      scrollToSection(targetId);
      // Close the drawer after navigating to a section. The Team selector item
      // is exempt: its panel anchors to this button, which must stay on-screen.
      if (isMobile) onCloseNav();
    } else {
      onOpenTeamSelector(e.currentTarget);
    }
  };

  return (
    <>
      {/* Scrim sits behind the drawer and closes it; mobile-only via CSS. */}
      <div
        className={`sidebar__scrim${isMobile && navOpen ? ' is-open' : ''}`}
        onClick={onCloseNav}
        aria-hidden
      />
      <aside className={`sidebar${isMobile && navOpen ? ' is-open' : ''}`}>
        <div className="sidebar__scene">
          {useSpecial ? (
            <SfScene />
          ) : (
            <GradientScene
              sport={sport}
              gradient={resolveGradient(gradientId)}
              showIcon={showIcon}
            />
          )}
        </div>
        <div className="sidebar__glass">
          <div className="sidebar__team">{teamName}</div>
          <nav className="sidebar__nav">
            {links.map((link) => (
              <button
                key={link.key}
                type="button"
                className={`sidebar__link${link.targetId === activeSection ? ' is-active' : ''}`}
                onClick={(e) => handleNav(e, link.targetId)}
              >
                {t(sport === 'mlb' && 'mlbKey' in link ? link.mlbKey : link.key)}
              </button>
            ))}
          </nav>
          <div className="sidebar__spacer" />
          <NextGameWidget upcoming={team?.hero.upcoming} />
          <div className="sidebar__monogram">made by Mika</div>
        </div>
      </aside>
    </>
  );
}
