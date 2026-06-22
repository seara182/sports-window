// The glossary that powers every <Hoverable>. Written for an intelligent adult
// who simply hasn't followed US sports. Keep entries plain and concrete.
// If a term appears in the UI without an entry here, that is a bug.

import type { SportKey } from '../types/domain';
import { GLOSSARY_DE } from './glossary.de';

export interface GlossaryEntry {
  title: string;
  body: string;
}

export const GLOSSARY: Record<string, GlossaryEntry> = {
  // ---------------------------------------------------------------- NFL positions
  QB: {
    title: 'Quarterback (QB)',
    body: 'The player who leads the offense. He takes the ball at the start of nearly every play and either hands it off, throws a pass, or runs. The most important position on the team.',
  },
  RB: {
    title: 'Running Back (RB)',
    body: 'A player whose main job is to carry the ball on running plays. Also catches short passes and helps block. Sometimes listed as HB (halfback) or FB (fullback).',
  },
  FB: {
    title: 'Fullback (FB)',
    body: 'A heavier running back who mostly blocks for the main runner and pushes for very short gains. A rare, old-school role on modern offenses.',
  },
  WR: {
    title: 'Wide Receiver (WR)',
    body: 'A fast player positioned near the sidelines whose job is to run downfield and catch passes from the quarterback.',
  },
  TE: {
    title: 'Tight End (TE)',
    body: 'A hybrid position — big enough to block like a lineman, but able to catch passes like a receiver. Lines up next to the offensive line.',
  },
  OT: {
    title: 'Offensive Tackle (OT)',
    body: "A lineman at the outside edge of the offensive line. Protects the quarterback's blind side and opens running lanes. Listed as LT/RT for left and right.",
  },
  OG: {
    title: 'Offensive Guard (OG)',
    body: 'An interior offensive lineman positioned just beside the center, blocking to protect the quarterback and clear running lanes.',
  },
  G: {
    title: 'Guard (G)',
    body: 'An interior offensive lineman positioned beside the center who blocks for the runner and quarterback.',
  },
  C: {
    title: 'Center (C)',
    body: 'The offensive lineman in the middle who snaps (hands) the ball to the quarterback to begin each play, then blocks.',
  },
  OL: {
    title: 'Offensive Line (OL)',
    body: 'The five big players up front (two tackles, two guards, a center) who block to protect the quarterback and open running lanes.',
  },
  DE: {
    title: 'Defensive End (DE)',
    body: "A defensive lineman at the edge whose job is to tackle runners and chase down the quarterback (a 'pass rush').",
  },
  DT: {
    title: 'Defensive Tackle (DT)',
    body: 'An interior defensive lineman who plugs the middle, stops running plays, and pushes back the offensive line.',
  },
  DL: {
    title: 'Defensive Line (DL)',
    body: 'The defensive players up front (ends and tackles) who attack the line of scrimmage to stop runs and rush the passer.',
  },
  NT: {
    title: 'Nose Tackle (NT)',
    body: 'A defensive tackle lined up directly across from the center, in the very middle, who occupies blockers and stuffs runs.',
  },
  LB: {
    title: 'Linebacker (LB)',
    body: 'A versatile defender positioned behind the defensive line. Stops runs, covers receivers, and sometimes rushes the quarterback.',
  },
  ILB: {
    title: 'Inside Linebacker (ILB)',
    body: 'A linebacker in the middle of the defense, strong against the run and responsible for short pass coverage. Also seen as MLB.',
  },
  OLB: {
    title: 'Outside Linebacker (OLB)',
    body: 'A linebacker near the edge who often rushes the passer and sets the edge against running plays.',
  },
  CB: {
    title: 'Cornerback (CB)',
    body: 'A fast defender who covers the opposing wide receivers one-on-one and tries to break up or intercept passes.',
  },
  S: {
    title: 'Safety (S)',
    body: 'A defender who plays deep, the last line of defense against long passes and breakaway runs. Split into free safety (FS) and strong safety (SS).',
  },
  FS: {
    title: 'Free Safety (FS)',
    body: "The deepest defender, who reads the play and helps against long passes — the defense's safety net.",
  },
  SS: {
    title: 'Strong Safety (SS)',
    body: 'A safety who plays a bit closer to the line, strong against the run while still helping in pass coverage.',
  },
  DB: {
    title: 'Defensive Back (DB)',
    body: 'A catch-all term for cornerbacks and safeties — the defenders responsible for covering pass-catchers.',
  },
  K: {
    title: 'Kicker (K)',
    body: 'The specialist who kicks field goals (worth 3 points) and extra points, and kicks the ball off to the other team.',
  },
  P: {
    title: 'Punter (P)',
    body: 'The specialist who punts — kicking the ball far downfield to the other team when the offense fails to gain enough yards.',
  },
  LS: {
    title: 'Long Snapper (LS)',
    body: 'A specialist who accurately snaps the ball backward over a long distance on punts and field goals.',
  },
  PK: {
    title: 'Placekicker (PK)',
    body: 'Another name for the kicker — the player who kicks field goals and extra points from a held or placed ball.',
  },
  ATH: {
    title: 'Athlete (ATH)',
    body: 'A versatile player not yet locked into one position, capable of filling several roles.',
  },

  // ------------------------------------------------------------ MLB positions
  SP: {
    title: 'Starting Pitcher (SP)',
    body: 'The pitcher who begins the game and ideally throws the most innings. Teams rotate through five or so starters across the season.',
  },
  RP: {
    title: 'Relief Pitcher (RP)',
    body: "A pitcher who enters after the starter tires, usually for an inning or two. Relievers come out of the 'bullpen'.",
  },
  CP: {
    title: 'Closer (CP)',
    body: "A specialist relief pitcher brought in to protect a narrow lead in the final inning and finish ('close') the game.",
  },
  P_MLB: {
    title: 'Pitcher (P)',
    body: 'The player who throws the ball toward the batter to begin each play. Pitching is the core of run prevention in baseball.',
  },
  CmlB: {
    title: 'Catcher (C)',
    body: 'The player crouched behind home plate who receives every pitch, calls the game plan, and guards home plate against runners.',
  },
  '1B': {
    title: 'First Baseman (1B)',
    body: 'The infielder stationed at first base. Catches throws from other infielders to record outs and fields balls hit nearby.',
  },
  '2B': {
    title: 'Second Baseman (2B)',
    body: 'The infielder positioned between first and second base. Quick hands and footwork help turn double plays.',
  },
  '3B': {
    title: 'Third Baseman (3B)',
    body: "The infielder at third base, known as the 'hot corner' because hard-hit balls arrive there fast. Needs a strong throwing arm.",
  },
  SS_MLB: {
    title: 'Shortstop (SS)',
    body: 'The infielder between second and third base, usually the most agile fielder, covering the most ground in the infield.',
  },
  LF: {
    title: 'Left Fielder (LF)',
    body: 'The outfielder covering the left third of the grass, catching fly balls and fielding hits in that area.',
  },
  CF: {
    title: 'Center Fielder (CF)',
    body: 'The outfielder in the middle, typically the fastest, responsible for the largest stretch of the outfield.',
  },
  RF: {
    title: 'Right Fielder (RF)',
    body: 'The outfielder covering the right third of the grass, usually with the strongest throwing arm to reach third base.',
  },
  DH: {
    title: 'Designated Hitter (DH)',
    body: 'A player who bats in place of the pitcher but does not field. Lets a strong hitter contribute without playing defense.',
  },
  IF: {
    title: 'Infielder (IF)',
    body: 'A player who fields one of the four infield positions (first, second, third base, or shortstop) near the diamond.',
  },
  OF: {
    title: 'Outfielder (OF)',
    body: 'A player who patrols the grass beyond the infield (left, center, or right), catching fly balls and fielding hits.',
  },
  UTIL: {
    title: 'Utility Player (UTIL)',
    body: 'A versatile player who can capably field several different positions as the team needs.',
  },

  // ------------------------------------------------------- NFL standings columns
  wins: {
    title: 'Wins (W)',
    body: 'The number of games this team has won so far this season.',
  },
  losses: {
    title: 'Losses (L)',
    body: 'The number of games this team has lost so far this season.',
  },
  ties: {
    title: 'Ties (T)',
    body: 'Games that ended level after overtime. Rare in the NFL — most games produce a winner.',
  },
  pct: {
    title: 'Win Percentage (PCT)',
    body: 'The share of games won, from .000 to 1.000. A tie counts as half a win. Used to rank teams regardless of how many games they have played.',
  },
  pointsFor: {
    title: 'Points For (PF)',
    body: 'The total points this team has scored across all its games this season.',
  },
  pointsAgainst: {
    title: 'Points Against (PA)',
    body: 'The total points this team has allowed its opponents to score this season.',
  },
  pointDiff: {
    title: 'Point Differential (DIFF)',
    body: 'Points scored minus points allowed. A positive number means the team outscores opponents overall — a good sign of strength.',
  },
  divRecord: {
    title: 'Division Record (DIV)',
    body: "This team's win–loss record in games against the other three teams in its own division. These games carry extra weight in the standings.",
  },
  confRecord: {
    title: 'Conference Record (CONF)',
    body: 'Win–loss record against teams in the same conference (the NFC or AFC). Used as a tiebreaker for playoff seeding.',
  },
  homeRecord: {
    title: 'Home Record (HOME)',
    body: "Win–loss record in games played at this team's own stadium.",
  },
  awayRecord: {
    title: 'Away / Road Record (AWAY)',
    body: "Win–loss record in games played at the opponent's stadium.",
  },
  streak: {
    title: 'Streak (STRK)',
    body: "The current run of consecutive results. 'W3' means three wins in a row; 'L1' means one loss in a row.",
  },

  // ------------------------------------------------------- MLB standings columns
  winsMlb: {
    title: 'Wins (W)',
    body: 'Games won this season. A baseball season is long — 162 games — so win totals climb high.',
  },
  lossesMlb: {
    title: 'Losses (L)',
    body: 'Games lost this season, out of a 162-game schedule.',
  },
  pctMlb: {
    title: 'Win Percentage (PCT)',
    body: 'The share of games won, from .000 to 1.000. The most direct measure of how a team is doing over a long season.',
  },
  gamesBack: {
    title: 'Games Back (GB)',
    body: "How far behind the division leader a team sits. It counts as half a game for each win the leader is ahead AND each extra loss. '—' marks the leader. Example: if the leader is 2 wins and 2 losses better, that team is 2 games back.",
  },
  runDiff: {
    title: 'Run Differential (RDIFF)',
    body: 'Runs scored minus runs allowed all season. A positive figure means a team outscores opponents overall — often a better sign of true quality than the win total alone.',
  },
  lastTen: {
    title: 'Last Ten Games (L10)',
    body: "The team's win–loss record over its most recent ten games — a quick read on whether it is hot or cold lately.",
  },
  streakMlb: {
    title: 'Streak (STRK)',
    body: "The current run of consecutive results. 'W3' means three straight wins; 'L2' means two straight losses.",
  },

  // --------------------------------------------------------- NFL structural terms
  division: {
    title: 'Division',
    body: 'A group of four teams that compete closely each year. The NFL has eight divisions; the 49ers play in the NFC West alongside Seattle, the Rams, and Arizona.',
  },
  conference: {
    title: 'Conference',
    body: 'The NFL is split into two halves of 16 teams — the NFC and the AFC. The two conference champions meet in the Super Bowl.',
  },
  nfcWest: {
    title: 'NFC West',
    body: "The 49ers' division: San Francisco, the Seattle Seahawks, the Los Angeles Rams, and the Arizona Cardinals.",
  },
  wildCard: {
    title: 'Wild Card',
    body: 'A playoff spot for strong teams that did not win their division. It lets the best non-division-winners still reach the postseason.',
  },
  byeWeek: {
    title: 'Bye Week',
    body: 'A scheduled week off during the season when a team does not play. Every NFL team gets one.',
  },
  playoffSeed: {
    title: 'Playoff Seed',
    body: "A team's ranking (1 through 7 in each conference) entering the playoffs. A higher seed plays weaker opponents and hosts games.",
  },
  superBowl: {
    title: 'Super Bowl',
    body: "The NFL's championship game, played between the NFC and AFC champions to end the season.",
  },
  week: {
    title: 'Week',
    body: 'The NFL regular season runs across 18 numbered weeks, with most teams playing one game per week.',
  },
  overtime: {
    title: 'Overtime (OT)',
    body: 'Extra time played when the score is level at the end of regulation, to try to decide a winner.',
  },

  // --------------------------------------------------------- MLB structural terms
  nlWest: {
    title: 'NL West',
    body: "The Giants' division in the National League: San Francisco, the Los Angeles Dodgers, San Diego, Arizona, and Colorado.",
  },
  nationalLeague: {
    title: 'National League (NL)',
    body: "One of baseball's two leagues. The Giants play in the NL; its champion meets the American League champion in the World Series.",
  },
  series: {
    title: 'Series',
    body: 'Teams play each other in clusters of two to four straight games, called a series, usually over consecutive days in one city.',
  },
  doubleheader: {
    title: 'Doubleheader',
    body: 'Two games between the same two teams played on the same day, often when an earlier game was rained out.',
  },
  wildCardMlb: {
    title: 'Wild Card (MLB)',
    body: 'Playoff spots for the best teams that did not win their division. Three per league reach the postseason this way.',
  },
  activeRoster: {
    title: 'Active Roster (26-man)',
    body: 'The 26 players a team may use in a game on any given day.',
  },
  fortyMan: {
    title: '40-Man Roster',
    body: 'A broader pool of 40 players under contract, including those in the minor leagues, from which the active roster is drawn.',
  },
  injuredList: {
    title: 'Injured List (IL)',
    body: 'Where injured players are placed; they cannot play until they recover, freeing a roster spot in the meantime.',
  },
  worldSeries: {
    title: 'World Series',
    body: "Baseball's championship — a best-of-seven series between the National League and American League champions.",
  },
  inning: {
    title: 'Inning',
    body: 'Baseball is divided into nine innings, each giving both teams a turn to bat until they make three outs.',
  },

  // ----------------------------------------------------------------- shared terms
  record: {
    title: 'Record',
    body: "A team's wins and losses written together, e.g. '12-5' means twelve wins and five losses.",
  },
  venue: {
    title: 'Venue',
    body: 'The stadium or ballpark where the game is played.',
  },
  homeAway: {
    title: 'Home vs Away',
    body: "'Home' games are played at a team's own stadium with its fans; 'away' (or 'road') games are at the opponent's stadium.",
  },
  broadcast: {
    title: 'Broadcast',
    body: 'The TV network or streaming service showing the game.',
  },
  finalScore: {
    title: 'Final',
    body: 'The game is over; the score shown is the finished result.',
  },
  jersey: {
    title: 'Jersey Number',
    body: "The number worn on a player's uniform, used to identify them during play.",
  },
  position: {
    title: 'Position',
    body: 'The role a player fills on the field. Hover any specific code (like QB or SP) to see what that role does.',
  },
  age: {
    title: 'Age',
    body: "The player's age in years.",
  },
  height: {
    title: 'Height',
    body: "The player's height in feet and inches. Hover the value to see it in metric.",
  },
  weight: {
    title: 'Weight',
    body: "The player's playing weight in pounds. Hover the value to see it in kilograms.",
  },
  bats: {
    title: 'Bats',
    body: 'Which side a player swings from: R (right), L (left), or S (switch — able to bat from either side).',
  },
  throws: {
    title: 'Throws',
    body: 'Which hand a player throws with: R (right) or L (left). It matters most for pitchers.',
  },
  injuryOut: {
    title: 'Injury Status',
    body: 'A note that the player is currently unavailable or limited due to injury.',
  },

  // --------------------------------------------------------- advanced stats
  war: {
    title: 'WAR',
    body: 'Wins Above Replacement: overall player value vs. a league-average replacement.',
  },
  ops: {
    title: 'OPS',
    body: 'On-base Plus Slugging: sum of OBP and SLG, measures overall offensive production.',
  },
  whip: {
    title: 'WHIP',
    body: 'Walks + Hits per Inning Pitched: how many baserunners a pitcher allows per inning.',
  },
  kPer9: {
    title: 'K/9',
    body: 'Strikeouts per 9 innings: rate of strikeouts for a pitcher.',
  },
  sv: {
    title: 'SV',
    body: 'Save: recorded when a relief pitcher finishes a game his team wins under specific conditions.',
  },
  eraPlus: {
    title: 'ERA+',
    body: 'ERA adjusted for ballpark and league; 100 = league average, higher is better.',
  },
  wrcPlus: {
    title: 'WRC+',
    body: 'Weighted Runs Created Plus: offensive value adjusted for park/league; 100 = average.',
  },
  passerRating: {
    title: 'Passer Rating',
    body: 'NFL QB efficiency metric combining completion %, yards, TDs, and interceptions (scale 0–158.3).',
  },
  ypc: {
    title: 'YPC',
    body: 'Yards Per Carry: average rushing yards gained per attempt.',
  },
  ypr: {
    title: 'YPR',
    body: 'Yards Per Reception: average receiving yards per catch.',
  },
  dvoa: {
    title: 'DVOA',
    body: 'Defense-adjusted Value Over Average: Football Outsiders efficiency metric.',
  },
  personnel11: {
    title: '11 Personnel',
    body: '1 RB, 1 TE, 3 WR on the field simultaneously.',
  },
  personnel12: {
    title: '12 Personnel',
    body: '1 RB, 2 TE, 2 WR on the field simultaneously.',
  },
  personnel21: {
    title: '21 Personnel',
    body: '2 RB, 1 TE, 2 WR on the field simultaneously.',
  },
  personnel22: {
    title: '22 Personnel',
    body: '2 RB, 2 TE, 1 WR on the field simultaneously.',
  },
  divisionSeries: {
    title: 'Division Series',
    body: 'MLB second-round playoff series, best of 5 games.',
  },
  championshipSeries: {
    title: 'Championship Series',
    body: 'MLB/NFL final-round before the championship game/series.',
  },
  splashHit: {
    title: 'Splash Hit',
    body: 'A home run at Oracle Park that lands in McCovey Cove beyond the right field wall.',
  },
  mcCoveyCove: {
    title: 'McCovey Cove',
    body: "The inlet of San Francisco Bay beyond Oracle Park's right field wall.",
  },
  leed: {
    title: 'LEED',
    body: 'Leadership in Energy and Environmental Design: green building certification standard.',
  },

  // --------------------------------------------------------- player card stat chips
  era: {
    title: 'ERA (Earned Run Average)',
    body: 'The average number of earned runs a pitcher allows per nine innings. Lower is better — a typical good starter sits around 3.50 or below.',
  },
  strikeoutsPitched: {
    title: 'Strikeouts (K)',
    body: "The number of batters this pitcher has struck out — retired by three strikes — this season. Written as 'K' on scoreboards.",
  },
  winLoss: {
    title: 'Win–Loss (W-L)',
    body: "A starting pitcher's individual win and loss totals for the season, credited based on the game's outcome while he was the pitcher of record.",
  },
  avg: {
    title: 'Batting Average (AVG)',
    body: "Hits divided by at-bats, shown like .275. It's the most traditional measure of how often a player gets a hit.",
  },
  hr: {
    title: 'Home Runs (HR)',
    body: 'The number of home runs — balls hit out of the park for an automatic run — this player has hit this season.',
  },
  rbi: {
    title: 'Runs Batted In (RBI)',
    body: "The number of runs that scored as a direct result of this player's hit, walk, or out (such as a sacrifice fly).",
  },
  completionPct: {
    title: 'Completion Percentage (COMP%)',
    body: 'The share of pass attempts this quarterback has completed to a receiver. Around 65% is solid in the modern NFL.',
  },
  passYds: {
    title: 'Passing Yards',
    body: 'Total yards gained through the air on completed passes this season.',
  },
  touchdown: {
    title: 'Touchdown (TD)',
    body: 'Worth 6 points — reaching the end zone by run, catch, or pass. This count tracks how many this player is directly responsible for.',
  },
  interceptionsThrown: {
    title: 'Interceptions (INT)',
    body: 'Passes thrown by this quarterback that were caught by the defense — a turnover. Fewer is better.',
  },
  rushYds: {
    title: 'Rushing Yards',
    body: 'Total yards gained by running with the ball this season.',
  },
  receptions: {
    title: 'Receptions (REC)',
    body: 'The number of passes this player has successfully caught this season.',
  },
  recYds: {
    title: 'Receiving Yards',
    body: 'Total yards gained after catching passes this season.',
  },
  status: {
    title: 'Roster Status',
    body: "Whether this player is currently available to play. 'Active' means healthy and eligible; other statuses (Injured, Suspended, etc.) mean they're temporarily unavailable.",
  },
  experience: {
    title: 'Years in League',
    body: 'How many seasons this player has played in the league, including the current one — a rough measure of veteran experience.',
  },
  ppg: {
    title: 'Points Per Game (PPG)',
    body: 'The average number of points this team scored per game that season.',
  },
  pointsAllowedPerGame: {
    title: 'Points Allowed Per Game',
    body: "The average number of points this team's defense gave up per game that season — lower is better.",
  },
  teamEra: {
    title: 'Team ERA',
    body: "The combined earned run average of the team's entire pitching staff that season — lower means the staff allowed fewer runs.",
  },
  teamAvg: {
    title: 'Team Batting Average',
    body: "The team's overall batting average that season — how often the lineup got a hit, combined.",
  },
};

