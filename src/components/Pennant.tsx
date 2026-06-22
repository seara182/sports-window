import type { PennantData } from '../data/historyData';
import { Hoverable } from './Hoverable';
import './Pennant.css';

/** Splits "SUPER BOWL XVI" into ["SUPER BOWL", "XVI"] so it fits the pennant
 * on two lines instead of overflowing a single one. */
function splitPennantLabel(line2: string): [string, string] {
  const idx = line2.lastIndexOf(' ');
  if (idx === -1) return [line2, ''];
  return [line2.slice(0, idx), line2.slice(idx + 1)];
}

/** Triangular championship pennant — used in the History pennant rail and
 * centered below the top performers in the Season Drilldown panel. */
export function Pennant({ pennant }: { pennant: PennantData }) {
  const [labelLine1, labelLine2] = splitPennantLabel(pennant.line2);
  return (
    <div className="pennant-wrap">
      <Hoverable term="pennant" title={`${pennant.year} — ${pennant.line2}`} body={pennant.tooltip}>
        <svg
          className="pennant"
          viewBox="0 0 80 130"
          role="img"
          aria-label={`${pennant.year} ${pennant.line2}`}
        >
          <polygon className="pennant__shape" points="0,0 80,0 40,130" />
          <text className="pennant__year" x="40" y="34" textAnchor="middle">
            {pennant.year}
          </text>
          <text className="pennant__label" x="40" y="50" textAnchor="middle">
            <tspan x="40" dy="0">
              {labelLine1}
            </tspan>
            {labelLine2 && (
              <tspan x="40" dy="12">
                {labelLine2}
              </tspan>
            )}
          </text>
        </svg>
      </Hoverable>
    </div>
  );
}
