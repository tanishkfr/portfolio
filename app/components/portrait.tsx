"use client";

import { type CSSProperties } from "react";
import { ROOM_WORLDS } from "../data/room-worlds";
import { SignalField, type Quiet } from "./signal-field";

/**
 * PROJECT PORTRAITS — the portfolio's interpretation layer.
 *
 * Explore and Quick view do not show screenshots or recreations; each
 * project is represented by an abstract, living composition built from
 * the SAME computational material (SignalField), in the project's own
 * pigment. The portrait represents the project's BEHAVIOUR, not its
 * interface: six different states of one digital matter.
 *
 * Every portrait is a pure function of (t, nx, ny) over the shared
 * engine — no new animation loops, no DOM glyphs, one canvas per
 * portrait, IO/visibility/reduced-motion handled by the engine. Under
 * reduced motion the script freezes at t=0, a composed resting state.
 *
 * Explore mounts the full register; Quick view mounts the same object
 * smaller and quieter. The case studies keep the real instruments.
 */

export type PortraitTone = "full" | "index";

type PortraitConfig = {
  glyphs?: string;
  cell: number;
  seed: number;
  ambient: number;
  flow?: number;
  wavefront?: number;
  drift?: number;
  tune?: [number, number];
  /** the portrait panel's own ground — the project's plate colour */
  ground: string;
  color: (t: number) => string | null;
  shape?: (v: number, nx: number, ny: number, t: number) => number;
  glyphAt?: (t: number, nx: number, ny: number) => number;
  displace?: (t: number, nx: number, ny: number) => [number, number];
  quiet?: Quiet[];
  pointerRadius?: number;
};

const smooth = (edge: number): number => {
  const x = Math.min(1, Math.max(0, edge));
  return x * x * (3 - 2 * x);
};

/** normalised position in a period, phase-shifted */
const cyc = (t: number, period: number, phase = 0): number =>
  (((t / period + phase) % 1) + 1) % 1;

/** an eased window over a cycle: rises at `a`, falls at `b` */
const env = (c: number, a: number, b: number, fade = 0.14): number =>
  smooth((c - a) / fade) * (1 - smooth((c - b) / fade));

const lerp = (a: number, b: number, k: number): number => a + (b - a) * k;

/* --------------------------------------------------------------
   01 · DESIGN OR DISASTER — point before you judge.
   A broad, ambiguous field of glyph information; one region
   resolves, points converge, a crosshair settles onto it. The
   rest stays contested. The selected region moves between
   cycles, so no answer ever becomes permanent.
   -------------------------------------------------------------- */

const EVIDENCE_REGIONS = [
  { x: 0.14, y: 0.18, w: 0.26, h: 0.3 },
  { x: 0.56, y: 0.42, w: 0.3, h: 0.26 },
  { x: 0.3, y: 0.58, w: 0.22, h: 0.24 },
] as const;

const EVIDENCE_STARTS = [
  { x: 0.08, y: 0.78 },
  { x: 0.88, y: 0.16 },
  { x: 0.82, y: 0.86 },
] as const;

function evidenceShape(v: number, nx: number, ny: number, t: number): number {
  const c = cyc(t, 34);
  const slot = Math.min(2, Math.floor(c * 3));
  const u = c * 3 - slot;
  const region = EVIDENCE_REGIONS[slot];
  const sel = env(u, 0.16, 0.82, 0.16);
  /* the selected region resolves out of the noise, framed by a thin
     unsettled border */
  const inX = nx > region.x && nx < region.x + region.w;
  const inY = ny > region.y && ny < region.y + region.h;
  const bx = Math.min(Math.abs(nx - region.x), Math.abs(nx - (region.x + region.w)));
  const by = Math.min(Math.abs(ny - region.y), Math.abs(ny - (region.y + region.h)));
  const border = inX && inY ? Math.min(bx, by) : 9;
  let out = v;
  if (inX && inY) {
    out = Math.max(out, sel * (0.66 + 0.3 * v));
  } else if (border < 0.02) {
    out = Math.max(out, sel * 0.9 * (1 - border / 0.02));
  }
  /* the crosshair: a point that starts displaced and settles onto the
     region while it resolves */
  const start = EVIDENCE_STARTS[slot];
  const settle = Math.min(1, Math.max(0, (u - 0.12) / 0.26));
  const px = lerp(start.x, region.x + region.w / 2, smooth(settle));
  const py = lerp(start.y, region.y + region.h / 2, smooth(settle));
  const d = Math.hypot(nx - px, ny - py);
  const marker = env(u, 0.1, 0.84, 0.1) * Math.exp(-Math.pow(d * 22, 2));
  out = Math.max(out, marker);
  return out;
}

