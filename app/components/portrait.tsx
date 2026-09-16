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

/** a stable per-column hash → word-gap texture for text rows */
const columnHash = (nx: number, salt: number): number => {
  const h = Math.sin(Math.floor(nx * 22) * 137.31 + salt * 61.7) * 43758.5453;
  return h - Math.floor(h);
};

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
   02 · PENTIMENTO — machine draft challenged, correction leads.
   Three sentence-like machine rows stand as the setup; a solid
   strike bar sweeps across the third line; the struck words drop
   to a faint ghost; the person's correction writes itself beneath,
   brighter and more stable, and leads for most of the cycle; the
   reset restores the fresh draft. Loop: draft → strike → rewrite
   → hold → reset.
   -------------------------------------------------------------- */

const REVISION_PERIOD = 14;

const REVISION_ROWS = [
  { y: 0.2, x0: 0.12, x1: 0.8, salt: 3 },
  { y: 0.31, x0: 0.12, x1: 0.56, salt: 7 },
] as const;
const REVISION_STRUCK = { y: 0.42, x0: 0.12, x1: 0.66, salt: 11 };
const REVISION_NEW = { y: 0.56, x0: 0.12, x1: 0.7, salt: 13 };

function revisionPhase(t: number): number {
  return cyc(t, REVISION_PERIOD, 0.72);
}

function revisionRowValue(
  nx: number,
  row: { x0: number; x1: number; salt: number },
): number {
  /* word gaps: columns group into words so rows read as text lines */
  return columnHash(nx, row.salt) > 0.24 ? 1 : 0.12;
}

function revisionShape(v: number, nx: number, ny: number, t: number): number {
  const c = revisionPhase(t);
  let out = v * 0.2;
  const strike = smooth((c - 0.14) / 0.16);
  const rewrite = smooth((c - 0.46) / 0.14);
  const reset = smooth((c - 0.9) / 0.08);

  /* the standing machine lines */
  for (const row of REVISION_ROWS) {
    if (
      Math.abs(ny - row.y) < 0.028 &&
      nx > row.x0 &&
      nx < row.x1 &&
      revisionRowValue(nx, row) > 0.5
    ) {
      out = Math.max(out, 0.88);
    }
  }

  /* the struck line: full before the strike, a ghost once the rewrite
     leads, restored at the reset */
  {
    const amp = lerp(0.8, strike > 0.9 && reset < 0.4 ? 0.2 : 0.8, reset);
    if (
      Math.abs(ny - REVISION_STRUCK.y) < 0.026 &&
      nx > REVISION_STRUCK.x0 &&
      nx < REVISION_STRUCK.x1
    ) {
      out = Math.max(out, amp * revisionRowValue(nx, REVISION_STRUCK));
    }
  }

  /* the strike bar: a dense rule sweeping the line, lifting glyphs
     just behind it */
  if (
    strike > 0.06 &&
    strike < 1 &&
    Math.abs(ny - REVISION_STRUCK.y) < 0.012 &&
    nx < REVISION_STRUCK.x0 + strike * (REVISION_STRUCK.x1 - REVISION_STRUCK.x0)
  ) {
    out = Math.max(out, 0.96);
  }

  /* the person's correction: brighter, writes beneath the struck line,
     then leads */
  if (
    rewrite > 0.15 &&
    Math.abs(ny - REVISION_NEW.y) < 0.03 &&
    nx > REVISION_NEW.x0 &&
    nx < REVISION_NEW.x0 + rewrite * (REVISION_NEW.x1 - REVISION_NEW.x0)
  ) {
    const visible = 1 - reset * 0.9;
    out = Math.max(
      out,
      (0.9 + 0.1 * Math.sin(t * 1.1 + nx * 26)) *
        revisionRowValue(nx, REVISION_NEW) *
        visible,
    );
  }
  return out;
}

