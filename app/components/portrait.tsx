"use client";

import { type CSSProperties } from "react";
import { ROOM_WORLDS } from "../data/room-worlds";
import { SignalField, type Quiet } from "./signal-field";

/**
 * PROJECT PORTRAITS — tiny moving ASCII diagrams of each project's core
 * behaviour.
 *
 * Every panel follows one loop: setup → action → resolved state → hold →
 * reset, drawn from the same engine as the folio's signal (one canvas per
 * portrait, IO/visibility/reduced-motion handled by the engine; under
 * reduced motion the script freezes at a composed resting state). The
 * structure is the message: a recognizable base layout, one clear action,
 * one legible resolved state. Ambient texture stays subordinate so the
 * diagram reads in one or two seconds.
 *
 * The set shares one drawing vocabulary — frame, rule, text row, block,
 * terminal, connector, under-rule — so six unlike behaviours still read
 * as one family. Each portrait's cycle is phase-offset so the
 * reduced-motion freeze lands on its resolved state, never on an empty
 * setup frame.
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

/* -------- the shared drawing vocabulary --------
   Every portrait composes from the same marks: a rect test, an edge
   distance (frames), a rule segment, a text row (word gaps from a
   stable per-column hash) and a slow blink. Keeping the marks identical
   across projects is what makes six unlike behaviours read as one
   authored family. */

const inRect = (
  nx: number,
  ny: number,
  x: number,
  y: number,
  w: number,
  h: number,
): boolean => nx > x && nx < x + w && ny > y && ny < y + h;

/** distance to a rect's nearest edge — frames render where it is small */
const edgeDist = (
  nx: number,
  ny: number,
  x: number,
  y: number,
  w: number,
  h: number,
): number =>
  Math.min(
    Math.abs(nx - x),
    Math.abs(nx - (x + w)),
    Math.abs(ny - y),
    Math.abs(ny - (y + h)),
  );

/** a horizontal rule segment: y-centred, half-height thick */
const inSeg = (
  nx: number,
  ny: number,
  x0: number,
  x1: number,
  y: number,
  half: number,
): boolean => ny > y - half && ny < y + half && nx > x0 && nx < x1;

/** a stable per-column hash → word-gap texture for text rows */
const columnHash = (nx: number, salt: number): number => {
  const h = Math.sin(Math.floor(nx * 22) * 137.31 + salt * 61.7) * 43758.5453;
  return h - Math.floor(h);
};

/** a text row's amplitude: word-gap columns drop to a faint residue */
const textRow = (nx: number, salt: number): number =>
  columnHash(nx, salt) > 0.24 ? 1 : 0.1;

/** one slow blink, per-element phase */
const blink = (t: number, rate: number, phase: number): number =>
  0.5 + 0.5 * Math.sin(t * rate + phase);

/* --------------------------------------------------------------
   01 · DESIGN OR DISASTER — point before you judge.
   A broad, ambiguous field; one region resolves to a crisp
   evidence plate while the rest stays contested, and a clear
   crosshair travels in and settles onto it. The selected region
   moves between cycles, so no answer becomes permanent. Phase
   0.30: the freeze lands on a resolved plate, crosshair settled.
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

function evidencePhase(t: number): number {
  return cyc(t, 30, 0.3);
}

function evidenceShape(v: number, nx: number, ny: number, t: number): number {
  const c = evidencePhase(t);
  const slot = Math.min(2, Math.floor(c * 3));
  const u = c * 3 - slot;
  const region = EVIDENCE_REGIONS[slot];
  const sel = env(u, 0.12, 0.9, 0.12);
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
  const marker = env(u, 0.06, 0.92, 0.08);
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
  const c = evidencePhase(t);
  const slot = Math.min(2, Math.floor(c * 3));
  const u = c * 3 - slot;
  const marker = env(u, 0.06, 0.92, 0.08);
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
   02 · PENTIMENTO — the machine drafts, the person rewrites.
   Three machine rows stand as the fresh draft; a dense strike —
   rows of x — sweeps across the third; the struck line drops to a
   faint ghost; the correction writes itself beneath in the
   heaviest glyph of the set, underlined, and leads for the rest
   of the cycle. Loop: draft → crossed out → corrected → hold →
   reset to the fresh draft.
   -------------------------------------------------------------- */

const REVISION_PERIOD = 14;

const REVISION_ROWS = [
  { y: 0.22, x0: 0.1, x1: 0.86, salt: 3 },
  { y: 0.34, x0: 0.1, x1: 0.62, salt: 7 },
] as const;
const REVISION_STRUCK = { y: 0.46, x0: 0.1, x1: 0.74, salt: 11 };
const REVISION_NEW = { y: 0.64, x0: 0.1, x1: 0.82, salt: 13 };
const REVISION_UNDER = { y: 0.715, x0: 0.1, x1: 0.8 };

function revisionPhase(t: number): number {
  return cyc(t, REVISION_PERIOD, 0.72);
}

