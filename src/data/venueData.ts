// Curated venue facts for the two bespoke San Francisco teams (no API calls).
// Every other team's venue name/capacity/location is read for free from the
// team-hub payload (see parsers.ts); only these hand-written fun facts are
// SF-specific. Stadium facts change rarely — refresh once a season if needed.
import type { SportKey, VenueInfo } from '../types/domain';

export const VENUE_DATA: Record<SportKey, VenueInfo> = {
  nfl: {
    name: "Levi's Stadium",
    stats: [
      { label: 'Opened', value: '2014' },
      { label: 'Capacity', value: '68,500' },
      { label: 'Surface', value: 'Bermuda grass hybrid' },
      { label: 'Location', value: 'Santa Clara, CA' },
    ],
    funFacts: [
      "Levi's Stadium has its own dedicated light rail station (Great America, VTA).",
      'The rooftop features a 27,000 sq ft green roof and solar panels generating enough power to host two Super Bowls per year.',
      'First major professional sports stadium certified LEED Gold.',
      'Has hosted Super Bowl 50 (2016) and WrestleMania 31.',
      "The 49ers moved from Candlestick Park after 44 seasons when Levi's Stadium opened in 2014.",
      'The scoreboard is one of the largest HD displays in the NFL at 13,500 sq ft.',
      'Construction cost approximately $1.3 billion, financed largely by the city of Santa Clara.',
    ],
  },
  mlb: {
    name: 'Oracle Park',
    stats: [
      { label: 'Opened', value: '2000' },
      { label: 'Capacity', value: '41,915' },
      { label: 'Surface', value: 'Natural grass' },
      { label: 'Dimensions', value: 'LF 339 ft · CF 399 ft · RF 309 ft' },
    ],
    funFacts: [
      'The only MLB ballpark where home runs to right field land in a body of water — McCovey Cove. Fans in kayaks wait for "splash hits."',
      'Named after Willie Mays, whose statue stands outside. Mays played for the Giants 1951-1972 and is widely considered the greatest baseball player ever.',
      'Right field is only 309 ft but has a 25-ft wall nicknamed "Splash Landing" to compensate.',
      'Barry Bonds hit 35 of his record 73 home runs in the 2001 season here (then Pac Bell Park).',
      'Privately financed — the Giants funded the entire $357 million construction without public money.',
      'One of the most scenic views in sports: the SF Bay is visible beyond right field throughout the game.',
      'The garlic fries, introduced in 1999, became one of the most imitated ballpark foods in the country.',
    ],
  },
};
