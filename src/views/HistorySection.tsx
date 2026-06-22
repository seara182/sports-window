import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import type { SportKey, TeamData } from '../types/domain';
import {
  FRANCHISE_RECORDS,
  PENNANTS,
  SEASON_HISTORY,
  TRENDLINE_Y_MAX,
  type SeasonRecord,
} from '../data/historyData';
import { useInView } from '../lib/useInView';
import { useDetailOverlay } from '../hooks/useDetailOverlay';
import { SeasonDrilldownPanel } from '../components/SeasonDrilldownPanel';
import { Pennant } from '../components/Pennant';
import './HistorySection.css';

const PLOT = { x0: 40, x1: 876, y0: 16, y1: 188 };

/** Wraps a chart SVG so that on phones it renders at a larger fixed width inside a
 *  horizontal scroller — the SVG is unreadable when squeezed into a ~320px column.
 *  On desktop this is a transparent passthrough; the swipe hint shows on mobile only. */
function ChartScroller({ hint, children }: { hint: string; children: ReactNode }) {
  return (
    <div className="history-scroll">
      <div className="history-scroll__viewport">{children}</div>
      <p className="history-scroll__hint" aria-hidden="true">
        {hint}
      </p>
    </div>
  );
}

interface TrendPoint {
  x: number;
  y: number;
  record: SeasonRecord;
}

