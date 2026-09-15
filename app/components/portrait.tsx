"use client";

import { type CSSProperties } from "react";
import { ROOM_WORLDS } from "../data/room-worlds";
import { SignalField, type Quiet } from "./signal-field";

/**
 * PROJECT PORTRAITS — the portfolio's interpretation layer.
 *
 * The projects are not shown as screenshots or recreations; each project
 * is represented by an abstract, living composition built from the SAME
 * computational material (SignalField), in the project's own pigment.
 * The portrait shows the project's BEHAVIOUR, not its interface: six
 * different states of one digital matter, readable at a glance and
 * evolving over a slow cycle.
 *
 * Every portrait is a pure function of (t, nx, ny) over the shared
 * engine — no new animation loops, no DOM glyphs, one canvas per
 * portrait, IO/visibility/reduced-motion handled by the engine. Under
 * reduced motion the script freezes at t=0, a composed resting state.
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
   A broad, ambiguous field; one region resolves to a crisp
   evidence plate while the rest stays contested, and a clear
   crosshair travels in and settles onto it. The selected region
   moves between cycles, so no answer becomes permanent.
   -------------------------------------------------------------- */

const EVIDENCE_REGIONS = [
  { x: 0.16, y: 0.2, w: 0.26, h: 0.28 },
  { x: 0.56, y: 0.44, w: 0.3, h: 0.26 },
  { x: 0.32, y: 0.6, w: 0.22, h: 0.22 },
] as const;

const EVIDENCE_STARTS = [
  { x: 0.08, y: 0.84 },
  { x: 0.9, y: 0.14 },
  { x: 0.86, y: 0.9 },
] as const;

function evidenceShape(v: number, nx: number, ny: number, t: number): number {
  const c = cyc(t, 30);
  const slot = Math.min(2, Math.floor(c * 3));
  const u = c * 3 - slot;
  const region = EVIDENCE_REGIONS[slot];
  const sel = env(u, 0.12, 0.86, 0.12);
  const inX = nx > region.x && nx < region.x + region.w;
  const inY = ny > region.y && ny < region.y + region.h;
  const bx = Math.min(Math.abs(nx - region.x), Math.abs(nx - (region.x + region.w)));
  const by = Math.min(Math.abs(ny - region.y), Math.abs(ny - (region.y + region.h)));
  const border = inX && inY ? Math.min(bx, by) : 9;
  let out = v;
  if (inX && inY) {
    /* the plate resolves: dense, near-uniform, slightly breathing */
    out = Math.max(out, sel * (0.86 + 0.12 * v));
  } else if (border < 0.022) {
    /* a crisp frame — the mark's own annotation */
    out = Math.max(out, sel * (0.7 + 0.3 * (1 - border / 0.022)));
  }
  /* the crosshair: a point that starts displaced and settles while
     the region resolves */
  const start = EVIDENCE_STARTS[slot];
  const settle = smooth(Math.min(1, Math.max(0, (u - 0.08) / 0.24)));
  const px = lerp(start.x, region.x + region.w / 2, settle);
  const py = lerp(start.y, region.y + region.h / 2, settle);
  const marker = env(u, 0.06, 0.88, 0.08);
  const dx = Math.abs(nx - px);
  const dy = Math.abs(ny - py);
  /* hairline cross + a small center bloom */
  if (marker > 0.3 && dy < 0.016 && dx < 0.055) {
    out = Math.max(out, 0.95);
  }
  if (marker > 0.3 && dx < 0.016 && dy < 0.055) {
    out = Math.max(out, marker);
  }
  if (marker > 0.3 && Math.hypot(dx, dy) < 0.024) {
    out = Math.max(out, marker * (0.6 + 0.4 * v));
  }
  return out;
}

function evidenceGlyphAt(t: number, nx: number, ny: number): number {
  const c = cyc(t, 30);
  const slot = Math.min(2, Math.floor(c * 3));
  const u = c * 3 - slot;
  const marker = env(u, 0.06, 0.88, 0.08);
  if (marker < 0.3) return -1;
  const region = EVIDENCE_REGIONS[slot];
  const start = EVIDENCE_STARTS[slot];
  const settle = smooth(Math.min(1, Math.max(0, (u - 0.08) / 0.24)));
  const px = lerp(start.x, region.x + region.w / 2, settle);
  const py = lerp(start.y, region.y + region.h / 2, settle);
  const dx = Math.abs(nx - px);
  const dy = Math.abs(ny - py);
  /* the crosshair: plus at the intersection */
  if (dx < 0.016 && dy < 0.016) return 2;
  return -1;
}

