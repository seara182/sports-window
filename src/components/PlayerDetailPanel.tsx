import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Player, SportKey } from '../types/domain';
import { headshotUrl } from '../data/espnApi';
import { usePlayerStats } from '../hooks/usePlayerStats';
import { PlayerSilhouetteIcon } from '../components/Icons';
import { Hoverable, HoverableStatLabel } from './Hoverable';
import { positionTerm } from '../data/glossary';
import { inchesToMeters, lbsToKg } from '../lib/format';
import './PlayerDetailPanel.css';

interface Props {
  player: Player;
  sport: SportKey;
}

function SkeletonBody() {
  return (
    <div className="player-detail__chips">
      {Array.from({ length: 6 }, (_, i) => (
        <div className="player-detail__chip" key={i}>
          <div className="skeleton player-detail__skel-label" />
          <div className="skeleton player-detail__skel-value" />
        </div>
      ))}
    </div>
  );
}

function ErrorBody({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="game-detail__error">
      <p>{t('player.statsError')}</p>
      <button className="game-detail__retry" onClick={onRetry}>
        {t('player.retry')}
      </button>
    </div>
  );
}

function Sparkline({
  points,
  label,
}: {
  points: { season: number; value: number }[];
  label: string;
}) {
  const { t } = useTranslation();
  if (points.length < 2) return null;
  const W = 120;
  const H = 40;
  const PAD = 4;
  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const coords = points.map((p, i) => {
    const x = PAD + (i / (points.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((p.value - min) / range) * (H - PAD * 2);
    return { x, y, ...p };
  });
  const path = coords
    .map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`)
    .join(' ');

  return (
    <div className="player-detail__sparkline">
      <div className="player-detail__sparkline-label">
        <HoverableStatLabel label={label} /> {t('player.bySeason')}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-hidden>
        <path d={path} fill="none" stroke="var(--team-accent)" strokeWidth={1.5} />
        {coords.map((c) => (
          <circle key={c.season} cx={c.x} cy={c.y} r={2.5} fill="var(--team-accent)">
            <title>{`${c.season}: ${c.value}`}</title>
          </circle>
        ))}
      </svg>
    </div>
  );
}

function ComparisonBars({
  comparisons,
  seasonYear,
}: {
  comparisons: {
    label: string;
    seasonValue: number;
    careerBest: number;
    higherIsBetter: boolean;
  }[];
  seasonYear?: number;
}) {
  const { t } = useTranslation();
  if (!comparisons.length) return null;
  const yearLabel = seasonYear ?? new Date().getFullYear();
  return (
    <div className="player-detail__comparisons">
      {comparisons.map((c) => {
        const scale = Math.max(c.seasonValue, c.careerBest, 0.0001);
        const seasonPct = Math.min(100, (c.seasonValue / scale) * 100);
        const careerPct = Math.min(100, (c.careerBest / scale) * 100);
        return (
          <div className="player-detail__comparison" key={c.label}>
            <div className="player-detail__comparison-label">
              <HoverableStatLabel label={c.label} /> {t('player.vsCareer', { year: yearLabel })}
            </div>
            <div className="player-detail__bar">
              <div className="player-detail__bar-track" style={{ width: `${careerPct}%` }} />
              <div className="player-detail__bar-fill" style={{ width: `${seasonPct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function PlayerDetailPanel({ player, sport }: Props) {
  const { t } = useTranslation();
  const [attempt, setAttempt] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);
  const stats = usePlayerStats(sport, player.id, player.positionAbbr, attempt);

  const heightMetric = inchesToMeters(player.heightInches);
  const weightMetric = lbsToKg(player.weightLbs);
  const birthDate = player.dateOfBirth ? player.dateOfBirth.slice(0, 10) : undefined;

  return (
    <div className="player-detail">
      <div className="player-detail__columns">
        <div className="player-detail__left">
          <div className="player-detail__photo-wrap">
            {player.jersey && <span className="player-detail__watermark">{player.jersey}</span>}
            {imgFailed ? (
              <div className="player-detail__silhouette">
                <PlayerSilhouetteIcon size={120} />
              </div>
            ) : (
              <img
                className="player-detail__photo"
                src={headshotUrl(sport, player.id)}
                alt={player.name}
                onError={() => setImgFailed(true)}
              />
            )}
          </div>
          <div className="player-detail__name">{player.name}</div>
          <div className="player-detail__badges">
            <span className="player-detail__badge">
              <Hoverable term={positionTerm(sport, player.positionAbbr)}>
                {player.positionAbbr}
              </Hoverable>
            </span>
            {player.experienceYears != null && (
              <span className="player-detail__badge">
                <Hoverable term="experience">
                  {t('player.yearsInLeague', { count: player.experienceYears })}
                </Hoverable>
              </span>
            )}
            {player.college && <span className="player-detail__badge">{player.college}</span>}
            {player.status && (
              <span
                className={`player-detail__badge${player.status.toLowerCase() === 'active' ? ' is-active' : ''}`}
              >
                <Hoverable term="status">{player.status}</Hoverable>
              </span>
            )}
          </div>
          <div className="player-detail__measurements">
            {player.heightDisplay && (
              <span>
                {heightMetric ? (
                  <Hoverable
                    term="height"
                    title={t('player.height')}
                    body={t('player.aboutMeasure', {
                      display: player.heightDisplay,
                      metric: heightMetric,
                    })}
                  >
                    {player.heightDisplay}
                  </Hoverable>
                ) : (
                  player.heightDisplay
                )}
              </span>
            )}
            {player.weightDisplay && (
              <span>
                {weightMetric ? (
                  <Hoverable
                    term="weight"
                    title={t('player.weight')}
                    body={t('player.aboutMeasure', {
                      display: player.weightDisplay,
                      metric: weightMetric,
                    })}
                  >
                    {player.weightDisplay}
                  </Hoverable>
                ) : (
                  player.weightDisplay
                )}
              </span>
            )}
          </div>
          {(birthDate || player.birthPlace) && (
            <div className="player-detail__bio">
              {[birthDate, player.birthPlace].filter(Boolean).join(' · ')}
            </div>
          )}
        </div>

        <div className="player-detail__right">
          {stats.status === 'loading' && <SkeletonBody />}
          {stats.status === 'error' && player.demoStatLine && (
            <div className="player-detail__chips">
              <div className="player-detail__chip player-detail__chip--demo">
                <div className="player-detail__chip-label">{t('player.demoStats')}</div>
                <div className="player-detail__chip-value player-detail__chip-value--demo">
                  {player.demoStatLine}
                </div>
              </div>
            </div>
          )}
          {stats.status === 'error' && !player.demoStatLine && (
            <ErrorBody onRetry={() => setAttempt((a) => a + 1)} />
          )}
          {stats.status === 'ready' && stats.data && (
            <>
              {stats.data.chips.length > 0 ? (
                <div className="player-detail__chips">
                  {stats.data.chips.map((chip, i) => (
                    <div
                      className="player-detail__chip"
                      key={chip.label}
                      style={{ animationDelay: `${i * 25}ms` }}
                    >
                      <div className="player-detail__chip-label">
                        <HoverableStatLabel label={chip.label} />
                      </div>
                      <div className="player-detail__chip-value tnum">{chip.value}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-note">{t('player.noSeasonStats')}</div>
              )}
              <ComparisonBars
                comparisons={stats.data.comparisons}
                seasonYear={stats.data.seasonYear}
              />
              <Sparkline points={stats.data.sparkline} label={stats.data.sparklineLabel} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