function evidenceGlyphAt(t: number, nx: number, ny: number): number {
  const c = cyc(t, 34);
  const slot = Math.min(2, Math.floor(c * 3));
  const u = c * 3 - slot;
  if (env(u, 0.1, 0.84, 0.1) < 0.5) return -1;
  const region = EVIDENCE_REGIONS[slot];
  const start = EVIDENCE_STARTS[slot];
  const settle = smooth(Math.min(1, Math.max(0, (u - 0.12) / 0.26)));
  const px = lerp(start.x, region.x + region.w / 2, settle);
  const py = lerp(start.y, region.y + region.h / 2, settle);
  /* the marker itself is a crosshair: a plus at the point */
  if (Math.abs(ny - py) < 0.014 && Math.abs(nx - px) < 0.05) return 2;
  if (Math.abs(nx - px) < 0.014 && Math.abs(ny - py) < 0.05) return 2;
  return -1;
}

/* --------------------------------------------------------------
   02 · PENTIMENTO — write, strike, rewrite.
   Four coherent lines of machine material; one is struck
   through with slashes and displaced, one is fragmented into
   x-blocks while a rewritten line settles beneath it, and the
   struck span keeps a readable residue. The cycle is slow and
   never identical twice to a casual glance.
   -------------------------------------------------------------- */

/* the machine lines, as spans */
const LINES = [
  { y: 0.22, x0: 0.1, x1: 0.8 },
  { y: 0.38, x0: 0.1, x1: 0.64 },
  { y: 0.54, x0: 0.1, x1: 0.46 },
  { y: 0.7, x0: 0.1, x1: 0.7 },
] as const;

function revisionAmp(index: number, c: number): number {
  /* line 3 is struck mid-cycle; line 4 is rewritten late */
  if (index === 2) return 0.82;
  if (index === 3) {
    /* the original line fades as the rewrite takes the lead */
    return 0.9 * (1 - env(c, 0.52, 0.9, 0.16));
  }
  return 0.85;
}

function revisionShape(v: number, nx: number, ny: number, t: number): number {
  const c = cyc(t, 36);
  let out = v * 0.55;
  for (let i = 0; i < LINES.length; i++) {
    const line = LINES[i];
    if (Math.abs(ny - line.y) > 0.03) continue;
    const amp = revisionAmp(i, c);
    if (i === 2) {
      /* the struck span: coherent left of the strike, slashed inside */
      const strike = env(c, 0.3, 0.82, 0.14);
      const struck = nx > line.x1 && nx < line.x1 + 0.26;
      if (struck) {
        out = Math.max(out, Math.max(amp, strike * 0.95));
      } else {
        out = Math.max(out, amp * (0.7 + 0.3 * v));
      }
    } else {
      const span = nx > line.x0 && nx < line.x1;
      if (span) out = Math.max(out, amp * (0.62 + 0.38 * v));
    }
  }
  /* the rewrite: a settled line below the struck one, rising late */
  const rw = env(c, 0.5, 0.92, 0.14);
  if (rw > 0 && Math.abs(ny - (LINES[3].y + 0.07)) < 0.03 && nx > 0.18 && nx < 0.74) {
    out = Math.max(out, rw * (0.7 + 0.3 * v));
  }
  return out;
}

function revisionGlyphAt(t: number, nx: number, ny: number): number {
  const c = cyc(t, 36);
  const line = LINES[2];
  const strike = env(c, 0.3, 0.82, 0.14);
  /* slashes through the struck span */
  if (strike > 0.4 && Math.abs(ny - line.y) < 0.03 && nx > line.x1 && nx < line.x1 + 0.26) {
    return 5;
  }
  /* x-fragments where the fourth line dissolves */
  const frag = env(c, 0.52, 0.9, 0.16);
  if (frag > 0.35 && Math.abs(ny - LINES[3].y) < 0.03 && nx > LINES[3].x0 && nx < LINES[3].x1) {
    return 6;
  }
  return -1;
}

function revisionDisplace(t: number, nx: number, ny: number): [number, number] {
  const c = cyc(t, 36);
  const strike = env(c, 0.3, 0.82, 0.14);
  const line = LINES[2];
  /* struck glyphs sit slightly off their baseline, then settle */
  if (strike > 0.2 && Math.abs(ny - line.y) < 0.04) {
    const wobble = Math.sin(t * 0.9 + nx * 40);
    return [0, strike * wobble * 2.2];
  }
  return [0, 0];
}

