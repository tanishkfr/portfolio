import type { Quiet } from "./signal-field";

/* The cover's material hierarchy: TANISHK first, the sparse
   ultramarine pixel signal second, the claim third, and a faint glyph
   texture under everything. The composition is centered: the identity
   sits in the middle of the field, so the quiet zone is a wide band
   across the centre — the signal keeps the margins, the top band under
   the header line and the two lower corners, and both fields share one
   array so the cover reads as one system. Shared with the splash: its
   fields run these exact configs, so the splash is the hero's opening
   phase rather than a separate composition.

   This module exists so the splash (mounted in the root layout on every
   route) can carry the cover's material without importing the folio
   itself — which would put the whole project index, portraits and data
   file into the shared bundle of every page. */
export const COVER_QUIET: Quiet[] = [
  { x: 0, y: 0, w: 1, h: 0.135, falloff: 0.94, feather: 0.03 },
  { x: 0.1, y: 0.27, w: 0.8, h: 0.56, falloff: 0.95, feather: 0.06 },
  { x: 0, y: 0.83, w: 1, h: 0.11, falloff: 0.95, feather: 0.03 },
  { x: 0, y: 0.97, w: 1, h: 0.04, falloff: 1 },
];

/* Below the pinned-sheet breakpoint the cover is content-height and
   the registration line wraps: the quiet geometry follows the
   composition, so the wrapped head, the whole mast and the handoff
   stay protected while the flanks stay alive. */
export const COVER_QUIET_NARROW: Quiet[] = [
  { x: 0, y: 0, w: 1, h: 0.21, falloff: 0.94, feather: 0.03 },
  { x: 0.06, y: 0.25, w: 0.9, h: 0.55, falloff: 0.95, feather: 0.05 },
  { x: 0, y: 0.86, w: 1, h: 0.14, falloff: 1 },
];

/* The cover texture: dark ink holds the margins and dies toward the
   centre, where the identity sits. Shared with the splash so its
   texture is the same material. */
export function coverTextureShape(
  v: number,
  nx: number,
  ny: number,
): number {
  return (
    v * (0.45 + 0.7 * Math.abs(nx - 0.5) * 2) *
    (0.4 + 1.25 * Math.pow(ny, 1.4))
  );
}

/**
 * The living signal. The composition is stable — two flank clusters,
 * a thin registration strip, two corner edges — but nothing holds
 * still: a slow global breath (~47s) swells and relaxes the whole
 * matter; each cluster gathers and disperses on its own
 * incommensurate period (~31s, ~41s), tightening toward a harder peak
 * then softening outward; the cluster centres wander on slow
 * Lissajous paths well inside their margins; and a faint satellite
 * pocket rises and dissolves (~73s) in the upper channel, so the
 * field occasionally reforms somewhere new. The periods share no
 * small common multiple, so ten seconds of watching shows evolution,
 * never a loop. The quiet zones are re-applied after this shape, so
 * none of the motion can reach the name or the copy.
 */
export function coverPixelShape(
  v: number,
  nx: number,
  ny: number,
  t: number,
): number {
  const hash = Math.sin(nx * 812.3 + ny * 431.7) * 43758.5453;
  const grain = 0.7 + 0.55 * (hash - Math.floor(hash));
  const breath = 0.9 + 0.14 * Math.sin(t * 0.133 + 1.7);
  /* gathering: the effective sigma tightens while the peak hardens, so
     the matter visibly converges and then lets go */
  const gatherL = 1 + 0.24 * Math.sin(t * 0.202 + 0.6);
  const gatherR = 1 + 0.24 * Math.sin(t * 0.157 + 2.9);
  /* the registration strip lives below the head meta's own quiet
     band — deep enough to never phase in behind the text */
  const strip = Math.exp(
    -Math.pow((ny - 0.175 - 0.006 * Math.sin(t * 0.2)) * 14, 2),
  );
  const clusterL =
    Math.exp(
      -Math.pow(
        ((nx - 0.115 - 0.028 * Math.sin(t * 0.093) -
          0.011 * Math.sin(t * 0.043)) * 3.7) / gatherL,
        2,
      ),
    ) *
    Math.exp(
      -Math.pow((ny - 0.44 + 0.05 * Math.sin(t * 0.09)) * 2.55, 2),
    ) /
    (0.84 + 0.3 * gatherL);
  const clusterR =
    Math.exp(
      -Math.pow(
        ((nx - 0.885 + 0.028 * Math.sin(t * 0.084 + 2) +
          0.011 * Math.sin(t * 0.047 + 1)) * 3.7) / gatherR,
        2,
      ),
    ) *
    Math.exp(
      -Math.pow((ny - 0.56 - 0.05 * Math.sin(t * 0.08 + 1)) * 2.55, 2),
    ) /
    (0.84 + 0.3 * gatherR);
  const edge = Math.exp(
    -Math.pow((ny - 0.93) * 7.5, 2) -
      Math.pow((nx - (nx < 0.5 ? 0.24 : 0.76)) * 3.4, 2),
  );
  /* the satellite: a pocket that forms above the wordmark's left
     channel, holds briefly, and dissolves back into nothing */
  const satellite =
    Math.pow(Math.max(0, Math.sin(t * 0.086 + 2.4)), 2.2) *
    Math.exp(
      -Math.pow((nx - 0.38) * 4.8, 2) - Math.pow((ny - 0.185) * 6, 2),
    );
  const settle = (0.9 + 0.2 * Math.pow(ny, 1.25)) * breath;
  const texture = v * 0.8;
  return Math.max(
    texture,
    clusterL * 1.05 * grain * settle,
    clusterR * 1.12 * grain * settle,
    strip * 0.72 * grain * (0.85 + 0.3 * Math.sin(t * 0.113 + 0.4)),
    edge * 0.78 * grain,
    satellite * 0.8 * grain,
  );
}
