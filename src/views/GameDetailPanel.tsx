import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { GameResult, SportKey } from '../types/domain';
import { fetchGameSummary } from '../data/espnApi';
import { getCachedDetail, setCachedDetail } from '../data/detailCache';
import { parseNflSummary, parseMlbSummary } from '../data/gameSummaryParsers';
import { fullDate } from '../lib/format';
import './GameDetailPanel.css';

interface Props {
  game: GameResult;
  sport: SportKey;
  teamAbbr: string;
}

type LoadState = { status: 'loading' } | { status: 'error' } | { status: 'ready'; data: unknown };

function SkeletonBody() {
  return (
    <div className="game-detail__section">
      <div className="skeleton game-detail__skel-line" style={{ width: '35%' }} />
      <div className="skeleton game-detail__skel-bar" />
      <div className="skeleton game-detail__skel-bar" />
      <div className="skeleton game-detail__skel-bar" />
      <div className="skeleton game-detail__skel-block" />
    </div>
  );
}

function ErrorBody({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="game-detail__error">
      <p>{t('game.loadError')}</p>
      <button className="game-detail__retry" onClick={onRetry}>
        {t('game.retry')}
      </button>
    </div>
  );
}

function PerformerGrid({
  groups,
}: {
  groups: {
    abbr: string;
    performers: { label: string; value: string; name: string; position?: string }[];
  }[];
}) {
  return (
    <div className="performer-grid">
      {groups.map((tp) => (
        <div className="performer-card" key={tp.abbr}>
          <div className="performer-card__team">{tp.abbr}</div>
          {tp.performers.map((p, i) => (
            <div className="performer-card__row" key={i}>
              <span className="performer-card__name">
                {p.name}
                {p.position ? ` · ${p.position}` : ''}
                {p.label ? ` — ${p.label}` : ''}
              </span>
              <span className="performer-card__value">{p.value}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function NflBody({
  summary,
  awayAbbr,
  homeAbbr,
}: {
  summary: unknown;
  awayAbbr: string;
  homeAbbr: string;
}) {
  const { t } = useTranslation();
  const parsed = parseNflSummary(summary, awayAbbr, homeAbbr);
  return (
    <>
      {parsed.stats.length > 0 && (
        <div className="game-detail__section">
          <div className="game-detail__section-title">{t('game.teamStats')}</div>
          <div className="stat-header">
            <span>{awayAbbr}</span>
            <span>{homeAbbr}</span>
          </div>
          {parsed.stats.map((s) => (
            <div className="stat-row" key={s.label}>
              <div className="stat-row__values">
                <span className="tnum">{s.awayDisplay}</span>
                <span className="stat-row__label">{s.label}</span>
                <span className="tnum">{s.homeDisplay}</span>
              </div>
              <div className="stat-row__bar">
                <div
                  className="stat-row__fill stat-row__fill--away"
                  style={{ width: `${s.awayPct}%` }}
                />
                <div
                  className="stat-row__fill stat-row__fill--home"
                  style={{ width: `${s.homePct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {parsed.performers.length > 0 && (
        <div className="game-detail__section">
          <div className="game-detail__section-title">{t('game.topPerformers')}</div>
          <PerformerGrid groups={parsed.performers} />
        </div>
      )}

      {parsed.recap && (
        <div className="game-detail__section">
          <div className="game-detail__section-title">{t('game.recap')}</div>
          <blockquote className="game-detail__quote">
            <p className="game-detail__quote-headline">{parsed.recap.headline}</p>
            {parsed.recap.description && <p>{parsed.recap.description}</p>}
          </blockquote>
        </div>
      )}
    </>
  );
}

function MlbBody({
  summary,
  awayAbbr,
  homeAbbr,
}: {
  summary: unknown;
  awayAbbr: string;
  homeAbbr: string;
}) {
  const { t } = useTranslation();
  const parsed = parseMlbSummary(summary, awayAbbr, homeAbbr);
  const maxInnings = Math.max(9, ...parsed.linescore.map((r) => r.innings.length));

  return (
    <>
      {parsed.linescore.length > 0 && (
        <div className="game-detail__section">
          <div className="game-detail__section-title">{t('game.linescore')}</div>
          <table className="linescore">
            <thead>
              <tr>
                <th></th>
                {Array.from({ length: maxInnings }, (_, i) => (
                  <th key={i}>{i + 1}</th>
                ))}
                <th>R</th>
                <th>H</th>
                <th>E</th>
              </tr>
            </thead>
            <tbody>
              {parsed.linescore.map((row) => (
                <tr key={row.abbr}>
                  <th>{row.abbr}</th>
                  {Array.from({ length: maxInnings }, (_, i) => {
                    const v = row.innings[i];
                    const n = v != null ? Number(v) : NaN;
                    const tier = Number.isFinite(n) && n > 0 ? Math.min(n, 3) : 0;
                    return (
                      <td
                        key={i}
                        className={
                          tier > 0 ? `linescore__cell linescore__cell--r${tier}` : 'linescore__cell'
                        }
                      >
                        {v ?? '-'}
                      </td>
                    );
                  })}
                  <td className="linescore__total tnum">{row.runs}</td>
                  <td className="linescore__total tnum">{row.hits}</td>
                  <td className="linescore__total tnum">{row.errors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {parsed.decisions.length > 0 && (
        <div className="game-detail__section">
          <div className="game-detail__section-title">{t('game.pitchingDecisions')}</div>
          <div className="decisions">
            {parsed.decisions.map((d, i) => (
              <div className="decision" key={i}>
                <span className={`decision__badge decision__badge--${d.type.toLowerCase()}`}>
                  {d.type}
                </span>
                <span className="decision__name">{d.name}</span>
                <span className="decision__record tnum">{d.record}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {parsed.performers.length > 0 && (
        <div className="game-detail__section">
          <div className="game-detail__section-title">{t('game.topPerformers')}</div>
          <PerformerGrid groups={parsed.performers} />
        </div>
      )}
    </>
  );
}

export function GameDetailPanel({ game, sport, teamAbbr }: Props) {
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });
    const cacheKey = `game_summary_${game.id}`;

    (async () => {
      const cached = await getCachedDetail<unknown>(cacheKey);
      if (cached) {
        if (!cancelled) setState({ status: 'ready', data: cached });
        return;
      }
      try {
        const fresh = await fetchGameSummary(sport, game.id);
        if (cancelled) return;
        setState({ status: 'ready', data: fresh });
        void setCachedDetail(cacheKey, fresh);
      } catch {
        if (!cancelled) setState({ status: 'error' });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [game.id, sport, attempt]);

  const isHome = game.homeAway === 'home';
  const awayAbbr = isHome ? game.opponentAbbr : teamAbbr;
  const homeAbbr = isHome ? teamAbbr : game.opponentAbbr;
  const awayScore = isHome ? game.opponentScore : game.teamScore;
  const homeScore = isHome ? game.teamScore : game.opponentScore;
  const awayLogo = isHome ? game.opponentLogo : undefined;
  const homeLogo = isHome ? undefined : game.opponentLogo;
  const awayWins = (awayScore ?? -1) > (homeScore ?? -1);
  const homeWins = (homeScore ?? -1) > (awayScore ?? -1);

  return (
    <div className="game-detail">
      <div className="game-detail__header">
        <div className="eyebrow game-detail__eyebrow">FINAL · {fullDate(game.date)}</div>
        <div className="game-detail__matchup">
          <div className="game-detail__team">
            {awayLogo && <img className="game-detail__logo" src={awayLogo} alt="" loading="lazy" />}
            <span className="game-detail__abbr">{awayAbbr}</span>
            <span className={`game-detail__score tnum${awayWins ? ' is-winner' : ''}`}>
              {awayScore ?? '—'}
            </span>
          </div>
          <span className="game-detail__at">@</span>
          <div className="game-detail__team">
            {homeLogo && <img className="game-detail__logo" src={homeLogo} alt="" loading="lazy" />}
            <span className="game-detail__abbr">{homeAbbr}</span>
            <span className={`game-detail__score tnum${homeWins ? ' is-winner' : ''}`}>
              {homeScore ?? '—'}
            </span>
          </div>
        </div>
        {game.venue && <div className="game-detail__venue muted">{game.venue}</div>}
      </div>

      {state.status === 'loading' && <SkeletonBody />}
      {state.status === 'error' && <ErrorBody onRetry={() => setAttempt((a) => a + 1)} />}
      {state.status === 'ready' && sport === 'nfl' && (
        <NflBody summary={state.data} awayAbbr={awayAbbr} homeAbbr={homeAbbr} />
      )}
      {state.status === 'ready' && sport === 'mlb' && (
        <MlbBody summary={state.data} awayAbbr={awayAbbr} homeAbbr={homeAbbr} />
      )}
    </div>
  );
}
