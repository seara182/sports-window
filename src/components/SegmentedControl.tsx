import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SportKey } from '../types/domain';
import './SegmentedControl.css';

interface Option {
  key: SportKey;
  markClass: string;
}

const OPTIONS: Option[] = [
  { key: 'nfl', markClass: 'segmented__mark--niners' },
  { key: 'mlb', markClass: 'segmented__mark--giants' },
];

interface Props {
  value: SportKey;
  onChange: (value: SportKey) => void;
  /** Display label per tab — the selected team's short name. */
  labels: Record<SportKey, string>;
}

export function SegmentedControl({ value, onChange, labels }: Props) {
  const { t } = useTranslation();
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [thumb, setThumb] = useState<{ left: number; width: number }>({
    left: 4,
    width: 0,
  });

  useLayoutEffect(() => {
    const el = refs.current[value];
    if (el) setThumb({ left: el.offsetLeft, width: el.offsetWidth });
  }, [value]);

  return (
    <div className="segmented" role="tablist" aria-label={t('segmented.chooseTeam')}>
      <span
        className="segmented__thumb"
        style={{ transform: `translateX(${thumb.left}px)`, width: thumb.width }}
      />
      {OPTIONS.map((opt) => (
        <button
          key={opt.key}
          ref={(el) => {
            refs.current[opt.key] = el;
          }}
          role="tab"
          aria-selected={value === opt.key}
          className={`segmented__option${value === opt.key ? ' is-active' : ''}`}
          onClick={() => onChange(opt.key)}
        >
          <span className={`segmented__mark ${opt.markClass}`} />
          {labels[opt.key]}
        </button>
      ))}
    </div>
  );
}