/* --------------------------------------------------------------
   02 · PENTIMENTO — write, strike, rewrite.
   Three lines of machine text. A strike sweeps across the third
   line and leaves a solid slash row behind; the struck line is
   then replaced by a new line that resolves beneath it, and the
   original fades back to a ghost. The narrative is legible:
   write, strike, rewrite.
   -------------------------------------------------------------- */

const STRIKE_Y = 0.44;
const REWRITE_Y = 0.56;

function revisionShape(v: number, nx: number, ny: number, t: number): number {
  const c = cyc(t, 32);
  let out = v * 0.5;
  /* the three standing lines: coherent, gently breathing */
  const lines = [
    { y: 0.24, x0: 0.1, x1: 0.82, amp: 0.88 },
    { y: 0.38, x0: 0.1, x1: 0.64, amp: 0.82 },
    /* line 3 holds until the strike takes it */
    { y: STRIKE_Y, x0: 0.1, x1: 0.7, amp: 0.85 * (1 - env(c, 0.6, 0.9, 0.12)) },
  ];
  for (const line of lines) {
    if (Math.abs(ny - line.y) > 0.032) continue;
    if (nx > line.x0 && nx < line.x1) {
      out = Math.max(out, line.amp * (0.66 + 0.34 * v));
    }
  }
  /* the strike: a solid slash row that sweeps across the third line */
  const strike = env(c, 0.3, 0.66, 0.1);
  const sweep = smooth((c - 0.3) / 0.18);
  if (strike > 0.2 && Math.abs(ny - STRIKE_Y) < 0.034 && nx < 0.1 + sweep * 0.6) {
    out = Math.max(out, strike * 0.95);
  }
  /* the rewrite: a fresh line resolving beneath the strike */
  const rw = env(c, 0.66, 0.94, 0.12);
  const rwSweep = smooth((c - 0.66) / 0.14);
  if (
    rw > 0.2 &&
    Math.abs(ny - REWRITE_Y) < 0.032 &&
    nx > 0.14 &&
    nx < 0.14 + rwSweep * 0.5
  ) {
    out = Math.max(out, rw * (0.8 + 0.2 * v));
  }
  return out;
}

function revisionGlyphAt(t: number, nx: number, ny: number): number {
  const c = cyc(t, 32);
  /* slashes wherever the strike has passed */
  const strike = env(c, 0.3, 0.66, 0.1);
  const sweep = smooth((c - 0.3) / 0.18);
  if (strike > 0.35 && Math.abs(ny - STRIKE_Y) < 0.032 && nx < 0.1 + sweep * 0.6) {
    return 5;
  }
  return -1;
}

function revisionDisplace(t: number, nx: number, ny: number): [number, number] {
  /* glyphs just behind the strike head lift off their baseline */
  const c = cyc(t, 32);
  const strike = env(c, 0.3, 0.66, 0.1);
  const sweep = smooth((c - 0.3) / 0.18);
  if (
    strike > 0.2 &&
    strike < 0.85 &&
    Math.abs(ny - STRIKE_Y) < 0.045 &&
    nx < 0.1 + sweep * 0.6 &&
    nx > 0.1 + sweep * 0.6 - 0.08
  ) {
    return [0, strike * 2.4 * Math.sin(nx * 60 + t * 4)];
  }
  return [0, 0];
}

/* --------------------------------------------------------------
   03 · INVISIBLE INTERFACES — presence, absence, return.
   A binary field with crisp rectangular voids: work regions
   empty quickly, hold their absence, and resettle with a short
   resolve. 0 1 belongs to this project alone.
   ---------------------------------------------------------------- */

const ABSENCE_REGIONS: { q: Quiet; phase: number }[] = [
  { q: { x: 0.1, y: 0.18, w: 0.3, h: 0.28, falloff: 1, feather: 0.035 }, phase: 0 },
  { q: { x: 0.58, y: 0.32, w: 0.28, h: 0.3, falloff: 1, feather: 0.09 }, phase: 0.37 },
  { q: { x: 0.3, y: 0.62, w: 0.34, h: 0.24, falloff: 1, feather: 0.07 }, phase: 0.71 },
];

