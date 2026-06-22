import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SportKey, TeamData } from '../types/domain';
import { ChevronIcon } from '../components/Icons';
import { HeadToHeadStrip } from '../components/HeadToHeadStrip';
import './HeadToHeadSection.css';

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

export function HeadToHeadSection({ sport, team }: { sport: SportKey; team: TeamData }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const upcoming = team.hero.upcoming;

  if (!upcoming) return null;
  const kickoff = Date.parse(upcoming.date);
  if (!Number.isFinite(kickoff) || kickoff - Date.now() > TWO_WEEKS_MS) return null;

  return (
    <div className="h2h-section">
      <button
        type="button"
        className={`h2h-section__head${open ? '' : ' collapsed'}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <ChevronIcon size={16} className="chev" />
        <span>{t('h2h.heading', { opponent: upcoming.opponentName })}</span>
      </button>
      {open && (
        <div className="h2h-section__body">
          <HeadToHeadStrip
            sport={sport}
            slug={team.slug}
            teamAbbr={team.teamAbbr}
            opponentId={upcoming.opponentId}
          />
        </div>
      )}
    </div>
  );
}
