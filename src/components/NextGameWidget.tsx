import { useTranslation } from 'react-i18next';
import { dayAndTime, fullDate } from '../lib/format';
import { useNow } from '../lib/useNow';
import type { UpcomingGame } from '../types/domain';
import './NextGameWidget.css';

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

function countdown(targetIso: string, now: number) {
  // FIX: Date.parse returns NaN for a malformed/empty date (parsers.ts falls back to ""),
  // which rendered "NaN" in every countdown cell. Treat it as 0 like an elapsed game.
  const target = Date.parse(targetIso);
  const diff = Number.isFinite(target) ? Math.max(0, target - now) : 0;
  return {
    days: Math.floor(diff / DAY_MS),
    hours: Math.floor((diff % DAY_MS) / HOUR_MS),
    minutes: Math.floor((diff % HOUR_MS) / MINUTE_MS),
  };
}

export function NextGameWidget({ upcoming }: { upcoming?: UpcomingGame }) {
  const { t } = useTranslation();
  const now = useNow(60000);
  if (!upcoming) return null;

  const { days, hours, minutes } = countdown(upcoming.date, now);
  const prefix = upcoming.homeAway === 'home' ? 'vs' : '@';
  const dateLabel = upcoming.timeTbd
    ? `${fullDate(upcoming.date)} · ${t('nextGame.timeTbd')}`
    : dayAndTime(upcoming.date);

  return (
    <div className="next-game">
      <div className="next-game__label">{t('nextGame.label')}</div>
      <div className="next-game__opp">
        {prefix} {upcoming.opponentName}
      </div>
      <div className="next-game__date">{dateLabel}</div>
      <div className="next-game__countdown">
        {(
          [
            [days, t('nextGame.days')],
            [hours, t('nextGame.hrs')],
            [minutes, t('nextGame.min')],
          ] as const
        ).map(([val, label]) => (
          <div className="next-game__unit" key={label}>
            <div className="next-game__val">{String(val).padStart(2, '0')}</div>
            <div className="next-game__lbl">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
