// True settings window — a centered, app-dimming modal that replaces the old
// anchored SettingsPopover. Built on the same render/closing animation pattern as
// RuleBookOverlay (portal, dimmed backdrop, Escape + backdrop-click close, focus
// management, aria-hidden on the rest of the app). Holds every app preference plus
// the per-sport sidebar appearance controls, with a creator blurb filling the
// left pane.
import { useEffect, useRef, useState, type AnimationEvent } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { platform } from '@tauri-apps/plugin-os';
import { useTheme } from '../state/ThemeProvider';
import { useSettings } from '../state/SettingsProvider';
import { useData } from '../state/DataProvider';
import { useAutostart } from '../lib/useAutostart';
import { Toggle } from './Toggle';
import { CloseIcon } from './Icons';
import { GRADIENT_PRESETS } from '../lib/sidebarBackgrounds';
import { DEMO_DATASETS } from '../data/demoData';
import { buildDiagnosticsReport, copyToClipboard } from '../lib/diagnostics';
import pkg from '../../package.json';
import type { ThemePref } from '../lib/theme';
import type { DefaultTabPref, FontSizePref, LanguagePref } from '../data/settings';
import type { SportKey } from '../types/domain';
import './SettingsModal.css';

function currentPlatform(): string {
  try {
    return platform();
  } catch {
    return 'unknown';
  }
}

const DESKTOP_PLATFORMS = new Set(['macos', 'windows', 'linux']);

/** Autostart (launch-at-login) is a desktop-only plugin — not registered on
 *  iOS/Android, and outside Tauri `platform()` throws. Either way, hide the toggle. */
function isDesktop(): boolean {
  try {
    return DESKTOP_PLATFORMS.has(platform());
  } catch {
    return false;
  }
}

