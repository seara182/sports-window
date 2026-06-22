// Content for the in-app Rule Book overlay. Written in the same plain,
// concrete tone as glossary.ts — aimed at an intelligent adult who simply
// hasn't followed American football or baseball before.

export interface RuleBookEntry {
  /** Unique id, used as a search result key and scroll anchor. */
  id: string;
  title: string;
  /** Paragraphs (strings) and/or bullet groups, rendered in order. */
  body: (string | { bullets: string[] })[];
}

export interface RuleBookSection {
  id: string;
  label: string;
  entries: RuleBookEntry[];
}

import { RULE_BOOK_DE } from './ruleBook.de';

export const RULE_BOOK: RuleBookSection[] = [
  {
    id: 'how-to-watch',
    label: 'How to Watch',
    entries: [
      {
        id: 'welcome',
        title: 'Welcome',
        body: [
          'Sports Window follows two San Francisco teams: the 49ers (NFL football) and the Giants (MLB baseball). This Rule Book is a quick reference for anyone who wants the must-know rules, structure, and lingo for either sport — no prior knowledge assumed.',
          'Use the search bar above to jump straight to a topic, or browse the NFL and MLB sections for a fuller walkthrough.',
        ],
      },
      {
        id: 'each-sport-in-one-paragraph',
        title: 'Each Sport in One Paragraph',
        body: [
          "Football: two teams of 11 take turns trying to move an oval ball toward the opponent's end zone. The team with the ball gets four attempts ('downs') to advance at least 10 yards; succeed and the count resets, fail and the other team gets the ball. Games are split into four 15-minute quarters, and scoring mostly comes from touchdowns (6 points) and field goals (3 points).",
          "Baseball: two teams take turns batting and fielding over nine innings. The fielding team's pitcher throws to a batter, who tries to hit the ball and reach base; runners who make it all the way around four bases score a 'run'. Each half-inning ends once the fielding team records three outs. There's no game clock — a game ends when nine innings are complete (or a winner is decided in extra innings).",
        ],
      },
      {
        id: 'common-lingo',
        title: 'Common Lingo',
        body: [
          "A handful of words you'll hear constantly in both sports:",
          {
            bullets: [
              'Possession — which team currently has the ball / is batting.',
              'Turnover — losing the ball to the other team before you intended to (an interception, fumble, or a costly out).',
              'Roster — the full list of players on a team; only some are active for a given game.',
              'Starter vs. bench/bullpen — the players who begin the game vs. those who come in as substitutes or relief.',
              'Regular season vs. playoffs — the long run of games that decides who qualifies, followed by a knockout tournament for the championship.',
              "Franchise — another word for the team as a long-running organization (e.g. 'the 49ers franchise').",
              'Home-field advantage — playing at your own stadium, in front of your own fans, usually earned by a better record.',
              'Lineup — the specific set of players on the field (baseball) or the starting group (football) for a game.',
            ],
          },
        ],
      },
      {
        id: 'broadcast-structure',
        title: 'How a Broadcast is Structured',
        body: [
          'Both sports take longer to watch on TV than the action itself, because the clock frequently stops for replays, commercials, and strategy.',
          {
            bullets: [
              'Score bug — the small graphic in a corner of the screen showing the score, time remaining (football) or inning/count (baseball), and possession info.',
              'Commercial breaks — football has many short stoppages (after scores, turnovers, timeouts, the two-minute warning) that broadcasts fill with ads; baseball breaks between half-innings.',
              "Red zone (football) — when the offense is inside the opponent's 20-yard line and close to scoring; broadcasts often flag this as a big moment.",
              "Instant replay — officials can review close calls on a monitor; in football this is a 'challenge', in baseball it's a 'replay review'. Play pauses while this happens.",
              'Announcers — the play-by-play commentator describes the action in real time, while the color commentator adds analysis and context between plays.',
            ],
          },
        ],
      },
      {
        id: 'tips-for-new-fans',
        title: 'Tips for New Fans',
        body: [
          'A few things that make watching easier early on:',
          {
            bullets: [
              'Pick one or two players to follow — it gives you a thread to track through a game and makes stats feel meaningful.',
              "Watch the score bug to learn the down-and-distance (football) or count and outs (baseball) conventions — they'll click faster than you expect.",
              "Don't worry about every penalty or rule call at first; commentators usually explain the important ones as they happen.",
              'Look out for the dramatic moments both sports build toward: 4th down decisions and two-minute drills in football; full counts (3 balls, 2 strikes) and the 9th inning in baseball.',
              "Both teams' seasons have a clear rhythm — football is one game a week (high stakes each time), baseball is nearly every day (any single game matters less, but trends over weeks matter a lot).",
            ],
          },
        ],
      },
      {
        id: 'hover-to-learn',
        title: "Hover to Learn — Sports Window's Built-in Glossary",
        body: [
          "Throughout the app, any underlined term — a position code like SP or WR, a stat like ERA or COMP%, or a standings column like GB — can be hovered (or tapped on touch) to see a short explanation right where you're reading. This Rule Book covers the bigger picture; the hover tooltips are there for quick, in-context lookups while you browse rosters, games, and player cards.",
        ],
      },
    ],
  },
  {
    id: 'nfl-basics',
    label: 'NFL Basics',
    entries: [
      {
        id: 'nfl-game-structure',
        title: 'Game Structure',
        body: [
          "An NFL game is played in four 15-minute quarters, with a longer break ('halftime') between the 2nd and 3rd quarters. Each team fields 11 players at a time, split into offense (tries to score), defense (tries to stop them), and special teams (handles kicks and punts).",
          {
            bullets: [
              'If the score is tied after regulation, the game goes to overtime — a sudden-death extra period (rules differ slightly between regular season and playoffs).',
              "Teams alternate which unit is on the field: when your offense is out there, the other team's defense is too.",
              'A coin toss before kickoff decides who gets the ball first.',
            ],
          },
        ],
      },
      {
        id: 'nfl-field-scoring',
        title: 'The Field & Scoring',
        body: [
          "The field is 100 yards long between two goal lines, with a 10-yard 'end zone' beyond each one. Ways to score:",
          {
            bullets: [
              "Touchdown (6 points) — carrying or catching the ball into the opponent's end zone.",
              'Extra point (1 point) or two-point conversion (2 points) — a bonus attempt taken right after a touchdown.',
              'Field goal (3 points) — kicking the ball through the goalposts, usually attempted on 4th down when a touchdown looks unlikely.',
              'Safety (2 points) — the defense tackles a ball-carrier in their own end zone (rare, but it happens).',
            ],
          },
          'After a score, the scoring team kicks off to the other team, who then start their next drive from deep in their own territory.',
        ],
      },
      {
        id: 'nfl-downs',
        title: 'Downs — The Core Mechanic',
        body: [
          "Everything in football revolves around 'downs'. The offense gets four attempts (downs) to advance the ball 10 yards. If they succeed within those four tries, the count resets to a fresh '1st and 10'. If they fail, the ball goes to the other team — usually after a punt on 4th down rather than risk losing it on the spot.",
          {
            bullets: [
              "'1st and 10' means it's the first of four downs, with 10 yards to go for a fresh set.",
              "'3rd and 2' means it's the third down, with only 2 yards needed — a much easier situation than '3rd and 12'.",
              "On 4th down, teams usually punt (kick the ball far downfield to the opponent) or attempt a field goal, unless they're close enough — or desperate enough — to 'go for it' and try to gain the yards directly.",
            ],
          },
        ],
      },
      {
        id: 'nfl-clock',
        title: 'The Clock & Key Situations',
        body: [
          'There are two clocks: the game clock (counts down each 15-minute quarter) and the play clock (gives the offense a short window, usually 40 seconds, to start the next play).',
          {
            bullets: [
              'The game clock stops for incomplete passes, plays that end out of bounds, penalties, scores, and timeouts (each team gets a limited number per half).',
              'The two-minute warning — an automatic stoppage near the end of each half — signals the start of crunch time.',
              "'Hurry-up offense' — a fast, no-huddle style used when a team is racing against the clock, usually late in a half.",
              "'Kneeling out the clock' — a leading team's quarterback can simply take the snap and kneel down to run time off the clock when the other team is out of timeouts.",
            ],
          },
        ],
      },
      {
        id: 'nfl-positions-overview',
        title: 'Positions at a Glance',
        body: [
          "Every position abbreviation you'll see on rosters and player cards (QB, WR, OLB, CB, and so on) is explained in detail via the hover glossary throughout the app — just hover or tap the code. As a quick map of the units:",
          {
            bullets: [
              'Offense — Quarterback (QB) leads the unit; Running Backs (RB/FB) carry the ball; Wide Receivers (WR) and Tight Ends (TE) catch passes; the Offensive Line (OL: tackles, guards, center) protects the quarterback and blocks for runners.',
              'Defense — the Defensive Line (DL: ends, tackles) attacks the line of scrimmage; Linebackers (LB) defend the middle; Defensive Backs (CB, S) cover receivers and defend deep passes.',
              'Special Teams — the Kicker (K) handles field goals and kickoffs, the Punter (P) handles punts, and the Long Snapper (LS) snaps the ball on those plays.',
            ],
          },
        ],
      },
      {
        id: 'nfl-penalties',
        title: 'Common Penalties',
        body: [
          "Penalties usually cost the offending team yardage and sometimes a replayed down. The ones you'll hear most:",
          {
            bullets: [
              'Holding — illegally grabbing or restraining an opponent, most often an offensive lineman holding a defender. Usually a 10-yard penalty.',
              'Pass interference — illegally contacting a receiver before the ball arrives, preventing them from making a fair play on the pass. Can be a large penalty, often placing the ball at the spot of the foul.',
              'False start / offside — a player on either side moves before the play begins. A 5-yard penalty.',
              "Roughing the passer — hitting the quarterback illegally (too late, too high, or with excessive force) after he's thrown the ball. A 15-yard penalty, and a notable one because it can extend a drive that should have ended.",
            ],
          },
        ],
      },
      {
        id: 'nfl-standings-playoffs',
        title: 'Standings, Playoffs & the Super Bowl',
        body: [
          'The NFL splits 32 teams into two conferences (NFC and AFC) of 16, each made up of four divisions of four teams. The 49ers play in the NFC West.',
          {
            bullets: [
              "After an 18-week regular season, each conference sends seven teams to the playoffs: the four division winners plus three 'wild card' teams with strong records.",
              "Playoff seeding (1st through 7th) determines who hosts each game and who gets a 'bye' (a free pass past the first round) — the No. 1 seed gets the bye.",
              "The playoffs are single-elimination: lose once and you're out. The two conference champions meet in the Super Bowl to decide the league title.",
            ],
          },
        ],
      },
      {
        id: 'nfl-49ers-facts',
        title: '49ers Quick Facts',
        body: [
          "The San Francisco 49ers play in the NFC West alongside the Seattle Seahawks, Los Angeles Rams, and Arizona Cardinals — one of the most competitive divisions in the league. They're one of the most decorated franchises in NFL history, with multiple Super Bowl titles, and have a long-standing rivalry with the Seahawks and Cowboys.",
        ],
      },
    ],
  },
  {
    id: 'mlb-basics',
    label: 'MLB Basics',
    entries: [
      {
        id: 'mlb-game-structure',
        title: 'Game Structure',
        body: [
          "A baseball game is divided into nine innings. Each inning has two halves: the visiting team bats in the 'top' half, the home team bats in the 'bottom' half. A half-inning ends once the fielding team records three outs — there's no clock, so an inning can take anywhere from a few minutes to half an hour.",
          {
            bullets: [
              'If the score is tied after nine innings, the game continues into extra innings until one team leads after a complete inning (or its home half, if the home team is ahead).',
              'Nine players field at a time: a pitcher, a catcher, four infielders, and three outfielders.',
              "The away team always bats first in each inning — a small but important difference from football's coin-toss start.",
            ],
          },
        ],
      },
      {
        id: 'mlb-field-roles',
        title: 'The Field & Basic Roles',
        body: [
          "The field is a diamond: home plate and three bases (first, second, third) form a square, with a large grass 'outfield' beyond the infield dirt. The pitcher stands on a raised mound at the center of the infield, facing the batter at home plate.",
          "The core matchup of the sport is pitcher vs. batter: the pitcher tries to get the batter out (by strikeout, or a ball hit that's caught or thrown out), while the batter tries to reach base safely.",
        ],
      },
      {
        id: 'mlb-outs',
        title: 'Outs — How Innings End',
        body: [
          "Three outs end a half-inning, no matter the score. The main ways a batter or runner is 'out':",
          {
            bullets: [
              'Strikeout — the batter accumulates three strikes (see Balls, Strikes & the Count).',
              'Fly out — a batted ball is caught in the air by a fielder before it touches the ground.',
              'Ground out / force out — a fielder throws the ball to a base ahead of the runner, or tags the runner, before they arrive.',
              "Tag out — a fielder touches a runner with the ball (held in glove/hand) while the runner isn't on a base.",
            ],
          },
        ],
      },
      {
        id: 'mlb-balls-strikes',
        title: 'Balls, Strikes & the Count',
        body: [
          "Each pitch is called a 'ball' or a 'strike' depending on whether it passes through the 'strike zone' (roughly the area over home plate, between the batter's knees and chest) and how the batter reacts to it.",
          {
            bullets: [
              "Ball — a pitch outside the strike zone that the batter doesn't swing at. Four balls = a 'walk', and the batter goes to first base for free.",
              'Strike — a pitch in the zone, a swing-and-miss, or a foul ball (with an exception below). Three strikes = a strikeout, and the batter is out.',
              "Foul ball — a batted ball that lands outside the field of play. It counts as a strike, except a foul ball can't be the third strike on its own (the batter just keeps batting) — unless it's caught in the air, which is a regular out.",
              "'The count' is written as balls–strikes, e.g. '3-2' (a 'full count') means the very next pitch will either end the at-bat with a walk, strikeout, or a ball in play.",
            ],
          },
        ],
      },
      {
        id: 'mlb-baserunning-scoring',
        title: 'Baserunning & Scoring',
        body: [
          'Runners advance counter-clockwise around first, second, third, and home. A run scores the moment a runner safely touches home plate. The size of a hit roughly determines how far a batter can advance:',
          {
            bullets: [
              'Single — batter reaches first base.',
              'Double — batter reaches second base.',
              'Triple — batter reaches third base (rare, usually requires a defensive misplay or exceptional speed).',
              'Home run — the ball is hit out of the field of play in fair territory; the batter and any runners on base all score automatically.',
              "Runners can also advance on stolen bases (sprinting to the next base while the pitcher is delivering), wild pitches, and other runners' hits or outs (e.g. a 'sacrifice fly' that scores a runner from third even though the batter is out).",
            ],
          },
        ],
      },
      {
        id: 'mlb-pitching-roles',
        title: 'Pitching Roles',
        body: [
          'Teams use multiple pitchers per game, each suited to a different role:',
          {
            bullets: [
              'Starting Pitcher (SP) — begins the game and ideally throws several innings. Teams rotate through about five starters across a season.',
              "Relief Pitcher (RP) — comes in from the 'bullpen' (the warm-up area) to pitch an inning or two when the starter tires.",
              "Closer (CP) — a specialist reliever brought in to protect a narrow lead in the final inning and 'close' the game out; recording the final outs of a win with a small lead earns a 'save' (SV).",
            ],
          },
          "Pitchers are often pulled based on their 'pitch count' — the number of pitches thrown, since fatigue increases injury risk and reduces effectiveness.",
        ],
      },
      {
        id: 'mlb-season-playoffs',
        title: 'A Full Season & Playoffs',
        body: [
          "The MLB regular season is 162 games — far longer than the NFL's 17-18 — so individual games matter less than sustained performance over weeks and months. The Giants play in the National League (NL) West, alongside the Los Angeles Dodgers, San Diego Padres, Arizona Diamondbacks, and Colorado Rockies.",
          {
            bullets: [
              "Division winners and a handful of 'wild card' teams (the best non-division-winners) qualify for the playoffs.",
              'The playoffs proceed through the Division Series, then the Championship Series, for each league.',
              'The NL and American League (AL) champions meet in the World Series — a best-of-seven series that decides the title.',
            ],
          },
        ],
      },
      {
        id: 'mlb-giants-facts',
        title: 'Giants Quick Facts',
        body: [
          "The San Francisco Giants play at Oracle Park, right on the edge of San Francisco Bay. A home run hit over the right field wall and into the water — McCovey Cove — is known as a 'splash hit', a signature moment unique to this ballpark. The Giants are one of MLB's oldest franchises and have won multiple World Series titles in the San Francisco era.",
        ],
      },
    ],
  },
];

export interface RuleBookSearchHit {
  sectionId: string;
  sectionLabel: string;
  entry: RuleBookEntry;
}

/** Flattens body content to plain text for searching. */
function entryText(entry: RuleBookEntry): string {
  const parts: string[] = [entry.title];
  for (const block of entry.body) {
    if (typeof block === 'string') parts.push(block);
    else parts.push(...block.bullets);
  }
  return parts.join(' ').toLowerCase();
}

/** Returns the Rule Book in the given UI language, falling back to English. */
export function getRuleBook(lang: string): RuleBookSection[] {
  return lang === 'de' ? RULE_BOOK_DE : RULE_BOOK;
}

/** Returns every entry whose title or body contains the query, grouped by section. */
export function searchRuleBook(query: string, lang = 'en'): RuleBookSearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits: RuleBookSearchHit[] = [];
  for (const section of getRuleBook(lang)) {
    for (const entry of section.entries) {
      if (entryText(entry).includes(q)) {
        hits.push({ sectionId: section.id, sectionLabel: section.label, entry });
      }
    }
  }
  return hits;
}
