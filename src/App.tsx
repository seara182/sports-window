import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n';
import i18n from './i18n';
import { setFormatLocale } from './lib/format';
import { ThemeProvider } from './state/ThemeProvider';
import { DataProvider, useData } from './state/DataProvider';
import { SettingsProvider, useSettings } from './state/SettingsProvider';
import { TitleBar } from './components/TitleBar';
import { SegmentedControl } from './components/SegmentedControl';
import { SettingsModal } from './components/SettingsModal';
import { TeamSelector } from './components/TeamSelector';
import { RuleBookOverlay } from './components/RuleBookOverlay';
import { BookIcon } from './components/Icons';
import { Sidebar } from './components/Sidebar';
import { TeamView } from './views/TeamView';
import { LoadingView } from './views/LoadingView';
import { DetailOverlayProvider } from './hooks/useDetailOverlay';
import { initialTab } from './data/settings';
import { teamById } from './data/teamConfig';
import { buildDemoTeamData, DEMO_DATASETS } from './data/demoData';
import { relativeTime } from './lib/format';
import { teamThemeVars } from './lib/teamTheme';
import { useNow } from './lib/useNow';
import { usePullToRefresh } from './hooks/usePullToRefresh';
import { useScrollSpy } from './lib/useScrollSpy';
import { runDesktopUpdateCheck } from './lib/updateCheck';
import type { SportKey } from './types/domain';
import './styles/app-shell.css';

const SECTION_IDS = [
  'section-dashboard',
  'section-spotlight',
  'section-formation',
  'section-standings',
  'section-venue',
  'section-history',
  'section-playoffs',
  'section-roster',
] as const;

function Shell() {
  const data = useData();
  const { settings, loaded, setLastTab } = useSettings();
  const { t } = useTranslation();
  const now = useNow();

  // Keep i18next + date formatting in step with the persisted language.
  useEffect(() => {
    void i18n.changeLanguage(settings.language);
    setFormatLocale(settings.language);
  }, [settings.language]);

  const [tab, setTab] = useState<SportKey>('nfl');
  const didInit = useRef(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [teamSelAnchor, setTeamSelAnchor] = useState<HTMLElement | null>(null);
  const [ruleBookOpen, setRuleBookOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeSection = useScrollSpy(scrollRef, SECTION_IDS, tab);

  // Layout-only: track the ≤768px breakpoint so the sidebar becomes a drawer and
  // the title bar becomes a plain mobile header. `navOpen` drives that drawer.
  const [isMobile, setIsMobile] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  // Returning to desktop width must never leave a stale open drawer behind.
  useEffect(() => {
    if (!isMobile) setNavOpen(false);
  }, [isMobile]);

  // Swipe-down-to-refresh on the mobile content column. Disabled in Demo Mode
  // (there's nothing to refresh) and while a refresh is already in flight.
  const { pull, triggerPx } = usePullToRefresh({
    containerRef: scrollRef,
    enabled: isMobile && !settings.demoMode && !data.refreshing,
    onRefresh: data.refresh,
  });

  // Apply the persisted "default team" once settings have loaded.
  useEffect(() => {
    if (loaded && !didInit.current) {
      didInit.current = true;
      setTab(initialTab(settings));
    }
  }, [loaded, settings]);

  const changeTab = useCallback(
    (t: SportKey) => {
      setTab(t);
      setLastTab(t);
    },
    [setLastTab],
  );

  const rawTeam = tab === 'nfl' ? data.nfl : data.mlb;
  const team = settings.demoMode ? buildDemoTeamData(tab) : rawTeam;

  // Selected team configs drive instant labels/names even before data arrives.
  const nflCfg = teamById('nfl', settings.selectedNfl);
  const mlbCfg = teamById('mlb', settings.selectedMlb);
  const activeCfg = tab === 'nfl' ? nflCfg : mlbCfg;

  const themeVars = teamThemeVars(team, tab);

  // Set on the document root (not just `.app`) so portaled content — the
  // detail overlay, tooltips — also sees the active team's accent colors.
  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty('--team-gradient', themeVars.gradient);
    root.setProperty('--team-accent', themeVars.accent);
  }, [themeVars.gradient, themeVars.accent]);

  return (
    <DetailOverlayProvider>
      <div className="app">
        <TitleBar
          sport={tab}
          updatedLabel={relativeTime(data.fetchedAt, now)}
          stale={data.stale}
          refreshing={data.refreshing}
          onRefresh={data.refresh}
          onOpenSettings={() => setSettingsOpen(true)}
          isMobile={isMobile}
          navOpen={navOpen}
          onToggleNav={() => setNavOpen((v) => !v)}
        />
        <div className="app__body">
          <Sidebar
            sport={tab}
            teamName={activeCfg.displayName}
            team={team}
            activeSection={activeSection}
            onOpenTeamSelector={setTeamSelAnchor}
            isMobile={isMobile}
            navOpen={navOpen}
            onCloseNav={() => setNavOpen(false)}
          />
          <main className="app__main">
            {settings.demoMode && (
              <div className="demo-banner">
                {t('data.demoBanner', { label: DEMO_DATASETS[tab].label })}
              </div>
            )}
            <div className="app__topbar">
              <div className="app__topbar-spacer" />
              <SegmentedControl
                value={tab}
                onChange={changeTab}
                labels={{ nfl: nflCfg.shortName, mlb: mlbCfg.shortName }}
              />
              <button
                type="button"
                className="app__topbar-rulebook"
                onClick={() => setRuleBookOpen(true)}
                aria-label="Open Rule Book"
                title="Rule Book"
              >
                <BookIcon size={18} />
              </button>
            </div>
            <div className="app__scroll" data-font-size={settings.fontSize} ref={scrollRef}>
              {isMobile && pull > 0 && (
                <div
                  className={`pull-refresh${pull >= triggerPx ? ' pull-refresh--ready' : ''}`}
                  style={{ height: pull }}
                  aria-hidden="true"
                >
                  <span className="pull-refresh__spinner" />
                </div>
              )}
              <div className="app__content" key={`${tab}:${activeCfg.id}`}>
                {team ? (
                  <TeamView sport={tab} team={team} />
                ) : data.loading ? (
                  <LoadingView />
                ) : (
                  <div className="empty-note" style={{ paddingTop: 80 }}>
                    {t('data.loadFailed', { team: activeCfg.shortName })}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>

        <SettingsModal isOpen={settingsOpen} sport={tab} onClose={() => setSettingsOpen(false)} />

        {teamSelAnchor && (
          <TeamSelector anchor={teamSelAnchor} onClose={() => setTeamSelAnchor(null)} />
        )}

        {data.rateLimitedMessage && (
          <div className="rate-limit-toast" role="status">
            {data.rateLimitedMessage}
          </div>
        )}

        <RuleBookOverlay isOpen={ruleBookOpen} onClose={() => setRuleBookOpen(false)} />
      </div>
    </DetailOverlayProvider>
  );
}

function Themed() {
  const { settings, setThemePref } = useSettings();
  return (
    <ThemeProvider initialPref={settings.themePref} onPrefChange={setThemePref}>
      <DataProvider>
        <Shell />
      </DataProvider>
    </ThemeProvider>
  );
}

export default function App() {
  // Desktop-only cross-device update check (Phase 4). Runs once on launch; it is a
  // no-op on mobile and outside Tauri, and never throws into render.
  useEffect(() => {
    void runDesktopUpdateCheck();
  }, []);

  return (
    <SettingsProvider>
      <Themed />
    </SettingsProvider>
  );
}
