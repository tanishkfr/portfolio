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
 * evolving over a slow cycle. The portrait is the message; the ambient
 * texture around it stays secondary.
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
  let out = v * 0.85;
  if (inX && inY) {
    /* the plate resolves: near-uniform, flat, slightly breathing */
    out = Math.max(out, sel * 0.92);
  } else if (border < 0.024) {
    /* a crisp frame — the mark's own annotation */
    out = Math.max(out, sel * (0.75 + 0.25 * (1 - border / 0.024)));
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
   02 · PENTIMENTO — the machine writes, the person answers.
   Two machine lines stand; a third is being written when a solid
   strike bar sweeps across it and the line drops to a ghost; the
   person's correction then resolves beneath it, brighter, and it
   leads the composition for the rest of the cycle. At a glance:
   text being challenged, then overwritten by its correction.
   -------------------------------------------------------------- */

const MACHINE_LINES = [
  { y: 0.22, x0: 0.1, x1: 0.8 },
  { y: 0.34, x0: 0.1, x1: 0.66 },
] as const;
const STRUCK_LINE = { y: 0.46, x0: 0.1, x1: 0.72 };
const REWRITE_LINE = { y: 0.56, x0: 0.14, x1: 0.76 };

function revisionShape(v: number, nx: number, ny: number, t: number): number {
  /* phase 0.82: the portrait arrives after the strike — the load state
     already reads "text was challenged and rewritten", and the cycle
     replays the argument from a fresh draft */
  const c = cyc(t, 40, 0.82);
  let out = v * 0.4;
  /* the standing machine text: coherent, mid-weight */
  for (const line of MACHINE_LINES) {
    if (Math.abs(ny - line.y) < 0.032 && nx > line.x0 && nx < line.x1) {
      out = Math.max(out, 0.72 * (0.7 + 0.3 * v));
    }
  }
  /* the third machine line: struck, then a ghost once the rewrite leads */
  const sweep = smooth((c - 0.36) / 0.18);
  const rewritten = smooth((c - 0.66) / 0.12);
  if (Math.abs(ny - STRUCK_LINE.y) < 0.03 && nx > 0.1 && nx < 0.72) {
    out = Math.max(out, 0.85 * (1 - 0.62 * rewritten));
  }
  /* the strike bar: a solid horizontal rule through the line */
  if (
    sweep > 0.2 &&
    Math.abs(ny - STRUCK_LINE.y) < 0.013 &&
    nx < 0.1 + sweep * 0.62
  ) {
    out = Math.max(out, 0.9);
  }
  /* the person's rewrite: brighter, resolving beneath, leading */
  if (
    rewritten > 0.2 &&
    Math.abs(ny - REWRITE_LINE.y) < 0.034 &&
    nx > 0.14 &&
    nx < 0.14 + rewritten * 0.62
  ) {
    out = Math.max(out, 0.88 + 0.1 * Math.sin(t * 0.7 + nx * 20));
  }
  return out;
}

function revisionGlyphAt(t: number, nx: number, ny: number): number {
  const c = cyc(t, 40, 0.82);
  const sweep = smooth((c - 0.36) / 0.14);
  /* the bar is drawn in the densest glyph */
  if (
    sweep > 0.2 &&
    Math.abs(ny - STRUCK_LINE.y) < 0.013 &&
    nx < 0.1 + sweep * 0.62
  ) {
    return 4;
  }
  return -1;
}

function revisionDisplace(t: number, nx: number, ny: number): [number, number] {
  /* struck glyphs lift off their baseline just behind the bar */
  const c = cyc(t, 40, 0.82);
  const sweep = smooth((c - 0.36) / 0.14);
  if (
    sweep > 0.2 &&
    sweep < 0.85 &&
    Math.abs(ny - STRUCK_LINE.y) < 0.05 &&
    nx < 0.1 + sweep * 0.62 &&
    nx > 0.1 + sweep * 0.62 - 0.08
  ) {
    return [0, sweep * 2.4 * Math.sin(nx * 60 + t * 4)];
  }
  return [0, 0];
}

/* --------------------------------------------------------------
   03 · INVISIBLE INTERFACES — presence, absence, return.
   A binary field with crisp rectangular voids: work regions
   empty quickly, hold their absence, and resettle with a short
   over-resolve flash — the material briefly brighter on its
   return, evidence that something came back. 0 1 belongs to
   this project alone.
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
    /* absence opens fast, holds, then the field returns with a short
       over-resolve — brighter for a moment, then settled */
    const gone = env(c, 0.2, 0.52, 0.08);
    const returned = 1 - env(c, 0.56, 0.72, 0.08);
    if (gone <= 0 && returned >= 1) continue;
    const q = region.q;
    const dx = Math.max(0, Math.abs(nx - (q.x + q.w / 2)) - q.w / 2);
    const dy = Math.max(0, Math.abs(ny - (q.y + q.h / 2)) - q.h / 2);
    const hold = 1 - smooth(Math.min(1, Math.hypot(dx, dy) / (q.feather ?? 0.05)));
    out *= 1 - gone * hold;
    out += returned * hold * 0.25;
  }
  return Math.min(1, out);
}