function revisionShape(v: number, nx: number, ny: number, t: number): number {
  const c = revisionPhase(t);
  const strike = smooth((c - 0.12) / 0.16);
  const rewrite = smooth((c - 0.44) / 0.14);
  const reset = smooth((c - 0.9) / 0.06);
  const ghost = strike * (1 - reset);
  let out = v * 0.14;

  /* the standing machine draft */
  for (const row of REVISION_ROWS) {
    if (
      inSeg(nx, ny, row.x0, row.x1, row.y, 0.026) &&
      textRow(nx, row.salt) > 0.5
    ) {
      out = Math.max(out, 0.82);
    }
  }

  /* the struck line: full before the bar, a ghost once crossed */
  if (
    inSeg(nx, ny, REVISION_STRUCK.x0, REVISION_STRUCK.x1, REVISION_STRUCK.y, 0.026) &&
    textRow(nx, REVISION_STRUCK.salt) > 0.5
  ) {
    out = Math.max(out, lerp(0.84, 0.16, ghost));
  }

  /* the strike bar: a dense rule of x sweeping the line */
  if (
    strike > 0.04 &&
    strike < 1 &&
    Math.abs(ny - REVISION_STRUCK.y) < 0.017 &&
    nx < REVISION_STRUCK.x0 + strike * (REVISION_STRUCK.x1 - REVISION_STRUCK.x0)
  ) {
    out = Math.max(out, 0.98);
  }

  /* the person's correction: the heaviest line in the panel,
     underlined, writing itself in behind its own leading edge */
  if (rewrite > 0.1) {
    const lead =
      REVISION_NEW.x0 + rewrite * (REVISION_NEW.x1 - REVISION_NEW.x0);
    const vis = 1 - reset * 0.9;
    if (
      inSeg(nx, ny, REVISION_NEW.x0, lead, REVISION_NEW.y, 0.036) &&
      textRow(nx, REVISION_NEW.salt) > 0.5
    ) {
      out = Math.max(out, (0.94 + 0.05 * Math.sin(t * 0.9 + nx * 18)) * vis);
    }
    /* its underline: the weight of the corrected sentence */
    if (inSeg(nx, ny, REVISION_UNDER.x0, lead * 0.98, REVISION_UNDER.y, 0.016)) {
      out = Math.max(out, 0.9 * vis);
    }
  }
  return out;
}

function revisionGlyphAt(t: number, nx: number, ny: number): number {
  const c = revisionPhase(t);
  const strike = smooth((c - 0.12) / 0.16);
  /* the strike: x, the hand crossing the line out */
  if (
    strike > 0.04 &&
    strike < 1 &&
    Math.abs(ny - REVISION_STRUCK.y) < 0.018 &&
    nx < REVISION_STRUCK.x0 + strike * (REVISION_STRUCK.x1 - REVISION_STRUCK.x0)
  ) {
    return 6;
  }
  /* the correction: the densest glyph, and its underline */
  const rewrite = smooth((c - 0.44) / 0.14);
  if (rewrite > 0.2) {
    const lead = REVISION_NEW.x0 + rewrite * (REVISION_NEW.x1 - REVISION_NEW.x0);
    if (Math.abs(ny - REVISION_NEW.y) < 0.038 && nx > REVISION_NEW.x0 && nx < lead) {
      return 4;
    }
    if (Math.abs(ny - REVISION_UNDER.y) < 0.018 && nx > REVISION_UNDER.x0 && nx < lead * 0.98) {
      return 4;
    }
  }
  /* the machine draft renders as rows of + */
  for (const row of REVISION_ROWS) {
    if (Math.abs(ny - row.y) < 0.028 && nx > row.x0 && nx < row.x1) return 2;
  }
  if (
    Math.abs(ny - REVISION_STRUCK.y) < 0.028 &&
    nx > REVISION_STRUCK.x0 &&
    nx < REVISION_STRUCK.x1
  ) {
    return 2;
  }
  return -1;
}

function revisionDisplace(t: number, nx: number, ny: number): [number, number] {
  /* struck glyphs lift off their baseline just behind the bar */
  const c = revisionPhase(t);
  const strike = smooth((c - 0.12) / 0.16);
  const lead = REVISION_STRUCK.x0 + strike * (REVISION_STRUCK.x1 - REVISION_STRUCK.x0);
  if (
    strike > 0.15 &&
    strike < 0.9 &&
    Math.abs(ny - REVISION_STRUCK.y) < 0.05 &&
    nx < lead &&
    nx > lead - 0.09
  ) {
    return [0, strike * 2.4 * Math.sin(nx * 60 + t * 4)];
  }
  return [0, 0];
}

/* --------------------------------------------------------------
   03 · INVISIBLE INTERFACES — leave, it keeps working, return
   with the receipt.
   A framed work plate carries a title rule and three content
   rows; a five-cell ticker in its right column keeps blinking
   while the rows empty out; the rows resolve back, then a
   separate framed receipt — all 1s, its ticks filling in
   sequence — draws itself beneath as the record of what happened
   while the page was away. Two objects: the working system and
   the returned evidence. Phase 0.80: the freeze lands on plate
   restored + receipt drawn.
   ---------------------------------------------------------------- */

const ABSENCE_PLATE = { x: 0.1, y: 0.1, w: 0.8, h: 0.44 };
const ABSENCE_TITLE = { x: 0.14, x1: 0.5, y: 0.175 };
const ABSENCE_ROWS = [
  { y: 0.26, x0: 0.14, x1: 0.72, salt: 5 },
  { y: 0.33, x0: 0.14, x1: 0.64, salt: 17 },
  { y: 0.4, x0: 0.14, x1: 0.68, salt: 29 },
] as const;
const ABSENCE_TICKER = { x: 0.845, y0: 0.2, dy: 0.06, n: 5 };
const ABSENCE_RECEIPT = { x: 0.4, y: 0.62, w: 0.5, h: 0.3 };
const ABSENCE_TICKS = [0.72, 0.77, 0.82, 0.87];