/* --------------------------------------------------------------
   03 · INVISIBLE INTERFACES — presence, absence, return.
   A binary field in which regions quietly empty out, hold their
   absence, and resettle — delegated work nobody is watching.
   The most binary of the six; 0 1 belongs to this project.
   ---------------------------------------------------------------- */

const ABSENCE_REGIONS: { q: Quiet; phase: number }[] = [
  { q: { x: 0.08, y: 0.16, w: 0.32, h: 0.3, falloff: 1, feather: 0.06 }, phase: 0 },
  { q: { x: 0.56, y: 0.3, w: 0.3, h: 0.32, falloff: 1, feather: 0.18 }, phase: 0.37 },
  { q: { x: 0.28, y: 0.62, w: 0.36, h: 0.26, falloff: 1, feather: 0.16 }, phase: 0.71 },
];

function absenceShape(v: number, nx: number, ny: number, t: number): number {
  let out = v;
  for (const region of ABSENCE_REGIONS) {
    const c = cyc(t, 30, region.phase);
    const absence = env(c, 0.2, 0.56, 0.16);
    if (absence <= 0) continue;
    const q = region.q;
    const dx = Math.max(0, Math.abs(nx - (q.x + q.w / 2)) - q.w / 2);
    const dy = Math.max(0, Math.abs(ny - (q.y + q.h / 2)) - q.h / 2);
    const hold = 1 - smooth(Math.min(1, Math.hypot(dx, dy) / (q.feather ?? 0.08)));
    out *= 1 - absence * hold;
  }
  return out;
}

/* --------------------------------------------------------------
   04 · INTERACTION ATLAS — rules change under pressure.
   A vertical lineage of authored runs: each line resolves in
   turn, connected by a short diagonal of colon glyphs, older
   wording dimming but never erased. Reads as inheritance, not
   as a git graph.
   -------------------------------------------------------------- */

const LINEAGE_RUNS = [
  { y: 0.15, x0: 0.1, w: 0.3 },
  { y: 0.265, x0: 0.18, w: 0.24 },
  { y: 0.38, x0: 0.18, w: 0.34 },
  { y: 0.495, x0: 0.18, w: 0.2 },
  { y: 0.61, x0: 0.26, w: 0.3 },
  { y: 0.725, x0: 0.26, w: 0.24 },
  { y: 0.825, x0: 0.34, w: 0.32 },
] as const;

function lineageShape(v: number, nx: number, ny: number, t: number): number {
  /* the cycle starts mid-lineage: ancestry is already present when the
     portrait arrives, and one new run resolves in every ~6 seconds */
  const c = cyc(t, 44, 0.45);
  const current = Math.floor(c * LINEAGE_RUNS.length);
  let out = v * 0.48;
  for (let i = 0; i < LINEAGE_RUNS.length; i++) {
    const run = LINEAGE_RUNS[i];
    if (i > current) continue;
    const inRun =
      Math.abs(ny - run.y) < 0.034 &&
      nx > run.x0 &&
      nx < run.x0 + run.w;
    if (!inRun) continue;
    /* the current run is the wording under pressure: dense and
       pigment-led; ancestry stays visible but dimmed */
    const amp = i === current ? 0.95 : 0.6;
    out = Math.max(out, amp * (0.6 + 0.4 * v));
  }
  /* the connector: a short diagonal from the previous run's end to
     the current run's start, resolving as the new run arrives */
  if (current > 0) {
    const prev = LINEAGE_RUNS[current - 1];
    const run = LINEAGE_RUNS[current];
    const ax = prev.x0 + prev.w;
    const ay = prev.y;
    const bx = run.x0;
    const by = run.y;
    const reveal = env(c * LINEAGE_RUNS.length - current, 0.02, 0.85, 0.18);
    if (reveal > 0) {
      const t01 = Math.max(0, Math.min(1, ((nx - ax) / (bx - ax) + (ny - ay) / (by - ay)) / 2));
      const lx = lerp(ax, bx, t01);
      const ly = lerp(ay, by, t01);
      const d = Math.hypot(nx - lx, ny - ly);
      if (d < 0.05) out = Math.max(out, reveal * 0.8 * (1 - d / 0.05));
    }
  }
  return out;
}

