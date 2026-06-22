import { useTranslation } from 'react-i18next';
import type { SportKey } from '../types/domain';
import { useHeadToHead } from '../hooks/useHeadToHead';
import { ResultsStrip } from '../views/ResultsStrip';
import './HeadToHeadStrip.css';

export function HeadToHeadStrip({
  sport,
  slug,
  teamAbbr,
  opponentId,
}: {
  sport: SportKey;
  slug: string;
  teamAbbr: string;
  opponentId?: string;
}) {
  const { t } = useTranslation();
  const h2h = useHeadToHead(sport, slug, teamAbbr, opponentId);

  return (
    <div className="h2h-strip">
      {h2h.status === 'loading' && (
        <div className="h2h-strip__skel">
          {Array.from({ length: 3 }, (_, i) => (
            <div className="skeleton h2h-strip__skel-card" key={i} />
          ))}
        </div>
      )}
      {h2h.status === 'error' && <div className="empty-note">{t('h2h.loadError')}</div>}
      {h2h.status === 'ready' && (
        <>
          <ResultsStrip results={h2h.data.matchups} sport={sport} teamAbbr={teamAbbr} />
          <div className="h2h-strip__record">{h2h.data.seriesRecord}</div>
        </>
      )}
    </div>
  );
}
