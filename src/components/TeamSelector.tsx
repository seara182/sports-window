import { useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../state/SettingsProvider';
import { TEAMS_BY_SPORT } from '../data/teamConfig';
import type { TeamConfig } from '../data/teamConfig';
import type { SportKey } from '../types/domain';
import './TeamSelector.css';

interface Props {
  anchor: HTMLElement;
  onClose: () => void;
}

function TeamList({
  sport,
  title,
  teams,
  selectedId,
  onPick,
}: {
  sport: SportKey;
  title: string;
  teams: TeamConfig[];
  selectedId: string;
  onPick: (sport: SportKey, id: string) => void;
}) {
  return (
    <div className="team-select__group">
      <div className="team-select__label">{title}</div>
      {/* Mobile (≤768px): a native <select> so iOS/Android show the OS picker
          (mirrors the Rule Book section dropdown). Hidden on desktop via CSS. */}
      <select
        className="team-select__native"
        aria-label={title}
        value={selectedId}
        onChange={(e) => onPick(sport, e.target.value)}
      >
        {teams.map((t) => (
          <option key={t.id} value={t.id}>
            {t.displayName}
          </option>
        ))}
      </select>
      {/* Desktop: scrollable button list. Hidden on mobile via CSS. */}
      <div className="team-select__list" role="listbox" aria-label={title}>
        {teams.map((t) => (
          <button
            key={t.id}
            type="button"
            role="option"
            aria-selected={t.id === selectedId}
            className={`team-select__opt${t.id === selectedId ? ' is-active' : ''}`}
            onClick={() => onPick(sport, t.id)}
          >
            {t.displayName}
          </button>
        ))}
      </div>
    </div>
  );
}

export function TeamSelector({ anchor, onClose }: Props) {
  const { t } = useTranslation();
  const { settings, setSelectedTeam } = useSettings();
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: -9999, left: -9999 });

  useLayoutEffect(() => {
    const r = anchor.getBoundingClientRect();
    const width = 300;
    const left = Math.max(8, Math.min(r.left, window.innerWidth - width - 8));
    const top = Math.max(8, Math.min(r.top, window.innerHeight - 480));
    setPos({ top, left });
  }, [anchor]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const pick = (sport: SportKey, id: string) => setSelectedTeam(sport, id);

  return createPortal(
    <>
      <div className="team-select__backdrop" onClick={onClose} />
      <div
        className="team-select"
        style={{ top: pos.top, left: pos.left }}
        role="dialog"
        aria-label={t('teamSelect.title')}
      >
        <div className="team-select__title">{t('teamSelect.title')}</div>
        <div className="team-select__hint">{t('teamSelect.hint')}</div>
        <TeamList
          sport="nfl"
          title={t('teamSelect.nfl')}
          teams={TEAMS_BY_SPORT.nfl}
          selectedId={settings.selectedNfl}
          onPick={pick}
        />
        <TeamList
          sport="mlb"
          title={t('teamSelect.mlb')}
          teams={TEAMS_BY_SPORT.mlb}
          selectedId={settings.selectedMlb}
          onPick={pick}
        />
      </div>
    </>,
    document.body,
  );
}
