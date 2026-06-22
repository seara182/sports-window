// WPA-poster-style flat-vector illustrations for the sidebar background.
// FootballScene: Diablo Range, tech park, Transamerica Pyramid, Bay water, football.
// BaseballScene: Golden Gate Bridge, Lombard Street, Fisherman's Wharf, Bay water, baseball.
//
// These two are the bespoke San Francisco scenes — the easter egg shown only when
// both SF teams are selected and `sfSpecialGraphics` is on. Every other team uses
// GradientScene (below): a user-chosen preset gradient with an optional sport icon.

import { BaseballIcon, FootballIcon } from './Icons';
import type { SportKey } from '../types/domain';

const SCENE_PROPS = {
  viewBox: '0 0 260 888',
  preserveAspectRatio: 'xMidYMid slice',
  style: { position: 'absolute', inset: 0, width: '100%', height: '100%' } as const,
};

export function FootballScene() {
  return (
    <svg {...SCENE_PROPS} xmlns="http://www.w3.org/2000/svg">
      {/* Sky — teal to gold to cream horizon */}
      <rect x="0" y="0" width="260" height="888" fill="#C8DDD6" />
      <rect x="0" y="155" width="260" height="240" fill="#E8D5A3" opacity="0.78" />
      <rect x="0" y="295" width="260" height="130" fill="#F2E8C8" opacity="0.90" />

      {/* Far mountains */}
      <path
        d="M0,418 C28,382 60,292 90,308 C120,324 148,242 178,267 C208,292 232,256 260,274 L260,418 Z"
        fill="#8B9E6B"
      />
      {/* Mid mountains */}
      <path
        d="M0,468 C36,428 74,366 112,384 C150,402 184,338 220,354 C238,362 252,358 260,360 L260,468 Z"
        fill="#6B8A4E"
      />
      {/* Near mountains */}
      <path
        d="M0,510 C44,468 84,422 126,442 C168,462 206,400 246,418 C254,422 258,424 260,425 L260,510 Z"
        fill="#4A6B35"
      />

      {/* Tech park buildings */}
      <rect x="5" y="504" width="42" height="46" fill="#D4C4A0" />
      <rect x="7" y="518" width="40" height="32" fill="#C2B28E" />
      <rect x="52" y="494" width="52" height="56" fill="#D4C4A0" />
      <rect x="54" y="510" width="50" height="40" fill="#C2B28E" />
      <rect x="108" y="506" width="36" height="44" fill="#D4C4A0" />
      <rect x="110" y="520" width="34" height="30" fill="#C2B28E" />
      <rect x="216" y="498" width="42" height="52" fill="#D4C4A0" />
      <rect x="218" y="512" width="40" height="38" fill="#C2B28E" />

      {/* Transamerica Pyramid */}
      <polygon points="164,550 183,308 202,550" fill="#B8A882" />
      <rect x="155" y="448" width="9" height="15" fill="#B8A882" />
      <rect x="202" y="448" width="9" height="15" fill="#B8A882" />
      <polygon points="183,308 202,550 183,550" fill="#9A8860" opacity="0.22" />

      {/* Water — three flat horizontal bands */}
      <rect x="0" y="640" width="260" height="78" fill="#7FB5AD" />
      <rect x="0" y="712" width="260" height="74" fill="#5A9B93" />
      <rect x="0" y="780" width="260" height="108" fill="#3D7A72" />

      {/* Football shadow */}
      <ellipse cx="130" cy="625" rx="58" ry="10" fill="#3D7A72" opacity="0.28" />

      {/* Football body */}
      <ellipse cx="130" cy="602" rx="64" ry="37" fill="#8B5E3C" />
      <path d="M66,602 Q130,639 194,602 Z" fill="#6B4423" />
      <path d="M70,602 Q130,565 190,602" stroke="#F5F0E8" strokeWidth="2.5" fill="none" />
      <rect x="112" y="589" width="36" height="26" rx="2.5" fill="#F5F0E8" />
      <line x1="108" y1="593" x2="148" y2="593" stroke="#8B5E3C" strokeWidth="1.9" />
      <line x1="108" y1="599" x2="148" y2="599" stroke="#8B5E3C" strokeWidth="1.9" />
      <line x1="108" y1="605" x2="148" y2="605" stroke="#8B5E3C" strokeWidth="1.9" />
      <line x1="108" y1="611" x2="148" y2="611" stroke="#8B5E3C" strokeWidth="1.9" />
    </svg>
  );
}