function absenceShape(v: number, nx: number, ny: number, t: number): number {
  let out = v;
  for (const region of ABSENCE_REGIONS) {
    const c = cyc(t, 30, region.phase);
    const absence = env(c, 0.22, 0.6, 0.09);
    if (absence <= 0) continue;
    const q = region.q;
    const dx = Math.max(0, Math.abs(nx - (q.x + q.w / 2)) - q.w / 2);
    const dy = Math.max(0, Math.abs(ny - (q.y + q.h / 2)) - q.h / 2);
    const hold = 1 - smooth(Math.min(1, Math.hypot(dx, dy) / (q.feather ?? 0.05)));
    out *= 1 - absence * hold;
  }
  return out;
}

/* --------------------------------------------------------------
   04 · INTERACTION ATLAS — rules change under pressure.
   A structured system of authored rules: each is a dense wording
   run sitting on a thin rule line; one lineage appends over the
   cycle with an elbow connector, one run branches in two, and
   the current wording is pigment-led while ancestry stays legible
   but dimmed. Structured, not a git graph.
   -------------------------------------------------------------- */

/* each entry: the wording run, then a thin rule line under it */
const LINEAGE_RUNS = [
  { y: 0.16, x0: 0.1, w: 0.34, rule: true },
  { y: 0.27, x0: 0.18, w: 0.28, rule: true },
  { y: 0.38, x0: 0.18, w: 0.36, rule: true },
  { y: 0.5, x0: 0.18, w: 0.22, rule: false },
  { y: 0.5, x0: 0.44, w: 0.16, rule: false },
  { y: 0.62, x0: 0.26, w: 0.3, rule: true },
  { y: 0.74, x0: 0.34, w: 0.26, rule: true },
] as const;
const LINEAGE_COUNT = 7;

function lineageState(t: number): { c: number; current: number; slot: number } {
  /* phase 0.45: the portrait arrives mid-lineage, ancestry present */
  const c = cyc(t, 44, 0.45);
  const current = Math.floor(c * LINEAGE_COUNT);
  return { c, current, slot: c * LINEAGE_COUNT - current };
}

function lineageShape(v: number, nx: number, ny: number, t: number): number {
  const { current, slot } = lineageState(t);
  let out = v * 0.4;
  for (let i = 0; i < LINEAGE_RUNS.length; i++) {
    const run = LINEAGE_RUNS[i];
    if (i > current) continue;
    /* the wording run */
    if (Math.abs(ny - run.y) < 0.03 && nx > run.x0 && nx < run.x0 + run.w) {
      const amp = i === current ? 0.95 : 0.52;
      out = Math.max(out, amp * (0.62 + 0.38 * v));
    }
    /* the authored rule: a thin line under each wording */
    if (run.rule && Math.abs(ny - (run.y + 0.055)) < 0.012 && nx > run.x0 && nx < run.x0 + run.w) {
      const amp = i === current ? 0.9 : 0.5;
      out = Math.max(out, amp);
    }
  }
  /* the elbow connector: down from the previous run's rule, then
     across to the next run's start */
  if (current > 0 && slot < 0.7) {
    const prev = LINEAGE_RUNS[current - 1];
    const run = LINEAGE_RUNS[current];
    const env2 = env(slot, 0.04, 0.9, 0.16);
    if (env2 > 0) {
      /* vertical segment under the previous run's end */
      const ex = prev.x0 + prev.w;
      if (Math.abs(nx - ex) < 0.012 && ny > prev.y && ny < run.y) {
        out = Math.max(out, env2 * 0.8);
      }
      /* horizontal approach into the new run's start */
      const yEnd = run.y - 0.03;
      if (Math.abs(ny - yEnd) < 0.012 && nx < ex && nx > run.x0 - 0.02) {
        out = Math.max(out, env2 * 0.8);
      }
    }
  }
  return out;
}

function lineageGlyphAt(t: number, nx: number, ny: number): number {
  const { current, slot } = lineageState(t);
  if (current === 0 || slot >= 0.7) return -1;
  const prev = LINEAGE_RUNS[current - 1];
  const run = LINEAGE_RUNS[current];
  const ex = prev.x0 + prev.w;
  const env2 = env(slot, 0.04, 0.9, 0.16);
  if (env2 < 0.4) return -1;
  /* the connector is drawn in the colon glyph */
  if (Math.abs(nx - ex) < 0.012 && ny > prev.y && ny < run.y) return 1;
  if (Math.abs(ny - (run.y - 0.03)) < 0.012 && nx < ex && nx > run.x0 - 0.02) {
    return 1;
  }
  return -1;
}

