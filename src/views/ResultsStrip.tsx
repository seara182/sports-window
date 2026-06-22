import { useTranslation } from 'react-i18next';
import type { GameResult, SportKey } from '../types/domain';
import { fullDate, gameDay } from '../lib/format';
import { useDetailOverlay } from '../hooks/useDetailOverlay';
import { GameDetailPanel } from './GameDetailPanel';
import './ResultsStrip.css';

function pillClass(outcome?: GameResult['outcome']): string {
  if (outcome === 'W') return 'pill pill--w';
  if (outcome === 'L') return 'pill pill--l';
  return 'pill pill--t';
}

function ResultCard({
  game,
  sport,
  teamAbbr,
  index,
}: {
  game: GameResult;
  sport: SportKey;
  teamAbbr: string;
  index: number;
}) {
  const { open } = useDetailOverlay();
  const ha = game.homeAway === 'home' ? 'vs' : '@';
  const score =
    game.teamScore != null && game.opponentScore != null
      ? `${game.teamScore}–${game.opponentScore}`
      : '—';
  const tip = [
    fullDate(game.date),
    game.homeAway === 'home' ? 'Home' : 'Away',
    game.venue,
    game.weekText,
  ]
    .filter(Boolean)
    .join(' · ');

  const label = `Game detail: ${ha} ${game.opponentAbbr}, final ${score}, ${gameDay(game.date)}`;

  const handleOpen = (e: { currentTarget: HTMLElement }) => {
    open(
      <GameDetailPanel game={game} sport={sport} teamAbbr={teamAbbr} />,
      e.currentTarget.getBoundingClientRect(),
    );
  };

  return (
    <div
      className="result-card clickable-card"
      title={tip}
      role="button"
      tabIndex={0}
      aria-label={label}
      style={{ animationDelay: `${120 + index * 30}ms` }}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpen(e);
        }
      }}
    >
      <div className="result-card__opp">
        {game.opponentLogo && <img src={game.opponentLogo} alt="" loading="lazy" />}
        <span className="result-card__ha">{ha}</span>
        {game.opponentAbbr}
      </div>
      <div className="result-card__score tnum">{score}</div>
      <div className="result-card__bottom">
        <span className={`${pillClass(game.outcome)} tnum`}>{game.outcome ?? '—'}</span>
        <span className="result-card__date">{gameDay(game.date)}</span>
      </div>
    </div>
  );
}

export function ResultsStrip({
  results,
  sport,
  teamAbbr,
}: {
  results: GameResult[];
  sport: SportKey;
  teamAbbr: string;
}) {
  const { t } = useTranslation();
  if (!results.length) {
    return <div className="empty-note">{t('results.noRecent')}</div>;
  }
  return (
    <div className="results">
      {results.map((g, i) => (
        <ResultCard key={g.id} game={g} sport={sport} teamAbbr={teamAbbr} index={i} />
      ))}
    </div>
  );
}