function absencePhase(t: number): number {
  return cyc(t, 16, 0.8);
}

function absenceShape(v: number, nx: number, ny: number, t: number): number {
  const c = absencePhase(t);
  const gone = smooth((c - 0.18) / 0.06) * (1 - smooth((c - 0.5) / 0.06));
  const flash = env(c, 0.5, 0.6, 0.05);
  const receipt = smooth((c - 0.58) / 0.14);
  let out = v * 0.1;

  /* the work plate: frame, title rule, content rows */
  const p = ABSENCE_PLATE;
  if (inRect(nx, ny, p.x, p.y, p.w, p.h)) {
    const pe = edgeDist(nx, ny, p.x, p.y, p.w, p.h);
    if (pe < 0.026) {
      out = Math.max(out, lerp(0.95, 0.45, gone));
    } else if (
      inSeg(nx, ny, ABSENCE_TITLE.x, ABSENCE_TITLE.x1, ABSENCE_TITLE.y, 0.022)
    ) {
      out = Math.max(out, lerp(0.72, 0.35, gone));
    }
    for (const row of ABSENCE_ROWS) {
      if (
        inSeg(nx, ny, row.x0, row.x1, row.y, 0.026) &&
        textRow(nx, row.salt) > 0.5
      ) {
        out = Math.max(out, lerp(0.86, 0.05, gone) + flash * 0.25);
      }
    }
  }

  /* the ticker: five cells that keep working through the absence —
     the one thing alive while the page is away */
  for (let i = 0; i < ABSENCE_TICKER.n; i++) {
    const ty = ABSENCE_TICKER.y0 + i * ABSENCE_TICKER.dy;
    if (
      Math.abs(nx - ABSENCE_TICKER.x) < 0.018 &&
      Math.abs(ny - ty) < 0.024
    ) {
      out = Math.max(
        out,
        (0.34 + 0.42 * gone) * (0.4 + 0.6 * blink(t, 3.4, i * 1.7)),
      );
    }
  }

  /* the returned receipt: its own framed artifact beneath the plate,
     ticks filling left to right in sequence */
  if (receipt > 0.05) {
    const r = ABSENCE_RECEIPT;
    if (inRect(nx, ny, r.x, r.y, r.w, r.h)) {
      const frameA = smooth((receipt - 0.05) / 0.3);
      const re = edgeDist(nx, ny, r.x, r.y, r.w, r.h);
      if (re < 0.026) {
        out = Math.max(out, 0.95 * frameA);
      }
      if (inSeg(nx, ny, r.x + 0.04, r.x + 0.3, r.y + 0.075, 0.022)) {
        out = Math.max(out, 0.6 * frameA);
      }
      for (let i = 0; i < ABSENCE_TICKS.length; i++) {
        const step = smooth((receipt - (0.3 + i * 0.14)) / 0.14);
        if (step <= 0) continue;
        const x1 = r.x + 0.05 + (0.34 + (i % 2) * 0.08) * step;
        if (inSeg(nx, ny, r.x + 0.05, x1, ABSENCE_TICKS[i], 0.024)) {
          out = Math.max(out, 0.88);
        }
      }
    }
  }
  return out;
}

function absenceGlyphAt(t: number, nx: number, ny: number): number {
  /* the receipt and the ticker are records: every cell a 1 */
  if (
    Math.abs(nx - ABSENCE_TICKER.x) < 0.016 &&
    ny > ABSENCE_TICKER.y0 - 0.03 &&
    ny < ABSENCE_TICKER.y0 + (ABSENCE_TICKER.n - 1) * ABSENCE_TICKER.dy + 0.03
  ) {
    return 1;
  }
  const r = ABSENCE_RECEIPT;
  if (inRect(nx, ny, r.x, r.y, r.w, r.h)) return 1;
  return -1;
}

/* --------------------------------------------------------------
   04 · INTERACTION ATLAS — a rule, tested, revised.
   The original rule runs across the top; three elbow connectors
   drop into three unlike pressure cases, each with its own
   annotation rule: one holds (a settled terminal), one fractures
   (the bar, terminal and annotation visibly break), one refines
   (the bar extends thicker past its old end). Each case then
   feeds a vertical collector down into the revised rule, which
   resolves bright and full-width with a solid end node — the
   lineage settling — while the test pulse travels it and the
   original rule recedes. Phase 0.86: the freeze lands with the
   whole tree drawn and the revised rule held.
   ---------------------------------------------------------------- */

const ATLAS_ROOT = { y: 0.1, x0: 0.08, x1: 0.8 };
const ATLAS_ORIGIN = { x0: 0.08, x1: 0.125 };
const ATLAS_CASES = [
  { y: 0.24, x0: 0.1, w: 0.3, drop: 0.16, outcome: "hold" as const, at: 0.1 },
  { y: 0.4, x0: 0.3, w: 0.32, drop: 0.36, outcome: "fracture" as const, at: 0.16 },
  { y: 0.56, x0: 0.5, w: 0.24, drop: 0.56, outcome: "refine" as const, at: 0.22 },
] as const;
const ATLAS_UNDER = [
  { y: 0.295, x0: 0.1, x1: 0.32 },
  { y: 0.455, x0: 0.3, x1: 0.52 },
  { y: 0.615, x0: 0.5, x1: 0.72 },
] as const;
const ATLAS_RULE = { y: 0.8, x0: 0.08, x1: 0.86 };
const ATLAS_NODE = { x0: 0.86, x1: 0.905 };
const ATLAS_PERIOD = 18;