function lineageGlyphAt(t: number, nx: number, ny: number): number {
  const c = cyc(t, 44, 0.45);
  const current = Math.floor(c * LINEAGE_RUNS.length);
  if (current === 0) return -1;
  const prev = LINEAGE_RUNS[current - 1];
  const run = LINEAGE_RUNS[current];
  /* the connector is drawn in the colon glyph */
  const ax = prev.x0 + prev.w;
  const ay = prev.y;
  const bx = run.x0;
  const by = run.y;
  const t01 = Math.max(0, Math.min(1, ((nx - ax) / (bx - ax) + (ny - ay) / (by - ay)) / 2));
  const lx = lerp(ax, bx, t01);
  const ly = lerp(ay, by, t01);
  if (Math.hypot(nx - lx, ny - ly) < 0.014) return 1;
  return -1;
}

/* --------------------------------------------------------------
   05 · FLUXION STUDIOS — brief, decision, shipped thing.
   Scattered signal drifts, then aligns into a stable
   rectangular structure — frame, top bar, internal rules —
   that holds as the delivered form, then gently releases.
   Constructed, not terminal-like.
   -------------------------------------------------------------- */

const FLUX_FRAME = { x: 0.14, y: 0.18, w: 0.72, h: 0.64 };

function fluxFormation(t: number): number {
  /* phase 0.5: the portrait arrives with the form already resolved —
     it releases, scatters, and rebuilds over the cycle */
  const c = cyc(t, 40, 0.5);
  return env(c, 0.28, 0.62, 0.18) * (1 - env(c, 0.9, 1.0, 0.07));
}

function fluxShape(v: number, nx: number, ny: number, t: number): number {
  const f = fluxFormation(t);
  const r = FLUX_FRAME;
  const inX = nx > r.x && nx < r.x + r.w;
  const inY = ny > r.y && ny < r.y + r.h;
  const bx = Math.min(Math.abs(nx - r.x), Math.abs(nx - (r.x + r.w)));
  const by = Math.min(Math.abs(ny - r.y), Math.abs(ny - (r.y + r.h)));
  let out = v * (0.7 + 0.35 * f);
  if (inX && inY) {
    /* the frame, the top bar, and two internal rules resolve in */
    const barY = r.y + 0.12;
    const ruleY = r.y + 0.38;
    const onRule =
      bx < 0.014 ||
      by < 0.014 ||
      (inX && Math.abs(ny - barY) < 0.014) ||
      (inX && Math.abs(ny - ruleY) < 0.014) ||
      (Math.abs(nx - (r.x + r.w * 0.55)) < 0.012 && ny > barY && ny < r.y + r.h - 0.02);
    if (onRule) out = Math.max(out, f * (0.9 + 0.1 * v));
    else if (inX && inY && ny > barY) {
      /* the delivered surface stays calm: quiet interior with a slow
         ambient life */
      out = Math.max(out, f * v * 0.5);
    }
  }
  return out;
}

function fluxDisplace(t: number, nx: number, ny: number): [number, number] {
  /* unformed matter wanders; formed structure holds its place */
  const f = fluxFormation(t);
  const amp = (1 - f) * 6;
  return [
    Math.sin(t * 0.42 + (nx * 9 + ny * 5) * 4.1) * amp,
    Math.cos(t * 0.35 + (nx * 6 + ny * 9) * 4.3) * amp,
  ];
}

/* --------------------------------------------------------------
   06 · DAYNERO — many small events become one decision.
   Transaction fragments enter from the edges, travel inward,
   and are absorbed between two stable rules around one dense,
   calm block — the daily number. The most resolved portrait.
   -------------------------------------------------------------- */

const NUMBER_RULES = [
  { y: 0.33, x0: 0.2, w: 0.6 },
  { y: 0.62, x0: 0.2, w: 0.6 },
] as const;
const NUMBER_CORE = { x0: 0.4, x1: 0.6, y0: 0.4, y1: 0.56 };
const TX_SLOTS = [
  { y: 0.16, phase: 0.05 },
  { y: 0.72, phase: 0.31 },
  { y: 0.24, phase: 0.55 },
  { y: 0.82, phase: 0.78 },
] as const;

