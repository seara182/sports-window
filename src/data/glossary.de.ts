// German translation of the glossary (see glossary.ts for the English source
// and the GlossaryEntry shape). Keys are identical so getGlossary can fall back
// to English for anything missing. US-sports jargon and stat abbreviations are
// kept in English (they are lingo, not vocabulary); only the explanations and
// generic headwords (wins, losses, conference, age, …) are translated.
// Register is impersonal — no direct address.
import type { GlossaryEntry } from './glossary';

export const GLOSSARY_DE: Record<string, GlossaryEntry> = {
  // ---------------------------------------------------------------- NFL-Positionen
  QB: {
    title: 'Quarterback (QB)',
    body: 'Der Spieler, der die Offense anführt. Er bekommt bei fast jedem Spielzug den Ball und gibt ihn ab, wirft einen Pass oder läuft selbst. Die wichtigste Position im Team.',
  },
  RB: {
    title: 'Running Back (RB)',
    body: 'Ein Spieler, dessen Hauptaufgabe es ist, bei Laufspielzügen den Ball zu tragen. Fängt auch kurze Pässe und hilft beim Blocken. Manchmal als HB (Halfback) oder FB (Fullback) gelistet.',
  },
  FB: {
    title: 'Fullback (FB)',
    body: 'Ein schwererer Running Back, der vor allem für den eigentlichen Läufer blockt und sehr kurze Raumgewinne erzwingt. Eine seltene, altmodische Rolle im modernen Football.',
  },
  WR: {
    title: 'Wide Receiver (WR)',
    body: 'Ein schneller Spieler nahe der Seitenlinie, dessen Aufgabe es ist, nach vorn zu laufen und Pässe des Quarterbacks zu fangen.',
  },
  TE: {
    title: 'Tight End (TE)',
    body: 'Eine Hybrid-Position — groß genug, um wie ein Lineman zu blocken, aber fähig, wie ein Receiver Pässe zu fangen. Steht neben der Offensive Line.',
  },
  OT: {
    title: 'Offensive Tackle (OT)',
    body: 'Ein Lineman am äußeren Rand der Offensive Line. Schützt die Blind Side des Quarterbacks und öffnet Laufwege. Als LT/RT für links und rechts gelistet.',
  },
  OG: {
    title: 'Offensive Guard (OG)',
    body: 'Ein innerer Offensive Lineman direkt neben dem Center, der blockt, um den Quarterback zu schützen und Laufwege freizuräumen.',
  },
  G: {
    title: 'Guard (G)',
    body: 'Ein innerer Offensive Lineman neben dem Center, der für Läufer und Quarterback blockt.',
  },
  C: {
    title: 'Center (C)',
    body: 'Der Offensive Lineman in der Mitte, der den Ball per Snap zum Quarterback bringt und dann blockt.',
  },
  OL: {
    title: 'Offensive Line (OL)',
    body: 'Die fünf großen Spieler vorne (zwei Tackles, zwei Guards, ein Center), die blocken, um den Quarterback zu schützen und Laufwege zu öffnen.',
  },
  DE: {
    title: 'Defensive End (DE)',
    body: 'Ein Defensive Lineman am Rand, dessen Aufgabe es ist, Läufer zu stoppen und den Quarterback unter Druck zu setzen (Pass Rush).',
  },
  DT: {
    title: 'Defensive Tackle (DT)',
    body: 'Ein innerer Defensive Lineman, der die Mitte verstopft, Laufspielzüge stoppt und die Offensive Line zurückdrängt.',
  },
  DL: {
    title: 'Defensive Line (DL)',
    body: 'Die vorderen Defensivspieler (Ends und Tackles), die die Line of Scrimmage attackieren, um Läufe zu stoppen und den Passgeber unter Druck zu setzen.',
  },
  NT: {
    title: 'Nose Tackle (NT)',
    body: 'Ein Defensive Tackle direkt gegenüber dem Center, ganz in der Mitte, der Blocker bindet und Läufe stopft.',
  },
  LB: {
    title: 'Linebacker (LB)',
    body: 'Ein vielseitiger Verteidiger hinter der Defensive Line. Stoppt Läufe, deckt Receiver und setzt manchmal den Quarterback unter Druck.',
  },
  ILB: {
    title: 'Inside Linebacker (ILB)',
    body: 'Ein Linebacker in der Mitte der Defense, stark gegen den Lauf und für kurze Passdeckung zuständig. Auch als MLB bekannt.',
  },
  OLB: {
    title: 'Outside Linebacker (OLB)',
    body: 'Ein Linebacker am Rand, der oft den Passgeber attackiert und gegen Laufspielzüge die Kante hält.',
  },
  CB: {
    title: 'Cornerback (CB)',
    body: 'Ein schneller Verteidiger, der die gegnerischen Wide Receiver eins gegen eins deckt und Pässe abfängt oder stört.',
  },
  S: {
    title: 'Safety (S)',
    body: 'Ein Verteidiger, der tief steht — die letzte Verteidigungslinie gegen lange Pässe und durchgebrochene Läufe. Unterteilt in Free Safety (FS) und Strong Safety (SS).',
  },
  FS: {
    title: 'Free Safety (FS)',
    body: 'Der am tiefsten postierte Verteidiger, der den Spielzug liest und gegen lange Pässe absichert — das Sicherheitsnetz der Defense.',
  },
  SS: {
    title: 'Strong Safety (SS)',
    body: 'Eine Safety, die etwas näher an der Line steht, stark gegen den Lauf, aber weiter in der Passdeckung hilft.',
  },
  DB: {
    title: 'Defensive Back (DB)',
    body: 'Sammelbegriff für Cornerbacks und Safeties — die Verteidiger, die für die Deckung der Passempfänger zuständig sind.',
  },
  K: {
    title: 'Kicker (K)',
    body: 'Der Spezialist, der Field Goals (3 Punkte) und Extra Points kickt und den Ball zum Gegner kickt (Kickoff).',
  },
  P: {
    title: 'Punter (P)',
    body: 'Der Spezialist, der punted — den Ball weit nach vorn zum Gegner kickt, wenn die Offense nicht genug Raum gutmacht.',
  },
  LS: {
    title: 'Long Snapper (LS)',
    body: 'Ein Spezialist, der den Ball bei Punts und Field Goals präzise über eine lange Distanz nach hinten snapt.',
  },
  PK: {
    title: 'Placekicker (PK)',
    body: 'Ein anderer Name für den Kicker — der Spieler, der Field Goals und Extra Points von einem gehaltenen oder abgelegten Ball kickt.',
  },
  ATH: {
    title: 'Athlete (ATH)',
    body: 'Ein vielseitiger Spieler, der noch nicht auf eine Position festgelegt ist und mehrere Rollen ausfüllen kann.',
  },

  // ------------------------------------------------------------ MLB-Positionen
  SP: {
    title: 'Starting Pitcher (SP)',
    body: 'Der Pitcher, der das Spiel beginnt und idealerweise die meisten Innings wirft. Teams rotieren über die Saison durch etwa fünf Starter.',
  },
  RP: {
    title: 'Relief Pitcher (RP)',
    body: 'Ein Pitcher, der nach dem ermüdeten Starter ins Spiel kommt, meist für ein bis zwei Innings. Reliever kommen aus dem Bullpen.',
  },
  CP: {
    title: 'Closer (CP)',
    body: 'Ein spezialisierter Relief Pitcher, der eine knappe Führung im letzten Inning schützen und das Spiel zu Ende bringen („closen“) soll.',
  },
  P_MLB: {
    title: 'Pitcher (P)',
    body: 'Der Spieler, der den Ball zum Batter wirft, um jeden Spielzug zu beginnen. Das Pitching ist der Kern der Run-Verhinderung im Baseball.',
  },
  CmlB: {
    title: 'Catcher (C)',
    body: 'Der Spieler, der hinter der Home Plate kauert, jeden Pitch annimmt, die Taktik ansagt und die Home Plate gegen Läufer schützt.',
  },
  '1B': {
    title: 'First Baseman (1B)',
    body: 'Der Infielder an der First Base. Fängt Würfe der anderen Infielder, um Outs zu erzielen, und feldet Bälle in der Nähe.',
  },
  '2B': {
    title: 'Second Baseman (2B)',
    body: 'Der Infielder zwischen First und Second Base. Schnelle Hände und Beinarbeit helfen, Double Plays zu drehen.',
  },
  '3B': {
    title: 'Third Baseman (3B)',
    body: 'Der Infielder an der Third Base, „hot corner“ genannt, weil hart geschlagene Bälle dort schnell ankommen. Braucht einen starken Wurfarm.',
  },
  SS_MLB: {
    title: 'Shortstop (SS)',
    body: 'Der Infielder zwischen Second und Third Base, meist der wendigste Feldspieler, der den größten Bereich des Infields abdeckt.',
  },
  LF: {
    title: 'Left Fielder (LF)',
    body: 'Der Outfielder, der das linke Drittel des Rasens abdeckt, Fly Balls fängt und Hits in diesem Bereich feldet.',
  },
  CF: {
    title: 'Center Fielder (CF)',
    body: 'Der Outfielder in der Mitte, typischerweise der schnellste, zuständig für den größten Teil des Outfields.',
  },
  RF: {
    title: 'Right Fielder (RF)',
    body: 'Der Outfielder, der das rechte Drittel des Rasens abdeckt, meist mit dem stärksten Wurfarm bis zur Third Base.',
  },
  DH: {
    title: 'Designated Hitter (DH)',
    body: 'Ein Spieler, der anstelle des Pitchers schlägt, aber nicht feldet. So kann ein starker Schläger beitragen, ohne in der Defense zu spielen.',
  },
  IF: {
    title: 'Infielder (IF)',
    body: 'Ein Spieler, der eine der vier Infield-Positionen besetzt (First, Second, Third Base oder Shortstop) nahe dem Diamond.',
  },
  OF: {
    title: 'Outfielder (OF)',
    body: 'Ein Spieler, der den Rasen jenseits des Infields patrouilliert (links, mittig oder rechts), Fly Balls fängt und Hits feldet.',
  },
  UTIL: {
    title: 'Utility Player (UTIL)',
    body: 'Ein vielseitiger Spieler, der je nach Bedarf des Teams mehrere Positionen solide spielen kann.',
  },

  // ------------------------------------------------------- NFL-Tabellenspalten
  wins: {
    title: 'Siege (W)',
    body: 'Die Anzahl der Spiele, die dieses Team in dieser Saison bisher gewonnen hat.',
  },
  losses: {
    title: 'Niederlagen (L)',
    body: 'Die Anzahl der Spiele, die dieses Team in dieser Saison bisher verloren hat.',
  },
  ties: {
    title: 'Unentschieden (T)',
    body: 'Spiele, die nach der Overtime gleichstanden. In der NFL selten — die meisten Spiele bringen einen Sieger.',
  },
  pct: {
    title: 'Siegquote (PCT)',
    body: 'Der Anteil gewonnener Spiele, von .000 bis 1.000. Ein Unentschieden zählt als halber Sieg. Ordnet Teams unabhängig von der Anzahl gespielter Partien.',
  },
  pointsFor: {
    title: 'Erzielte Punkte (PF)',
    body: 'Die Gesamtpunkte, die dieses Team in dieser Saison über alle Spiele erzielt hat.',
  },
  pointsAgainst: {
    title: 'Gegenpunkte (PA)',
    body: 'Die Gesamtpunkte, die dieses Team seinen Gegnern in dieser Saison erlaubt hat.',
  },
  pointDiff: {
    title: 'Punktedifferenz (DIFF)',
    body: 'Erzielte minus kassierte Punkte. Eine positive Zahl heißt, das Team überpunktet seine Gegner insgesamt — ein gutes Zeichen für Stärke.',
  },
  divRecord: {
    title: 'Divisions-Bilanz (DIV)',
    body: 'Die Sieg-Niederlage-Bilanz dieses Teams gegen die drei anderen Teams der eigenen Division. Diese Spiele wiegen in der Tabelle besonders schwer.',
  },
  confRecord: {
    title: 'Conference-Bilanz (CONF)',
    body: 'Sieg-Niederlage-Bilanz gegen Teams derselben Conference (NFC oder AFC). Dient als Tiebreaker für die Playoff-Setzung.',
  },
  homeRecord: {
    title: 'Heimbilanz (HOME)',
    body: 'Sieg-Niederlage-Bilanz in Spielen im eigenen Stadion dieses Teams.',
  },
  awayRecord: {
    title: 'Auswärtsbilanz (AWAY)',
    body: 'Sieg-Niederlage-Bilanz in Spielen im Stadion des Gegners.',
  },
  streak: {
    title: 'Serie (STRK)',
    body: 'Die aktuelle Folge von Ergebnissen in Folge. „W3“ heißt drei Siege hintereinander; „L1“ heißt eine Niederlage in Folge.',
  },

  // ------------------------------------------------------- MLB-Tabellenspalten
  winsMlb: {
    title: 'Siege (W)',
    body: 'In dieser Saison gewonnene Spiele. Eine Baseball-Saison ist lang — 162 Spiele — daher steigen die Siegzahlen hoch.',
  },
  lossesMlb: {
    title: 'Niederlagen (L)',
    body: 'In dieser Saison verlorene Spiele, aus einem 162-Spiele-Plan.',
  },
  pctMlb: {
    title: 'Siegquote (PCT)',
    body: 'Der Anteil gewonnener Spiele, von .000 bis 1.000. Das direkteste Maß dafür, wie ein Team über eine lange Saison dasteht.',
  },
  gamesBack: {
    title: 'Rückstand (GB)',
    body: 'Wie weit ein Team hinter dem Divisionsführer liegt. Jeder Sieg Vorsprung des Führenden UND jede zusätzliche Niederlage zählt als halbes Spiel. „—“ markiert den Führenden. Beispiel: Ist der Führende um 2 Siege und 2 Niederlagen besser, liegt das Team 2 Spiele zurück.',
  },
  runDiff: {
    title: 'Run-Differenz (RDIFF)',
    body: 'Erzielte minus kassierte Runs über die Saison. Eine positive Zahl heißt, ein Team überpunktet seine Gegner insgesamt — oft ein besseres Zeichen für echte Qualität als die Siegzahl allein.',
  },
  lastTen: {
    title: 'Letzte zehn Spiele (L10)',
    body: 'Die Sieg-Niederlage-Bilanz des Teams über die letzten zehn Spiele — ein schneller Blick darauf, ob es zuletzt heiß oder kalt läuft.',
  },
  streakMlb: {
    title: 'Serie (STRK)',
    body: 'Die aktuelle Folge von Ergebnissen in Folge. „W3“ heißt drei Siege in Folge; „L2“ heißt zwei Niederlagen in Folge.',
  },

  // --------------------------------------------------------- NFL-Strukturbegriffe
  division: {
    title: 'Division',
    body: 'Eine Gruppe von vier Teams, die jedes Jahr eng konkurrieren. Die NFL hat acht Divisions; die 49ers spielen in der NFC West mit Seattle, den Rams und Arizona.',
  },
  conference: {
    title: 'Conference',
    body: 'Die NFL ist in zwei Hälften zu je 16 Teams geteilt — die NFC und die AFC. Die beiden Conference-Sieger treffen im Super Bowl aufeinander.',
  },
  nfcWest: {
    title: 'NFC West',
    body: 'Die Division der 49ers: San Francisco, die Seattle Seahawks, die Los Angeles Rams und die Arizona Cardinals.',
  },
  wildCard: {
    title: 'Wild Card',
    body: 'Ein Playoff-Platz für starke Teams, die ihre Division nicht gewonnen haben. So erreichen die besten Nicht-Divisionssieger trotzdem die Postseason.',
  },
  byeWeek: {
    title: 'Bye Week',
    body: 'Eine planmäßige spielfreie Woche während der Saison. Jedes NFL-Team bekommt eine.',
  },
  playoffSeed: {
    title: 'Playoff-Setzung',
    body: 'Die Platzierung eines Teams (1 bis 7 je Conference) zu Beginn der Playoffs. Eine höhere Setzung bedeutet schwächere Gegner und Heimrecht.',
  },
  superBowl: {
    title: 'Super Bowl',
    body: 'Das Meisterschaftsspiel der NFL, zwischen den Siegern der NFC und der AFC zum Saisonabschluss.',
  },
  week: {
    title: 'Spielwoche',
    body: 'Die NFL-Regular-Season läuft über 18 nummerierte Wochen, die meisten Teams spielen ein Spiel pro Woche.',
  },
  overtime: {
    title: 'Overtime (OT)',
    body: 'Zusätzliche Spielzeit bei Gleichstand am Ende der regulären Zeit, um einen Sieger zu ermitteln.',
  },

  // --------------------------------------------------------- MLB-Strukturbegriffe
  nlWest: {
    title: 'NL West',
    body: 'Die Division der Giants in der National League: San Francisco, die Los Angeles Dodgers, San Diego, Arizona und Colorado.',
  },
  nationalLeague: {
    title: 'National League (NL)',
    body: 'Eine der beiden Ligen des Baseballs. Die Giants spielen in der NL; ihr Champion trifft in der World Series auf den Champion der American League.',
  },
  series: {
    title: 'Series',
    body: 'Teams spielen in Blöcken aus zwei bis vier Spielen hintereinander, einer Series genannt, meist an aufeinanderfolgenden Tagen in einer Stadt.',
  },
  doubleheader: {
    title: 'Doubleheader',
    body: 'Zwei Spiele zwischen denselben Teams am selben Tag, oft wenn ein früheres Spiel verregnet wurde.',
  },
  wildCardMlb: {
    title: 'Wild Card (MLB)',
    body: 'Playoff-Plätze für die besten Teams, die ihre Division nicht gewonnen haben. Drei pro Liga erreichen so die Postseason.',
  },
  activeRoster: {
    title: 'Aktiver Kader (26 Spieler)',
    body: 'Die 26 Spieler, die ein Team an einem Spieltag einsetzen darf.',
  },
  fortyMan: {
    title: '40-Mann-Kader',
    body: 'Ein größerer Pool von 40 Spielern unter Vertrag, einschließlich der Minor Leagues, aus dem der aktive Kader gebildet wird.',
  },
  injuredList: {
    title: 'Injured List (IL)',
    body: 'Wo verletzte Spieler geführt werden; sie dürfen bis zur Genesung nicht spielen und geben in der Zwischenzeit einen Kaderplatz frei.',
  },
  worldSeries: {
    title: 'World Series',
    body: 'Die Meisterschaft des Baseballs — eine Best-of-Seven-Serie zwischen den Siegern der National League und der American League.',
  },
  inning: {
    title: 'Inning',
    body: 'Baseball ist in neun Innings unterteilt; in jedem kommen beide Teams an den Schlag, bis sie drei Outs machen.',
  },

  // ----------------------------------------------------------------- gemeinsame Begriffe
  record: {
    title: 'Bilanz',
    body: 'Die Siege und Niederlagen eines Teams zusammen geschrieben, z. B. heißt „12-5“ zwölf Siege und fünf Niederlagen.',
  },
  venue: {
    title: 'Spielstätte',
    body: 'Das Stadion oder der Ballpark, in dem das Spiel ausgetragen wird.',
  },
  homeAway: {
    title: 'Heim vs. Auswärts',
    body: 'Heimspiele finden im eigenen Stadion vor den eigenen Fans statt; Auswärtsspiele im Stadion des Gegners.',
  },
  broadcast: {
    title: 'Übertragung',
    body: 'Der TV-Sender oder Streaming-Dienst, der das Spiel zeigt.',
  },
  finalScore: {
    title: 'Endstand',
    body: 'Das Spiel ist vorbei; der angezeigte Spielstand ist das Endergebnis.',
  },
  jersey: {
    title: 'Trikotnummer',
    body: 'Die Nummer auf dem Trikot eines Spielers, mit der er während des Spiels erkannt wird.',
  },
  position: {
    title: 'Position',
    body: 'Die Rolle, die ein Spieler auf dem Feld einnimmt. Per Maus über ein Kürzel (wie QB oder SP) erscheint, was diese Rolle macht.',
  },
  age: {
    title: 'Alter',
    body: 'Das Alter des Spielers in Jahren.',
  },
  height: {
    title: 'Größe',
    body: 'Die Größe des Spielers in Fuß und Zoll. Per Maus über den Wert erscheint die metrische Angabe.',
  },
  weight: {
    title: 'Gewicht',
    body: 'Das Spielgewicht des Spielers in Pfund. Per Maus über den Wert erscheint die Angabe in Kilogramm.',
  },
  bats: {
    title: 'Bats (Schlagseite)',
    body: 'Von welcher Seite ein Spieler schlägt: R (rechts), L (links) oder S (Switch — kann von beiden Seiten schlagen).',
  },
  throws: {
    title: 'Throws (Wurfhand)',
    body: 'Mit welcher Hand ein Spieler wirft: R (rechts) oder L (links). Am wichtigsten für Pitcher.',
  },
  injuryOut: {
    title: 'Verletzungsstatus',
    body: 'Ein Hinweis, dass der Spieler derzeit verletzungsbedingt nicht oder nur eingeschränkt verfügbar ist.',
  },

  // --------------------------------------------------------- erweiterte Statistiken
  war: {
    title: 'WAR',
    body: 'Wins Above Replacement: der Gesamtwert eines Spielers gegenüber einem ligadurchschnittlichen Ersatzspieler.',
  },
  ops: {
    title: 'OPS',
    body: 'On-base Plus Slugging: Summe aus OBP und SLG, misst die gesamte Offensivleistung.',
  },
  whip: {
    title: 'WHIP',
    body: 'Walks + Hits per Inning Pitched: wie viele Baserunner ein Pitcher pro Inning zulässt.',
  },
  kPer9: {
    title: 'K/9',
    body: 'Strikeouts pro 9 Innings: die Strikeout-Rate eines Pitchers.',
  },
  sv: {
    title: 'SV',
    body: 'Save: wird gutgeschrieben, wenn ein Relief Pitcher ein gewonnenes Spiel unter bestimmten Bedingungen beendet.',
  },
  eraPlus: {
    title: 'ERA+',
    body: 'ERA, angepasst an Ballpark und Liga; 100 = Ligadurchschnitt, höher ist besser.',
  },
  wrcPlus: {
    title: 'WRC+',
    body: 'Weighted Runs Created Plus: Offensivwert, angepasst an Park/Liga; 100 = Durchschnitt.',
  },
  passerRating: {
    title: 'Passer Rating',
    body: 'NFL-Effizienzmaß für QBs aus Completion-Quote, Yards, TDs und Interceptions (Skala 0–158,3).',
  },
  ypc: {
    title: 'YPC',
    body: 'Yards Per Carry: durchschnittlich erlaufene Yards pro Versuch.',
  },
  ypr: {
    title: 'YPR',
    body: 'Yards Per Reception: durchschnittliche Receiving-Yards pro Fang.',
  },
  dvoa: {
    title: 'DVOA',
    body: 'Defense-adjusted Value Over Average: Effizienzmaß von Football Outsiders.',
  },
  personnel11: {
    title: '11 Personnel',
    body: '1 RB, 1 TE, 3 WR gleichzeitig auf dem Feld.',
  },
  personnel12: {
    title: '12 Personnel',
    body: '1 RB, 2 TE, 2 WR gleichzeitig auf dem Feld.',
  },
  personnel21: {
    title: '21 Personnel',
    body: '2 RB, 1 TE, 2 WR gleichzeitig auf dem Feld.',
  },
  personnel22: {
    title: '22 Personnel',
    body: '2 RB, 2 TE, 1 WR gleichzeitig auf dem Feld.',
  },
  divisionSeries: {
    title: 'Division Series',
    body: 'Die MLB-Playoff-Serie der zweiten Runde, Best of 5.',
  },
  championshipSeries: {
    title: 'Championship Series',
    body: 'Die MLB/NFL-Runde vor dem Meisterschaftsspiel bzw. der -serie.',
  },
  splashHit: {
    title: 'Splash Hit',
    body: 'Ein Home Run im Oracle Park, der jenseits der Right-Field-Mauer in der McCovey Cove landet.',
  },
  mcCoveyCove: {
    title: 'McCovey Cove',
    body: 'Die Bucht der San Francisco Bay jenseits der Right-Field-Mauer des Oracle Park.',
  },
  leed: {
    title: 'LEED',
    body: 'Leadership in Energy and Environmental Design: ein Zertifizierungsstandard für nachhaltiges Bauen.',
  },

  // --------------------------------------------------------- Statistik-Chips
  era: {
    title: 'ERA (Earned Run Average)',
    body: 'Die durchschnittliche Zahl der Earned Runs, die ein Pitcher pro neun Innings zulässt. Niedriger ist besser — ein guter Starter liegt typischerweise um 3,50 oder darunter.',
  },
  strikeoutsPitched: {
    title: 'Strikeouts (K)',
    body: 'Die Anzahl der Batter, die dieser Pitcher in dieser Saison per Strikeout (drei Strikes) ausgemacht hat. Auf Anzeigetafeln als „K“.',
  },
  winLoss: {
    title: 'Win–Loss (W-L)',
    body: 'Die individuellen Sieg- und Niederlagezahlen eines Starting Pitchers für die Saison, je nach Spielausgang während seiner Zeit als Pitcher of Record.',
  },
  avg: {
    title: 'Batting Average (AVG)',
    body: 'Hits geteilt durch At-Bats, dargestellt wie .275. Das traditionellste Maß dafür, wie oft ein Spieler einen Hit erzielt.',
  },
  hr: {
    title: 'Home Runs (HR)',
    body: 'Die Anzahl der Home Runs — aus dem Park geschlagene Bälle für einen automatischen Run — die dieser Spieler in dieser Saison erzielt hat.',
  },
  rbi: {
    title: 'Runs Batted In (RBI)',
    body: 'Die Anzahl der Runs, die als direkte Folge des Hits, Walks oder Outs dieses Spielers erzielt wurden (etwa per Sacrifice Fly).',
  },
  completionPct: {
    title: 'Completion-Quote (COMP%)',
    body: 'Der Anteil der Passversuche, die dieser Quarterback an einen Receiver gebracht hat. Rund 65 % sind in der modernen NFL solide.',
  },
  passYds: {
    title: 'Passing Yards',
    body: 'Gesamte durch die Luft gutgemachte Yards auf vollendeten Pässen in dieser Saison.',
  },
  touchdown: {
    title: 'Touchdown (TD)',
    body: '6 Punkte wert — das Erreichen der End Zone per Lauf, Fang oder Pass. Diese Zahl zählt, für wie viele dieser Spieler direkt verantwortlich ist.',
  },
  interceptionsThrown: {
    title: 'Interceptions (INT)',
    body: 'Von diesem Quarterback geworfene Pässe, die die Defense gefangen hat — ein Turnover. Weniger ist besser.',
  },
  rushYds: {
    title: 'Rushing Yards',
    body: 'Gesamte durch Laufen mit dem Ball gutgemachte Yards in dieser Saison.',
  },
  receptions: {
    title: 'Receptions (REC)',
    body: 'Die Anzahl der Pässe, die dieser Spieler in dieser Saison erfolgreich gefangen hat.',
  },
  recYds: {
    title: 'Receiving Yards',
    body: 'Gesamte nach dem Fangen von Pässen gutgemachte Yards in dieser Saison.',
  },
  status: {
    title: 'Kaderstatus',
    body: 'Ob dieser Spieler derzeit spielberechtigt ist. „Active“ heißt fit und einsatzbereit; andere Status (Injured, Suspended usw.) bedeuten vorübergehende Nichtverfügbarkeit.',
  },
  experience: {
    title: 'Jahre in der Liga',
    body: 'Wie viele Saisons dieser Spieler in der Liga gespielt hat, die aktuelle eingeschlossen — ein grobes Maß für Routine.',
  },
  ppg: {
    title: 'Punkte pro Spiel (PPG)',
    body: 'Die durchschnittliche Punktzahl, die dieses Team in jener Saison pro Spiel erzielt hat.',
  },
  pointsAllowedPerGame: {
    title: 'Gegenpunkte pro Spiel',
    body: 'Die durchschnittliche Punktzahl, die die Defense dieses Teams in jener Saison pro Spiel zugelassen hat — niedriger ist besser.',
  },
  teamEra: {
    title: 'Team-ERA',
    body: 'Der kombinierte Earned Run Average des gesamten Pitching-Stabs des Teams in jener Saison — niedriger heißt, der Stab ließ weniger Runs zu.',
  },
  teamAvg: {
    title: 'Team-Batting-Average',
    body: 'Der gesamte Batting Average des Teams in jener Saison — wie oft die Lineup insgesamt einen Hit erzielte.',
  },
};
