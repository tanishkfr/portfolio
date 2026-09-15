"use client";

import { hexToRgba, SignalField, type Quiet } from "./signal-field";

/**
 * SPECIMEN — the project previews' shared material register.
 *
 * Explore and Quick view show the same objects, so they must be painted
 * with the same material. Every project specimen carries two shared
 * devices, one grammar:
 *
 *   AMBIENT  — a persistent, quiet glyph field in the project's own
 *              pigment, living in the margins and behind the instrument.
 *              Explore runs it full; the index runs it lighter.
 *   RAIL     — a thin glyph line along the reading edge of the stage:
 *              vertical on Explore's sheets, horizontal on the index
 *              rows. Same component, same density family, oriented to
 *              the surface it serves.
 *
 * The behaviour on top is each project's own (mark, strike, revise,
 * return); the ambient field is the family resemblance underneath.
 * Everything here is decorative, aria-hidden, pointer-transparent, and
 * silent under reduced motion — the engine paints one static frame.
 */

export type SpecimenTone = "full" | "index";

type SpecimenConfig = {
  glyphs?: string;
  cell: number;
  ambient: number;
  flow?: number;
  wavefront?: number;
  drift?: number;
  mode?: "glyph" | "dither";
  /** the project's signal colour, as hex */
  pigment: string;
  /** ink base alpha and peak alpha derived from the pigment */
  alpha: [number, number];
  /** peak colour, for the field's ultramarine-style moments */
  peak?: string;
  peakAlpha?: number;
  peakAt?: number;
  /** suppression zones, in the figure's own normalised box */
  quiet?: Quiet[];
  /** compositional shaping; same contract as SignalField.shape */
  shape?: (v: number, nx: number, ny: number) => number;
};

const SPECIMENS: Record<string, SpecimenConfig> = {
  /* Fluxion: the studio's matter is directional — streamlines through
     the pink board, the wordmark's red as the pigment. */
  "fluxion-studios": {
    cell: 11,
    ambient: 0.32,
    flow: 2.6,
    drift: 0.5,
    wavefront: 0.08,
    pigment: "#b01020",
    alpha: [0.1, 0.3],
  },
  /* Design or Disaster: the evidence is held by the sampler — a thin
     ordered-dither frame around the plate, the critique zone marked
     before anyone marks it. */
  "design-or-disaster": {
    mode: "dither",
    cell: 12,
    ambient: 0.3,
    flow: 1.1,
    drift: 0.3,
    pigment: "#ef4a35",
    alpha: [0.12, 0.4],
    shape: (v, nx, ny) => {
      const edge = Math.min(nx, 1 - nx, ny, 1 - ny);
      const frame = 1 - Math.min(1, edge / 0.055);
      const corner = Math.min(
        1,
        Math.max(0, 1 - Math.hypot(Math.min(nx, 1 - nx) - 0.02, Math.min(ny, 1 - ny) - 0.02) * 8),
      );
      return v * (frame * 0.85 + corner * 0.35);
    },
  },
  /* Pentimento: the machine reading sits in unstable matter; the
     person's correction below stays crisp. */
  pentimento: {
    cell: 11,
    ambient: 0.3,
    flow: 2.2,
    drift: 0.4,
    wavefront: 0.08,
    pigment: "#d48cb4",
    alpha: [0.08, 0.3],
    quiet: [{ x: 0, y: 0.52, w: 0.62, h: 0.48, falloff: 0.92, feather: 0.05 }],
  },
  /* Invisible Interfaces: the room carries its own delegation field, so
     no ambient is mounted here — but the rail still runs, in the lamp
     amber, so the sheet joins the family's shared edge line. */
  "invisible-interfaces": {
    cell: 12,
    ambient: 0.3,
    drift: 0.4,
    wavefront: 0.08,
    pigment: "#d9a951",
    alpha: [0.08, 0.28],
  },
  /* Atlas: the rule under pressure — a quiet pine field behind the
     lineage, clear of the wording it carries. */
  atlas: {
    cell: 12,
    ambient: 0.28,
    drift: 0.35,
    wavefront: 0.07,
    pigment: "#12615a",
    alpha: [0.09, 0.26],
    quiet: [{ x: 0.03, y: 0.08, w: 0.6, h: 0.62, falloff: 0.94, feather: 0.05 }],
  },
  /* Daynero: the ledger's signal — a sparse columnar drift, clear of
     the amount that must stay crisp. */
  daynero: {
    cell: 11,
    ambient: 0.3,
    drift: 0.3,
    wavefront: 0.06,
    pigment: "#b9dd55",
    alpha: [0.08, 0.26],
    quiet: [{ x: 0, y: 0.06, w: 0.52, h: 0.72, falloff: 0.85, feather: 0.05 }],
  },
};

function specimenProps(
  slug: string,
  tone: SpecimenTone,
  seed: number,
  className: string,
) {
  const config = SPECIMENS[slug];
  if (!config) return null;
  const index = tone === "index";
  return {
    className: `${className} specimen-field--${slug}${index ? " specimen-field--index" : ""}`,
    glyphs: config.glyphs ?? "·:+*#",
    mode: config.mode ?? ("glyph" as const),
    cell: config.cell + (index ? 1 : 0),
    seed,
    ambient: config.ambient * (index ? 0.72 : 1),
    flow: config.flow,
    wavefront: config.wavefront,
    drift: config.drift,
    pointerRadius: 0,
    color: (t: number) => {
      if (config.peak && (config.peakAt ?? 0.94) <= t) {
        return hexToRgba(config.peak, config.peakAlpha ?? 0.4);
      }
      return hexToRgba(config.pigment, config.alpha[0] + config.alpha[1] * t);
    },
    quiet: config.quiet,
    shape: config.shape,
  };
}

/** The persistent specimen field: the project's own computational
    atmosphere, mounted inside its figure. */
export function SpecimenAmbient({
  slug,
  tone = "full",
  seed = 5,
}: {
  slug: string;
  tone?: SpecimenTone;
  seed?: number;
}) {
  const props = specimenProps(slug, tone, seed, "specimen-field");
  return props ? <SignalField {...props} /> : null;
}

/** The specimen rail: one thin glyph line along the stage's reading
    edge, in the project's pigment — horizontal on the index rows, a
    vertical edge line on Explore's sheets. The shared signature of the
    set: the same device on every surface. */
export function SpecimenRail({
  slug,
  tone = "full",
  seed = 3,
  orientation = "line",
}: {
  slug: string;
  tone?: SpecimenTone;
  seed?: number;
  orientation?: "line" | "edge";
}) {
  const props = specimenProps(slug, tone, seed, "specimen-rail-field");
  if (!props) return null;
  return (
    <div
      className={`specimen-rail${orientation === "edge" ? " specimen-rail--edge" : ""}`}
      aria-hidden="true"
    >
      <SignalField {...props} ambient={props.ambient * 1.25} />
    </div>
  );
}