function revisionGlyphAt(t: number, nx: number, ny: number): number {
  const c = revisionPhase(t);
  const strike = smooth((c - 0.14) / 0.16);
  /* the strike bar: the densest glyph in the set */
  if (
    strike > 0.06 &&
    strike < 1 &&
    Math.abs(ny - REVISION_STRUCK.y) < 0.014 &&
    nx < REVISION_STRUCK.x0 + strike * (REVISION_STRUCK.x1 - REVISION_STRUCK.x0)
  ) {
    return 3;
  }
  /* the correction: a mid-dense glyph so the leading line reads solid */
  const rewrite = smooth((c - 0.46) / 0.14);
  if (
    rewrite > 0.3 &&
    Math.abs(ny - REVISION_NEW.y) < 0.026 &&
    nx < REVISION_NEW.x0 + rewrite * (REVISION_NEW.x1 - REVISION_NEW.x0)
  ) {
    return 2;
  }
  return -1;
}

function revisionDisplace(t: number, nx: number, ny: number): [number, number] {
  /* struck glyphs lift off their baseline just behind the bar */
  const c = revisionPhase(t);
  const strike = smooth((c - 0.14) / 0.16);
  if (
    strike > 0.15 &&
    strike < 0.9 &&
    Math.abs(ny - REVISION_STRUCK.y) < 0.05 &&
    nx < REVISION_STRUCK.x0 + strike * (REVISION_STRUCK.x1 - REVISION_STRUCK.x0) &&
    nx >
      REVISION_STRUCK.x0 + strike * (REVISION_STRUCK.x1 - REVISION_STRUCK.x0) - 0.09
  ) {
    return [0, strike * 2.6 * Math.sin(nx * 60 + t * 4)];
  }
  return [0, 0];
}

/* --------------------------------------------------------------
   03 · INVISIBLE INTERFACES — leave, continue, return with proof.
   A content plate (a page of binary rows) empties while a small
   activity ticker keeps running outside it; the plate then
   returns with a short over-resolve, and a receipt strip draws
   itself beneath — four evidence cells, the record of what
   happened while the page was away. Loop: page → absence →
   return with proof.
   ---------------------------------------------------------------- */

const ABSENCE_PLATE = { x: 0.12, y: 0.12, w: 0.76, h: 0.46 };
const ABSENCE_RECEIPT = { y: 0.76, x0: 0.12, x1: 0.88 };
const ABSENCE_TICKER = { x: 0.62, y: 0.68, w: 0.26 };

function absencePhase(t: number): number {
  return cyc(t, 16, 0.66);
}

function absenceShape(v: number, nx: number, ny: number, t: number): number {
  const c = absencePhase(t);
  const r = ABSENCE_PLATE;
  const inX = nx > r.x && nx < r.x + r.w;
  const inY = ny > r.y && ny < r.y + r.h;
  const bx = Math.min(Math.abs(nx - r.x), Math.abs(nx - (r.x + r.w)));
  const by = Math.min(Math.abs(ny - r.y), Math.abs(ny - (r.y + r.h)));
  const border = inX && inY ? Math.min(bx, by) : 9;

  /* the plate's own rows — the page's content, three text lines */
  const gone = smooth((c - 0.2) / 0.06) * (1 - smooth((c - 0.52) / 0.06));
  const flash = env(c, 0.52, 0.62, 0.05);

  let out = v * 0.12;
  /* the ongoing ticker: one small block that keeps working during the
     absence, outside the plate */
  if (
    nx > ABSENCE_TICKER.x &&
    nx < ABSENCE_TICKER.x + ABSENCE_TICKER.w &&
    Math.abs(ny - ABSENCE_TICKER.y) < 0.022
  ) {
    const blink = 0.5 + 0.5 * Math.sin(t * 5.2 + nx * 40);
    out = Math.max(out, (0.3 + 0.4 * gone) * (0.55 + 0.45 * blink));
  }

  if (inX && inY) {
    /* the page content, present until the absence takes it */
    const rows =
      Math.abs(ny - (r.y + 0.12)) < 0.03 ||
      Math.abs(ny - (r.y + 0.2)) < 0.03 ||
      Math.abs(ny - (r.y + 0.28)) < 0.03;
    out = Math.max(
      out,
      (rows ? 0.82 : border < 0.02 ? 0.9 : 0.2) * (1 - gone) +
        flash * (rows ? 0.3 : border < 0.02 ? 0.35 : 0.12),
    );
  }

  /* the receipt: draws beneath the plate after the return — four
     segments appearing in sequence, then held */
  const receipt = smooth((c - 0.6) / 0.16) * (1 - smooth((c - 0.94) / 0.06));
  if (receipt > 0.15) {
    if (Math.abs(ny - ABSENCE_RECEIPT.y) < 0.018) {
      out = Math.max(out, 0.95 * receipt);
    }
    /* four receipt segments: changed / preserved / not inferred / discard */
    const segs = [0.14, 0.36, 0.52, 0.74];
    for (let i = 0; i < segs.length; i++) {
      if (receipt < 0.25 + i * 0.2) break;
      const seg = { x0: segs[i], x1: segs[i] + (i === 2 ? 0.18 : 0.16) };
      if (
        Math.abs(ny - (ABSENCE_RECEIPT.y + 0.055)) < 0.022 &&
        nx > seg.x0 &&
        nx < seg.x0 + (seg.x1 - seg.x0) * Math.min(1, Math.max(0, (receipt - 0.25 - i * 0.2) / 0.2))
      ) {
        out = Math.max(out, 0.8 * receipt);
      }
    }
    /* the receipt's own under-rule */
    if (Math.abs(ny - (ABSENCE_RECEIPT.y + 0.1)) < 0.012) {
      out = Math.max(out, 0.85 * receipt);
    }
  }
  return out;
}