function atlasPhase(t: number): number {
  return cyc(t, ATLAS_PERIOD, 0.86);
}

function atlasShape(v: number, nx: number, ny: number, t: number): number {
  const c = atlasPhase(t);
  /* the whole tree releases together at the cycle end — a soft reset,
     never a hard cut */
  const release = 1 - smooth((c - 0.96) / 0.04);
  let out = v * 0.06 * release;
  const rootOn = smooth((c - 0.02) / 0.06);
  const ruleOn = smooth((c - 0.56) / 0.08) * (1 - smooth((c - 0.97) / 0.04));

  /* the original rule: full strength until the revision takes over,
     then receding to a remembered line; a solid origin block anchors
     its start — the mark the end node will answer */
  if (rootOn > 0) {
    const dim = lerp(0.94, 0.55, smooth((c - 0.6) / 0.1));
    if (
      inSeg(
        nx,
        ny,
        ATLAS_ROOT.x0,
        ATLAS_ROOT.x0 + (ATLAS_ROOT.x1 - ATLAS_ROOT.x0) * rootOn,
        ATLAS_ROOT.y,
        0.028,
      )
    ) {
      out = Math.max(out, dim * release);
    }
    if (
      nx > ATLAS_ORIGIN.x0 &&
      nx < ATLAS_ORIGIN.x1 &&
      Math.abs(ny - ATLAS_ROOT.y) < 0.04 * rootOn
    ) {
      out = Math.max(out, release);
    }
  }

  for (let i = 0; i < ATLAS_CASES.length; i++) {
    const k = ATLAS_CASES[i];
    const appear = smooth((c - k.at) / 0.07);
    if (appear <= 0) continue;

    /* the elbow: vertical drop from the rule, then into the case bar */
    if (Math.abs(nx - k.drop) < 0.018 && ny > ATLAS_ROOT.y && ny < k.y) {
      out = Math.max(out, 0.82 * appear * release);
    }

    const end = k.x0 + k.w;
    const drawn = k.x0 + k.w * appear;
    const gap =
      k.outcome === "fracture" ? smooth((c - (k.at + 0.1)) / 0.06) : 0;

    /* the case bar — a fractured case renders as two halves with a gap */
    const broken = gap > 0 && nx > end - 0.12 && nx < end - 0.08;
    if (!broken && inSeg(nx, ny, k.x0, drawn, k.y, 0.028)) {
      out = Math.max(out, (0.72 + 0.2 * v) * appear * release);
    }
    if (broken && gap < 0.5) {
      out = Math.max(out, 0.5 * appear * release);
    }

    /* the case's outcome terminal */
    const termOn = smooth((c - (k.at + 0.06)) / 0.05);
    if (termOn > 0) {
      if (k.outcome === "hold") {
        /* settled: a solid end block */
        if (nx > end - 0.008 && nx < end + 0.045 && Math.abs(ny - k.y) < 0.036) {
          out = Math.max(out, 0.95 * termOn * release);
        }
      } else if (k.outcome === "fracture") {
        /* the terminal splits with the bar */
        if (
          nx > end - 0.045 &&
          nx < end + 0.01 &&
          Math.abs(ny - (k.y + gap * 0.02)) < 0.03
        ) {
          out = Math.max(out, 0.9 * termOn * release * (1 - gap * 0.35));
        }
      } else {
        /* refined: the bar extends thicker past its old end */
        const ext = smooth((c - (k.at + 0.12)) / 0.08);
        if (ext > 0) {
          if (inSeg(nx, ny, end, end + ext * 0.1, k.y, 0.03)) {
            out = Math.max(out, 0.9 * ext * release);
          }
          if (nx > end + 0.075 && nx < end + 0.125 && Math.abs(ny - k.y) < 0.036) {
            out = Math.max(out, 0.95 * ext * release);
          }
        }
      }
    }

    /* the case's annotation rule, breaking where its case broke */
    const annot = smooth((c - (k.at + 0.04)) / 0.06);
    if (annot > 0) {
      const u = ATLAS_UNDER[i];
      const annotBroken = gap > 0 && nx > u.x0 + 0.16 && nx < u.x0 + 0.2;
      if (
        !annotBroken &&
        inSeg(nx, ny, u.x0, u.x0 + (u.x1 - u.x0) * annot, u.y, 0.016)
      ) {
        out = Math.max(out, 0.6 * annot * release);
      }
    }

    /* the collector: each case feeds the revised rule below */
    const feed = smooth((c - (0.42 + i * 0.04)) / 0.06);
    if (feed > 0 && Math.abs(nx - k.drop) < 0.016) {
      const fy = lerp(ATLAS_UNDER[i].y, ATLAS_RULE.y, feed);
      if (ny > ATLAS_UNDER[i].y && ny < fy) {
        out = Math.max(out, 0.68 * release);
      }
    }
  }

  /* the revised rule: resolves bright and full-width, with the test
     pulse travelling it and a solid end node — the lineage settled */
  if (ruleOn > 0) {
    if (
      inSeg(
        nx,
        ny,
        ATLAS_RULE.x0,
        ATLAS_RULE.x0 + (ATLAS_RULE.x1 - ATLAS_RULE.x0) * ruleOn,
        ATLAS_RULE.y,
        0.028,
      )
    ) {
      out = Math.max(out, 0.97 * release);
    }
    const nodeOn = smooth((c - 0.66) / 0.06);
    if (
      nodeOn > 0 &&
      nx > ATLAS_NODE.x0 &&
      nx < ATLAS_NODE.x1 &&
      Math.abs(ny - ATLAS_RULE.y) < 0.05 * nodeOn
    ) {
      out = Math.max(out, release);
    }
    const pulse = cyc(t, 4.5);
    const px = ATLAS_RULE.x0 + pulse * (ATLAS_RULE.x1 - ATLAS_RULE.x0);
    if (Math.abs(ny - ATLAS_RULE.y) < 0.042 && Math.abs(nx - px) < 0.045) {
      out = Math.max(out, 0.98 * release);
    }
  }
  return out;
}

