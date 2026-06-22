import { useTranslation } from 'react-i18next';
import type { Player, RosterGroup, SportKey, TeamData } from '../types/domain';
import { useDetailOverlay } from '../hooks/useDetailOverlay';
import { useSettings } from '../state/SettingsProvider';
import { PlayerDetailPanel } from '../components/PlayerDetailPanel';
import { usePlayerStats } from '../hooks/usePlayerStats';
import { Hoverable, HoverableStatLabel } from '../components/Hoverable';
import { positionTerm } from '../data/glossary';
import './FormationCard.css';

function group(roster: RosterGroup[], label: string): Player[] {
  return roster.find((g) => g.label === label)?.players ?? [];
}

function pick(players: Player[], used: Set<string>, abbrs: string[]): Player | undefined {
  for (const abbr of abbrs) {
    for (const p of players) {
      if (used.has(p.id)) continue;
      if (p.positionAbbr === abbr) {
        used.add(p.id);
        return p;
      }
    }
  }
  return undefined;
}

function chipValue(stats: ReturnType<typeof usePlayerStats>, label: string): string | undefined {
  if (stats.status !== 'ready' || !stats.data) return undefined;
  return stats.data.chips.find((c) => c.label === label)?.value;
}

interface NodeSpec {
  player?: Player;
  x: number;
  y: number;
  role: string;
}

function PlayerNode({ spec, sport }: { spec: NodeSpec; sport: SportKey }) {
  const { open } = useDetailOverlay();
  const { player, x, y, role } = spec;
  if (!player) return null;

  const handleOpen = (e: { currentTarget: SVGGElement }) =>
    open(
      <PlayerDetailPanel player={player} sport={sport} />,
      e.currentTarget.getBoundingClientRect(),
    );

  return (
    <g
      className="formation-node"
      transform={`translate(${x} ${y})`}
      role="button"
      tabIndex={0}
      aria-label={`${player.name}, ${role}${player.jersey ? `, #${player.jersey}` : ''}`}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpen(e as unknown as { currentTarget: SVGGElement });
        }
      }}
    >
      <title>{`${player.name} — ${role}${player.jersey ? ` #${player.jersey}` : ''}`}</title>
      <circle className="formation-node__circle" r={16} />
      <text className="formation-node__number" textAnchor="middle" dy="4">
        {player.jersey ?? ''}
      </text>
      <text className="formation-node__label" textAnchor="middle" y={28}>
        {role}
      </text>
    </g>
  );
}

function StatLeader({
  player,
  statLabel,
  value,
  max,
  invert,
}: {
  player?: Player;
  statLabel: string;
  value?: string;
  max: number;
  invert?: boolean;
}) {
  if (!player || value == null) return null;
  const raw = parseFloat(value.replace(/[^0-9.-]/g, ''));
  if (!Number.isFinite(raw)) return null;
  const ratio = invert ? 1 - raw / max : raw / max;
  const pct = Math.max(0, Math.min(100, ratio * 100));

  return (
    <div className="formation-card__leader">
      <div className="formation-card__leader-head">
        <span className="formation-card__leader-name">{player.name}</span>
        <span className="formation-card__leader-label">
          <HoverableStatLabel label={statLabel} />
        </span>
      </div>
      <div className="formation-card__bar">
        <div className="formation-card__bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="formation-card__leader-value tnum">{value}</span>
    </div>
  );
}

const FIELD_W = 560;
const FIELD_H = 315;
const END_ZONE = 35;
const YARDS_PER_PX = (FIELD_H - END_ZONE * 2) / 100;
const yardY = (yardsFromTop: number) => END_ZONE + yardsFromTop * YARDS_PER_PX;
const YARD_LINES = [50, 30, 70, 20, 80, 10, 90].map(yardY);
const HASH_X = [200, 360];
const HASH_Y = [10, 20, 30, 40, 50, 60, 70, 80, 90].map(yardY);
const STRIPES = Array.from({ length: 10 }, (_, i) => ({
  y: yardY(i * 10),
  h: yardY((i + 1) * 10) - yardY(i * 10),
}));
const YARD_NUMBERS = [10, 20, 30, 40, 50, 60, 70, 80, 90].map((d) => ({
  y: yardY(d) + 4,
  label: String(Math.min(d, 100 - d)),
}));