/** 5-point star polygon, centered on (cx, cy). */
function starPoints(cx: number, cy: number, outerR: number, innerR: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`);
  }
  return pts.join(' ');
}

function MarkerShape({ point }: { point: TrendPoint }) {
  const { x, y, record } = point;
  if (record.result === 'champion') {
    return (
      <polygon
        className="history-trend__marker history-trend__marker--champion"
        points={starPoints(x, y, 7, 3)}
      />
    );
  }
  if (record.result === 'playoff') {
    return (
      <rect
        className="history-trend__marker history-trend__marker--playoff"
        x={x - 5}
        y={y - 5}
        width={10}
        height={10}
        transform={`rotate(45 ${x} ${y})`}
      />
    );
  }
  return (
    <circle className="history-trend__marker history-trend__marker--missed" cx={x} cy={y} r={5} />
  );
}

/** Draws in via stroke-dashoffset once the chart scrolls into view. */
function TrendLine({ points, inView }: { points: TrendPoint[]; inView: boolean }) {
  const ref = useRef<SVGPolylineElement>(null);
  const [length, setLength] = useState(0);

  useEffect(() => {
    if (ref.current) setLength(ref.current.getTotalLength());
  }, [points]);

  return (
    <polyline
      ref={ref}
      className="history-trend__line"
      points={points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
      style={{ strokeDasharray: length, strokeDashoffset: inView ? 0 : length }}
    />
  );
}

function statLine(record: SeasonRecord): string {
  const value =
    record.keyStatLabel === 'PPG' ? record.keyStat.toFixed(1) : record.keyStat.toFixed(2);
  return `${value} ${record.keyStatLabel}`;
}

function SeasonTrendline({ team, sport }: { team: TeamData; sport: SportKey }) {
  const { t } = useTranslation();
  const { open } = useDetailOverlay();
  const [containerRef, inView] = useInView<HTMLDivElement>();
  const [hover, setHover] = useState<{ index: number; x: number; y: number } | null>(null);

  const records = SEASON_HISTORY[sport];
  const yMax = TRENDLINE_Y_MAX[sport];

  const points: TrendPoint[] = records.map((record, i) => ({
    x: PLOT.x0 + (i / (records.length - 1)) * (PLOT.x1 - PLOT.x0),
    y: PLOT.y1 - (record.wins / yMax) * (PLOT.y1 - PLOT.y0),
    record,
  }));

  const areaPoints = `${PLOT.x0},${PLOT.y1} ${points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')} ${PLOT.x1},${PLOT.y1}`;

  const handleOpen = (record: SeasonRecord, rect: DOMRect) => {
    open(<SeasonDrilldownPanel season={record.year} sport={sport} team={team} />, rect);
  };

  return (
    <div className="history-trend" ref={containerRef}>
      <div className="history-trend__head">
        <div className="history-trend__title">{t('history.winLossTrend')}</div>
        <div className="history-trend__legend">
          <span className="history-trend__legend-item">
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
              <circle
                className="history-trend__marker history-trend__marker--missed"
                cx="6"
                cy="6"
                r="5"
              />
            </svg>
            {t('history.regularSeason')}
          </span>
          <span className="history-trend__legend-item">
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
              <rect
                className="history-trend__marker history-trend__marker--playoff"
                x="1"
                y="1"
                width="10"
                height="10"
                transform="rotate(45 6 6)"
              />
            </svg>
            {t('history.playoffs')}
          </span>
          <span className="history-trend__legend-item">
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
              <polygon
                className="history-trend__marker history-trend__marker--champion"
                points={starPoints(6, 6, 6, 2.6)}
              />
            </svg>
            {t('history.championship')}
          </span>
        </div>
      </div>
      <ChartScroller hint={t('history.swipeSeasons')}>
        <svg
          className="history-trend__svg"
          viewBox="0 0 900 220"
          role="img"
          aria-label={`Season win/loss trend, ${records[0].year} to ${records[records.length - 1].year}`}
        >
          <defs>
            <linearGradient id={`history-trend-grad-${sport}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--team-accent)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--team-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon
            className="history-trend__area"
            points={areaPoints}
            fill={`url(#history-trend-grad-${sport})`}
            style={{ opacity: inView ? 1 : 0 }}
          />
          <TrendLine points={points} inView={inView} />
          {points.map((p, i) => (
            <g key={p.record.year}>
              <MarkerShape point={p} />
              <circle
                className="history-trend__hit"
                cx={p.x}
                cy={p.y}
                r={14}
                tabIndex={0}
                role="button"
                aria-label={`${p.record.year} season: ${p.record.wins}-${p.record.losses}, ${p.record.outcome}`}
                onMouseEnter={(e) => setHover({ index: i, x: e.clientX, y: e.clientY })}
                onMouseMove={(e) => setHover({ index: i, x: e.clientX, y: e.clientY })}
                onMouseLeave={() => setHover(null)}
                onFocus={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  setHover({ index: i, x: r.left + r.width / 2, y: r.top });
                }}
                onBlur={() => setHover(null)}
                onClick={(e) => handleOpen(p.record, e.currentTarget.getBoundingClientRect())}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpen(p.record, e.currentTarget.getBoundingClientRect());
                  }
                }}
              />
            </g>
          ))}
          {points.map((p, i) =>
            i % 2 === 0 ? (
              <text
                key={p.record.year}
                className="history-trend__axis-label"
                x={p.x}
                y={PLOT.y1 + 24}
                textAnchor="middle"
              >
                {p.record.year}
              </text>
            ) : null,
          )}
        </svg>
      </ChartScroller>
      {hover &&
        createPortal(
          <div className="tooltip tooltip--enter" style={{ top: hover.y + 14, left: hover.x }}>
            <div className="tooltip__term">
              {points[hover.index].record.year} — {points[hover.index].record.wins}-
              {points[hover.index].record.losses}
            </div>
            <div className="tooltip__body">
              {statLine(points[hover.index].record)} · {points[hover.index].record.outcome}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

function PennantRail({ sport }: { sport: SportKey }) {
  const { t } = useTranslation();
  const pennants = PENNANTS[sport];
  const trackRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ startX: number; scrollLeft: number } | null>(null);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el) return;
    dragState.current = { startX: e.clientX, scrollLeft: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el || !dragState.current) return;
    el.scrollLeft = dragState.current.scrollLeft - (e.clientX - dragState.current.startX);
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    dragState.current = null;
    trackRef.current?.releasePointerCapture(e.pointerId);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      el.scrollBy({ left: 100, behavior: 'smooth' });
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      el.scrollBy({ left: -100, behavior: 'smooth' });
    }
  };

  if (!pennants.length) return null;

  return (
    <div className="history-pennants">
      <div className="history-pennants__title">{t('history.championships')}</div>
      <div
        className="history-pennants__track"
        ref={trackRef}
        role="list"
        aria-label="Championship pennants"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onKeyDown={onKeyDown}
      >
        {pennants.map((p) => (
          <div className="history-pennants__item" role="listitem" key={p.year}>
            <Pennant pennant={p} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoringBarChart({ sport }: { sport: SportKey }) {
  const { t } = useTranslation();
  const [containerRef, inView] = useInView<HTMLDivElement>();
  const seasons = SEASON_HISTORY[sport].slice(-8);
  const isNfl = sport === 'nfl';

  const maxValue = isNfl
    ? Math.max(...seasons.flatMap((s) => [s.keyStat, s.pointsAllowed ?? 0]))
    : Math.max(...seasons.map((s) => s.keyStat));

  const W = 900;
  const H = 150;
  const groupW = W / seasons.length;

  return (
    <div className="history-scoring" ref={containerRef}>
      <div className="history-scoring__head">
        <div className="history-scoring__title">
          {isNfl ? t('history.scoringTrend') : t('history.teamEra')} — {t('history.lastSeasons')}
        </div>
        {isNfl && (
          <div className="history-scoring__legend">
            <span className="history-scoring__legend-item">
              <i className="history-scoring__swatch history-scoring__swatch--primary" />
              {t('history.pointsScored')}
            </span>
            <span className="history-scoring__legend-item">
              <i className="history-scoring__swatch history-scoring__swatch--secondary" />
              {t('history.pointsAllowed')}
            </span>
          </div>
        )}
      </div>
      <ChartScroller hint={t('history.swipeAll')}>
        <svg
          className="history-scoring__svg"
          viewBox={`0 0 ${W} ${H + 28}`}
          role="img"
          aria-label="Scoring trend, last 8 seasons"
        >
          {seasons.map((s, i) => {
            const cx = i * groupW + groupW / 2;
            const delay = `${i * 30}ms`;
            if (isNfl) {
              const ppgH = (s.keyStat / maxValue) * H;
              const paH = ((s.pointsAllowed ?? 0) / maxValue) * H;
              return (
                <g key={s.year}>
                  <rect
                    className="history-scoring__bar history-scoring__bar--primary"
                    x={cx - 18}
                    y={H - ppgH}
                    width={14}
                    height={ppgH}
                    style={{
                      transform: inView ? 'scaleY(1)' : 'scaleY(0)',
                      transitionDelay: delay,
                    }}
                  />
                  <rect
                    className="history-scoring__bar history-scoring__bar--secondary"
                    x={cx + 4}
                    y={H - paH}
                    width={14}
                    height={paH}
                    style={{
                      transform: inView ? 'scaleY(1)' : 'scaleY(0)',
                      transitionDelay: delay,
                    }}
                  />
                  <text className="history-scoring__label" x={cx} y={H + 20} textAnchor="middle">
                    {s.year}
                  </text>
                </g>
              );
            }
            const eraH = (s.keyStat / maxValue) * H;
            return (
              <g key={s.year}>
                <rect
                  className="history-scoring__bar history-scoring__bar--primary"
                  x={cx - 12}
                  y={H - eraH}
                  width={24}
                  height={eraH}
                  style={{ transform: inView ? 'scaleY(1)' : 'scaleY(0)', transitionDelay: delay }}
                />
                <text className="history-scoring__label" x={cx} y={H + 20} textAnchor="middle">
                  {s.year}
                </text>
              </g>
            );
          })}
        </svg>
      </ChartScroller>
    </div>
  );
}

function FranchiseRecordCards({ sport }: { sport: SportKey }) {
  return (
    <div className="history-records">
      {FRANCHISE_RECORDS[sport].map((r) => (
        <div className="card card--tight history-records__card" key={r.label}>
          <div className="history-records__value tnum">{r.value}</div>
          <div className="history-records__label">{r.label}</div>
          <div className="history-records__desc">{r.description}</div>
        </div>
      ))}
    </div>
  );
}

export function HistorySection({ team, sport }: { team: TeamData; sport: SportKey }) {
  return (
    <div className="card history-card">
      <SeasonTrendline team={team} sport={sport} />
      <PennantRail sport={sport} />
      <ScoringBarChart sport={sport} />
      <FranchiseRecordCards sport={sport} />
    </div>
  );
}