function absenceGlyphAt(t: number, nx: number, ny: number): number {
  /* the receipt strip and ticker render as filled "1" blocks */
  const c = absencePhase(t);
  const receipt = smooth((c - 0.6) / 0.16);
  if (receipt > 0.15 && Math.abs(ny - ABSENCE_RECEIPT.y) < 0.018) return 1;
  if (
    nx > ABSENCE_TICKER.x &&
    nx < ABSENCE_TICKER.x + ABSENCE_TICKER.w &&
    Math.abs(ny - ABSENCE_TICKER.y) < 0.02
  ) {
    return 1;
  }
  return -1;
}

/* --------------------------------------------------------------
   04 · INTERACTION ATLAS — rule → pressure cases → revised rule.
   A clear logic map drawn at full strength: a root rule block up
   top, three elbow connectors branching into three unlike cases,
   each case ending in a different outcome terminal (holds = a
   settled block, refine = the wording extends, fracture = the bar
   visibly breaks), and the revised rule resolving bright beneath
   with the test pulse travelling it. Contrast is driven up; the
   base texture is silenced so the tree is the whole message.
   ---------------------------------------------------------------- */

const ATLAS_ROOT = { y: 0.11, x0: 0.1, w: 0.44 };
const ATLAS_CASES = [
  { y: 0.36, x0: 0.12, w: 0.32, outcome: "hold" as const, root: 0.16 },
  { y: 0.53, x0: 0.3, w: 0.34, outcome: "fracture" as const, root: 0.34 },
  { y: 0.7, x0: 0.48, w: 0.32, outcome: "refine" as const, root: 0.52 },
] as const;
const ATLAS_RULE = { y: 0.88, x0: 0.1, x1: 0.78 };
const ATLAS_PERIOD = 18;

function atlasPhase(t: number): number {
  /* phase 0.86: the reduced-motion freeze lands on the revised rule,
     held and legible */
  return cyc(t, ATLAS_PERIOD, 0.86);
}

