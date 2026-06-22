// German translation of the in-app Rule Book (see ruleBook.ts for the English
// source and the RuleBookSection/Entry shapes). Section ids and entry ids are
// identical to the English version. US-sports jargon (down, touchdown, field
// goal, inning, strike, walk, run, …) is kept in English — it is lingo, not
// vocabulary. Register is impersonal.
import type { RuleBookSection } from './ruleBook';

export const RULE_BOOK_DE: RuleBookSection[] = [
  {
    id: 'how-to-watch',
    label: 'Zum Einstieg',
    entries: [
      {
        id: 'welcome',
        title: 'Willkommen',
        body: [
          'Sports Window verfolgt zwei Teams aus San Francisco: die 49ers (NFL, Football) und die Giants (MLB, Baseball). Dieses Regelwerk ist eine schnelle Referenz für alle, die die wichtigsten Regeln, die Struktur und das Vokabular beider Sportarten kennenlernen wollen — ganz ohne Vorwissen.',
          'Die Suchleiste oben führt direkt zu einem Thema; alternativ geben die Abschnitte zu NFL und MLB einen ausführlicheren Überblick.',
        ],
      },
      {
        id: 'each-sport-in-one-paragraph',
        title: 'Jede Sportart in einem Absatz',
        body: [
          'Football: Zwei Teams mit je 11 Spielern versuchen abwechselnd, einen ovalen Ball in die End Zone des Gegners zu bringen. Das Team mit dem Ball hat vier Versuche („Downs“), um mindestens 10 Yards gutzumachen; gelingt das, beginnt die Zählung neu, misslingt es, bekommt das andere Team den Ball. Spiele bestehen aus vier 15-Minuten-Quartern, Punkte kommen meist aus Touchdowns (6 Punkte) und Field Goals (3 Punkte).',
          'Baseball: Zwei Teams wechseln sich über neun Innings im Schlagen und Feldspiel ab. Der Pitcher der Feldmannschaft wirft zum Batter, der den Ball treffen und eine Base erreichen will; Läufer, die es ganz um die vier Bases schaffen, erzielen einen „Run“. Jedes Half-Inning endet, sobald die Feldmannschaft drei Outs verzeichnet. Es gibt keine Spieluhr — ein Spiel endet nach neun vollständigen Innings (oder wenn in Extra Innings ein Sieger feststeht).',
        ],
      },
      {
        id: 'common-lingo',
        title: 'Wichtiges Vokabular',
        body: [
          'Eine Handvoll Begriffe, die in beiden Sportarten ständig fallen:',
          {
            bullets: [
              'Possession — welches Team gerade den Ball hat bzw. am Schlag ist.',
              'Turnover — der ungewollte Verlust des Balls an das andere Team (eine Interception, ein Fumble oder ein teures Out).',
              'Roster (Kader) — die vollständige Spielerliste eines Teams; nur ein Teil ist für ein Spiel aktiv.',
              'Starter vs. Bench/Bullpen — die Spieler, die das Spiel beginnen, gegenüber denen, die als Ersatz oder Relief kommen.',
              'Regular Season vs. Playoffs — die lange Spielreihe, die über die Qualifikation entscheidet, gefolgt von einem K.-o.-Turnier um die Meisterschaft.',
              'Franchise — ein anderes Wort für das Team als langjährige Organisation (z. B. „die Franchise der 49ers“).',
              'Heimvorteil — das Spiel im eigenen Stadion vor den eigenen Fans, meist durch eine bessere Bilanz verdient.',
              'Lineup — die konkrete Aufstellung der Spieler auf dem Feld (Baseball) bzw. die Startformation (Football) für ein Spiel.',
            ],
          },
        ],
      },
      {
        id: 'broadcast-structure',
        title: 'Wie eine Übertragung aufgebaut ist',
        body: [
          'Beide Sportarten dauern im TV länger als die eigentliche Aktion, weil die Uhr häufig für Wiederholungen, Werbung und Taktik anhält.',
          {
            bullets: [
              'Score Bug — die kleine Grafik in einer Bildschirmecke mit Spielstand, Restzeit (Football) bzw. Inning/Count (Baseball) und Possession-Info.',
              'Werbepausen — Football hat viele kurze Unterbrechungen (nach Scores, Turnovers, Timeouts, der Two-Minute Warning), die mit Werbung gefüllt werden; Baseball pausiert zwischen den Half-Innings.',
              'Red Zone (Football) — wenn die Offense innerhalb der 20-Yard-Linie des Gegners steht und nah am Punkten ist; Übertragungen heben das oft als großen Moment hervor.',
              'Instant Replay — Offizielle können knappe Entscheidungen am Monitor überprüfen; im Football ist das eine „Challenge“, im Baseball ein „Replay Review“. Das Spiel pausiert dabei.',
              'Kommentatoren — der Play-by-Play-Kommentator beschreibt die Aktion in Echtzeit, der Color-Kommentator liefert zwischen den Spielzügen Analyse und Kontext.',
            ],
          },
        ],
      },
      {
        id: 'tips-for-new-fans',
        title: 'Tipps für neue Fans',
        body: [
          'Ein paar Dinge, die den Einstieg erleichtern:',
          {
            bullets: [
              'Ein oder zwei Spieler zum Verfolgen auswählen — das gibt einen roten Faden durchs Spiel und macht Statistiken greifbar.',
              'Den Score Bug beobachten, um Down-and-Distance (Football) oder Count und Outs (Baseball) zu lernen — das sitzt schneller als gedacht.',
              'Anfangs nicht über jede Penalty oder Regelentscheidung grübeln; die Kommentatoren erklären die wichtigen meist sofort.',
              'Auf die dramatischen Momente achten, auf die beide Sportarten zusteuern: 4th-Down-Entscheidungen und Two-Minute-Drills im Football; Full Counts (3 Balls, 2 Strikes) und das 9. Inning im Baseball.',
              'Die Saisons haben einen klaren Rhythmus — Football ist ein Spiel pro Woche (jedes Mal viel auf dem Spiel), Baseball ist fast täglich (ein einzelnes Spiel zählt weniger, aber Trends über Wochen zählen viel).',
            ],
          },
        ],
      },
      {
        id: 'hover-to-learn',
        title: 'Per Maus lernen — das eingebaute Glossar von Sports Window',
        body: [
          'Überall in der App lässt sich jeder unterstrichene Begriff — ein Positionskürzel wie SP oder WR, eine Statistik wie ERA oder COMP% oder eine Tabellenspalte wie GB — mit der Maus (oder per Tippen am Touchscreen) ansteuern, um direkt an Ort und Stelle eine kurze Erklärung zu sehen. Dieses Regelwerk liefert das große Ganze; die Tooltips sind für schnelle Nachschläge im Kontext da, während man Kader, Spiele und Spielerkarten durchstöbert.',
        ],
      },
    ],
  },
  {
    id: 'nfl-basics',
    label: 'NFL-Grundlagen',
    entries: [
      {
        id: 'nfl-game-structure',
        title: 'Spielstruktur',
        body: [
          'Ein NFL-Spiel besteht aus vier 15-Minuten-Quartern, mit einer längeren Pause („Halftime“) zwischen dem 2. und 3. Quarter. Jedes Team hat 11 Spieler gleichzeitig auf dem Feld, aufgeteilt in Offense (versucht zu punkten), Defense (versucht das zu verhindern) und Special Teams (für Kicks und Punts).',
          {
            bullets: [
              'Steht es nach der regulären Zeit unentschieden, geht das Spiel in die Overtime — eine Sudden-Death-Verlängerung (die Regeln unterscheiden sich leicht zwischen Regular Season und Playoffs).',
              'Die Teams wechseln sich mit ihren Einheiten ab: Ist die eigene Offense auf dem Feld, ist auch die Defense des anderen Teams draußen.',
              'Ein Münzwurf vor dem Kickoff entscheidet, wer den Ball zuerst bekommt.',
            ],
          },
        ],
      },
      {
        id: 'nfl-field-scoring',
        title: 'Das Feld & das Punkten',
        body: [
          'Das Feld ist zwischen den beiden Goal Lines 100 Yards lang, mit einer 10 Yards tiefen End Zone dahinter. Möglichkeiten zu punkten:',
          {
            bullets: [
              'Touchdown (6 Punkte) — den Ball in die End Zone des Gegners tragen oder dort fangen.',
              'Extra Point (1 Punkt) oder Two-Point Conversion (2 Punkte) — ein Bonusversuch direkt nach einem Touchdown.',
              'Field Goal (3 Punkte) — den Ball durch die Goalposts kicken, meist am 4th Down versucht, wenn ein Touchdown unwahrscheinlich wirkt.',
              'Safety (2 Punkte) — die Defense tackelt einen Ballträger in dessen eigener End Zone (selten, kommt aber vor).',
            ],
          },
          'Nach einem Score kickt das punktende Team zum Gegner, der seinen nächsten Drive tief in der eigenen Hälfte beginnt.',
        ],
      },
      {
        id: 'nfl-downs',
        title: 'Downs — die zentrale Mechanik',
        body: [
          'Im Football dreht sich alles um „Downs“. Die Offense hat vier Versuche (Downs), um den Ball 10 Yards vorzubringen. Gelingt das in diesen vier Versuchen, beginnt die Zählung neu bei „1st and 10“. Misslingt es, geht der Ball ans andere Team — meist nach einem Punt am 4th Down, statt ihn an Ort und Stelle zu riskieren.',
          {
            bullets: [
              '„1st and 10“ heißt: erster von vier Downs, noch 10 Yards bis zu einem neuen Satz.',
              '„3rd and 2“ heißt: dritter Down, nur noch 2 Yards nötig — eine viel leichtere Lage als „3rd and 12“.',
              'Am 4th Down punten Teams meist (Ball weit zum Gegner kicken) oder versuchen ein Field Goal — außer sie sind nah genug oder verzweifelt genug, um es zu versuchen („go for it“) und die Yards direkt zu holen.',
            ],
          },
        ],
      },
      {
        id: 'nfl-clock',
        title: 'Die Uhr & wichtige Situationen',
        body: [
          'Es gibt zwei Uhren: die Game Clock (zählt jedes 15-Minuten-Quarter herunter) und die Play Clock (gibt der Offense ein kurzes Fenster, meist 40 Sekunden, um den nächsten Spielzug zu starten).',
          {
            bullets: [
              'Die Game Clock stoppt bei unvollständigen Pässen, Spielzügen ins Aus, Penalties, Scores und Timeouts (jedes Team hat pro Halbzeit eine begrenzte Zahl).',
              'Die Two-Minute Warning — ein automatischer Stopp kurz vor jeder Halbzeit — läutet die heiße Phase ein.',
              '„Hurry-up Offense“ — ein schneller No-Huddle-Stil, wenn ein Team gegen die Uhr spielt, meist spät in einer Halbzeit.',
              '„Kneeling out the clock“ — der Quarterback eines führenden Teams kann den Snap annehmen und sich hinknien, um Zeit von der Uhr laufen zu lassen, wenn der Gegner keine Timeouts mehr hat.',
            ],
          },
        ],
      },
      {
        id: 'nfl-positions-overview',
        title: 'Positionen im Überblick',
        body: [
          'Jedes Positionskürzel auf Kadern und Spielerkarten (QB, WR, OLB, CB usw.) wird überall in der App ausführlich über das Hover-Glossar erklärt — einfach das Kürzel ansteuern oder antippen. Als schnelle Übersicht der Einheiten:',
          {
            bullets: [
              'Offense — der Quarterback (QB) führt die Einheit an; Running Backs (RB/FB) tragen den Ball; Wide Receiver (WR) und Tight Ends (TE) fangen Pässe; die Offensive Line (OL: Tackles, Guards, Center) schützt den Quarterback und blockt für Läufer.',
              'Defense — die Defensive Line (DL: Ends, Tackles) attackiert die Line of Scrimmage; Linebacker (LB) verteidigen die Mitte; Defensive Backs (CB, S) decken Receiver und sichern gegen tiefe Pässe.',
              'Special Teams — der Kicker (K) übernimmt Field Goals und Kickoffs, der Punter (P) die Punts, und der Long Snapper (LS) snapt den Ball bei diesen Spielzügen.',
            ],
          },
        ],
      },
      {
        id: 'nfl-penalties',
        title: 'Häufige Penalties',
        body: [
          'Penalties kosten das schuldige Team meist Raum (Yards) und manchmal einen wiederholten Down. Die häufigsten:',
          {
            bullets: [
              'Holding — das unerlaubte Festhalten eines Gegners, meist ein Offensive Lineman, der einen Verteidiger hält. Üblicherweise 10 Yards Strafe.',
              'Pass Interference — unerlaubter Kontakt mit einem Receiver, bevor der Ball ankommt, der ihn an einer fairen Aktion hindert. Kann teuer sein, oft wird der Ball an den Ort des Vergehens gelegt.',
              'False Start / Offside — ein Spieler einer Seite bewegt sich vor Spielbeginn. 5 Yards Strafe.',
              'Roughing the Passer — ein unerlaubter Treffer am Quarterback (zu spät, zu hoch oder mit übermäßiger Härte), nachdem er geworfen hat. 15 Yards Strafe und bemerkenswert, weil sie einen Drive verlängern kann, der hätte enden sollen.',
            ],
          },
        ],
      },
      {
        id: 'nfl-standings-playoffs',
        title: 'Tabelle, Playoffs & der Super Bowl',
        body: [
          'Die NFL teilt 32 Teams in zwei Conferences (NFC und AFC) zu je 16, jede aus vier Divisions mit vier Teams. Die 49ers spielen in der NFC West.',
          {
            bullets: [
              'Nach einer 18-wöchigen Regular Season schickt jede Conference sieben Teams in die Playoffs: die vier Divisionssieger plus drei „Wild Card“-Teams mit starker Bilanz.',
              'Die Playoff-Setzung (1 bis 7) bestimmt, wer jedes Spiel ausrichtet und wer ein „Bye“ bekommt (einen Freilos-Durchgang in der ersten Runde) — die Nr.-1-Setzung erhält das Bye.',
              'Die Playoffs sind K. o.: einmal verlieren und raus. Die beiden Conference-Sieger treffen im Super Bowl um den Ligatitel aufeinander.',
            ],
          },
        ],
      },
      {
        id: 'nfl-49ers-facts',
        title: '49ers — kurz & knapp',
        body: [
          'Die San Francisco 49ers spielen in der NFC West neben den Seattle Seahawks, Los Angeles Rams und Arizona Cardinals — eine der umkämpftesten Divisions der Liga. Sie sind eine der erfolgreichsten Franchises der NFL-Geschichte mit mehreren Super-Bowl-Titeln und pflegen langjährige Rivalitäten mit den Seahawks und den Cowboys.',
        ],
      },
    ],
  },
  {
    id: 'mlb-basics',
    label: 'MLB-Grundlagen',
    entries: [
      {
        id: 'mlb-game-structure',
        title: 'Spielstruktur',
        body: [
          'Ein Baseball-Spiel besteht aus neun Innings. Jedes Inning hat zwei Hälften: das Gastteam schlägt im „Top“, das Heimteam im „Bottom“. Ein Half-Inning endet, sobald die Feldmannschaft drei Outs verzeichnet — es gibt keine Uhr, also kann ein Inning von wenigen Minuten bis zu einer halben Stunde dauern.',
          {
            bullets: [
              'Steht es nach neun Innings unentschieden, geht es in Extra Innings, bis ein Team nach einem vollständigen Inning führt (oder nach seiner Heimhälfte, wenn das Heimteam vorn liegt).',
              'Neun Spieler feldet gleichzeitig: ein Pitcher, ein Catcher, vier Infielder und drei Outfielder.',
              'Das Gastteam schlägt in jedem Inning zuerst — ein kleiner, aber wichtiger Unterschied zum Münzwurf-Start des Footballs.',
            ],
          },
        ],
      },
      {
        id: 'mlb-field-roles',
        title: 'Das Feld & die Grundrollen',
        body: [
          'Das Feld ist ein Diamond: Home Plate und drei Bases (First, Second, Third) bilden ein Quadrat, dahinter liegt ein großes Gras-„Outfield“ jenseits des Infield-Sands. Der Pitcher steht auf einem erhöhten Mound in der Mitte des Infields, dem Batter an der Home Plate zugewandt.',
          'Das Kernduell des Sports ist Pitcher gegen Batter: Der Pitcher will den Batter ausmachen (per Strikeout oder einem geschlagenen Ball, der gefangen oder weggeworfen wird), während der Batter sicher eine Base erreichen will.',
        ],
      },
      {
        id: 'mlb-outs',
        title: 'Outs — wie Innings enden',
        body: [
          'Drei Outs beenden ein Half-Inning, egal beim welchem Spielstand. Die wichtigsten Wege, wie ein Batter oder Läufer „out“ ist:',
          {
            bullets: [
              'Strikeout — der Batter sammelt drei Strikes (siehe Balls, Strikes & der Count).',
              'Fly Out — ein geschlagener Ball wird in der Luft gefangen, bevor er den Boden berührt.',
              'Ground Out / Force Out — ein Feldspieler wirft den Ball vor dem Läufer zu einer Base oder tagt den Läufer, bevor er ankommt.',
              'Tag Out — ein Feldspieler berührt einen Läufer mit dem Ball (in Handschuh/Hand), während der Läufer nicht auf einer Base steht.',
            ],
          },
        ],
      },
      {
        id: 'mlb-balls-strikes',
        title: 'Balls, Strikes & der Count',
        body: [
          'Jeder Pitch wird als „Ball“ oder „Strike“ gewertet — je nachdem, ob er durch die „Strike Zone“ verläuft (grob der Bereich über der Home Plate, zwischen Knie und Brust des Batters) und wie der Batter reagiert.',
          {
            bullets: [
              'Ball — ein Pitch außerhalb der Strike Zone, bei dem der Batter nicht schwingt. Vier Balls = ein „Walk“, und der Batter geht frei zur First Base.',
              'Strike — ein Pitch in der Zone, ein Swing-and-Miss oder ein Foul Ball (mit Ausnahme unten). Drei Strikes = ein Strikeout, und der Batter ist out.',
              'Foul Ball — ein geschlagener Ball, der außerhalb des Spielfelds landet. Er zählt als Strike, kann aber nicht der dritte Strike für sich sein (der Batter schlägt einfach weiter) — außer er wird in der Luft gefangen, was ein reguläres Out ist.',
              '„Der Count“ wird als Balls–Strikes geschrieben, z. B. „3-2“ (ein „Full Count“) heißt, der nächste Pitch beendet das At-Bat per Walk, Strikeout oder Ball im Spiel.',
            ],
          },
        ],
      },
      {
        id: 'mlb-baserunning-scoring',
        title: 'Baserunning & Punkten',
        body: [
          'Läufer rücken gegen den Uhrzeigersinn über First, Second, Third und Home vor. Ein Run zählt in dem Moment, in dem ein Läufer sicher die Home Plate berührt. Die Größe eines Hits bestimmt grob, wie weit ein Batter vorrücken kann:',
          {
            bullets: [
              'Single — der Batter erreicht die First Base.',
              'Double — der Batter erreicht die Second Base.',
              'Triple — der Batter erreicht die Third Base (selten, meist nur bei einem Defensivfehler oder außergewöhnlichem Tempo).',
              'Home Run — der Ball wird im Fair-Bereich aus dem Spielfeld geschlagen; der Batter und alle Läufer auf den Bases erzielen automatisch einen Run.',
              'Läufer können auch durch Stolen Bases (Sprint zur nächsten Base, während der Pitcher wirft), Wild Pitches und Hits oder Outs anderer Läufer vorrücken (z. B. ein „Sacrifice Fly“, der einen Läufer von der Third nach Hause bringt, obwohl der Batter out ist).',
            ],
          },
        ],
      },
      {
        id: 'mlb-pitching-roles',
        title: 'Pitching-Rollen',
        body: [
          'Teams setzen pro Spiel mehrere Pitcher ein, jeder für eine andere Rolle:',
          {
            bullets: [
              'Starting Pitcher (SP) — beginnt das Spiel und wirft idealerweise mehrere Innings. Teams rotieren über eine Saison durch etwa fünf Starter.',
              'Relief Pitcher (RP) — kommt aus dem „Bullpen“ (dem Aufwärmbereich), um ein bis zwei Innings zu pitchen, wenn der Starter ermüdet.',
              'Closer (CP) — ein spezialisierter Reliever, der eine knappe Führung im letzten Inning schützen und das Spiel „closen“ soll; das Verbuchen der letzten Outs eines Sieges mit knappem Vorsprung bringt einen „Save“ (SV).',
            ],
          },
          'Pitcher werden oft anhand ihres „Pitch Count“ ausgewechselt — der Zahl geworfener Pitches, da Ermüdung das Verletzungsrisiko erhöht und die Wirkung mindert.',
        ],
      },
      {
        id: 'mlb-season-playoffs',
        title: 'Eine ganze Saison & die Playoffs',
        body: [
          'Die MLB-Regular-Season umfasst 162 Spiele — weit mehr als die 17–18 der NFL — daher zählen einzelne Spiele weniger als die anhaltende Leistung über Wochen und Monate. Die Giants spielen in der National League (NL) West, neben den Los Angeles Dodgers, San Diego Padres, Arizona Diamondbacks und Colorado Rockies.',
          {
            bullets: [
              'Divisionssieger und eine Handvoll „Wild Card“-Teams (die besten Nicht-Divisionssieger) qualifizieren sich für die Playoffs.',
              'Die Playoffs verlaufen je Liga über die Division Series, dann die Championship Series.',
              'Die Champions der NL und der American League (AL) treffen in der World Series aufeinander — einer Best-of-Seven-Serie, die den Titel entscheidet.',
            ],
          },
        ],
      },
      {
        id: 'mlb-giants-facts',
        title: 'Giants — kurz & knapp',
        body: [
          'Die San Francisco Giants spielen im Oracle Park, direkt am Rand der San Francisco Bay. Ein Home Run über die Right-Field-Mauer ins Wasser — die McCovey Cove — heißt „Splash Hit“, ein für diesen Ballpark einzigartiger Signature-Moment. Die Giants sind eine der ältesten Franchises der MLB und haben in der San-Francisco-Ära mehrere World-Series-Titel gewonnen.',
        ],
      },
    ],
  },
];
