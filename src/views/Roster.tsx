import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Player, RosterGroup, SportKey } from '../types/domain';
import { Hoverable } from '../components/Hoverable';
import { positionTerm } from '../data/glossary';
import { ChevronIcon, SearchIcon } from '../components/Icons';
import { inchesToMeters, lbsToKg } from '../lib/format';
import './Roster.css';

function initials(name: string): string {
  const parts = name.split(' ').filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

function HeightCell({ player }: { player: Player }) {
  if (!player.heightDisplay) return <span className="roster__stat">—</span>;
  const metric = inchesToMeters(player.heightInches);
  if (!metric) return <span className="roster__stat tnum">{player.heightDisplay}</span>;
  return (
    <span className="roster__stat tnum">
      <Hoverable term="height" title="Height" body={`${player.heightDisplay} is about ${metric}.`}>
        {player.heightDisplay}
      </Hoverable>
    </span>
  );
}

function WeightCell({ player }: { player: Player }) {
  if (!player.weightDisplay) return <span className="roster__stat">—</span>;
  const metric = lbsToKg(player.weightLbs);
  if (!metric) return <span className="roster__stat tnum">{player.weightDisplay}</span>;
  return (
    <span className="roster__stat tnum">
      <Hoverable term="weight" title="Weight" body={`${player.weightDisplay} is about ${metric}.`}>
        {player.weightDisplay}
      </Hoverable>
    </span>
  );
}

function PlayerRow({ player, sport }: { player: Player; sport: SportKey }) {
  return (
    <div className="roster__row">
      <span className="roster__num tnum">{player.jersey ?? '—'}</span>
      <span className="roster__player">
        {player.headshot ? (
          <img className="roster__avatar" src={player.headshot} alt="" loading="lazy" />
        ) : (
          <span className="roster__avatar roster__avatar--ph">{initials(player.name)}</span>
        )}
        <span className="roster__name">
          {player.name}
          {player.injuryStatus && (
            <span className="roster__injury" title={`Injury: ${player.injuryStatus}`}>
              {player.injuryStatus}
            </span>
          )}
        </span>
      </span>
      <span className="roster__pos">
        <Hoverable term={positionTerm(sport, player.positionAbbr)}>{player.positionAbbr}</Hoverable>
      </span>
      <span className="roster__stat ralign tnum roster__hide-sm">{player.age ?? '—'}</span>
      <span className="ralign roster__hide-sm">
        <HeightCell player={player} />
      </span>
      <span className="ralign">
        <WeightCell player={player} />
      </span>
    </div>
  );
}

function Group({
  group,
  sport,
  collapsed,
  onToggle,
}: {
  group: RosterGroup;
  sport: SportKey;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="roster__group">
      <button
        className={`roster__group-head${collapsed ? ' collapsed' : ''}`}
        onClick={onToggle}
        aria-expanded={!collapsed}
      >
        <ChevronIcon size={16} className="chev" />
        {t(`rosterGroups.${group.label}`, { defaultValue: group.label })}
        <span className="roster__group-count">{group.players.length}</span>
      </button>
      {!collapsed && (
        <div className="roster__rows">
          {group.players.map((p) => (
            <PlayerRow key={p.id} player={p} sport={sport} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Roster({ groups, sport }: { groups: RosterGroup[]; sport: SportKey }) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const q = filter.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        players: g.players.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.positionAbbr.toLowerCase().includes(q) ||
            (p.jersey ?? '').includes(q),
        ),
      }))
      .filter((g) => g.players.length > 0);
  }, [groups, q]);

  const total = useMemo(() => groups.reduce((n, g) => n + g.players.length, 0), [groups]);
  const shown = useMemo(() => filtered.reduce((n, g) => n + g.players.length, 0), [filtered]);

  if (!groups.length) {
    return <div className="empty-note">{t('roster.unavailable')}</div>;
  }

  const toggle = (label: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });

  return (
    <div className="roster">
      <div className="roster__toolbar">
        <div className="roster__search">
          <SearchIcon size={16} />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={t('roster.filter')}
            aria-label={t('roster.filterAria')}
          />
        </div>
        <span className="roster__total tnum">
          {q ? t('roster.shownOf', { shown, total }) : t('sections.rosterCount', { count: total })}
        </span>
      </div>

      <div className="roster__cols">
        <span className="ralign">
          <Hoverable term="jersey">#</Hoverable>
        </span>
        <span>{t('roster.player')}</span>
        <span>
          <Hoverable term="position">{t('roster.pos')}</Hoverable>
        </span>
        <span className="ralign roster__hide-sm">
          <Hoverable term="age">{t('roster.age')}</Hoverable>
        </span>
        <span className="ralign roster__hide-sm">
          <Hoverable term="height">{t('roster.ht')}</Hoverable>
        </span>
        <span className="ralign">
          <Hoverable term="weight">{t('roster.wt')}</Hoverable>
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="roster__empty">{t('roster.noMatch', { query: filter })}</div>
      ) : (
        filtered.map((g) => (
          <Group
            key={g.label}
            group={g}
            sport={sport}
            // While filtering, force every matching group open.
            collapsed={q ? false : collapsed.has(g.label)}
            onToggle={() => toggle(g.label)}
          />
        ))
      )}
    </div>
  );
}