function atlasShape(v: number, nx: number, ny: number, t: number): number {
  const c = atlasPhase(t);
  /* the whole tree releases together at the cycle end — a soft reset,
     never a hard cut */
  const release = 1 - smooth((c - 0.96) / 0.04);
  let out = v * 0.08 * release;
  /* the walk compresses into the first third of the cycle so the full
     tree is on screen and held for most of every cycle */
  const rootOn = smooth((c - 0.02) / 0.06);

  /* the root rule: a labelled bar with its own underline */
  if (rootOn > 0) {
    if (Math.abs(ny - ATLAS_ROOT.y) < 0.026 && nx > ATLAS_ROOT.x0 && nx < ATLAS_ROOT.x0 + ATLAS_ROOT.w) {
      out = Math.max(out, 0.9 * rootOn);
    }
    if (
      Math.abs(ny - (ATLAS_ROOT.y + 0.05)) < 0.012 &&
      nx > ATLAS_ROOT.x0 &&
      nx < ATLAS_ROOT.x0 + ATLAS_ROOT.w
    ) {
      out = Math.max(out, 0.9 * rootOn);
    }
  }

  /* three pressure cases branch off the root, each ending in a
     different outcome terminal */
  for (let i = 0; i < ATLAS_CASES.length; i++) {
    const k = ATLAS_CASES[i];
    const appear = smooth((c - (0.12 + i * 0.07)) / 0.07);
    if (appear <= 0) continue;
    /* elbow: drop from the root, then run into the case bar */
    const dropX = k.root;
    if (Math.abs(nx - dropX) < 0.012 && ny > ATLAS_ROOT.y + 0.03 && ny < k.y) {
      out = Math.max(out, appear * release * 0.8);
    }
    const drawn = k.w * appear;
    /* the case wording bar */
    if (Math.abs(ny - k.y) < 0.024 && nx > k.x0 && nx < k.x0 + drawn) {
      out = Math.max(out, appear * release * (0.66 + 0.24 * v));
    }
    /* the outcome terminal at the case's end */
    const endX = k.x0 + k.w;
    if (k.outcome === "hold") {
      /* a settled block: the rule stands */
      if (
        nx > endX - 0.02 &&
        nx < endX + 0.03 &&
        Math.abs(ny - k.y) < 0.03
      ) {
        out = Math.max(out, appear * release * 0.95);
      }
    } else if (k.outcome === "fracture") {
      /* the bar visibly breaks: two halves, a gap between them */
      const gap = smooth((c - (0.12 + i * 0.07 + 0.06)) / 0.05);
      if (nx > k.x0 + k.w * 0.52 && nx < endX - k.w * 0.1) {
        const shift = gap * 0.02;
        if (Math.abs(ny - (k.y - shift)) < 0.02) {
          out = Math.max(out, appear * release * 0.7);
        }
      }
      if (gap > 0 && nx > endX - 0.028 && nx < endX && Math.abs(ny - k.y) < 0.014) {
        out = Math.max(out, appear * release * 0.95);
      }
    } else {
      /* refined: the wording extends past the original end */
      const extend = smooth((c - (0.12 + i * 0.07)) / 0.07);
      if (
        extend > 0 &&
        Math.abs(ny - k.y) < 0.024 &&
        nx > k.x0 + drawn * 0.96 &&
        nx < k.x0 + k.w + extend * 0.14
      ) {
        out = Math.max(out, appear * release * 0.8);
      }
      if (nx > endX + extend * 0.1 - 0.02 && nx < endX + extend * 0.14 && Math.abs(ny - k.y) < 0.03) {
        out = Math.max(out, appear * release * 0.95);
      }
    }
  }

  /* the revised rule: resolves bright once the cases have spoken, with
     the test pulse travelling it */
  const ruleOn = smooth((c - 0.4) / 0.08) * (1 - smooth((c - 0.97) / 0.04));
  if (ruleOn > 0) {
    if (
      Math.abs(ny - ATLAS_RULE.y) < 0.03 &&
      nx > ATLAS_RULE.x0 &&
      nx < ATLAS_RULE.x0 + (ATLAS_RULE.x1 - ATLAS_RULE.x0) * ruleOn
    ) {
      out = Math.max(out, 0.96 * ruleOn * release);
    }
    const pulse = cyc(t, 4.5);
    const px = ATLAS_RULE.x0 + pulse * (ATLAS_RULE.x1 - ATLAS_RULE.x0);
    if (Math.abs(ny - ATLAS_RULE.y) < 0.045 && Math.abs(nx - px) < 0.05) {
      out = Math.max(out, ruleOn * release * 0.98);
    }
  }
  return out;
}

