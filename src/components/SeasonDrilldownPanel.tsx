import { useTranslation } from 'react-i18next';
import type { Player, SportKey, TeamData } from '../types/domain';
import {
  SEASON_HISTORY,
  TOP_PERFORMERS,
  pennantForSeason,
  type TopPerformer,
} from '../data/historyData';
import { usePlayerStats } from '../hooks/usePlayerStats';
import { Hoverable } from './Hoverable';
import { positionTerm } from '../data/glossary';
import { Pennant } from './Pennant';
import './SeasonDrilldownPanel.css';

interface Props {
  season: number;
  sport: SportKey;
  team: TeamData;
}

function PerformerCard({ performer, sport }: { performer: TopPerformer; sport: SportKey }) {
  return (
    <div className="drilldown__performer">
      <div className="drilldown__performer-head">
        <span className="drilldown__performer-name">{performer.name}</span>
        <span className="drilldown__performer-badge">
          <Hoverable term={positionTerm(sport, performer.position)}>{performer.position}</Hoverable>
        </span>
      </div>
      <div className="drilldown__performer-stat">{performer.statLine}</div>
    </div>
  );
}

/** Top performer card backed by live, already-cached ESPN season stats —
 * used for the current/most-recent seasons that have no hardcoded entry. */
function LivePerformerCard({ player, sport }: { player: Player; sport: SportKey }) {
  const stats = usePlayerStats(sport, player.id, player.positionAbbr);
  const chips = stats.status === 'ready' ? (stats.data?.chips ?? []) : [];
  const statLine = chips
    .slice(0, 3)
    .map((c) => `${c.value} ${c.label}`)
    .join(' · ');

  return (
    <div className="drilldown__performer">
      <div className="drilldown__performer-head">
        <span className="drilldown__performer-name">{player.name}</span>
        <span className="drilldown__performer-badge">
          <Hoverable term={positionTerm(sport, player.positionAbbr)}>
            {player.positionAbbr}
          </Hoverable>
        </span>
      </div>
      <div className="drilldown__performer-stat">
        {stats.status === 'loading' ? 'Loading…' : statLine || 'Stats unavailable'}
      </div>
    </div>
  );
}

/** Picks up to three roster players to stand in for "live" top performers
 * on seasons without a hardcoded entry (2023–2024). */
function pickLivePerformers(team: TeamData, sport: SportKey): Player[] {
  const group = (label: string) => team.roster.find((g) => g.label === label)?.players ?? [];

  if (sport === 'nfl') {
    const offense = group('Offense');
    const qb = offense.find((p) => p.positionAbbr === 'QB');
    const rb = offense.find((p) => ['RB', 'HB', 'FB'].includes(p.positionAbbr));
    const wr = offense.find((p) => p.positionAbbr === 'WR');
    return [qb, rb, wr].filter((p): p is Player => !!p);
  }

  const pitchers = group('Pitchers');
  const infield = group('Infield');
  const outfield = group('Outfield');
  const sp = pitchers.find((p) => p.positionAbbr === 'SP');
  return [sp, infield[0], outfield[0]].filter((p): p is Player => !!p);
}

export function SeasonDrilldownPanel({ season, sport, team }: Props) {
  const { t } = useTranslation();
  const record = SEASON_HISTORY[sport].find((s) => s.year === season);
  if (!record) return null;

  const hardcoded = TOP_PERFORMERS[sport][season];
  const livePerformers = !hardcoded && season >= 2023 ? pickLivePerformers(team, sport) : [];
  const pennant = record.result === 'champion' ? pennantForSeason(sport, season) : undefined;

  return (
    <div className="drilldown">
      <div className="drilldown__header">
        <div className="drilldown__year">{season}</div>
        <div className="drilldown__record tnum">
          {record.wins}–{record.losses}
        </div>
      </div>

      <div className="drilldown__chips">
        {sport === 'nfl' ? (
          <>
            <div className="drilldown__chip">
              <div className="drilldown__chip-label">
                <Hoverable term="ppg">PPG</Hoverable>
              </div>
              <div className="drilldown__chip-value tnum">{record.keyStat.toFixed(1)}</div>
            </div>
            <div className="drilldown__chip">
              <div className="drilldown__chip-label">
                <Hoverable term="pointsAllowedPerGame">
                  {t('drilldown.pointsAllowedPerG')}
                </Hoverable>
              </div>
              <div className="drilldown__chip-value tnum">
                {(record.pointsAllowed ?? 0).toFixed(1)}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="drilldown__chip">
              <div className="drilldown__chip-label">
                <Hoverable term="teamEra">{t('drilldown.teamEra')}</Hoverable>
              </div>
              <div className="drilldown__chip-value tnum">{record.keyStat.toFixed(2)}</div>
            </div>
            <div className="drilldown__chip">
              <div className="drilldown__chip-label">
                <Hoverable term="teamAvg">{t('drilldown.teamAvg')}</Hoverable>
              </div>
              <div className="drilldown__chip-value tnum">
                {(record.battingAvg ?? 0).toFixed(3).replace(/^0/, '')}
              </div>
            </div>
          </>
        )}
      </div>

      <blockquote className="drilldown__quote">{record.outcome}</blockquote>

      <div className="drilldown__performers">
        {hardcoded ? (
          hardcoded.map((p) => <PerformerCard key={p.name} performer={p} sport={sport} />)
        ) : livePerformers.length > 0 ? (
          livePerformers.map((p) => <LivePerformerCard key={p.id} player={p} sport={sport} />)
        ) : (
          <div className="empty-note">{t('drilldown.unavailable')}</div>
        )}
      </div>

      {pennant && (
        <div className="drilldown__pennant">
          <Pennant pennant={pennant} />
        </div>
      )}
    </div>
  );
}
