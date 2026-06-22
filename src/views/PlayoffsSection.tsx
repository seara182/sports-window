import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SportKey } from '../types/domain';
import { useSettings } from '../state/SettingsProvider';
import { fetchPlayoffScoreboard } from '../data/espnApi';
import {
  emptyBracket,
  parseScoreboardToBracket,
  type Bracket,
  type BracketSide,
  type BracketSlot,
  type BracketTeam,
} from '../data/playoffData';
import { getCachedDetail, setCachedDetail } from '../data/detailCache';
import { DEMO_DATASETS } from '../data/demoData';
import './PlayoffsSection.css';

const THIRTY_MINUTES = 30 * 60 * 1000;
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

interface CachedBracket {
  fetchedAt: number;
  bracket: Bracket | null;
}

type BracketState =
  | { status: 'loading' }
  | { status: 'ready'; bracket: Bracket | null; error: boolean };

/** Fetches + caches the postseason bracket, with TTLs per the spec. */
function usePlayoffBracket(sport: SportKey, userAbbr: string): BracketState {
  const [state, setState] = useState<BracketState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });
    const year = new Date().getFullYear();
    const key = `playoff_bracket_${sport}_${year}`;

    (async () => {
      const cached = await getCachedDetail<CachedBracket>(key);
      const now = Date.now();
      if (cached) {
        const ttl = cached.bracket ? THIRTY_MINUTES : TWENTY_FOUR_HOURS;
        if (now - cached.fetchedAt < ttl) {
          if (!cancelled) setState({ status: 'ready', bracket: cached.bracket, error: false });
          return;
        }
      }
      try {
        const raw = await fetchPlayoffScoreboard(sport);
        const bracket = parseScoreboardToBracket(sport, raw, userAbbr);
        if (!cancelled) setState({ status: 'ready', bracket, error: false });
        void setCachedDetail<CachedBracket>(key, { fetchedAt: now, bracket });
      } catch (err) {
        console.warn('[playoffs] bracket fetch/parse failed', err);
        if (!cancelled) setState({ status: 'ready', bracket: null, error: true });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sport, userAbbr]);

  return state;
}

// ---------------------------------------------------------------- layout

const VB_W = 1000;
const SLOT_W = 130;
const FINAL_W = 140;
const SLOT_H = 56;
const LEFT_X = [0, 150, 300];
const RIGHT_X = [VB_W - SLOT_W, VB_W - SLOT_W - 150, VB_W - SLOT_W - 300];
const FINAL_X = (VB_W - FINAL_W) / 2;
const TOP_PAD = 28;

/** Per-round vertical centers, before TOP_PAD is added. NFL is 3-2-1-final; MLB is 2-2-1-final. */
const Y_BY_SPORT: Record<SportKey, number[][]> = {
  nfl: [[0, 90, 180], [45, 135], [90], [90]],
  mlb: [[0, 90], [0, 90], [45], [45]],
};
const CONTENT_H: Record<SportKey, number> = { nfl: 240, mlb: 150 };

interface SlotLayout {
  x: number;
  y: number;
  w: number;
  h: number;
}

function layoutFor(sport: SportKey, slot: BracketSlot): SlotLayout {
  const y = (Y_BY_SPORT[sport][slot.round]?.[slot.index] ?? 0) + TOP_PAD;
  if (slot.side === 'center') return { x: FINAL_X, y, w: FINAL_W, h: SLOT_H };
  if (slot.side === 'left') return { x: LEFT_X[slot.round], y, w: SLOT_W, h: SLOT_H };
  return { x: RIGHT_X[slot.round], y, w: SLOT_W, h: SLOT_H };
}

interface Connector {
  d: string;
  active: boolean;
}

function isLiveOrAdvancing(team: BracketTeam | undefined): boolean {
  return !!team && !team.eliminated;
}

function connectorsFor(sport: SportKey, bracket: Bracket): Connector[] {
  const lastRound = bracket.rounds.length - 1;
  const result: Connector[] = [];

  for (const slot of bracket.slots) {
    if (slot.round === lastRound) continue;
    const targetSide: BracketSide = slot.round + 1 === lastRound ? 'center' : slot.side;
    const candidates = bracket.slots.filter(
      (s) => s.round === slot.round + 1 && s.side === targetSide,
    );
    if (!candidates.length) continue;

    const from = layoutFor(sport, slot);
    const fromY = from.y + from.h / 2;

    let best = candidates[0];
    let bestDiff = Infinity;
    for (const c of candidates) {
      const cy = layoutFor(sport, c).y + layoutFor(sport, c).h / 2;
      const diff = Math.abs(cy - fromY);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = c;
      }
    }
    const to = layoutFor(sport, best);
    const toY = to.y + to.h / 2;

    const x1 = slot.side === 'left' ? from.x + from.w : from.x;
    const x2 = targetSide === 'left' ? to.x + to.w : to.x;
    const midX = (x1 + x2) / 2;
    const d = `M ${x1} ${fromY} C ${midX} ${fromY} ${midX} ${toY} ${x2} ${toY}`;

    const active = isLiveOrAdvancing(slot.top) || isLiveOrAdvancing(slot.bottom);
    const activeUser = (slot.top?.isUserTeam || slot.bottom?.isUserTeam) ?? false;
    result.push({ d, active: activeUser && active });
  }

  return result;
}

