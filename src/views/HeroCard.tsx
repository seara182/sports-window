import { useTranslation } from 'react-i18next';
import type { GameResult, SportKey, TeamData, UpcomingGame } from '../types/domain';
import { dayAndTime, fullDate } from '../lib/format';
import { useDetailOverlay } from '../hooks/useDetailOverlay';
import { UpcomingGameOverlay } from './UpcomingGameOverlay';
import './HeroCard.css';

function Logo({ src, alt }: { src?: string; alt: string }) {
  if (!src) return null;
  return (
    <div className="hero__logo">
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}

function MetaRow({ items }: { items: (string | undefined)[] }) {
  const shown = items.filter(Boolean) as string[];
  return (
    <div className="hero__meta">
      {shown.map((it, i) => (
        <span key={i}>
          {i > 0 && <span className="hero__dot">·</span>}
          {it}
        </span>
      ))}
    </div>
  );
}

function UpcomingHero({
  game,
  sport,
  team,
  teamAbbr,
}: {
  game: UpcomingGame;
  sport: SportKey;
  team: TeamData;
  teamAbbr: string;
}) {
  const { t } = useTranslation();
  const { open } = useDetailOverlay();
  const prefix = game.homeAway === 'home' ? 'vs' : '@';
  const eyebrow = game.weekText
    ? t('hero.nextGameWeek', { week: game.weekText })
    : t('hero.nextGame');

  const handleOpen = (e: { currentTarget: HTMLElement }) => {
    open(
      <UpcomingGameOverlay game={game} sport={sport} team={team} teamAbbr={teamAbbr} />,
      e.currentTarget.getBoundingClientRect(),
    );
  };

  return (
    <div
      className="hero clickable-card"
      role="button"
      tabIndex={0}
      aria-label={t('hero.upcomingAria', { prefix, opponent: game.opponentName })}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpen(e);
        }
      }}
    >
      <div className="hero__top">
        <span className="hero__eyebrow">{eyebrow}</span>
        <span className="hero__chip">
          {t(game.homeAway === 'home' ? 'hero.home' : 'hero.away')}
        </span>
      </div>
      <div className="hero__matchup">
        <Logo src={game.opponentLogo} alt={game.opponentName} />
        <div className="hero__names">
          <span className="hero__prefix">{prefix}</span>
          <span className="hero__opponent">{game.opponentName}</span>
        </div>
      </div>
      <MetaRow
        items={[
          game.timeTbd
            ? `${fullDate(game.date)} · ${t('nextGame.timeTbd')}`
            : dayAndTime(game.date),
          game.venue,
          game.broadcast,
        ]}
      />
    </div>
  );
}

function ResultHero({ game }: { game: GameResult }) {
  const { t } = useTranslation();
  const prefix = game.homeAway === 'home' ? 'vs' : '@';
  const score =
    game.teamScore != null && game.opponentScore != null
      ? `${game.teamScore}–${game.opponentScore}`
      : '';
  return (
    <div className="hero">
      <div className="hero__top">
        <span className="hero__eyebrow">{t('hero.latestResult')}</span>
        <span className="hero__chip">{t('hero.final')}</span>
      </div>
      <div className="hero__matchup">
        <Logo src={game.opponentLogo} alt={game.opponentName} />
        <div className="hero__names">
          {game.outcome && <span className="hero__score">{game.outcome}</span>}
          <span className="hero__prefix">{prefix}</span>
          <span className="hero__opponent">{game.opponentName}</span>
        </div>
      </div>
      <MetaRow
        items={[
          score ? t('hero.finalScore', { score }) : t('hero.final'),
          fullDate(game.date),
          game.venue,
        ]}
      />
    </div>
  );
}

export function HeroCard({
  team,
  sport,
  teamAbbr,
}: {
  team: TeamData;
  sport: SportKey;
  teamAbbr: string;
}) {
  const { t } = useTranslation();
  const upcoming = team.hero.upcoming;
  const last = team.hero.lastResult;

  if (upcoming)
    return <UpcomingHero game={upcoming} sport={sport} team={team} teamAbbr={teamAbbr} />;
  if (last) return <ResultHero game={last} />;

  return (
    <div className="hero hero--empty">
      <span className="hero__eyebrow">{t('hero.offseason')}</span>
      <div className="hero__matchup">
        <div className="hero__names">
          <span className="hero__opponent">{t('hero.noGames')}</span>
        </div>
      </div>
      <MetaRow items={[t('playoffs.tbd')]} />
    </div>
  );
}
