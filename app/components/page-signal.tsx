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
  /* the canvas is bounded to the intro's open upper-right strip; the
     left edge, the metadata row's band and the whole lower quarter
     never paint — any text box that reaches the strip meets only
     dissolved space */
  { x: 0, y: 0, w: 0.22, h: 1, falloff: 1, feather: 0.06 },
  { x: 0, y: 0, w: 1, h: 0.32, falloff: 1, feather: 0.04 },
  { x: 0, y: 0.8, w: 1, h: 0.2, falloff: 1, feather: 0.05 },
];

const CONTACT_QUIET: Quiet[] = [
  /* the canvas only holds the open right strip of the shell's top
     region — the letter's column is structurally out of reach. The
     zones frame the strip's own edges so the field dissolves instead
     of stopping: a feather at the strip's left edge keeps pixels a
     clear distance from the copy's column. */
  { x: 0, y: 0, w: 0.2, h: 1, falloff: 0.9, feather: 0.06 },
  { x: 0, y: 0, w: 1, h: 0.07, falloff: 0.9, feather: 0.03 },
  { x: 0, y: 0.86, w: 1, h: 0.14, falloff: 0.9, feather: 0.05 },
];

const RESUME_QUIET: Quiet[] = [
  { x: 0, y: 0, w: 0.22, h: 1, falloff: 1, feather: 0.06 },
  { x: 0, y: 0, w: 1, h: 0.32, falloff: 1, feather: 0.04 },
  { x: 0, y: 0.8, w: 1, h: 0.2, falloff: 1, feather: 0.05 },
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
      /* one breathing cluster in the strip's middle, clear of every
         word: the canvas itself is bounded to the open upper-right
         corner, so the field holds the corner without ever touching
         the copy */
      const grain = grainAt(nx, ny);
      const cluster = Math.exp(
        -Math.pow((nx - 0.62 - 0.02 * Math.sin(t * 0.12)) * 5, 2) -
          Math.pow((ny - 0.52 + 0.05 * Math.sin(t * 0.09 + 2)) * 2.8, 2),
      );
      return Math.max(v * 0.8, cluster * 0.85 * grain);
    },
  },
  contact: {
    seed: 97,
    ambient: 0.5,
    quiet: CONTACT_QUIET,
    shape: (v: number, nx: number, ny: number, t: number) => {
      /* one breathing cluster column, clear of every word: the canvas
         itself is bounded to the open right side, so the cluster's
         centre sits at the strip's middle and the field holds the
         margins without ever touching the copy */
      const cluster = Math.exp(
        -Math.pow((nx - 0.62 - 0.02 * Math.sin(t * 0.11)) * 5, 2) -
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
      /* a slow density wave travelling down the strip's middle — the
         signal never reaches the document column */
      const rail = Math.exp(
        -Math.pow((nx - 0.72 - 0.02 * Math.sin(t * 0.1)) * 5, 2),
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
