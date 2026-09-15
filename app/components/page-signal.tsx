"use client";

import { SignalField, type Quiet } from "./signal-field";

/**
 * PAGE SIGNAL — the hero material on the secondary pages.
 *
 * The same purple pixel signal the cover and the closing plate carry,
 * arranged differently per page so it reads as a shared language, not a
 * repeated sticker. It lives in the header's margins — corner clusters
 * and edge bands — with quiet zones over every word of the heading, and
 * it never takes a pointer.
 */

const ABOUT_QUIET: Quiet[] = [
  { x: 0, y: 0.08, w: 0.62, h: 0.5, falloff: 0.93, feather: 0.045 },
  { x: 0, y: 0.72, w: 0.4, h: 0.28, falloff: 0.95, feather: 0.03 },
  { x: 0, y: 0.95, w: 1, h: 0.05, falloff: 1, feather: 0.02 },
];

const CONTACT_QUIET: Quiet[] = [
  /* the letter's copy is centred and fills its column — the quiet zone
     covers it fully; the signal only lives in the padding bands */
  { x: 0.04, y: 0.04, w: 0.92, h: 0.66, falloff: 0.95, feather: 0.035 },
  { x: 0.06, y: 0.72, w: 0.88, h: 0.2, falloff: 0.96, feather: 0.03 },
];

const CONFIGS = {
  about: {
    seed: 91,
    ambient: 0.52,
    quiet: ABOUT_QUIET,
    shape: (v: number, nx: number, ny: number, t: number) => {
      /* two drifting corner clusters, balanced against the text */
      const a = Math.exp(
        -Math.pow((nx - 0.84 - 0.03 * Math.sin(t * 0.11)) * 4.2, 2) -
          Math.pow((ny - 0.16) * 3.4, 2),
      );
      const b = Math.exp(
        -Math.pow((nx - 0.2) * 4.2, 2) -
          Math.pow((ny - 0.62 - 0.04 * Math.sin(t * 0.09 + 3)) * 3.2, 2),
      );
      return v * (0.3 + 1.6 * a + 1.3 * b) * (0.8 + 0.5 * Math.pow(ny, 1.2));
    },
  },
  contact: {
    seed: 97,
    ambient: 0.48,
    quiet: CONTACT_QUIET,
    shape: (v: number, nx: number, ny: number, t: number) => {
      /* the letter keeps its margins clean: the signal resolves as one
         drifting band in the padding below the email */
      const band = Math.exp(
        -Math.pow((ny - 0.88 + 0.02 * Math.sin(t * 0.1)) * 7, 2),
      );
      const edge = Math.pow(Math.abs(nx - 0.5) * 2, 1.2);
      return v * (0.35 + 1.5 * band * (0.5 + 0.6 * edge));
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