function atlasGlyphAt(t: number, nx: number, ny: number): number {
  const c = atlasPhase(t);
  /* connectors and collectors read as : — thin dotted lines */
  for (let i = 0; i < ATLAS_CASES.length; i++) {
    const k = ATLAS_CASES[i];
    if (
      smooth((c - k.at) / 0.07) > 0 &&
      Math.abs(nx - k.drop) < 0.018 &&
      ny > ATLAS_ROOT.y &&
      ny < k.y
    ) {
      return 1;
    }
    const feed = smooth((c - (0.42 + i * 0.04)) / 0.06);
    if (
      feed > 0 &&
      Math.abs(nx - k.drop) < 0.016 &&
      ny > ATLAS_UNDER[i].y &&
      ny < ATLAS_RULE.y
    ) {
      return 1;
    }
    /* a junction mark where each drop leaves the rule */
    if (Math.abs(nx - k.drop) < 0.02 && Math.abs(ny - ATLAS_ROOT.y) < 0.028) {
      return 2;
    }
  }
  /* annotation rules read as : rows too */
  for (const u of ATLAS_UNDER) {
    if (Math.abs(ny - u.y) < 0.016 && nx > u.x0 && nx < u.x1) return 1;
  }
  /* solids: the outcome terminals and the end node */
  for (const k of ATLAS_CASES) {
    const end = k.x0 + k.w;
    if (
      Math.abs(ny - k.y) < 0.05 &&
      nx > end - 0.05 &&
      nx < end + 0.13 &&
      smooth((c - (k.at + 0.06)) / 0.05) > 0.5
    ) {
      return 4;
    }
  }
  if (
    Math.abs(ny - ATLAS_RULE.y) < 0.052 &&
    nx > ATLAS_NODE.x0 &&
    nx < ATLAS_NODE.x1 &&
    smooth((c - 0.66) / 0.06) > 0.5
  ) {
    return 4;
  }
  return -1;
}

/* --------------------------------------------------------------
   05 · FLUXION STUDIOS — the delivery: a site, and its companion.
   Loose pieces drift in the open; they slide one at a time into a
   desktop layout (logo, nav, display heading, sub-rows, image
   block, caption, footer), the browser frame snaps shut with one
   flash; a mobile companion then assembles at the right — top
   bar, screen block, rows — and its own frame snaps; both hold
   as one delivered system. Phase 0.88: the freeze lands on the
   shipped pair.
   ---------------------------------------------------------------- */

const FLUX_DESK = { x: 0.04, y: 0.07, w: 0.54, h: 0.86 };
const FLUX_MOBILE = { x: 0.68, y: 0.24, w: 0.26, h: 0.6 };
const FLUX_PERIOD = 16;

type FluxPiece = {
  /** the piece's assembled rectangle */
  x: number;
  y: number;
  w: number;
  h: number;
  kind: "bar" | "rows" | "block";
  /** its scattered start position (top-left corner) */
  sx: number;
  sy: number;
  /** the cycle position at which the piece locks into its slot */
  at: number;
};

/* the wordmark plate is a wide, short strip (~5:1): every piece keeps
   at least one glyph row of height so nothing aliases out of the grid */
const FLUX_PIECES: FluxPiece[] = [
  { x: 0.08, y: 0.13, w: 0.035, h: 0.055, kind: "block", sx: 0.42, sy: 0.0, at: 0.08 },
  { x: 0.135, y: 0.13, w: 0.2, h: 0.055, kind: "bar", sx: 0.72, sy: 0.06, at: 0.11 },
  { x: 0.08, y: 0.26, w: 0.4, h: 0.075, kind: "bar", sx: 0.06, sy: 0.92, at: 0.17 },
  { x: 0.08, y: 0.4, w: 0.3, h: 0.06, kind: "rows", sx: 0.66, sy: 0.5, at: 0.22 },
  { x: 0.08, y: 0.49, w: 0.42, h: 0.24, kind: "block", sx: 0.3, sy: 0.0, at: 0.28 },
  { x: 0.08, y: 0.78, w: 0.34, h: 0.06, kind: "rows", sx: 0.85, sy: 0.34, at: 0.34 },
  { x: 0.08, y: 0.865, w: 0.42, h: 0.05, kind: "bar", sx: 0.16, sy: 0.55, at: 0.4 },
  { x: 0.71, y: 0.31, w: 0.13, h: 0.055, kind: "bar", sx: 0.55, sy: 0.88, at: 0.52 },
  { x: 0.71, y: 0.4, w: 0.2, h: 0.22, kind: "block", sx: 0.92, sy: 0.06, at: 0.58 },
  { x: 0.71, y: 0.66, w: 0.17, h: 0.06, kind: "rows", sx: 0.28, sy: 0.1, at: 0.64 },
  { x: 0.71, y: 0.75, w: 0.14, h: 0.06, kind: "rows", sx: 0.45, sy: 0.3, at: 0.68 },
];