function numberShape(v: number, nx: number, ny: number, t: number): number {
  let out = v * 0.3;
  /* the two rules: stable, always present */
  for (const rule of NUMBER_RULES) {
    if (Math.abs(ny - rule.y) < 0.012 && nx > rule.x0 && nx < rule.x0 + rule.w) {
      out = Math.max(out, 0.55);
    }
  }
  /* the number: a dense, stable cluster that only breathes */
  if (
    nx > NUMBER_CORE.x0 &&
    nx < NUMBER_CORE.x1 &&
    ny > NUMBER_CORE.y0 &&
    ny < NUMBER_CORE.y1
  ) {
    out = Math.max(out, 0.82 + 0.14 * Math.sin(t * 0.6));
  }
  /* transactions: fragments travel inward and are absorbed */
  for (const slot of TX_SLOTS) {
    const c = cyc(t, 26, slot.phase);
    const travel = Math.min(1, c / 0.42);
    if (travel >= 1) continue;
    const fromLeft = slot.y < 0.5;
    const xEdge = fromLeft ? 0.06 : 0.94;
    const x = lerp(xEdge, xEdge + (xEdge < 0.5 ? 0.34 : -0.34), smooth(travel));
    const y = lerp(slot.y, slot.y < 0.5 ? 0.36 : 0.6, smooth(travel));
    const width = 0.07 * (1 - travel * 0.6);
    if (Math.abs(ny - y) < 0.02 && Math.abs(nx - x) < width / 2) {
      out = Math.max(out, 0.5 * (0.4 + 0.6 * travel) * (1 - smooth((travel - 0.85) / 0.15)));
    }
  }
  return out;
}

/* -------------------------------------------------------------- */

const PORTRAITS: Record<string, PortraitConfig> = {
  "design-or-disaster": {
    cell: 10,
    seed: 41,
    ambient: 0.5,
    tune: [0.4, 2.0],
    ground: "#150f0c",
    pointerRadius: 8,
    shape: evidenceShape,
    glyphAt: evidenceGlyphAt,
    color: (t) =>
      t >= 0.92
        ? "rgba(239, 74, 53, 0.85)"
        : `rgba(255, 246, 232, ${0.08 + 0.28 * t})`,
  },
  pentimento: {
    cell: 11,
    seed: 57,
    ambient: 0.36,
    drift: 0.25,
    ground: "#3b1830",
    shape: revisionShape,
    glyphAt: revisionGlyphAt,
    displace: revisionDisplace,
    color: (t) =>
      t >= 0.9
        ? "rgba(241, 191, 217, 0.65)"
        : `rgba(247, 236, 245, ${0.09 + 0.3 * t})`,
  },
  "invisible-interfaces": {
    glyphs: "01",
    cell: 12,
    seed: 23,
    ambient: 0.52,
    tune: [0.42, 2.0],
    ground: "#0f0e0a",
    shape: absenceShape,
    color: (t) => `rgba(230, 171, 63, ${0.11 + 0.42 * t})`,
  },
  atlas: {
    cell: 11,
    seed: 79,
    ambient: 0.36,
    ground: "#dcece8",
    shape: lineageShape,
    glyphAt: lineageGlyphAt,
    color: (t) =>
      t >= 0.92
        ? "rgba(18, 97, 90, 0.7)"
        : `rgba(13, 24, 23, ${0.13 + 0.3 * t})`,
  },
  "fluxion-studios": {
    cell: 12,
    seed: 61,
    ambient: 0.6,
    drift: 0.35,
    ground: "#f1c9cd",
    shape: fluxShape,
    displace: fluxDisplace,
    color: (t) =>
      t >= 0.92
        ? "rgba(140, 10, 24, 0.85)"
        : `rgba(176, 16, 32, ${0.14 + 0.32 * t})`,
  },
  daynero: {
    cell: 12,
    seed: 83,
    ambient: 0.34,
    ground: "#161c0d",
    shape: numberShape,
    color: (t) =>
      t >= 0.9
        ? "rgba(201, 242, 78, 0.85)"
        : `rgba(185, 221, 85, ${0.09 + 0.32 * t})`,
  },
};

/** The project portrait: an abstract, living representation of one
    project's behaviour — the same material family, six behaviours.
    `index` renders the compact, quieter Quick view register. */
export function ProjectPortrait({
  slug,
  tone = "full",
}: {
  slug: string;
  tone?: PortraitTone;
}) {
  const config = PORTRAITS[slug];
  if (!config) return null;
  const index = tone === "index";
  return (
    <figure
      className={`xp-portrait${index ? " xp-portrait--index" : ""}`}
      data-portrait={slug}
      style={
        {
          background: config.ground,
          "--accent-ink": ROOM_WORLDS[slug]?.accentInk,
        } as CSSProperties
      }
    >
      <SignalField
        className="xp-portrait-field"
        glyphs={config.glyphs ?? "·:+*#"}
        cell={config.cell + (index ? 2 : 0)}
        seed={config.seed}
        ambient={config.ambient * (index ? 0.9 : 1)}
        flow={config.flow}
        wavefront={config.wavefront}
        drift={config.drift}
        tune={config.tune}
        pointerRadius={config.pointerRadius ?? 0}
        color={config.color}
        shape={config.shape}
        glyphAt={config.glyphAt}
        displace={config.displace}
      />
    </figure>
  );
}
