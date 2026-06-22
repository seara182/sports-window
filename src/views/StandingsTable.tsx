import { useTranslation } from 'react-i18next';
import type { Standings } from '../types/domain';
import { Hoverable } from '../components/Hoverable';
import './StandingsTable.css';

export function StandingsTable({ standings }: { standings: Standings }) {
  const { t } = useTranslation();
  const { columns, rows } = standings;

  if (!rows.length) {
    return <div className="empty-note">{t('standings.unavailable')}</div>;
  }

  return (
    <div className="standings-wrap">
      <table className="standings">
        <thead>
          <tr>
            <th className="col-rank">#</th>
            <th className="col-team">Team</th>
            {columns.map((c) => (
              <th key={c.key}>
                <Hoverable term={c.term}>{c.header}</Hoverable>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.teamId}
              className={row.isUserTeam ? 'is-user' : ''}
              style={{ animationDelay: `${150 + i * 20}ms` }}
            >
              <td className="col-rank tnum">{i + 1}</td>
              <td className="col-team">
                <div className="standings__team">
                  {row.logo && <img src={row.logo} alt="" loading="lazy" />}
                  <span className="standings__abbr">{row.abbr}</span>
                  <span className="standings__name">{row.name}</span>
                </div>
              </td>
              {columns.map((c) => (
                <td key={c.key} className="tnum">
                  {row.stats[c.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
