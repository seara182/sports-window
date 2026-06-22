import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SportKey, TeamData, UpcomingGame } from '../types/domain';
import { fetchGameSummary } from '../data/espnApi';
import { getCachedDetail, setCachedDetail } from '../data/detailCache';
import { pnum, pstr } from '../data/safe';
import { dayAndTime, fullDate } from '../lib/format';
import i18n from '../i18n';
import { HeadToHeadStrip } from '../components/HeadToHeadStrip';
import { SunIcon, CloudIcon, RainIcon, SnowIcon } from '../components/Icons';
import './UpcomingGameOverlay.css';

interface Props {
  game: UpcomingGame;
  sport: SportKey;
  team: TeamData;
  teamAbbr: string;
}

const ONE_HOUR = 60 * 60 * 1000;

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

function useCountdown(targetIso: string) {
  const target = Date.parse(targetIso);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!Number.isFinite(target)) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [target]);
  return Math.max(0, target - now);
}

interface SummaryExtras {
  weatherText?: string;
  weatherIcon?: 'sun' | 'cloud' | 'rain' | 'snow';
  winProbText?: string;
}

function weatherIconFor(displayValue: string): 'sun' | 'cloud' | 'rain' | 'snow' | undefined {
  const v = displayValue.toLowerCase();
  if (v.includes('snow')) return 'snow';
  if (v.includes('rain') || v.includes('shower') || v.includes('storm')) return 'rain';
  if (v.includes('cloud') || v.includes('overcast')) return 'cloud';
  if (v.includes('sun') || v.includes('clear')) return 'sun';
  return undefined;
}

function extractExtras(raw: unknown, opponentAbbr: string, teamAbbr: string): SummaryExtras {
  const extras: SummaryExtras = {};

  const wDisplay = pstr(raw, 'weather.displayValue');
  const wTemp = pnum(raw, 'weather.temperature');
  if (wDisplay) {
    extras.weatherText = wTemp != null ? `${wDisplay}, ${wTemp}°F` : wDisplay;
    extras.weatherIcon = weatherIconFor(wDisplay);
  }

  const homeAbbr = pstr(raw, 'predictor.homeTeam.team.abbreviation');
  const homePct = pnum(raw, 'predictor.homeTeam.gameProjection');
  const awayPct = pnum(raw, 'predictor.awayTeam.gameProjection');
  if (homePct != null && awayPct != null) {
    const ourAbbr = teamAbbr;
    const ourPct = homeAbbr === ourAbbr ? homePct : awayPct;
    const oppPct = homeAbbr === ourAbbr ? awayPct : homePct;
    extras.winProbText = `${i18n.t('upcoming.winProbPrefix')}: ${ourAbbr} ${ourPct.toFixed(0)}% · ${opponentAbbr} ${oppPct.toFixed(0)}%`;
  }

  return extras;
}

function WeatherIcon({ icon }: { icon: 'sun' | 'cloud' | 'rain' | 'snow' }) {
  if (icon === 'sun') return <SunIcon size={16} />;
  if (icon === 'cloud') return <CloudIcon size={16} />;
  if (icon === 'rain') return <RainIcon size={16} />;
  return <SnowIcon size={16} />;
}

/** Parses an ESPN record string like "14-3" or "40-25-1" into a win percentage. */
function recordToPct(record: string): number | null {
  const parts = record.split('-').map((p) => Number(p.trim()));
  if (parts.length < 2 || parts.some((p) => !Number.isFinite(p))) return null;
  const [w, l, t = 0] = parts;
  const total = w + l + t;
  if (total === 0) return null;
  return w / total;
}