function fluxCycle(t: number): number {
  /* phase 0.88: the reduced-motion freeze lands on the shipped pair */
  return cyc(t, FLUX_PERIOD, 0.88);
}

/* each piece's own formation: it locks into its slot at `at`, holds
   with the structure, and releases back to scatter at the cycle end */
function fluxPiece(p: FluxPiece, t: number, c: number): {
  x: number;
  y: number;
  f: number;
  alpha: number;
} {
  const f = smooth((c - p.at) / 0.14);
  /* loose matter reads as a dimmed fragment — visible while it
     travels, never dimmed to nothing; assembled structure is full */
  const alpha = 0.8 + 0.2 * f;
  const wander = (1 - f) * 0.05;
  const wx = Math.sin(t * 0.5 + p.sx * 9) * wander;
  const wy = Math.cos(t * 0.44 + p.sy * 7) * wander;
  return {
    x: lerp(p.sx + wx, p.x, f),
    y: lerp(p.sy + wy, p.y, f),
    f,
    alpha,
  };
}

function fluxShape(v: number, nx: number, ny: number, t: number): number {
  const c = fluxCycle(t);
  const flash = env(c, 0.46, 0.56, 0.05) + env(c, 0.72, 0.8, 0.04) * 0.8;
  const release = 1 - smooth((c - 0.94) / 0.05);
  let out = v * 0.16;

  /* the loose pieces, each travelling from its scatter to its slot */
  for (const p of FLUX_PIECES) {
    const rect = fluxPiece(p, t, c);
    const inX = nx > rect.x && nx < rect.x + p.w;
    const inY = ny > rect.y && ny < rect.y + p.h;
    if (!inX || !inY) continue;
    let amp =
      (0.42 + 0.58 * rect.f) *
      (p.kind === "bar" ? 0.95 : p.kind === "block" ? 0.66 : 0.78);
    /* the block's inner texture once it settles */
    if (p.kind === "block" && rect.f > 0.9) {
      amp *= columnHash(nx, 5) > 0.3 ? 0.9 : 0.25;
    }
    /* rows get word-gap texture */
    if (p.kind === "rows") amp *= textRow(nx, 9);
    if (amp <= 0.02) continue;
    out = Math.max(out, amp * rect.alpha * release * (0.75 + 0.25 * v));
  }

  /* the two frames snap shut after their own assemblies, flash, hold */
  const frames: Array<{ r: typeof FLUX_DESK; on: number }> = [
    { r: FLUX_DESK, on: smooth((c - 0.46) / 0.08) },
    { r: FLUX_MOBILE, on: smooth((c - 0.72) / 0.08) },
  ];
  for (const { r, on } of frames) {
    if (on <= 0) continue;
    const bx = Math.min(Math.abs(nx - r.x), Math.abs(nx - (r.x + r.w)));
    const by = Math.min(Math.abs(ny - r.y), Math.abs(ny - (r.y + r.h)));
    const inSpan =
      nx > r.x - 0.02 &&
      nx < r.x + r.w + 0.02 &&
      ny > r.y - 0.03 &&
      ny < r.y + r.h + 0.03;
    if (!inSpan || (bx >= 0.022 && by >= 0.03)) continue;
    out = Math.max(out, (0.95 + flash * 0.05) * release * (0.75 + 0.25 * v));
  }
  return out;
}

function fluxDisplace(t: number, nx: number, ny: number): [number, number] {
  /* unformed matter wanders gently; the assembled system holds place */
  const c = fluxCycle(t);
  const f = smooth((c - 0.08) / 0.55);
  const amp = (1 - f) * 2.6;
  return [
    Math.sin(t * 0.42 + (nx * 9 + ny * 5) * 4.1) * amp,
    Math.cos(t * 0.35 + (nx * 6 + ny * 9) * 4.3) * amp,
  ];
}

/* --------------------------------------------------------------
   06 · DAYNERO — many spends, one safe number.
   A budget card fills the panel: frame, label bar, status pip,
   and a large three-digit amount on its own line above a
   baseline rule. Transaction dashes stream in from every edge
   and are absorbed at the well's edge; when the batch lands the
   amount ticks to its new value with one bright beat. The amount
   is the only thing in the panel allowed digits — many pieces of
   data condensing into one actionable number, calmly.
   ---------------------------------------------------------------- */

/* glyph set: ·:+*# then 0-9 — the ambient field only ever resolves
   into the marks (indices 0-4); digits belong to the amount alone */
const NUMBER_GLYPHS = "·:+*#0123456789";