/* --------------------------------------------------------------
   05 · FLUXION STUDIOS — pieces aligning into a built thing.
   Scattered signal wanders, then aligns into the site's
   wireframe — frame, top bar, two columns, footer rule — which
   holds as the delivered structure. Constructed, not
   terminal-like.
   -------------------------------------------------------------- */

const FLUX_FRAME = { x: 0.14, y: 0.16, w: 0.72, h: 0.66 };

function fluxFormation(t: number): number {
  /* phase 0.5: the portrait arrives with the form already resolved —
     it releases, scatters, and rebuilds over the cycle */
  const c = cyc(t, 40, 0.5);
  return env(c, 0.24, 0.66, 0.16) * (1 - env(c, 0.9, 1.0, 0.07));
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
    /* the wireframe: frame edges, top bar, column rule, footer bar */
    const barY = r.y + 0.11;
    const footY = r.y + r.h - 0.09;
    const colX = r.x + r.w * 0.52;
    const onRule =
      bx < 0.014 ||
      by < 0.014 ||
      (inX && Math.abs(ny - barY) < 0.014) ||
      (inX && Math.abs(ny - footY) < 0.014) ||
      (Math.abs(nx - colX) < 0.012 && ny > barY && ny < footY);
    if (onRule) {
      out = Math.max(out, f * (0.9 + 0.1 * v));
    } else if (inX && inY && ny > barY && ny < footY) {
      /* two stable content runs inside the built surface */
      const rowA = Math.abs(ny - (barY + 0.14)) < 0.026 && nx > r.x + 0.05 && nx < colX - 0.03;
      const rowB = Math.abs(ny - (barY + 0.14)) < 0.026 && nx > colX + 0.03 && nx < r.x + r.w - 0.02;
      if (rowA || rowB) {
        out = Math.max(out, f * (0.55 + 0.25 * v));
      } else {
        /* the delivered surface stays calm */
        out = Math.max(out, f * v * 0.4);
      }
    }
  }
  return out;
}

function fluxDisplace(t: number, nx: number, ny: number): [number, number] {
  /* unformed matter wanders gently; formed structure holds place */
  const f = fluxFormation(t);
  const amp = (1 - f) * 4;
  return [
    Math.sin(t * 0.42 + (nx * 9 + ny * 5) * 4.1) * amp,
    Math.cos(t * 0.35 + (nx * 6 + ny * 9) * 4.3) * amp,
  ];
}

/* --------------------------------------------------------------
   06 · DAYNERO — many small fragments resolve into one amount.
   Transaction fragments enter from the edges and are absorbed
   between two stable rules; the daily amount sits between them
   as a dense, legible block that occasionally ticks to a new
   value. The most resolved portrait.
   -------------------------------------------------------------- */

/* glyph set: ·:+*# then 0-9 — the ambient field only ever resolves
   into the marks (indices 0-4); digits belong to the amount alone */
const NUMBER_GLYPHS = "·:+*#0123456789";

const NUMBER_RULES = [
  { y: 0.34, x0: 0.2, w: 0.6 },
  { y: 0.62, x0: 0.2, w: 0.6 },
] as const;
const NUMBER_CORE = { x0: 0.38, x1: 0.62, y0: 0.42, y1: 0.56 };
/* the amount reads as three digit cells; '824' → glyph indices 13,7,9 */
const AMOUNT_A = [13, 7, 9];
const AMOUNT_B = [13, 5, 14]; /* '809' — the cycle's other value */
const TX_SLOTS = [
  { y: 0.16, phase: 0.05 },
  { y: 0.74, phase: 0.31 },
  { y: 0.22, phase: 0.55 },
  { y: 0.82, phase: 0.78 },
] as const;

function numberAmountIndex(t: number, nx: number): number {
  /* which digit column: three cells inside the core, or -1 */
  const c = cyc(t, 26, 0.4);
  const tick = env(c, 0.5, 0.64, 0.05);
  const value = tick > 0.5 ? AMOUNT_B : AMOUNT_A;
  for (let i = 0; i < value.length; i++) {
    const cx = 0.42 + i * 0.08;
    if (Math.abs(nx - cx) < 0.038) return value[i];
  }
  return -1;
}