/* --------------------------------------------------------------
   04 · INTERACTION ATLAS — a rule changing under pressure.
   A structured ladder of authored rules, drawn at full strength:
   each wording run sits on a thin rule line; solid elbow
   connectors carry the rule from case to case; one entry
   branches in two; and a bright pressure pulse travels along
   the current wording — the rule being tested right now. The
   current wording is pigment-led; ancestry stays legible but
   dimmed. The base texture is suppressed so the ladder is the
   whole message.
   -------------------------------------------------------------- */

const LINEAGE_RUNS = [
  { y: 0.14, x0: 0.08, w: 0.4 },
  { y: 0.3, x0: 0.08, w: 0.32 },
  { y: 0.46, x0: 0.08, w: 0.22 },
  { y: 0.46, x0: 0.38, w: 0.22 },
  { y: 0.63, x0: 0.16, w: 0.38 },
  { y: 0.8, x0: 0.24, w: 0.34 },
] as const;
const LINEAGE_COUNT = 6;

function lineageState(t: number): { current: number; slot: number } {
  /* phase 0.4: the portrait arrives mid-lineage, ancestry present */
  const c = cyc(t, 48, 0.4);
  const current = Math.floor(c * LINEAGE_COUNT);
  return { current, slot: c * LINEAGE_COUNT - current };
}

function lineageShape(v: number, nx: number, ny: number, t: number): number {
  const { current, slot } = lineageState(t);
  let out = v * 0.22;
  for (let i = 0; i < LINEAGE_RUNS.length; i++) {
    const run = LINEAGE_RUNS[i];
    if (i > current) continue;
    const inRun = Math.abs(ny - run.y) < 0.045 && nx > run.x0 && nx < run.x0 + run.w;
    if (!inRun) continue;
    /* the current wording: dense and pigment-led; ancestry dimmed but
       legible */
    const amp = i === current ? 0.98 : 0.56;
    out = Math.max(out, amp * (0.66 + 0.34 * v));
    /* the authored rule: a thin line under each wording */
    if (Math.abs(ny - (run.y + 0.068)) < 0.014 && nx > run.x0 && nx < run.x0 + run.w) {
      out = Math.max(out, i === current ? 0.95 : 0.62);
    }
  }
  /* the pressure pulse: a bright segment travelling along the current
     wording — the rule being tested right now */
  {
    const run = LINEAGE_RUNS[current];
    const pulse = cyc(t, 9);
    const px = run.x0 + pulse * run.w;
    const d = Math.abs(nx - px);
    if (Math.abs(ny - run.y) < 0.05 && d < 0.07) {
      out = Math.max(out, (1 - d / 0.07) * 0.95);
    }
    if (Math.abs(ny - (run.y + 0.068)) < 0.014 && d < 0.07) {
      out = Math.max(out, (1 - d / 0.07) * 0.95);
    }
  }
  /* the elbow connector: a solid vertical drop, then a horizontal
     approach into the next wording's start */
  if (current > 0 && slot < 0.72) {
    const prev = LINEAGE_RUNS[current - 1];
    const run = LINEAGE_RUNS[current];
    const env2 = env(slot, 0.04, 0.9, 0.16);
    if (env2 > 0) {
      const ex = Math.max(prev.x0 + prev.w, run.x0);
      if (Math.abs(nx - ex) < 0.013 && ny > prev.y + 0.04 && ny < run.y - 0.02) {
        out = Math.max(out, env2 * 0.88);
      }
      if (Math.abs(ny - (run.y - 0.036)) < 0.013 && nx > run.x0 - 0.02 && nx < ex) {
        out = Math.max(out, env2 * 0.88);
      }
    }
  }
  return out;
}

/* --------------------------------------------------------------
   05 · FLUXION STUDIOS — pieces aligning into a built thing.
   Scattered signal wanders, then aligns into the site's
   wireframe — frame, top bar with a dense logo block, two
   content columns, footer rule — which holds as the delivered
   structure. Constructed, not terminal-like.
   -------------------------------------------------------------- */