const NUMBER_CARD = { x: 0.14, y: 0.16, w: 0.72, h: 0.68 };
const NUMBER_LABEL = { y: 0.25, x0: 0.19, x1: 0.53 };
const NUMBER_CHIP = { y: 0.25, x0: 0.72, x1: 0.81 };
const NUMBER_WELL = { x0: 0.34, y0: 0.38, x1: 0.66, y1: 0.62 };
const NUMBER_UNDER = { y: 0.59, x0: 0.38, x1: 0.62 };
const AMOUNT_LINE = 0.5;
const AMOUNT_XS = [0.42, 0.5, 0.58];
/** one glyph cell wide — a digit, not a run of digits */
const AMOUNT_CELL = 0.008;
/** two glyph rows tall: the amount reads as one bold display number */
const AMOUNT_ROW = 0.02;
/* the amount reads as three digit cells; '824' → glyph indices 13,7,9 */
const AMOUNT_A = [13, 7, 9];
const AMOUNT_B = [13, 5, 14]; /* '809' — the cycle's other value */
/* eight transaction dashes: starts on every edge, doors around the
   well — they stream in, shrink, and are swallowed by the amount */
const TX_STARTS = [
  { x: 0.02, y: 0.2 },
  { x: 0.98, y: 0.24 },
  { x: 0.02, y: 0.44 },
  { x: 0.98, y: 0.48 },
  { x: 0.04, y: 0.7 },
  { x: 0.96, y: 0.74 },
  { x: 0.16, y: 0.95 },
  { x: 0.86, y: 0.94 },
] as const;
const TX_DOORS = [
  { x: 0.36, y: 0.42 },
  { x: 0.64, y: 0.42 },
  { x: 0.33, y: 0.5 },
  { x: 0.67, y: 0.5 },
  { x: 0.36, y: 0.58 },
  { x: 0.64, y: 0.58 },
  { x: 0.41, y: 0.63 },
  { x: 0.59, y: 0.63 },
] as const;
const TX_WINDOW = 0.44;

function numberPhase(t: number): number {
  return cyc(t, 16, 0.62);
}

function numberAmountIndex(t: number, nx: number): number {
  /* which digit column: three cells on the amount's line, or -1 */
  const c = numberPhase(t);
  const tick = smooth((c - 0.5) / 0.05);
  const value = tick > 0.5 ? AMOUNT_B : AMOUNT_A;
  for (let i = 0; i < value.length; i++) {
    if (Math.abs(nx - AMOUNT_XS[i]) < AMOUNT_CELL) return value[i];
  }
  return -1;
}

function numberShape(v: number, nx: number, ny: number, t: number): number {
  const c = numberPhase(t);
  let out = v * 0.12;
  const r = NUMBER_CARD;
  const beat = env(c, 0.46, 0.56, 0.05);

  /* the budget card: frame, label bar, status pip, amount well */
  if (inRect(nx, ny, r.x, r.y, r.w, r.h)) {
    const re = edgeDist(nx, ny, r.x, r.y, r.w, r.h);
    if (re < 0.026) {
      out = Math.max(out, 0.9);
    } else if (
      inSeg(nx, ny, NUMBER_LABEL.x0, NUMBER_LABEL.x1, NUMBER_LABEL.y, 0.02)
    ) {
      out = Math.max(out, 0.55);
    } else if (
      inSeg(nx, ny, NUMBER_CHIP.x0, NUMBER_CHIP.x1, NUMBER_CHIP.y, 0.016)
    ) {
      out = Math.max(out, 0.45);
    } else if (
      inRect(
        nx,
        ny,
        NUMBER_WELL.x0,
        NUMBER_WELL.y0,
        NUMBER_WELL.x1 - NUMBER_WELL.x0,
        NUMBER_WELL.y1 - NUMBER_WELL.y0,
      )
    ) {
      /* the well: a fenced slot holding the decision */
      const we = edgeDist(
        nx,
        ny,
        NUMBER_WELL.x0,
        NUMBER_WELL.y0,
        NUMBER_WELL.x1 - NUMBER_WELL.x0,
        NUMBER_WELL.y1 - NUMBER_WELL.y0,
      );
      const digit = numberAmountIndex(t, nx);
      if (we < 0.018) {
        out = Math.max(out, 0.5 + beat * 0.2);
      } else if (digit >= 0 && Math.abs(ny - AMOUNT_LINE) < AMOUNT_ROW) {
        /* the amount: the brightest line in the panel */
        out = Math.max(out, 1);
      } else {
        out = Math.max(out, 0.24 + beat * 0.18);
      }
    }
    /* the amount's baseline rule */
    if (
      inSeg(nx, ny, NUMBER_UNDER.x0, NUMBER_UNDER.x1, NUMBER_UNDER.y, 0.018)
    ) {
      out = Math.max(out, 0.9 + beat * 0.08);
    }
  }

  /* the transaction dashes: short value rows streaming from the edges
     toward the well, shrinking as they travel, absorbed at the door */
  for (let i = 0; i < TX_STARTS.length; i++) {
    const u = cyc(t, 16, i * 0.125);
    if (u >= TX_WINDOW) continue;
    const travel = smooth(u / TX_WINDOW);
    const start = TX_STARTS[i];
    const door = TX_DOORS[i];
    const x = lerp(start.x, door.x, travel);
    const y = lerp(start.y, door.y, travel);
    const len = 0.09 * (1 - travel * 0.4);
    if (Math.abs(ny - y) < 0.022 && Math.abs(nx - x) < len / 2) {
      out = Math.max(
        out,
        (0.62 + 0.3 * travel) * (1 - smooth((travel - 0.9) / 0.1)),
      );
    }
    /* the absorption: a small bloom where the data enters the number */
    const arrive = smooth((travel - 0.82) / 0.18);
    if (arrive > 0 && Math.hypot(nx - door.x, ny - door.y) < 0.03) {
      out = Math.max(out, arrive * 0.9);
    }
  }
  return out;
}