// ---------------------------------------------------------------- rendering

function PlaceholderSlot({ layout }: { layout: SlotLayout }) {
  return (
    <foreignObject x={layout.x} y={layout.y} width={layout.w} height={layout.h}>
      <div className="bracket__slot bracket__slot--ghost">
        <div className="bracket__placeholder-row" />
        <div className="bracket__placeholder-row" />
      </div>
    </foreignObject>
  );
}

function TeamRow({ team }: { team?: BracketTeam }) {
  if (!team) {
    return (
      <div className="bracket__row bracket__row--tbd">
        <span className="bracket__name">TBD</span>
      </div>
    );
  }
  const cls = ['bracket__row'];
  if (team.isUserTeam) cls.push('bracket__row--user');
  if (team.eliminated) cls.push('bracket__row--eliminated');
  return (
    <div className={cls.join(' ')}>
      <span className="bracket__seed">{team.seed ?? ''}</span>
      <span className="bracket__badge">{team.abbr}</span>
      <span className="bracket__name">{team.name}</span>
      {team.score != null && <span className="bracket__score">{team.score}</span>}
    </div>
  );
}

function FilledSlot({ slot, layout }: { slot: BracketSlot; layout: SlotLayout }) {
  return (
    <foreignObject x={layout.x} y={layout.y} width={layout.w} height={layout.h}>
      <div className="bracket__slot">
        <TeamRow team={slot.top} />
        <TeamRow team={slot.bottom} />
      </div>
    </foreignObject>
  );
}

function BracketSvg({
  sport,
  bracket,
  ghost,
}: {
  sport: SportKey;
  bracket: Bracket;
  ghost: boolean;
}) {
  const height = TOP_PAD + CONTENT_H[sport] + SLOT_H + 12;
  const connectors = ghost ? [] : connectorsFor(sport, bracket);
  const finalSlot = bracket.slots.find((s) => s.side === 'center');
  const finalLayout = finalSlot ? layoutFor(sport, finalSlot) : undefined;

  // Connector lines for the ghost skeleton: same shape, all --border.
  const ghostConnectors = ghost ? connectorsFor(sport, emptyBracket(sport)) : [];

  return (
    <svg
      className="bracket-svg"
      viewBox={`0 0 ${VB_W} ${height}`}
      role="img"
      aria-label={
        ghost ? 'Empty playoff bracket' : `${sport === 'nfl' ? 'NFL' : 'MLB'} playoff bracket`
      }
    >
      {(ghost ? ghostConnectors : connectors).map((c, i) => (
        <path
          key={i}
          className={`bracket__connector${c.active ? ' bracket__connector--active' : ''}`}
          d={c.d}
        />
      ))}
      {bracket.slots.map((slot, i) => {
        const layout = layoutFor(sport, slot);
        return ghost ? (
          <PlaceholderSlot key={i} layout={layout} />
        ) : (
          <FilledSlot key={i} slot={slot} layout={layout} />
        );
      })}
      {finalLayout && !ghost && (
        <text
          className="bracket__final-label"
          x={finalLayout.x + finalLayout.w / 2}
          y={finalLayout.y - 8}
        >
          {bracket.finalLabel}
        </text>
      )}
    </svg>
  );
}

function SkeletonBracket({ sport, errorNote }: { sport: SportKey; errorNote?: string }) {
  const { t } = useTranslation();
  const bracket = emptyBracket(sport);
  return (
    <div className="card playoffs-card playoffs-card--skeleton">
      <BracketSvg sport={sport} bracket={bracket} ghost />
      <div className="playoffs-overlay">
        <div className="playoffs-overlay__text">{t('playoffs.populates')}</div>
        {errorNote && <div className="playoffs-overlay__error">{errorNote}</div>}
      </div>
    </div>
  );
}

function ActiveBracket({ sport, bracket }: { sport: SportKey; bracket: Bracket }) {
  return (
    <div className="card playoffs-card">
      <BracketSvg sport={sport} bracket={bracket} ghost={false} />
    </div>
  );
}

function DemoPlayoffRun({ sport }: { sport: SportKey }) {
  const dataset = DEMO_DATASETS[sport];
  return (
    <div className="card playoffs-card">
      <div className="demo-playoff__title">{dataset.label}</div>
      <div className="demo-playoff__list">
        {dataset.playoffPath.map((g) => (
          <div className="demo-playoff__item" key={g.round}>
            <div className="demo-playoff__round">{g.round}</div>
            <div className="demo-playoff__opponent">vs {g.opponent}</div>
            <div
              className={`demo-playoff__result demo-playoff__result--${g.result === 'W' ? 'w' : 'l'}`}
            >
              {g.result} {g.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PlayoffsSection({ sport, teamAbbr }: { sport: SportKey; teamAbbr: string }) {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const state = usePlayoffBracket(sport, teamAbbr);

  if (settings.demoMode) return <DemoPlayoffRun sport={sport} />;
  if (state.status === 'loading') return <SkeletonBracket sport={sport} />;
  if (state.bracket) return <ActiveBracket sport={sport} bracket={state.bracket} />;
  return (
    <SkeletonBracket
      sport={sport}
      errorNote={state.error ? t('playoffs.unavailable') : undefined}
    />
  );
}