const FLUX_FRAME = { x: 0.14, y: 0.16, w: 0.72, h: 0.66 };

function fluxFormation(t: number): number {
  /* phase 0.45: the portrait arrives with the form already resolved —
     it releases, scatters, and rebuilds over the cycle */
  const c = cyc(t, 34, 0.45);
  return env(c, 0.15, 0.72, 0.12);
}

function fluxShape(v: number, nx: number, ny: number, t: number): number {
  const f = fluxFormation(t);
  const r = FLUX_FRAME;
  const inX = nx > r.x && nx < r.x + r.w;
  const inY = ny > r.y && ny < r.y + r.h;
  const bx = Math.min(Math.abs(nx - r.x), Math.abs(nx - (r.x + r.w)));
  const by = Math.min(Math.abs(ny - r.y), Math.abs(ny - (r.y + r.h)));
  const hash = Math.sin(nx * 619.7 + ny * 311.3) * 43758.5453;
  const frac = hash - Math.floor(hash);
  /* loose fragments stay visible while the matter is unformed */
  let out = Math.max(v * (0.75 + 0.35 * f), (1 - f) * 0.55 * (frac > 0.78 ? 1 : 0));
  if (inX && inY) {
    /* the wireframe: frame edges, top bar, column rule, footer bar */
    const barY = r.y + 0.1;
    const footY = r.y + r.h - 0.08;
    const colX = r.x + r.w * 0.52;
    const onRule =
      bx < 0.018 ||
      by < 0.018 ||
      (inX && Math.abs(ny - barY) < 0.016) ||
      (inX && Math.abs(ny - footY) < 0.016) ||
      (Math.abs(nx - colX) < 0.014 && ny > barY && ny < footY);
    /* the logo block: a dense square at the frame's top-left */
    const logo =
      nx > r.x + 0.03 &&
      nx < r.x + 0.15 &&
      ny > barY + 0.035 &&
      ny < barY + 0.155;
    if (onRule) {
      out = Math.max(out, f * (0.92 + 0.08 * v));
    } else if (logo && ny < footY) {
      out = Math.max(out, f * 0.85);
    } else if (inX && inY && ny > barY && ny < footY) {
      /* two content rows inside the built surface */
      const rowA =
        Math.abs(ny - (barY + 0.17)) < 0.03 && nx > r.x + 0.19 && nx < colX - 0.03;
      const rowB =
        Math.abs(ny - (barY + 0.17)) < 0.03 && nx > colX + 0.03 && nx < r.x + r.w - 0.02;
      const rowC =
        Math.abs(ny - (barY + 0.3)) < 0.03 && nx > r.x + 0.19 && nx < colX - 0.03;
      if (rowA || rowB || rowC) {
        out = Math.max(out, f * (0.62 + 0.28 * v));
      } else {
        /* the delivered surface stays calm */
        out = Math.max(out, f * v * 0.35);
      }
    }
  }
  return out;
}

function fluxDisplace(t: number, nx: number, ny: number): [number, number] {
  /* unformed matter wanders gently; formed structure holds place */
  const f = fluxFormation(t);
  const amp = (1 - f) * 5;
  return [
    Math.sin(t * 0.42 + (nx * 9 + ny * 5) * 4.1) * amp,
    Math.cos(t * 0.35 + (nx * 6 + ny * 9) * 4.3) * amp,
  ];
}

/* --------------------------------------------------------------
   06 · DAYNERO — many small spending decisions, one daily amount.
   Transaction fragments enter from the edges, compress as they
   travel, and are absorbed between two stable rules; between the
   rules one clear amount holds, ticking to a new value once per
   cycle. Financial noise resolving into one useful number.
   -------------------------------------------------------------- */

/* glyph set: ·:+*# then 0-9 — the ambient field only ever resolves
   into the marks (indices 0-4); digits belong to the amount alone */
const NUMBER_GLYPHS = "·:+*#0123456789";

const NUMBER_RULES = [
  { y: 0.3, x0: 0.18, w: 0.64 },
  { y: 0.62, x0: 0.18, w: 0.64 },
] as const;
const NUMBER_CORE = { x0: 0.32, x1: 0.68, y0: 0.38, y1: 0.55 };
/* the amount reads as three digit cells; '824' → glyph indices 13,7,9 */
const AMOUNT_A = [13, 7, 9];
const AMOUNT_B = [13, 5, 14]; /* '809' — the cycle's other value */
const TX_SLOTS = [
  { y: 0.38, from: "left", phase: 0.02 },
  { y: 0.54, from: "right", phase: 0.2 },
  { y: 0.44, from: "left", phase: 0.38 },
  { y: 0.48, from: "right", phase: 0.56 },
  { y: 0.42, from: "left", phase: 0.72 },
  { y: 0.52, from: "left", phase: 0.88 },
] as const;

