// Hardcoded gradient presets for the sidebar's frosted background. These are the
// curated options offered in the settings window for any team that isn't showing
// the bespoke SF skyline scenes (WpaScenes.tsx). Tuned to read well behind the
// translucent `.sidebar__glass` overlay in both light and dark themes.
//
// `auto` resolves to the team-adaptive `--team-gradient` custom property (driven
// by ThemeProvider/teamTheme.ts from each team's official colors), so it tracks
// the selected team. Every other preset is a fixed gradient.

export interface GradientPreset {
  id: string;
  /** i18n key under `settings.gradients.*` for the human-readable label. */
  labelKey: string;
  /** A CSS gradient (or custom-property reference) for `background`. */
  gradient: string;
}

export const GRADIENT_PRESETS: GradientPreset[] = [
  { id: 'auto', labelKey: 'settings.gradients.auto', gradient: 'var(--team-gradient)' },
  {
    id: 'sunset',
    labelKey: 'settings.gradients.sunset',
    gradient: 'linear-gradient(150deg, #ff9b4d 0%, #d95fa3 55%, #8a4ec0 100%)',
  },
  {
    id: 'ocean',
    labelKey: 'settings.gradients.ocean',
    gradient: 'linear-gradient(150deg, #0da5de 0%, #1fb5a8 55%, #2a8f9f 100%)',
  },
  {
    id: 'forest',
    labelKey: 'settings.gradients.forest',
    gradient: 'linear-gradient(150deg, #52c241 0%, #2db878 55%, #2a8f7f 100%)',
  },
  {
    id: 'dusk',
    labelKey: 'settings.gradients.dusk',
    gradient: 'linear-gradient(150deg, #7a8fd9 0%, #9070c7 55%, #6b4fa8 100%)',
  },
  {
    id: 'slate',
    labelKey: 'settings.gradients.slate',
    gradient: 'linear-gradient(150deg, #7a92b8 0%, #5f738f 55%, #4a5575 100%)',
  },
];

const BY_ID = new Map(GRADIENT_PRESETS.map((p) => [p.id, p]));

/** The CSS gradient for a preset id, falling back to the team-adaptive default. */
export function resolveGradient(id: string | undefined): string {
  return (id && BY_ID.get(id)?.gradient) ?? GRADIENT_PRESETS[0].gradient;
}