function FootballField({ nodes, sport }: { nodes: NodeSpec[]; sport: SportKey }) {
  return (
    <svg
      className="formation-field"
      viewBox={`0 0 ${FIELD_W} ${FIELD_H}`}
      role="img"
      aria-label="Offensive formation diagram"
    >
      <rect className="formation-field__surface" x={0} y={0} width={FIELD_W} height={FIELD_H} />
      {STRIPES.filter((_, i) => i % 2 === 1).map((s, i) => (
        <rect
          key={i}
          className="formation-field__stripe"
          x={0}
          y={s.y}
          width={FIELD_W}
          height={s.h}
        />
      ))}
      <rect className="formation-field__endzone" x={0} y={0} width={FIELD_W} height={END_ZONE} />
      <rect
        className="formation-field__endzone"
        x={0}
        y={FIELD_H - END_ZONE}
        width={FIELD_W}
        height={END_ZONE}
      />
      {YARD_LINES.map((y, i) => (
        <line key={i} className="formation-field__yardline" x1={0} y1={y} x2={FIELD_W} y2={y} />
      ))}
      {HASH_X.map((x) =>
        HASH_Y.map((y, i) => (
          <line
            key={`${x}-${i}`}
            className="formation-field__hash"
            x1={x - 4}
            y1={y}
            x2={x + 4}
            y2={y}
          />
        )),
      )}
      {YARD_NUMBERS.map((n, i) => (
        <text key={`l${i}`} className="formation-field__number" x={20} y={n.y}>
          {n.label}
        </text>
      ))}
      {YARD_NUMBERS.map((n, i) => (
        <text
          key={`r${i}`}
          className="formation-field__number"
          x={FIELD_W - 20}
          y={n.y}
          textAnchor="end"
        >
          {n.label}
        </text>
      ))}
      <text className="formation-field__personnel" x={FIELD_W - 12} y={20} textAnchor="end">
        11 Personnel — 1 RB / 1 TE / 3 WR
      </text>
      {nodes.map((spec, i) => (
        <PlayerNode key={spec.player?.id ?? i} spec={spec} sport={sport} />
      ))}
    </svg>
  );
}

function BaseballDiamond({ nodes, sport }: { nodes: NodeSpec[]; sport: SportKey }) {
  return (
    <svg
      className="formation-diamond"
      viewBox="0 0 400 420"
      role="img"
      aria-label="Defensive positions diagram"
    >
      <rect className="formation-diamond__outfield" x={0} y={0} width={400} height={420} />
      <polygon className="formation-diamond__infield" points="200,410 350,260 200,110 50,260" />
      <polygon className="formation-diamond__basepaths" points="200,380 290,290 200,200 110,290" />
      <circle className="formation-diamond__mound" cx={200} cy={248} r={10} />
      {[
        [200, 380],
        [290, 290],
        [200, 200],
        [110, 290],
      ].map(([x, y], i) => (
        <rect
          key={i}
          className="formation-diamond__base"
          x={x - 6}
          y={y - 6}
          width={12}
          height={12}
          transform={`rotate(45 ${x} ${y})`}
        />
      ))}
      {nodes.map((spec, i) => (
        <PlayerNode key={spec.player?.id ?? i} spec={spec} sport={sport} />
      ))}
    </svg>
  );
}

function NflFormation({ team }: { team: TeamData }) {
  const offense = group(team.roster, 'Offense');
  const used = new Set<string>();
  const qb = pick(offense, used, ['QB']);
  const rb = pick(offense, used, ['RB', 'HB', 'FB']);
  const te = pick(offense, used, ['TE']);
  const lt = pick(offense, used, ['T', 'OT', 'LT']);
  const lg = pick(offense, used, ['G', 'OG', 'LG']);
  const c = pick(offense, used, ['C']);
  const rg = pick(offense, used, ['G', 'OG', 'RG']);
  const rt = pick(offense, used, ['T', 'OT', 'RT']);
  const wr1 = pick(offense, used, ['WR']);
  const wr2 = pick(offense, used, ['WR']);
  const wr3 = pick(offense, used, ['WR']);

  const los = yardY(50);
  const nodes: NodeSpec[] = [
    { player: lt, x: 180, y: los, role: 'LT' },
    { player: lg, x: 230, y: los, role: 'LG' },
    { player: c, x: 280, y: los, role: 'C' },
    { player: rg, x: 330, y: los, role: 'RG' },
    { player: rt, x: 380, y: los, role: 'RT' },
    { player: te, x: 440, y: los, role: 'TE' },
    { player: wr1, x: 60, y: los, role: 'WR' },
    { player: wr3, x: 140, y: los, role: 'WR' },
    { player: wr2, x: 520, y: yardY(46), role: 'WR' },
    { player: qb, x: 280, y: los + 25, role: 'QB' },
    { player: rb, x: 280, y: los + 60, role: 'RB' },
  ];

  const passYds = usePlayerStats('nfl', qb?.id, qb?.positionAbbr ?? 'QB');
  const rushYds = usePlayerStats('nfl', rb?.id, rb?.positionAbbr ?? 'RB');
  const recYds = usePlayerStats('nfl', wr1?.id, wr1?.positionAbbr ?? 'WR');

  return (
    <>
      <div className="formation-card__body formation-card__body--nfl">
        <FootballField nodes={nodes} sport="nfl" />
      </div>
      <div className="formation-card__leaders">
        <StatLeader
          player={qb}
          statLabel="Passing Yds"
          value={chipValue(passYds, 'PASS YDS')}
          max={5000}
        />
        <StatLeader
          player={rb}
          statLabel="Rushing Yds"
          value={chipValue(rushYds, 'RUSH YDS')}
          max={2000}
        />
        <StatLeader
          player={wr1}
          statLabel="Receiving Yds"
          value={chipValue(recYds, 'REC YDS')}
          max={1500}
        />
      </div>
    </>
  );
}