export function BaseballScene() {
  return (
    <svg {...SCENE_PROPS} xmlns="http://www.w3.org/2000/svg">
      {/* Sky — cream gold */}
      <rect x="0" y="0" width="260" height="888" fill="#E8D5A3" />
      <rect x="0" y="175" width="260" height="195" fill="#F2E8C8" opacity="0.72" />

      {/* Golden Gate Bridge — left tower (dominant) */}
      <rect x="26" y="80" width="17" height="400" fill="#C84B2D" />
      <rect x="70" y="80" width="17" height="400" fill="#C84B2D" />
      <rect x="20" y="142" width="84" height="17" fill="#C84B2D" />
      <rect x="20" y="202" width="84" height="15" fill="#C84B2D" />
      <rect x="20" y="258" width="84" height="15" fill="#C84B2D" />
      <rect x="20" y="314" width="84" height="15" fill="#C84B2D" />
      <rect x="22" y="65" width="24" height="17" fill="#C84B2D" />
      <rect x="67" y="65" width="24" height="17" fill="#C84B2D" />

      {/* Golden Gate Bridge — right tower (receding) */}
      <rect x="163" y="98" width="15" height="362" fill="#C84B2D" opacity="0.84" />
      <rect x="199" y="98" width="15" height="362" fill="#C84B2D" opacity="0.84" />
      <rect x="157" y="158" width="64" height="14" fill="#C84B2D" opacity="0.84" />
      <rect x="157" y="212" width="64" height="12" fill="#C84B2D" opacity="0.84" />
      <rect x="157" y="262" width="64" height="12" fill="#C84B2D" opacity="0.84" />
      <rect x="157" y="312" width="64" height="12" fill="#C84B2D" opacity="0.84" />
      <rect x="159" y="85" width="20" height="15" fill="#C84B2D" opacity="0.84" />
      <rect x="197" y="85" width="20" height="15" fill="#C84B2D" opacity="0.84" />

      {/* Suspension cables */}
      <path
        d="M34,62 C72,408 196,404 207,88"
        stroke="#C84B2D"
        strokeWidth="3.2"
        fill="none"
        opacity="0.62"
      />
      <path
        d="M78,62 C108,338 178,334 206,88"
        stroke="#C84B2D"
        strokeWidth="2"
        fill="none"
        opacity="0.38"
      />
      {/* Vertical hanger cables */}
      <line x1="92" y1="238" x2="92" y2="460" stroke="#C84B2D" strokeWidth="1" opacity="0.28" />
      <line x1="112" y1="208" x2="112" y2="460" stroke="#C84B2D" strokeWidth="1" opacity="0.28" />
      <line x1="130" y1="196" x2="130" y2="460" stroke="#C84B2D" strokeWidth="1" opacity="0.28" />
      <line x1="148" y1="202" x2="148" y2="460" stroke="#C84B2D" strokeWidth="1" opacity="0.28" />
      <line x1="167" y1="220" x2="167" y2="460" stroke="#C84B2D" strokeWidth="1" opacity="0.28" />
      {/* Road deck */}
      <rect x="20" y="460" width="222" height="10" fill="#C84B2D" opacity="0.52" />

      {/* Transamerica Pyramid — smaller, right side */}
      <polygon points="207,474 218,360 230,474" fill="#B8A882" />
      <rect x="200" y="428" width="7" height="11" fill="#B8A882" />
      <rect x="230" y="428" width="7" height="11" fill="#B8A882" />

      {/* Lombard Street — geometric switchback path */}
      <path
        d="M12,516 L60,500 L108,516 L156,500 L204,516 L244,504"
        stroke="#D4C4A0"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M12,516 L60,500 L108,516 L156,500 L204,516 L244,504"
        stroke="#F2E8C8"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Hydrangeas along Lombard */}
      <circle cx="36" cy="508" r="13" fill="#9B7FB5" opacity="0.83" />
      <circle cx="52" cy="498" r="11" fill="#C4A8D4" opacity="0.83" />
      <circle cx="84" cy="508" r="14" fill="#7A6B8B" opacity="0.83" />
      <circle cx="130" cy="508" r="13" fill="#9B7FB5" opacity="0.83" />
      <circle cx="147" cy="498" r="11" fill="#C4A8D4" opacity="0.83" />
      <circle cx="178" cy="508" r="14" fill="#7A6B8B" opacity="0.83" />
      <circle cx="222" cy="502" r="11" fill="#9B7FB5" opacity="0.83" />

      {/* Fisherman's Wharf boat silhouettes */}
      <path d="M13,566 Q38,558 64,566 Q60,580 17,580 Z" fill="#8C7A5A" />
      <line x1="38" y1="566" x2="38" y2="542" stroke="#8C7A5A" strokeWidth="2.5" />
      <line x1="38" y1="542" x2="56" y2="550" stroke="#8C7A5A" strokeWidth="1.5" />
      <path d="M76,570 Q102,562 128,570 Q124,584 80,584 Z" fill="#8C7A5A" />
      <line x1="102" y1="570" x2="102" y2="547" stroke="#8C7A5A" strokeWidth="2.5" />
      <path d="M142,573 Q162,565 182,573 Q179,586 146,586 Z" fill="#7A6A4A" />
      <line x1="161" y1="573" x2="161" y2="551" stroke="#7A6A4A" strokeWidth="2" />

      {/* Water — three flat bands */}
      <rect x="0" y="602" width="260" height="76" fill="#7FB5AD" />
      <rect x="0" y="672" width="260" height="72" fill="#5A9B93" />
      <rect x="0" y="738" width="260" height="150" fill="#3D7A72" />

      {/* Baseball shadow */}
      <ellipse cx="130" cy="673" rx="46" ry="9" fill="#3D7A72" opacity="0.28" />

      {/* Baseball body */}
      <circle cx="130" cy="632" r="48" fill="#F5F0E8" />

      {/* Stitching */}
      <path d="M108,584 C96,600 94,664 108,680" stroke="#C84B2D" strokeWidth="2.6" fill="none" />
      <path d="M152,584 C164,600 166,664 152,680" stroke="#C84B2D" strokeWidth="2.6" fill="none" />
      {/* Left tick marks */}
      <line x1="104" y1="591" x2="113" y2="596" stroke="#C84B2D" strokeWidth="1.5" />
      <line x1="100" y1="606" x2="110" y2="609" stroke="#C84B2D" strokeWidth="1.5" />
      <line x1="98" y1="622" x2="108" y2="622" stroke="#C84B2D" strokeWidth="1.5" />
      <line x1="99" y1="638" x2="109" y2="635" stroke="#C84B2D" strokeWidth="1.5" />
      <line x1="103" y1="653" x2="112" y2="648" stroke="#C84B2D" strokeWidth="1.5" />
      <line x1="108" y1="667" x2="116" y2="660" stroke="#C84B2D" strokeWidth="1.5" />
      {/* Right tick marks */}
      <line x1="147" y1="591" x2="156" y2="596" stroke="#C84B2D" strokeWidth="1.5" />
      <line x1="150" y1="606" x2="160" y2="609" stroke="#C84B2D" strokeWidth="1.5" />
      <line x1="152" y1="622" x2="162" y2="622" stroke="#C84B2D" strokeWidth="1.5" />
      <line x1="151" y1="638" x2="161" y2="635" stroke="#C84B2D" strokeWidth="1.5" />
      <line x1="148" y1="653" x2="157" y2="648" stroke="#C84B2D" strokeWidth="1.5" />
      <line x1="144" y1="667" x2="152" y2="660" stroke="#C84B2D" strokeWidth="1.5" />
    </svg>
  );
}

interface GradientSceneProps {
  sport: SportKey;
  /** A CSS gradient (or `var(--team-gradient)`) — see sidebarBackgrounds.ts. */
  gradient: string;
  /** When true, overlays a faint line-art football/baseball over the gradient. */
  showIcon: boolean;
}

/** The non-SF sidebar background: a flat preset gradient with an optional, faint
 *  iconized ball. Pure CSS/SVG — no per-team art assets to bundle (keeps mobile
 *  download size down). The ball reuses the existing title-bar stroke icons. */
export function GradientScene({ sport, gradient, showIcon }: GradientSceneProps) {
  const Icon = sport === 'nfl' ? FootballIcon : BaseballIcon;
  return (
    <div className="gradient-scene" style={{ background: gradient }}>
      {showIcon && <Icon size={170} strokeWidth={0.9} className="gradient-scene__icon" />}
    </div>
  );
}