function numberGlyphAt(t: number, nx: number, ny: number): number {
  /* digits live only on the amount's single line; EVERY other cell —
     card frame, label bar, fragments, ambient — resolves to a mark.
     The engine's default band maps strength across the whole glyph
     string, which would spill digits into the structure. */
  const r = NUMBER_CARD;
  if (inRect(nx, ny, r.x, r.y, r.w, r.h)) {
    if (
      inRect(
        nx,
        ny,
        NUMBER_WELL.x0,
        NUMBER_WELL.y0,
        NUMBER_WELL.x1 - NUMBER_WELL.x0,
        NUMBER_WELL.y1 - NUMBER_WELL.y0,
      )
    ) {
      const digit = numberAmountIndex(t, nx);
      if (digit >= 0 && Math.abs(ny - AMOUNT_LINE) < AMOUNT_ROW) return digit;
      const we = edgeDist(
        nx,
        ny,
        NUMBER_WELL.x0,
        NUMBER_WELL.y0,
        NUMBER_WELL.x1 - NUMBER_WELL.x0,
        NUMBER_WELL.y1 - NUMBER_WELL.y0,
      );
      if (we < 0.019) return 4; /* the well's fence */
      return 3; /* '*' fill inside the well, digits on one line over it */
    }
    const re = edgeDist(nx, ny, r.x, r.y, r.w, r.h);
    if (re < 0.026) return 4; /* the frame: densest mark */
    if (Math.abs(ny - NUMBER_LABEL.y) < 0.02) return 4; /* the label bar */
    if (Math.abs(ny - NUMBER_CHIP.y) < 0.018) return 4; /* the status pip */
    if (Math.abs(ny - NUMBER_UNDER.y) < 0.018) return 4; /* the baseline rule */
    return 3;
  }
  /* the streaming fragments: marks, never digits */
  for (let i = 0; i < TX_STARTS.length; i++) {
    const u = cyc(t, 16, i * 0.125);
    if (u >= TX_WINDOW) continue;
    const travel = smooth(u / TX_WINDOW);
    const x = lerp(TX_STARTS[i].x, TX_DOORS[i].x, travel);
    const y = lerp(TX_STARTS[i].y, TX_DOORS[i].y, travel);
    const len = 0.09 * (1 - travel * 0.4);
    if (Math.abs(ny - y) < 0.022 && Math.abs(nx - x) < len / 2) {
      return travel > 0.6 ? 2 : 1; /* + : — value marks, not digits */
    }
  }
  /* everything else, ambient included: a stable mark per column —
     strength is rendered through alpha, never through digits */
  return Math.floor(columnHash(nx, 17) * 5) % 5;
}

/* -------------------------------------------------------------- */

const PORTRAITS: Record<string, PortraitConfig> = {
  "design-or-disaster": {
    cell: 11,
    seed: 41,
    ambient: 0.44,
    tune: [0.44, 2.0],
    ground: "#150f0c",
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
    ambient: 0.15,
    ground: "#3b1830",
    shape: revisionShape,
    glyphAt: revisionGlyphAt,
    displace: revisionDisplace,
    color: (t) =>
      t >= 0.9
        ? "rgba(255, 244, 250, 0.95)"
        : `rgba(247, 236, 245, ${0.12 + 0.44 * t})`,
  },
  "invisible-interfaces": {
    glyphs: "01",
    cell: 13,
    seed: 23,
    ambient: 0.18,
    tune: [0.42, 2.0],
    ground: "#0f0e0a",
    shape: absenceShape,
    glyphAt: absenceGlyphAt,
    color: (t) =>
      t >= 0.9
        ? "rgba(230, 171, 63, 0.95)"
        : `rgba(230, 171, 63, ${0.14 + 0.48 * t})`,
  },
  atlas: {
    cell: 10,
    seed: 79,
    ambient: 0.12,
    ground: "#dcece8",
    shape: atlasShape,
    glyphAt: atlasGlyphAt,
    color: (t) =>
      t >= 0.9
        ? "rgba(11, 62, 57, 0.95)"
        : `rgba(13, 24, 23, ${0.34 + 0.54 * t})`,
  },
  "fluxion-studios": {
    cell: 12,
    seed: 61,
    ambient: 0.22,
    ground: "#f1c9cd",
    shape: fluxShape,
    displace: fluxDisplace,
    color: (t) =>
      t >= 0.92
        ? "rgba(140, 10, 24, 0.95)"
        : `rgba(176, 16, 32, ${0.2 + 0.48 * t})`,
  },
  daynero: {
    glyphs: NUMBER_GLYPHS,
    cell: 12,
    seed: 83,
    ambient: 0.15,
    ground: "#161c0d",
    shape: numberShape,
    glyphAt: numberGlyphAt,
    color: (t) =>
      t >= 0.9
        ? "rgba(201, 242, 78, 0.95)"
        : `rgba(185, 221, 85, ${0.14 + 0.44 * t})`,
  },
};

/** The project portrait: a compact moving diagram of one project's
    core behaviour — the same engine, six readable behaviours.
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