/** Looks up a glossary entry in the given UI language, falling back to English
 *  for any term that has not been translated yet. */
export function getGlossary(term: string, lang = 'en'): GlossaryEntry | undefined {
  if (lang === 'de') return GLOSSARY_DE[term] ?? GLOSSARY[term];
  return GLOSSARY[term];
}

export const GLOSSARY_COUNT = Object.keys(GLOSSARY).length;

// MLB reuses some NFL letters for different roles, so positions are mapped to
// glossary terms with the sport in mind.
const MLB_POSITION_REMAP: Record<string, string> = {
  C: 'CmlB',
  SS: 'SS_MLB',
  P: 'P_MLB',
};

/** Maps a raw position abbreviation to its glossary key, accounting for
 * MLB/NFL letter collisions (C, SS, P mean different things per sport). */
export function positionTerm(sport: SportKey, abbr: string): string {
  return sport === 'mlb' ? (MLB_POSITION_REMAP[abbr] ?? abbr) : abbr;
}

// Maps player-card stat-chip / comparison-bar / sparkline labels (see
// playerStatsParsers.ts CHIP_DEFS) to glossary keys.
const STAT_CHIP_TERMS: Record<string, string> = {
  ERA: 'era',
  K: 'strikeoutsPitched',
  WHIP: 'whip',
  'W-L': 'winLoss',
  'K/9': 'kPer9',
  SV: 'sv',
  AVG: 'avg',
  HR: 'hr',
  RBI: 'rbi',
  OPS: 'ops',
  'COMP%': 'completionPct',
  'PASS YDS': 'passYds',
  TD: 'touchdown',
  INT: 'interceptionsThrown',
  RATING: 'passerRating',
  'RUSH YDS': 'rushYds',
  YPC: 'ypc',
  REC: 'receptions',
  'REC YDS': 'recYds',
  YPR: 'ypr',
};

/** Maps a stat-chip label to its glossary key, or undefined if none exists. */
export function statChipTerm(label: string): string | undefined {
  return STAT_CHIP_TERMS[label];
}