/* --------------------------------------------------------------
   05 · FLUXION STUDIOS — scattered brief, assembled site, shipped.
   Seven loose pieces wander in the open; they slide into the
   site's wireframe one at a time (nav, heading, image block,
   text rows, footer), the frame snaps shut with one assembly
   flash, and the delivered structure holds before releasing.
   Loop: scattered brief → assembly → shipped thing → hold →
   reset.
   ---------------------------------------------------------------- */

const FLUX_FRAME = { x: 0.12, y: 0.12, w: 0.76, h: 0.76 };
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

const FLUX_PIECES: FluxPiece[] = [
  { x: 0.14, y: 0.17, w: 0.6, h: 0.03, kind: "bar", sx: 0.05, sy: 0.06, at: 0.12 },
  { x: 0.16, y: 0.3, w: 0.36, h: 0.06, kind: "bar", sx: 0.62, sy: 0.04, at: 0.24 },
  { x: 0.58, y: 0.36, w: 0.26, h: 0.2, kind: "block", sx: 0.78, sy: 0.62, at: 0.36 },
  { x: 0.16, y: 0.62, w: 0.3, h: 0.045, kind: "rows", sx: 0.04, sy: 0.72, at: 0.36 },
  { x: 0.16, y: 0.71, w: 0.26, h: 0.045, kind: "rows", sx: 0.5, sy: 0.92, at: 0.46 },
  { x: 0.14, y: 0.8, w: 0.72, h: 0.028, kind: "bar", sx: 0.3, sy: 0.3, at: 0.56 },
];

function fluxCycle(t: number): number {
  /* phase 0.88: the reduced-motion freeze lands on the shipped state */
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
  const alpha =
    env(c, p.at - 0.04, 0.93, 0.07) * (1 - smooth((c - 0.93) / 0.06));
  const wander = (1 - f) * 0.055;
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
  const flash = env(c, 0.7, 0.82, 0.06);
  let out = v * 0.28;

  /* the loose pieces, each travelling from its scatter to its slot */
  for (const p of FLUX_PIECES) {
    const rect = fluxPiece(p, t, c);
    if (rect.alpha <= 0) continue;
    const inX = nx > rect.x && nx < rect.x + p.w;
    const inY = ny > rect.y && ny < rect.y + p.h;
    if (!inX || !inY) continue;
    let amp = rect.f * (p.kind === "bar" ? 0.88 : p.kind === "block" ? 0.6 : 0.72);
    /* the block's inner texture once it settles */
    if (p.kind === "block" && rect.f > 0.9) {
      amp *= columnHash(nx, 5) > 0.3 ? 0.9 : 0.25;
    }
    /* rows get word-gap texture */
    if (p.kind === "rows") amp *= columnHash(nx, 9) > 0.24 ? 1 : 0.12;
    out = Math.max(out, amp * rect.alpha * (0.75 + 0.25 * v));
  }

  /* the frame snaps shut at the assembly moment, flashes, then holds */
  const frameOn = smooth((c - 0.7) / 0.1) * (1 - smooth((c - 0.94) / 0.05));
  if (frameOn > 0) {
    const r = FLUX_FRAME;
    const bx = Math.min(
      Math.abs(nx - r.x),
      Math.abs(nx - (r.x + r.w)),
    );
    const by = Math.min(
      Math.abs(ny - r.y),
      Math.abs(ny - (r.y + r.h)),
    );
    const onEdge = bx < 0.016 || by < 0.016;
    if (onEdge) {
      out = Math.max(out, (0.9 + flash * 0.1) * (0.75 + 0.25 * v));
    }
  }
  return out;
}

function fluxDisplace(t: number, nx: number, ny: number): [number, number] {
  /* unformed matter wanders gently; the assembled site holds place */
  const c = fluxCycle(t);
  const f = smooth((c - 0.1) / 0.58);
  const amp = (1 - f) * 3.5;
  return [
    Math.sin(t * 0.42 + (nx * 9 + ny * 5) * 4.1) * amp,
    Math.cos(t * 0.35 + (nx * 6 + ny * 9) * 4.3) * amp,
  ];
}