function numberShape(v: number, nx: number, ny: number, t: number): number {
  let out = v * 0.3;
  /* the two rules: stable, always present */
  for (const rule of NUMBER_RULES) {
    if (Math.abs(ny - rule.y) < 0.014 && nx > rule.x0 && nx < rule.x0 + rule.w) {
      out = Math.max(out, 0.6);
    }
  }
  /* the amount: digit columns bright, the block around them dim */
  if (
    nx > NUMBER_CORE.x0 &&
    nx < NUMBER_CORE.x1 &&
    ny > NUMBER_CORE.y0 &&
    ny < NUMBER_CORE.y1
  ) {
    const digit = numberAmountIndex(t, nx);
    if (digit >= 0 && Math.abs(ny - 0.49) < 0.062) {
      out = Math.max(out, 0.96);
    } else {
      out = Math.max(out, 0.4 + 0.08 * Math.sin(t * 0.6));
    }
  }
  /* transactions: fragments travel inward and are absorbed */
  for (const slot of TX_SLOTS) {
    const c = cyc(t, 26, slot.phase);
    const travel = Math.min(1, c / 0.42);
    if (travel >= 1) continue;
    const fromLeft = slot.y < 0.5;
    const xEdge = fromLeft ? 0.06 : 0.94;
    const x = lerp(xEdge, xEdge + (fromLeft ? 0.34 : -0.34), smooth(travel));
    const y = lerp(slot.y, slot.y < 0.5 ? 0.36 : 0.6, smooth(travel));
    const width = 0.07 * (1 - travel * 0.6);
    if (Math.abs(ny - y) < 0.02 && Math.abs(nx - x) < width / 2) {
      out = Math.max(out, 0.55 * (0.4 + 0.6 * travel) * (1 - smooth((travel - 0.85) / 0.15)));
    }
  }
  return out;
}

function numberGlyphAt(t: number, nx: number, ny: number): number {
  /* the ambient field only ever draws the five marks; digits live
     only inside the amount block */
  if (
    nx > NUMBER_CORE.x0 &&
    nx < NUMBER_CORE.x1 &&
    ny > NUMBER_CORE.y0 &&
    ny < NUMBER_CORE.y1
  ) {
    const digit = numberAmountIndex(t, nx);
    if (digit >= 0 && Math.abs(ny - 0.49) < 0.062) return digit;
    return 3; /* '*' fill inside the block, digits over it */
  }
  return -1;
}

/* -------------------------------------------------------------- */

const PORTRAITS: Record<string, PortraitConfig> = {
  "design-or-disaster": {
    cell: 10,
    seed: 41,
    ambient: 0.46,
    tune: [0.44, 2.0],
    ground: "#150f0c",
    pointerRadius: 8,
    shape: evidenceShape,
    glyphAt: evidenceGlyphAt,
    color: (t) =>
      t >= 0.92
        ? "rgba(239, 74, 53, 0.9)"
        : `rgba(255, 246, 232, ${0.08 + 0.26 * t})`,
  },
  pentimento: {
    glyphs: "·:+*#/x",
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
        ? "rgba(241, 191, 217, 0.75)"
        : `rgba(247, 236, 245, ${0.09 + 0.3 * t})`,
  },
  "invisible-interfaces": {
    glyphs: "01",
    cell: 12,
    seed: 23,
    ambient: 0.48,
    tune: [0.42, 2.0],
    ground: "#0f0e0a",
    shape: absenceShape,
    color: (t) => `rgba(230, 171, 63, ${0.11 + 0.4 * t})`,
  },
  atlas: {
    cell: 11,
    seed: 79,
    ambient: 0.34,
    ground: "#dcece8",
    shape: lineageShape,
    glyphAt: lineageGlyphAt,
    color: (t) =>
      t >= 0.85
        ? "rgba(18, 97, 90, 0.8)"
        : `rgba(13, 24, 23, ${0.14 + 0.3 * t})`,
  },
  "fluxion-studios": {
    cell: 12,
    seed: 61,
    ambient: 0.55,
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
    glyphs: NUMBER_GLYPHS,
    cell: 12,
    seed: 83,
    ambient: 0.32,
    ground: "#161c0d",
    shape: numberShape,
    glyphAt: numberGlyphAt,
    color: (t) =>
      t >= 0.9
        ? "rgba(201, 242, 78, 0.9)"
        : `rgba(185, 221, 85, ${0.09 + 0.32 * t})`,
  },
};

/** The project portrait: an abstract, living representation of one
    project's behaviour — the same material family, six behaviours.
    `index` renders the compact, quieter register. */
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