function MlbLineup({ team }: { team: TeamData }) {
  const { open } = useDetailOverlay();
  const pitchers = group(team.roster, 'Pitchers');
  const catchers = group(team.roster, 'Catchers');
  const infield = group(team.roster, 'Infield');
  const outfield = group(team.roster, 'Outfield');
  const dh = group(team.roster, 'Designated Hitter');

  const used = new Set<string>();
  const p = pick(pitchers, used, ['SP', 'P']);
  const c = pick(catchers, used, ['C']);
  const first = pick(infield, used, ['1B']);
  const second = pick(infield, used, ['2B']);
  const third = pick(infield, used, ['3B']);
  const ss = pick(infield, used, ['SS']);
  const lf = pick(outfield, used, ['LF', 'OF']);
  const cf = pick(outfield, used, ['CF', 'OF']);
  const rf = pick(outfield, used, ['RF', 'OF']);
  const designatedHitter =
    pick(dh, used, ['DH']) ?? pick(infield, used, ['DH']) ?? pick(outfield, used, ['DH']);

  const battingOrder = [c, first, second, third, ss, lf, cf, rf, designatedHitter].filter(
    (x): x is Player => !!x,
  );

  const nodes: NodeSpec[] = [
    { player: p, x: 200, y: 248, role: 'P' },
    { player: c, x: 200, y: 395, role: 'C' },
    { player: first, x: 290, y: 270, role: '1B' },
    { player: second, x: 215, y: 185, role: '2B' },
    { player: third, x: 110, y: 270, role: '3B' },
    { player: ss, x: 185, y: 185, role: 'SS' },
    { player: lf, x: 80, y: 80, role: 'LF' },
    { player: cf, x: 200, y: 45, role: 'CF' },
    { player: rf, x: 320, y: 80, role: 'RF' },
  ];

  const eraStats = usePlayerStats('mlb', p?.id, p?.positionAbbr ?? 'SP');

  const handleRowOpen = (player: Player) => (e: { currentTarget: HTMLElement }) =>
    open(
      <PlayerDetailPanel player={player} sport="mlb" />,
      e.currentTarget.getBoundingClientRect(),
    );

  return (
    <>
      <div className="formation-card__body">
        <ol className="formation-card__order">
          {battingOrder.map((player, i) => (
            <li key={player.id}>
              <button
                type="button"
                className="formation-card__order-row"
                onClick={handleRowOpen(player)}
              >
                <span className="formation-card__order-num">{i + 1}</span>
                <span className="formation-card__order-name">{player.name}</span>
                <span className="formation-card__order-pos">
                  <Hoverable term={positionTerm('mlb', player.positionAbbr)}>
                    {player.positionAbbr}
                  </Hoverable>
                </span>
              </button>
            </li>
          ))}
        </ol>
        <BaseballDiamond nodes={nodes} sport="mlb" />
      </div>
      <div className="formation-card__leaders">
        <StatLeader player={p} statLabel="ERA" value={chipValue(eraStats, 'ERA')} max={6} invert />
        <StatLeader player={p} statLabel="K" value={chipValue(eraStats, 'K')} max={300} />
        <StatLeader
          player={p}
          statLabel="WHIP"
          value={chipValue(eraStats, 'WHIP')}
          max={2}
          invert
        />
      </div>
    </>
  );
}

/** Demo Mode: the bundled roster only covers a handful of spotlight
 * players, not a full lineup — show them as a simple list instead of
 * forcing them into the fixed-slot formation/diamond diagrams. */
function DemoRosterSpotlight({ team, sport }: { team: TeamData; sport: SportKey }) {
  const { open } = useDetailOverlay();
  const players = team.roster.flatMap((g) => g.players);

  return (
    <div className="formation-card__demo-list">
      {players.map((player) => (
        <button
          key={player.name}
          type="button"
          className="formation-card__demo-row"
          onClick={(e) =>
            open(
              <PlayerDetailPanel player={player} sport={sport} />,
              e.currentTarget.getBoundingClientRect(),
            )
          }
        >
          <span className="formation-card__demo-name">{player.name}</span>
          <span className="formation-card__demo-pos">
            <Hoverable term={positionTerm(sport, player.positionAbbr)}>
              {player.positionAbbr}
            </Hoverable>
          </span>
          <span className="formation-card__demo-stat">{player.demoStatLine}</span>
        </button>
      ))}
    </div>
  );
}

export function FormationCard({ team, sport }: { team: TeamData; sport: SportKey }) {
  const { t } = useTranslation();
  const { settings } = useSettings();

  if (!team.roster.length) {
    return <div className="card empty-note">{t('roster.unavailable')}</div>;
  }
  return (
    <div className="card formation-card">
      {settings.demoMode ? (
        <DemoRosterSpotlight team={team} sport={sport} />
      ) : sport === 'nfl' ? (
        <NflFormation team={team} />
      ) : (
        <MlbLineup team={team} />
      )}
    </div>
  );
}