/* --------------------------------------------------------------
   06 · DAYNERO — many small spends, one safe daily amount.
   Transaction fragments stream in from every edge toward a
   budget card, each one absorbed at the card's edge with a small
   flash; once enough have landed the amount inside the card
   ticks to its new value with a bright beat, then holds. The
   card's rails and label bar give the amount its structure.
   ---------------------------------------------------------------- */

/* glyph set: ·:+*# then 0-9 — the ambient field only ever resolves
   into the marks (indices 0-4); digits belong to the amount alone */
const NUMBER_GLYPHS = "·:+*#0123456789";

const NUMBER_CARD = { x: 0.3, y: 0.28, w: 0.4, h: 0.4 };
const NUMBER_CORE = { x0: 0.4, x1: 0.6, y0: 0.44, y1: 0.56 };
/* the amount reads as three digit cells; '824' → glyph indices 13,7,9 */
const AMOUNT_A = [13, 7, 9];
const AMOUNT_B = [13, 5, 14]; /* '809' — the cycle's other value */
const TX_SLOTS = [
  { x: 0.06, y: 0.16, phase: 0.02 },
  { x: 0.94, y: 0.2, phase: 0.18 },
  { x: 0.08, y: 0.62, phase: 0.34 },
  { x: 0.92, y: 0.44, phase: 0.5 },
  { x: 0.12, y: 0.86, phase: 0.66 },
  { x: 0.88, y: 0.9, phase: 0.82 },
] as const;
/* where each fragment docks on the card's edge */
const TX_DOORS = [
  { x: 0.34, y: 0.36 },
  { x: 0.66, y: 0.38 },
  { x: 0.32, y: 0.52 },
  { x: 0.68, y: 0.54 },
  { x: 0.38, y: 0.64 },
  { x: 0.62, y: 0.66 },
] as const;

function numberPhase(t: number): number {
  return cyc(t, 16, 0.55);
}

function numberAmountIndex(t: number, nx: number): number {
  /* which digit column: three cells inside the core, or -1 */
  const c = numberPhase(t);
  const tick = smooth((c - 0.5) / 0.05);
  const value = tick > 0.5 ? AMOUNT_B : AMOUNT_A;
  for (let i = 0; i < value.length; i++) {
    const cx = 0.4 + i * 0.1;
    if (Math.abs(nx - cx) < 0.05) return value[i];
  }
  return -1;
}

