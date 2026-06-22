import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TeamData } from '../types/domain';
import './StadiumCard.css';

function randomIndex(len: number): number {
  return Math.floor(Math.random() * len);
}

export function StadiumCard({ team }: { team: TeamData }) {
  const { t } = useTranslation();
  const venue = team.venue;
  const facts = venue?.funFacts ?? [];
  const [factIndex, setFactIndex] = useState(() => (facts.length ? randomIndex(facts.length) : 0));
  const [spinTick, setSpinTick] = useState(0);

  const nextFact = () => {
    setFactIndex((i) => (i + 1) % facts.length);
    setSpinTick((t) => t + 1);
  };

  if (!venue) {
    return (
      <div className="card stadium-card">
        <div className="empty-note">{t('stadium.unavailable')}</div>
      </div>
    );
  }

  return (
    <div className="card stadium-card">
      {facts.length > 0 && (
        <button
          type="button"
          className="stadium-card__refresh"
          onClick={nextFact}
          aria-label={t('stadium.showNextFact')}
          title={t('stadium.nextFact')}
        >
          <span
            key={spinTick}
            className={
              spinTick > 0
                ? 'stadium-card__refresh-icon animate-spin'
                : 'stadium-card__refresh-icon'
            }
          >
            ↻
          </span>
        </button>
      )}

      <div className="stadium-card__name">{venue.name}</div>

      <div className="stadium-card__stats">
        {venue.stats.map((s) => (
          <div className="stadium-card__stat" key={s.label}>
            <div className="stadium-card__stat-label">
              {t(`stadium.${s.label}`, { defaultValue: s.label })}
            </div>
            <div className="stadium-card__stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      {facts.length > 0 && <div className="stadium-card__fact">{facts[factIndex]}</div>}
    </div>
  );
}
