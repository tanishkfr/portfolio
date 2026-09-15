"use client";

import { SignalField, hexToRgba, type Quiet } from "./signal-field";

/**
 * CASE SIGNAL — the argument's material inside each case room.
 *
 * The folio's pages hold the signal in open space; the case rooms run
 * the same engine at room register. Both layers live in the reasoning
 * section's open right rail — the prose is capped near 58ch and sits
 * on the left edge, so the rail is structurally clear of every word.
 * A faint glyph texture runs down the rail like a margin annotation,
 * and one small cluster of the room's ink breathes in its upper half.
 * Quiet zones still cover the rail's text-facing edges completely,
 * and pixel mode only paints above its on-threshold.
 */

const RAIL_QUIET: Quiet[] = [
  /* the rail's text-facing edge dissolves toward the argument */
  { x: 0, y: 0, w: 0.24, h: 1, falloff: 1, feather: 0.06 },
  { x: 0, y: 0, w: 1, h: 0.08, falloff: 0.9, feather: 0.04 },
  { x: 0, y: 0.9, w: 1, h: 0.1, falloff: 0.85, feather: 0.04 },
];

const POCKET_QUIET: Quiet[] = [
  { x: 0, y: 0, w: 0.24, h: 1, falloff: 1, feather: 0.06 },
  { x: 0, y: 0, w: 1, h: 0.1, falloff: 0.9, feather: 0.04 },
  { x: 0, y: 0.86, w: 1, h: 0.14, falloff: 0.85, feather: 0.04 },
];

/* per-cell grain: the same hole-punching the folio clusters use */
const grainAt = (nx: number, ny: number): number => {
  const hash = Math.sin(nx * 811.3 + ny * 431.7) * 43758.5453;
  return 0.7 + 0.55 * (hash - Math.floor(hash));
};

export function CaseSignal({
  accent,
  ink,
  seed,
}: {
  accent: string;
  ink: string;
  seed: number;
}) {
  return (
    <>
      <SignalField
        className="case-texture"
        cell={17}
        seed={seed}
        ambient={0.15}
        pointerRadius={0}
        quiet={RAIL_QUIET}
        color={(t) => hexToRgba(ink, 0.04 + 0.1 * t)}
      />
      <SignalField
        className="case-pixels"
        mode="pixel"
        cell={22}
        seed={seed + 13}
        ambient={0.55}
        flow={1.2}
        pointerRadius={0}
        tune={[0.4, 2.1]}
        quiet={POCKET_QUIET}
        shape={(v, nx, ny, t) => {
          /* one breathing cluster in the room's ink, upper half of the
             rail — beside the reasoning's opening, clear of every word */
          const cluster = Math.exp(
            -Math.pow((nx - 0.64 - 0.02 * Math.sin(t * 0.11)) * 4.4, 2) -
              Math.pow((ny - 0.46 + 0.05 * Math.sin(t * 0.09)) * 2.6, 2),
          );
          return Math.max(v * 0.8, cluster * 0.85 * grainAt(nx, ny));
        }}
        color={(t) => hexToRgba(accent, 0.22 + 0.5 * t)}
      />
    </>
  );
}