export function UpcomingGameOverlay({ game, sport, team, teamAbbr }: Props) {
  const remaining = useCountdown(game.date);
  const [extras, setExtras] = useState<SummaryExtras>({});

  const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
  const hours = Math.floor((remaining / (60 * 60 * 1000)) % 24);
  const minutes = Math.floor((remaining / (60 * 1000)) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);

  useEffect(() => {
    let cancelled = false;
    const cacheKey = `upcoming_summary_${game.id}`;

    (async () => {
      const cached = await getCachedDetail<{ ts: number; raw: unknown }>(cacheKey);
      if (cached && Date.now() - cached.ts < ONE_HOUR) {
        if (!cancelled) setExtras(extractExtras(cached.raw, game.opponentAbbr, teamAbbr));
        return;
      }
      try {
        const fresh = await fetchGameSummary(sport, game.id);
        if (cancelled) return;
        setExtras(extractExtras(fresh, game.opponentAbbr, teamAbbr));
        void setCachedDetail(cacheKey, { ts: Date.now(), raw: fresh });
      } catch {
        /* weather/win-prob are optional; silently omit on failure */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [game.id, sport, game.opponentAbbr, teamAbbr]);

  const { t } = useTranslation();
  const kickoffLabel = t(sport === 'nfl' ? 'hero.kickoff' : 'hero.firstPitch');
  const isHome = game.homeAway === 'home';
  const ourPct = recordToPct(team.summary.record);
  const opponentRow = team.standings.rows.find((r) => r.teamId === game.opponentId);
  const oppRecord =
    opponentRow?.stats['wins'] != null
      ? `${opponentRow.stats['wins']}-${opponentRow.stats['losses']}${opponentRow.stats['ties'] ? `-${opponentRow.stats['ties']}` : ''}`
      : undefined;

  return (
    <div className="upcoming-overlay">
      <div className="upcoming-overlay__header">
        <div className="upcoming-overlay__matchup">
          <div className="upcoming-overlay__team">
            <span className="upcoming-overlay__abbr">{isHome ? teamAbbr : game.opponentAbbr}</span>
          </div>
          <span className="upcoming-overlay__at">{isHome ? 'vs' : '@'}</span>
          <div className="upcoming-overlay__team">
            {game.opponentLogo && (
              <img
                className="upcoming-overlay__logo"
                src={game.opponentLogo}
                alt=""
                loading="lazy"
              />
            )}
            <span className="upcoming-overlay__abbr">{isHome ? game.opponentAbbr : teamAbbr}</span>
          </div>
        </div>

        <div className="upcoming-overlay__kickoff-label">{kickoffLabel}</div>
        <div className="upcoming-overlay__countdown tnum">
          {pad(days)}
          <span className="upcoming-overlay__sep">d</span>
          {pad(hours)}
          <span className="upcoming-overlay__sep">h</span>
          {pad(minutes)}
          <span className="upcoming-overlay__sep">m</span>
          {pad(seconds)}
          <span className="upcoming-overlay__sep">s</span>
        </div>

        <div className="upcoming-overlay__meta">
          {game.timeTbd || !Number.isFinite(Date.parse(game.date))
            ? `${fullDate(game.date)} · ${t('nextGame.timeTbd')}`
            : dayAndTime(game.date)}
          {game.broadcast ? ` · ${game.broadcast}` : ''}
        </div>
      </div>

      <div className="upcoming-overlay__section">
        <div className="upcoming-overlay__section-title">{t('upcoming.headToHead')}</div>
        <HeadToHeadStrip
          sport={sport}
          slug={team.slug}
          teamAbbr={teamAbbr}
          opponentId={game.opponentId}
        />
      </div>

      {(game.venue || game.broadcast || extras.weatherText) && (
        <div className="upcoming-overlay__section">
          <div className="upcoming-overlay__section-title">{t('upcoming.gameInfo')}</div>
          <div className="upcoming-overlay__info-row">
            {game.venue && (
              <span>
                {game.venue}
                {game.venueCity ? ` · ${game.venueCity}` : ''}
              </span>
            )}
            {game.broadcast && <span>{game.broadcast}</span>}
            {extras.weatherText && (
              <span className="upcoming-overlay__weather">
                {extras.weatherIcon && <WeatherIcon icon={extras.weatherIcon} />}
                {extras.weatherText}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="upcoming-overlay__section">
        <div className="upcoming-overlay__section-title">{t('upcoming.seasonContext')}</div>
        <div className="upcoming-overlay__matchup-bar">
          <div
            className="upcoming-overlay__matchup-bar-fill"
            style={{ width: `${((ourPct ?? 0.5) * 100).toFixed(1)}%` }}
          />
        </div>
        <div className="upcoming-overlay__matchup-bar-labels">
          <span>
            {teamAbbr} {team.summary.record}
          </span>
          {oppRecord && (
            <span>
              {game.opponentAbbr} {oppRecord}
            </span>
          )}
        </div>
        {extras.winProbText && (
          <div className="upcoming-overlay__win-prob">{extras.winProbText}</div>
        )}
      </div>
    </div>
  );
}