function numberShape(v: number, nx: number, ny: number, t: number): number {
  const c = numberPhase(t);
  let out = v * 0.14;
  const r = NUMBER_CARD;
  const inCard =
    nx > r.x && nx < r.x + r.w && ny > r.y && ny < r.y + r.h;

  /* the budget card: frame, label bar, amount well */
  if (inCard) {
    const bx = Math.min(Math.abs(nx - r.x), Math.abs(nx - (r.x + r.w)));
    const by = Math.min(Math.abs(ny - r.y), Math.abs(ny - (r.y + r.h)));
    if (bx < 0.018 || by < 0.018) {
      out = Math.max(out, 0.85);
    } else if (Math.abs(ny - (r.y + 0.09)) < 0.02 && nx > r.x + 0.04 && nx < r.x + r.w - 0.04) {
      out = Math.max(out, 0.55);
    } else if (nx > NUMBER_CORE.x0 && nx < NUMBER_CORE.x1 && ny > NUMBER_CORE.y0 && ny < NUMBER_CORE.y1) {
      const digit = numberAmountIndex(t, nx);
      /* the beat: the amount flashes bright as it ticks */
      const beat = env(c, 0.48, 0.56, 0.04);
      if (digit >= 0 && Math.abs(ny - 0.47) < 0.035) {
        out = Math.max(out, 0.97 + beat * 0.03);
      } else {
        out = Math.max(out, 0.3 + 0.05 * Math.sin(t * 0.6) + beat * 0.25);
      }
    }
  }

  /* the fragments: small value bars streaming from the edges toward
     the card, shrinking as they travel, absorbed at the door */
  for (let i = 0; i < TX_SLOTS.length; i++) {
    const slot = TX_SLOTS[i];
    const door = TX_DOORS[i];
    const u = (cyc(t, 16, slot.phase) * 1) % 1;
    const travel = smooth(u / 0.5);
    if (u >= 0.5) continue;
    const x = lerp(slot.x, door.x, travel);
    const y = lerp(slot.y, door.y, travel);
    const w = 0.05 * (1 - travel * 0.55);
    const d = Math.abs(nx - x);
    const dy = Math.abs(ny - y);
    const arrive = smooth((travel - 0.92) / 0.08);
    if (dy < 0.022 && d < w / 2) {
      out = Math.max(out, 0.72 * (0.45 + 0.55 * travel) * (1 - smooth((u - 0.44) / 0.06)));
    }
    /* the absorption flash on the card's edge */
    if (arrive > 0 && Math.hypot(nx - door.x, ny - door.y) < 0.035) {
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
  if (nx > r.x && nx < r.x + r.w && ny > r.y && ny < r.y + r.h) {
    if (nx > NUMBER_CORE.x0 && nx < NUMBER_CORE.x1 && ny > NUMBER_CORE.y0 && ny < NUMBER_CORE.y1) {
      const digit = numberAmountIndex(t, nx);
      if (digit >= 0 && Math.abs(ny - 0.47) < 0.032) return digit;
      return 3; /* '*' fill inside the well, digits on one line over it */
    }
    const bx = Math.min(Math.abs(nx - r.x), Math.abs(nx - (r.x + r.w)));
    const by = Math.min(Math.abs(ny - r.y), Math.abs(ny - (r.y + r.h)));
    if (bx < 0.018 || by < 0.018) return 4; /* the frame: densest mark */
    if (Math.abs(ny - (r.y + 0.09)) < 0.02) return 4; /* the label bar */
    return 3;
  }
  /* the streaming fragments: marks, never digits */
  for (let i = 0; i < TX_SLOTS.length; i++) {
    const slot = TX_SLOTS[i];
    const door = TX_DOORS[i];
    const u = cyc(t, 16, slot.phase) % 1;
    if (u >= 0.5) continue;
    const travel = smooth(u / 0.5);
    const x = lerp(slot.x, door.x, travel);
    const y = lerp(slot.y, door.y, travel);
    const w = 0.05 * (1 - travel * 0.55);
    if (Math.abs(ny - y) < 0.022 && Math.abs(nx - x) < w / 2) {
      return travel > 0.6 ? 2 : 1; /* * : — value marks, not digits */
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
        : `rgba(247, 236, 245, ${0.1 + 0.4 * t})`,
  },
  "invisible-interfaces": {
    glyphs: "01",
    cell: 13,
    seed: 23,
    ambient: 0.2,
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
    color: (t) =>
      t >= 0.9
        ? "rgba(11, 62, 57, 0.95)"
        : `rgba(13, 24, 23, ${0.3 + 0.5 * t})`,
  },
  "fluxion-studios": {
    cell: 13,
    seed: 61,
    ambient: 0.2,
    ground: "#f1c9cd",
    shape: fluxShape,
    displace: fluxDisplace,
    color: (t) =>
      t >= 0.92
        ? "rgba(140, 10, 24, 0.95)"
        : `rgba(176, 16, 32, ${0.18 + 0.42 * t})`,
  },
  daynero: {
    glyphs: NUMBER_GLYPHS,
    cell: 13,
    seed: 83,
    ambient: 0.15,
    ground: "#161c0d",
    shape: numberShape,
    glyphAt: numberGlyphAt,
    color: (t) =>
      t >= 0.9
        ? "rgba(201, 242, 78, 0.95)"
        : `rgba(185, 221, 85, ${0.12 + 0.4 * t})`,
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
