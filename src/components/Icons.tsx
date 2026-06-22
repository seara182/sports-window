// Hand-rolled inline icons (no icon library). All inherit currentColor and
// use a consistent 1.6 stroke weight.

interface IconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export function RefreshIcon({ size = 18, className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} aria-hidden>
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 4v5h-5" />
    </svg>
  );
}

export function GearIcon({ size = 18, className, strokeWidth = 1.6 }: IconProps) {
  // A true cog: a toothed ring with a hollow centre, so it no longer reads as a
  // sun the way the old radiating-spokes version did at small sizes.
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} aria-hidden>
      <path d="M19.4 13a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function MinimizeIcon({ size = 18, className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} aria-hidden>
      <path d="M6 12h12" />
    </svg>
  );
}

export function CloseIcon({ size = 18, className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function SearchIcon({ size = 16, className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

/** Open book — used for the Rule Book trigger button. */
export function BookIcon({ size = 18, className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} aria-hidden>
      <path d="M12 5.5c-1.5-1-3.6-1.5-6-1.5-1 0-1.5.4-1.5 1v12.5c0 .6.5 1 1.5 1 2.4 0 4.5.5 6 1.5" />
      <path d="M12 5.5c1.5-1 3.6-1.5 6-1.5 1 0 1.5.4 1.5 1v12.5c0 .6-.5 1-1.5 1-2.4 0-4.5.5-6 1.5" />
      <path d="M12 5.5v14" />
    </svg>
  );
}

export function ChevronIcon({ size = 16, className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} aria-hidden>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function StaleIcon({ size = 14, className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

/** Thumbtack — used to pin/unpin the Spotlight card's player. */
export function PinIcon({ size = 16, className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} aria-hidden>
      <path
        d="M9 2h6l-1 6 4 4v2h-6v6l-1 1-1-1v-6H4v-2l4-4-1-6z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

/** Generic player silhouette, used as a headshot fallback. */
export function PlayerSilhouetteIcon({ size = 64, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <circle cx="32" cy="22" r="14" />
      <path d="M8 60c0-14 10.7-24 24-24s24 10 24 24z" />
    </svg>
  );
}

export function SunIcon({ size = 16, className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} aria-hidden>
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8l1.8-1.8M18 6l1.8-1.8" />
    </svg>
  );
}

export function CloudIcon({ size = 16, className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} aria-hidden>
      <path d="M6.5 18.5a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 16.6 9.06 4.5 4.5 0 0 1 17.5 18z" />
    </svg>
  );
}

export function RainIcon({ size = 16, className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} aria-hidden>
      <path d="M6.5 14.5a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 16.6 5.06 4.5 4.5 0 0 1 17.5 14z" />
      <path d="M8 18l-1 2M12 18l-1 2M16 18l-1 2" />
    </svg>
  );
}

export function SnowIcon({ size = 16, className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} aria-hidden>
      <path d="M6.5 13.5a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 16.6 4.06 4.5 4.5 0 0 1 17.5 13z" />
      <path d="M8 18v3M8 18l-1.7 1M8 18l1.7 1M12 18v3M12 18l-1.7 1M12 18l1.7 1M16 18v3M16 18l-1.7 1M16 18l1.7 1" />
    </svg>
  );
}

/** American football — used as the title bar mascot icon for the 49ers tab. */
export function FootballIcon({ size = 20, className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} aria-hidden>
      <ellipse cx="12" cy="12" rx="9" ry="5.5" />
      <path d="M5.5 12h13" />
      <path d="M9.5 9.7v1M9.5 13.3v1M12 9.2v1.1M12 13.7v1.1M14.5 9.7v1M14.5 13.3v1" />
    </svg>
  );
}

/** Baseball — used as the title bar mascot icon for the Giants tab. */
export function BaseballIcon({ size = 20, className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M5.7 6.3c2 1.6 3.1 4 3.1 5.7s-1.1 4.1-3.1 5.7" />
      <path d="M18.3 6.3c-2 1.6-3.1 4-3.1 5.7s1.1 4.1 3.1 5.7" />
    </svg>
  );
}

/** Small baseball bat — payoff decoration for the title bar mascot's 10th-click animation. */
export function BatIcon({ size = 22, className }: IconProps) {
  return (
    <svg
      width={size * 0.7}
      height={size}
      viewBox="0 0 18 26"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M8 1c3 0 5 4.4 5 9.5S11 22 8 22 4 15.6 4 10.5 5 1 8 1z" opacity="0.9" />
      <rect x="6.3" y="20" width="3.4" height="5" rx="1.4" />
      <circle cx="8" cy="25.3" r="2" />
    </svg>
  );
}
