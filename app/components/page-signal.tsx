"use client";

import { SignalField, type Quiet } from "./signal-field";

/**
 * PAGE SIGNAL — the hero material on the secondary pages.
 *
 * The same purple pixel signal the cover and the closing plate carry,
 * arranged per page so it reads as a shared language, not a repeated
 * sticker. The rule is absolute: the signal lives only in open space —
 * margins, corners, padding bands — and every quiet zone covers the
 * text column completely, so no square ever sits under readable words.
 */

const ABOUT_QUIET: Quiet[] = [
  /* the intro's text column: the heading block and both lede columns
     stay completely quiet; the signal holds the open upper-right area
     beside the heading only */
  { x: 0, y: 0.04, w: 0.6, h: 0.66, falloff: 0.96, feather: 0.04 },
  { x: 0.55, y: 0.42, w: 0.45, h: 0.58, falloff: 0.97, feather: 0.04 },
  { x: 0, y: 0.94, w: 1, h: 0.06, falloff: 1, feather: 0.02 },
];

const CONTACT_QUIET: Quiet[] = [
  /* the letter's copy occupies the left column of the page's top region;
     the signal holds the open right side only */
  { x: 0, y: 0, w: 0.54, h: 1, falloff: 0.96, feather: 0.04 },
  { x: 0.54, y: 0.66, w: 0.46, h: 0.34, falloff: 0.97, feather: 0.04 },
];

const RESUME_QUIET: Quiet[] = [
  /* the document column: kicker, name, lede, actions stay crisp */
  { x: 0, y: 0.04, w: 0.78, h: 0.82, falloff: 0.96, feather: 0.04 },
  { x: 0, y: 0.9, w: 1, h: 0.1, falloff: 1, feather: 0.02 },
];

/* per-cell grain: the same hole-punching the cover clusters use */
const grainAt = (nx: number, ny: number): number => {
  const hash = Math.sin(nx * 733.1 + ny * 289.7) * 43758.5453;
  return 0.7 + 0.55 * (hash - Math.floor(hash));
};

const CONFIGS = {
  about: {
    seed: 91,
    ambient: 0.5,
    quiet: ABOUT_QUIET,
    shape: (v: number, nx: number, ny: number, t: number) => {
      /* the signal holds the open upper-right area beside the heading,
         with a faint echo at the far bottom-left. The structured
         elements max-blend over the ambient texture. */
      const grain = grainAt(nx, ny);
      const cluster = Math.exp(
        -Math.pow((nx - 0.87 - 0.02 * Math.sin(t * 0.12)) * 5.5, 2) -
          Math.pow((ny - 0.18 + 0.05 * Math.sin(t * 0.09 + 2)) * 3.2, 2),
      );
      const echo = Math.exp(
        -Math.pow((nx - 0.06) * 8, 2) - Math.pow((ny - 0.93) * 11, 2),
      );
      return Math.max(v * 0.8, cluster * 0.85 * grain, echo * 0.7 * grain);
    },
  },
  contact: {
    seed: 97,
    ambient: 0.5,
    quiet: CONTACT_QUIET,
    shape: (v: number, nx: number, ny: number, t: number) => {
      /* one breathing cluster column in the open right side, clear of
         the heading, the copy and the email row */
      const cluster = Math.exp(
        -Math.pow((nx - 0.86 - 0.02 * Math.sin(t * 0.11)) * 5, 2) -
          Math.pow((ny - 0.3 + 0.04 * Math.sin(t * 0.09)) * 2.4, 2),
      );
      return Math.max(v * 0.8, cluster * 0.85 * grainAt(nx, ny));
    },
  },
  resume: {
    seed: 101,
    ambient: 0.46,
    quiet: RESUME_QUIET,
    shape: (v: number, nx: number, ny: number, t: number) => {
      /* a narrow signal rail down the document's right edge, with a
         slow density wave travelling down it */
      const rail = Math.exp(
        -Math.pow((nx - 0.9 - 0.02 * Math.sin(t * 0.1)) * 6, 2),
      );
      const wave = 0.55 + 0.45 * Math.sin(ny * 7 - t * 0.35);
      return Math.max(v * 0.8, rail * 0.8 * wave);
    },
  },
} as const;

export function PageSignal({
  variant,
}: {
  variant: keyof typeof CONFIGS;
}) {
  const config = CONFIGS[variant];
  return (
    <SignalField
      className="page-signal"
      mode="pixel"
      cell={20}
      seed={config.seed}
      ambient={config.ambient}
      flow={1.2}
      wavefront={0.08}
      drift={0.4}
      pointerRadius={0}
      tune={[0.4, 2.1]}
      quiet={config.quiet}
      shape={config.shape}
      color={(t) => `rgba(58, 31, 240, ${0.16 + 0.5 * t})`}
    />
  );
}