interface ChoiceProps<T extends string> {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}
function Choice<T extends string>({ value, options, onChange }: ChoiceProps<T>) {
  return (
    <div className="choice" role="group">
      {options.map((o) => (
        <button
          key={o.value}
          className={`choice__opt${value === o.value ? ' is-active' : ''}`}
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

interface Props {
  isOpen: boolean;
  sport: SportKey;
  onClose: () => void;
}

export function SettingsModal({ isOpen, sport, onClose }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    settings,
    setDefaultTab,
    setFontSize,
    setDemoMode,
    setLanguage,
    setSidebarGradient,
    setSidebarIcon,
    setSfSpecialGraphics,
  } = useSettings();
  const data = useData();
  const autostart = useAutostart();
  const [rendered, setRendered] = useState(false);
  const [closing, setClosing] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const handleCopyDiagnostics = async () => {
    const report = buildDiagnosticsReport({
      appVersion: pkg.version,
      platform: currentPlatform(),
      selectedNfl: settings.selectedNfl,
      selectedMlb: settings.selectedMlb,
      demoMode: settings.demoMode,
      language: settings.language,
      lastRefreshAt: data.fetchedAt,
      stale: data.stale,
    });
    const ok = await copyToClipboard(report);
    setCopyState(ok ? 'copied' : 'failed');
    setTimeout(() => setCopyState('idle'), 3000);
  };

  useEffect(() => {
    if (isOpen) {
      setRendered(true);
      setClosing(false);
    } else if (rendered) {
      setClosing(true);
    }
  }, [isOpen, rendered]);

  useEffect(() => {
    if (isOpen && rendered) closeBtnRef.current?.focus();
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

  if (!rendered) return null;

  const handleAnimationEnd = (e: AnimationEvent<HTMLDivElement>) => {
    if (closing && e.animationName === 'settings-modal-out') {
      setRendered(false);
      setClosing(false);
    }
  };

  const themeOpts: { value: ThemePref; label: string }[] = [
    { value: 'system', label: t('settings.system') },
    { value: 'light', label: t('settings.light') },
    { value: 'dark', label: t('settings.dark') },
  ];
  // 49ers / Giants are team names and stay as-is; only "Last viewed" translates.
  const tabOpts: { value: DefaultTabPref; label: string }[] = [
    { value: 'niners', label: '49ers' },
    { value: 'giants', label: 'Giants' },
    { value: 'last', label: t('settings.lastViewed') },
  ];
  const fontSizeOpts: { value: FontSizePref; label: string }[] = [
    { value: 'small', label: t('settings.small') },
    { value: 'medium', label: t('settings.medium') },
    { value: 'large', label: t('settings.large') },
  ];
  const demoOpts: { value: 'off' | 'on'; label: string }[] = [
    { value: 'off', label: t('settings.off') },
    { value: 'on', label: t('settings.on') },
  ];
  const langOpts: { value: LanguagePref; label: string }[] = [
    { value: 'en', label: t('lang.en') },
    { value: 'de', label: t('lang.de') },
  ];

  // Per-sport sidebar appearance for whichever tab is active.
  const gradientId = sport === 'nfl' ? settings.sidebarGradientNfl : settings.sidebarGradientMlb;
  const iconOn = sport === 'nfl' ? settings.sidebarIconNfl : settings.sidebarIconMlb;
  const bothSF = settings.selectedNfl === 'nfl-sf' && settings.selectedMlb === 'mlb-sf';
  const sportLabel = sport === 'nfl' ? 'NFL' : 'MLB';

  const panelClass = `settings-modal__panel${closing ? ' is-closing' : ' is-opening'}`;

  return createPortal(
    <div className="settings-modal" data-font-size={settings.fontSize}>
      <div
        className={`settings-modal__backdrop${closing ? ' is-closing' : ''}`}
        onClick={onClose}
      />
      <div className="settings-modal__wrap">
        <div
          className={panelClass}
          role="dialog"
          aria-modal="true"
          aria-label={t('settings.title')}
          onAnimationEnd={handleAnimationEnd}
        >
          <div className="settings-modal__header">
            <span className="settings-modal__title">{t('settings.title')}</span>
            <button
              ref={closeBtnRef}
              className="settings-modal__close"
              onClick={onClose}
              aria-label={t('common.close')}
            >
              <CloseIcon size={18} />
            </button>
          </div>

          <div className="settings-modal__body">
            <aside className="settings-modal__about">
              <div className="settings-modal__about-dot" aria-hidden />
              <div className="settings-modal__about-name">Sports Window</div>
              <p className="settings-modal__about-text">{t('settings.about.body')}</p>
              <div className="settings-modal__about-sig">{t('settings.about.signature')}</div>
            </aside>

            <div className="settings-modal__groups">
              <section className="settings-group">
                <div className="settings-group__label">{t('settings.language')}</div>
                <Choice value={settings.language} options={langOpts} onChange={setLanguage} />
              </section>

              <section className="settings-group">
                <div className="settings-group__label">{t('settings.textSize')}</div>
                <Choice value={settings.fontSize} options={fontSizeOpts} onChange={setFontSize} />
              </section>

              <section className="settings-group">
                <div className="settings-group__label">{t('settings.theme')}</div>
                <Choice value={theme.pref} options={themeOpts} onChange={theme.setPref} />
              </section>

              <section className="settings-group">
                <div className="settings-group__label">{t('settings.defaultTeam')}</div>
                <Choice value={settings.defaultTab} options={tabOpts} onChange={setDefaultTab} />
              </section>

              <section className="settings-group">
                <div className="settings-group__label">
                  {t('settings.sidebarBackground', { sport: sportLabel })}
                </div>
                <div className="gradient-picker" role="group">
                  {GRADIENT_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      className={`gradient-swatch${gradientId === preset.id ? ' is-active' : ''}`}
                      aria-pressed={gradientId === preset.id}
                      title={t(preset.labelKey)}
                      onClick={() => setSidebarGradient(sport, preset.id)}
                    >
                      <span
                        className="gradient-swatch__chip"
                        style={{ background: preset.gradient }}
                      />
                      <span className="gradient-swatch__label">{t(preset.labelKey)}</span>
                    </button>
                  ))}
                </div>
                <div className="settings-group__row">
                  <span className="settings-group__row-label">{t('settings.sidebarIcon')}</span>
                  <Toggle
                    label={t('settings.sidebarIcon')}
                    checked={iconOn}
                    onChange={() => setSidebarIcon(sport, !iconOn)}
                  />
                </div>
                {/* Easter egg: only visible when both SF teams are selected. */}
                {bothSF && (
                  <div className="settings-group__row">
                    <span className="settings-group__row-label">{t('settings.sfGraphics')}</span>
                    <Toggle
                      label={t('settings.sfGraphics')}
                      checked={settings.sfSpecialGraphics}
                      onChange={() => setSfSpecialGraphics(!settings.sfSpecialGraphics)}
                    />
                  </div>
                )}
              </section>

              <section className="settings-group">
                <div className="settings-group__label">{t('settings.demoMode')}</div>
                <Choice
                  value={settings.demoMode ? 'on' : 'off'}
                  options={demoOpts}
                  onChange={(v) => setDemoMode(v === 'on')}
                />
                {settings.demoMode && (
                  <>
                    <div className="settings-group__hint">
                      {t('settings.demoActive', { label: DEMO_DATASETS[sport].label })}
                    </div>
                    <div className="settings-group__hint">{t('settings.demoPaused')}</div>
                  </>
                )}
              </section>

              {isDesktop() && (
                <section className="settings-group">
                  <div className="settings-group__row">
                    <span className="settings-group__row-label">
                      {t('settings.launchAtStartup')}
                    </span>
                    <Toggle
                      label={t('settings.launchAtStartup')}
                      checked={autostart.enabled === true}
                      disabled={autostart.enabled === null || autostart.busy}
                      onChange={autostart.toggle}
                    />
                  </div>
                  <div className="settings-group__hint">{t('settings.launchHint')}</div>
                </section>
              )}

              <section className="settings-group">
                <div className="settings-group__label">{t('settings.support.title')}</div>
                <div className="settings-group__hint">{t('settings.support.hint')}</div>
                <button type="button" className="settings-copy-log" onClick={handleCopyDiagnostics}>
                  {copyState === 'copied'
                    ? t('settings.support.copied')
                    : copyState === 'failed'
                      ? t('settings.support.copyFailed')
                      : t('settings.support.copyButton')}
                </button>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
