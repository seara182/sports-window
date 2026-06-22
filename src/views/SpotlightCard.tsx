import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Player, RosterGroup, SportKey, TeamData } from '../types/domain';
import { headshotUrl } from '../data/espnApi';
import { PinIcon, PlayerSilhouetteIcon } from '../components/Icons';
import { usePlayerStats } from '../hooks/usePlayerStats';
import { useDetailOverlay } from '../hooks/useDetailOverlay';
import { PlayerDetailPanel } from '../components/PlayerDetailPanel';
import { Hoverable, HoverableStatLabel } from '../components/Hoverable';
import { positionTerm } from '../data/glossary';
import './SpotlightCard.css';

/** Picks a sensible default spotlight player from the cached roster. */
function pickSpotlightPlayer(roster: RosterGroup[], sport: SportKey): Player | undefined {
  const find = (label: string, pred?: (p: Player) => boolean) => {
    const group = roster.find((g) => g.label === label);
    if (!group) return undefined;
    return pred ? group.players.find(pred) : group.players[0];
  };

  if (sport === 'nfl') {
    return (
      find('Offense', (p) => p.positionAbbr === 'QB') ?? find('Offense') ?? roster[0]?.players[0]
    );
  }

  return (
    find('Pitchers', (p) => p.positionAbbr === 'SP') ??
    find('Infield') ??
    find('Outfield') ??
    roster[0]?.players[0]
  );
}

function HeadshotImg({ player, sport }: { player: Player; sport: SportKey }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="spotlight-card__silhouette">
        <PlayerSilhouetteIcon size={84} />
      </div>
    );
  }
  return (
    <img
      className="spotlight-card__photo"
      src={headshotUrl(sport, player.id)}
      alt={player.name}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export function SpotlightCard({ team, sport }: { team: TeamData; sport: SportKey }) {
  const { t } = useTranslation();
  const { open } = useDetailOverlay();
  const autoPlayer = useMemo(() => pickSpotlightPlayer(team.roster, sport), [team.roster, sport]);

  const [pinnedPlayer, setPinnedPlayer] = useState<Player | null>(null);
  const [wobbleTick, setWobbleTick] = useState(0);

  const player = pinnedPlayer ?? autoPlayer;
  const stats = usePlayerStats(sport, player?.id, player?.positionAbbr ?? '');

  if (!player) return null;

  const data = stats.status === 'ready' ? stats.data : null;
  const careerLine = data?.careerLine;

  const togglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedPlayer((prev) => (prev ? null : (autoPlayer ?? null)));
    setWobbleTick((t) => t + 1);
  };

  const handleOpen = (e: React.MouseEvent | React.KeyboardEvent) => {
    open(
      <PlayerDetailPanel player={player} sport={sport} />,
      e.currentTarget.getBoundingClientRect(),
    );
  };

  return (
    <div
      className="card spotlight-card clickable-card"
      role="button"
      tabIndex={0}
      aria-label={t('spotlight.spotlightAria', { name: player.name })}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpen(e);
        }
      }}
    >
      <span className="spotlight-card__label">{t('spotlight.label')}</span>

      <div className="spotlight-card__body">
        <div className="spotlight-card__photo-col">
          <HeadshotImg player={player} sport={sport} />
          <div className="spotlight-card__name">{player.name}</div>
          <div className="spotlight-card__badges">
            <span className="spotlight-card__badge">
              <Hoverable term={positionTerm(sport, player.positionAbbr)}>
                {player.positionAbbr}
              </Hoverable>
            </span>
            {player.jersey && <span className="spotlight-card__badge">#{player.jersey}</span>}
          </div>
        </div>

        <div className="spotlight-card__stats-col">
          {stats.status === 'loading' && (
            <div className="spotlight-card__chips">
              {Array.from({ length: 4 }, (_, i) => (
                <div className="spotlight-card__chip" key={i}>
                  <div className="skeleton spotlight-card__skel-label" />
                  <div className="skeleton spotlight-card__skel-value" />
                </div>
              ))}
            </div>
          )}
          {stats.status === 'error' && (
            <div className="empty-note">
              {player.demoStatLine ?? t('spotlight.statsUnavailable')}
            </div>
          )}
          {data && data.chips.length > 0 && (
            <div className="spotlight-card__chips">
              {data.chips.map((chip) => (
                <div className="spotlight-card__chip" key={chip.label}>
                  <div className="spotlight-card__chip-label">
                    <HoverableStatLabel label={chip.label} />
                  </div>
                  <div className="spotlight-card__chip-value tnum">{chip.value}</div>
                </div>
              ))}
            </div>
          )}
          {data && data.chips.length === 0 && stats.status === 'ready' && (
            <div className="empty-note">{t('spotlight.noSeasonStats')}</div>
          )}
          {careerLine && (
            <div className="spotlight-card__career-line">
              {careerLine.text}
              {careerLine.arrow && (
                <span
                  className={`spotlight-card__arrow spotlight-card__arrow--${careerLine.direction}`}
                >
                  {' '}
                  {careerLine.arrow}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        className="spotlight-card__pin"
        aria-pressed={pinnedPlayer != null}
        aria-label={pinnedPlayer ? t('spotlight.unpinAria') : t('spotlight.pinAria')}
        title={pinnedPlayer ? t('spotlight.unpin') : t('spotlight.pin')}
        onClick={togglePin}
      >
        <span
          key={wobbleTick}
          className={
            wobbleTick > 0 ? 'spotlight-card__pin-icon animate-wobble' : 'spotlight-card__pin-icon'
          }
        >
          <PinIcon size={16} className={pinnedPlayer ? 'is-pinned' : ''} />
        </span>
      </button>
    </div>
  );
}