function numberAmountIndex(t: number, nx: number): number {
  /* which digit column: three cells inside the core, or -1 */
  const c = cyc(t, 24, 0.4);
  const tick = env(c, 0.52, 0.66, 0.05);
  const value = tick > 0.5 ? AMOUNT_B : AMOUNT_A;
  for (let i = 0; i < value.length; i++) {
    const cx = 0.4 + i * 0.1;
    if (Math.abs(nx - cx) < 0.05) return value[i];
  }
  return -1;
}

function numberShape(v: number, nx: number, ny: number, t: number): number {
  let out = v * 0.25;
  /* the two rules: stable, always present */
  for (const rule of NUMBER_RULES) {
    if (Math.abs(ny - rule.y) < 0.014 && nx > rule.x0 && nx < rule.x0 + rule.w) {
      out = Math.max(out, 0.62);
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
    if (digit >= 0 && Math.abs(ny - 0.465) < 0.075) {
      out = Math.max(out, 0.97);
    } else {
      out = Math.max(out, 0.36 + 0.07 * Math.sin(t * 0.6));
    }
  }
  /* transactions: ledger rows slide along the rules band toward the
     amount and are absorbed at its edges */
  for (const slot of TX_SLOTS) {
    const c = cyc(t, 22, slot.phase);
    const travel = Math.min(1, c / 0.44);
    if (travel >= 1) continue;
    const xEdge = slot.from === "left" ? 0.02 : 0.98;
    const x = lerp(xEdge, xEdge + (slot.from === "left" ? 0.3 : -0.3), smooth(travel));
    const width = 0.085 * (1 - travel * 0.7);
    if (Math.abs(ny - slot.y) < 0.02 && Math.abs(nx - x) < width / 2) {
      out = Math.max(out, 0.6 * (0.4 + 0.6 * travel) * (1 - smooth((travel - 0.85) / 0.15)));
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
    if (digit >= 0 && Math.abs(ny - 0.465) < 0.07) return digit;
    return 3; /* '*' fill inside the block, digits over it */
  }
  return -1;
}

/* -------------------------------------------------------------- */

const PORTRAITS: Record<string, PortraitConfig> = {
  "design-or-disaster": {
    cell: 11,
    seed: 41,
    ambient: 0.44,
    tune: [0.44, 2.0],
    ground: "#150f0c",
    pointerRadius: 8,
    shape: evidenceShape,
    glyphAt: evidenceGlyphAt,
    color: (t) =>
      t >= 0.92
        ? "rgba(239, 74, 53, 0.9)"
        : `rgba(255, 246, 232, ${0.07 + 0.24 * t})`,
  },
  pentimento: {
    glyphs: "·:+*#/x",
    cell: 12,
    seed: 57,
    ambient: 0.32,
    drift: 0.25,
    ground: "#3b1830",
    shape: revisionShape,
    glyphAt: revisionGlyphAt,
    displace: revisionDisplace,
    color: (t) =>
      t >= 0.9
        ? "rgba(255, 244, 250, 0.85)"
        : `rgba(247, 236, 245, ${0.08 + 0.3 * t})`,
  },
  "invisible-interfaces": {
    glyphs: "01",
    cell: 13,
    seed: 23,
    ambient: 0.48,
    tune: [0.42, 2.0],
    ground: "#0f0e0a",
    shape: absenceShape,
    color: (t) => `rgba(230, 171, 63, ${0.11 + 0.4 * t})`,
  },
  atlas: {
    cell: 10,
    seed: 79,
    ambient: 0.3,
    ground: "#dcece8",
    shape: lineageShape,
    color: (t) =>
      t >= 0.85
        ? "rgba(18, 97, 90, 0.85)"
        : `rgba(13, 24, 23, ${0.17 + 0.3 * t})`,
  },
  "fluxion-studios": {
    cell: 13,
    seed: 61,
    ambient: 0.52,
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
    cell: 13,
    seed: 83,
    ambient: 0.3,
    ground: "#161c0d",
    shape: numberShape,
    glyphAt: numberGlyphAt,
    color: (t) =>
      t >= 0.9
        ? "rgba(201, 242, 78, 0.95)"
        : `rgba(185, 221, 85, ${0.08 + 0.3 * t})`,
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
