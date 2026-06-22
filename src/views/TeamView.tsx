import { useTranslation } from 'react-i18next';
import type { SportKey, TeamData } from '../types/domain';
import { Hoverable } from '../components/Hoverable';
import { HeroCard } from './HeroCard';
import { HeadToHeadSection } from './HeadToHeadSection';
import { ResultsStrip } from './ResultsStrip';
import { StandingsTable } from './StandingsTable';
import { Roster } from './Roster';
import { SpotlightCard } from './SpotlightCard';
import { FormationCard } from './FormationCard';
import { StadiumCard } from './StadiumCard';
import { HistorySection } from './HistorySection';
import { PlayoffsSection } from './PlayoffsSection';

export function TeamView({ sport, team }: { sport: SportKey; team: TeamData }) {
  const { t } = useTranslation();
  const divisionTerm = sport === 'nfl' ? 'nfcWest' : 'nlWest';
  const divisionName = team.standings.divisionName;
  const rosterTotal = team.roster.reduce((n, g) => n + g.players.length, 0);

  return (
    <div className="view-enter">
      <div id="section-dashboard">
        <HeroCard team={team} sport={sport} teamAbbr={team.teamAbbr} />
        <HeadToHeadSection sport={sport} team={team} />
      </div>

      <section id="section-spotlight" className="section">
        <SpotlightCard team={team} sport={sport} />
      </section>

      <section id="section-formation" className="section">
        <div className="section__title">{t(sport === 'nfl' ? 'nav.formation' : 'nav.lineup')}</div>
        <FormationCard team={team} sport={sport} />
      </section>

      <section className="section">
        <div className="section__title">
          {t('sections.recentResults')}
          {team.recentResults.length > 0 && (
            <span className="section__count">
              {t('sections.recentCount', { count: team.recentResults.length })}
            </span>
          )}
        </div>
        <ResultsStrip results={team.recentResults} sport={sport} teamAbbr={team.teamAbbr} />
      </section>

      <section id="section-standings" className="section">
        <div className="section__title">
          {/* The division glossary tooltips are written for the SF divisions only. */}
          {team.bespoke ? (
            <Hoverable term={divisionTerm}>{divisionName}</Hoverable>
          ) : (
            <span>{divisionName}</span>
          )}
          <span>{t('nav.standings')}</span>
        </div>
        <StandingsTable standings={team.standings} />
      </section>

      <section id="section-venue" className="section">
        <div className="section__title">
          {t(sport === 'nfl' ? 'sections.stadium' : 'sections.ballpark')}
        </div>
        <StadiumCard team={team} />
      </section>

      {/* History is a hand-curated 13-season dataset for the SF teams only. */}
      {team.bespoke && (
        <section id="section-history" className="section">
          <div className="section__title">{t('nav.history')}</div>
          <HistorySection team={team} sport={sport} />
        </section>
      )}

      <section id="section-playoffs" className="section">
        <div className="section__title">{t('nav.playoffs')}</div>
        <PlayoffsSection sport={sport} teamAbbr={team.teamAbbr} />
      </section>

      <section id="section-roster" className="section">
        <div className="section__title">
          {t('sections.roster')}
          {rosterTotal > 0 && (
            <span className="section__count">
              {t('sections.rosterCount', { count: rosterTotal })}
            </span>
          )}
        </div>
        <Roster groups={team.roster} sport={sport} />
      </section>
    </div>
  );
}
