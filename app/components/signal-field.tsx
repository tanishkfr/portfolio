"use client";

import { useEffect, useRef } from "react";

/**
 * SIGNAL FIELD — the portfolio's computational material.
 *
 * One Canvas-2D primitive, many states. A field is a low-resolution grid
 * whose cells resolve into density glyphs; how much of the field is
 * resolved is the state the host wants to express:
 *
 *   CRISP        — the field is absent; the DOM carries the information
 *   GLYPH FIELD  — being processed, transmitted, partially known
 *   DISPERSED    — contested, withdrawn, collapsing
 *   REASSEMBLED  — returned, settled
 *
 * Engine contract: one rAF loop at most, and only while the canvas is in
 * the viewport, the tab is visible, and the reader allows motion. Cells
 * repaint only when their glyph/level changes. Glyphs are pre-rendered
 * sprites (one small sprite sheet per field), so the per-frame cost is a
 * grid of integer field evaluations plus a handful of drawImage calls.
 * Colour and quiet zones are read through refs so they can be inline
 * values without re-binding the effect; geometry coarsens on narrow
 * viewports, DPR is capped, and coarse pointers get no pointer field.
 */

export type Quiet = {
  x: number;
  y: number;
  w: number;
  h: number;
  falloff?: number;
  /** Suppression feather beyond the rect, in normalised units. */
  feather?: number;
};

/** Project pigments reach the engine as plain hex values. */
export function hexToRgba(hex: string, alpha: number): string {
  const raw = hex.replace("#", "");
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : raw;
  const n = parseInt(full, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/** The ordered 4×4 dither matrix, normalised. */
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((row) => row.map((value) => (value + 0.5) / 16));

export type SignalFieldProps = {
  glyphs?: string;
  color?: (t: number) => string | null;
  cell?: number;
  seed?: number;
  ambient?: number;
  quiet?: Quiet[];
  /** Compositional shaping over the clamped field, in normalised
      coordinates — e.g. a vertical resolve ramp toward one edge. The
      fourth argument is seconds since mount (frozen at 0 under
      reduced motion), so scripts can evolve over a period. The last
      two are one cell's width and height in the same normalised
      units, so a script can keep a feature at least one glyph wide
      whatever the grid resolution happens to be. */
  shape?: (
    v: number,
    nx: number,
    ny: number,
    t: number,
    cellX: number,
    cellY: number,
  ) => number;
  /** Domain advection: how far the noise field bends its own sampling
      coordinates — streamlines and interference, felt not seen. */
  flow?: number;
  /** A slow diagonal signal band that lifts density as it passes. */
  wavefront?: number;
  /** Slow advection of the whole lattice origin — the field travels,
      slowly, instead of boiling in place. */
  drift?: number;
  /** Contrast curve of the sampled field as [offset, gain]; a lower
      offset with a higher gain resolves more of the field without
      losing the quiet pockets between structures. */
  tune?: [number, number];
  /** "glyph" resolves the field into characters; "dither" into
      Bayer-thresholded halftone dots; "pixel" into sparse solid
      squares — the signal-fragment register. */
  mode?: "glyph" | "dither" | "pixel";
  /** Per-cell glyph override: the index into `glyphs` to draw at this
      coordinate this frame, or a negative value to keep the field's
      own choice. Lets a portrait mark structure (a crosshair, a
      strike, a connector) without leaving the engine. The trailing
      numbers are the grid pitch, as on `shape`. */
  glyphAt?: (
    t: number,
    nx: number,
    ny: number,
    cellX: number,
    cellY: number,
  ) => number;
  /** Per-cell draw offset in pixels — slow wander for formation and
      displacement behaviours. Quantised to whole pixels for the
      repaint cache. */
  displace?: (t: number, nx: number, ny: number) => [number, number];
  pointerRadius?: number;
  pulseKey?: number | string | null;
  pulseMs?: number;
  pulseDirection?: "resolve" | "disperse";
  /** Disperse the field as its container scrolls out (the hero). */
  collapse?: boolean;
  /** Sleep: the canvas keeps its last frame and the loop stops until
      the host says otherwise. The folio keeps exactly one portrait
      awake — the sheet being read — so five panels cost nothing while
      the reader is somewhere else. Resuming continues the cycle from
      where it slept, so nothing ever visibly restarts. */
  paused?: boolean;
  /** A miniature: keep the requested cell on narrow panels instead of
      coarsening to the legibility floor. Used by small fields that are
      meant to read as texture rather than as a diagram. */
  dense?: boolean;
  className?: string;
};

const BANDS = 7;

/* One time origin for every field on the page. Simultaneously mounted
   fields (the splash's and the cover's, say) therefore run in exactly
   the same noise phase — the splash is literally the hero's first
   frames — and a field that remounts resumes the shared clock instead
   of restarting its material from zero. */
let SHARED_EPOCH = 0;

function hash3(x: number, y: number, z: number, seed: number): number {
  let h = seed;
  h = Math.imul(h ^ (x | 0), 0x27d4eb2d);
  h = Math.imul(h ^ (y | 0), 0x165667b1);
  h = Math.imul(h ^ (z | 0), 0x9e3779b9);
  h ^= h >>> 15;
  return ((h >>> 0) % 100000) / 100000;
}

function smooth(edge: number): number {
  return edge * edge * (3 - 2 * edge);
}

function lattice(gx: number, gy: number, gz: number, seed: number): number {
  const x0 = Math.floor(gx);
  const y0 = Math.floor(gy);
  const fx = gx - x0;
  const fy = gy - y0;
  const ux = smooth(fx);
  const uy = smooth(fy);
  const z0 = Math.floor(gz);
  const fz = gz - z0;
  const corner = (dx: number, dy: number): number => {
    const a = hash3(x0 + dx, y0 + dy, z0, seed);
    const b = hash3(x0 + dx, y0 + dy, z0 + 1, seed);
    return a + (b - a) * fz;
  };
  const top = corner(0, 0) * (1 - ux) + corner(1, 0) * ux;
  const bottom = corner(0, 1) * (1 - ux) + corner(1, 1) * ux;
  return top * (1 - uy) + bottom * uy;
}

export function SignalField({
  glyphs = "·:+*#",
  color = (t) => `rgba(27, 33, 38, ${0.08 + 0.26 * t})`,
  cell = 13,
  seed = 1,
  ambient = 0.25,
  quiet,
  shape,
  flow = 0,
  wavefront = 0,
  drift = 0,
  /* a fresh array per render is fine: tune is read through lookRef and
     kept out of the effect deps */
  tune = [0.42, 2.1],
  mode = "glyph",
  glyphAt,
  displace,
  pointerRadius = 9,
  pulseKey = null,
  pulseMs = 1100,
  pulseDirection = "resolve",
  collapse = false,
  paused = false,
  dense = false,
  className,
}: SignalFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /* inline functions and tuples would rebind the effect every render;
      the engine reads them through this ref, refreshed before each paint */
  const lookRef = useRef({ color, quiet, shape, tune, glyphAt, displace, paused });
  /* waking a slept field: the mount effect publishes its scheduler here,
     so a `paused` change resumes painting without rebinding anything */
  const wakeRef = useRef<(() => void) | null>(null);

  /* keep the ref fresh between renders without rebinding listeners —
     the engine reads colour, quiet zones, scripts and sleep state per
     paint, and a field that just woke is scheduled immediately */
  useEffect(() => {
    lookRef.current = { color, quiet, shape, tune, glyphAt, displace, paused };
    if (!paused) wakeRef.current?.();
  });

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const ctx0 = el.getContext("2d");
    if (!ctx0) return;
    const canvas = el;
    const ctx = ctx0;
    lookRef.current = { color, quiet, shape, tune, glyphAt, displace, paused };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");

    let width = 1;
    let height = 1;
    let cols = 1;
    let rows = 1;
    let step = cell;
    let dpr = 1;
    let sprite: HTMLCanvasElement | null = null;
    let lastPaint = new Int32Array(1);
    /* painted colour strings for the solid-square modes, quantised to
       13 weights — no per-cell string allocation per frame; rebuilt per
       effect run, same lifetime as the sprites */
    const inkCache: string[] = [];
    const pointerCell = { x: -9999, y: -9999 };
    let inView = false;
    let raf = 0;
    const clockStart = SHARED_EPOCH || (SHARED_EPOCH = performance.now());
    const arriveStart = performance.now();
    /* Portrait time: accumulated only while actually painting, so a
       slept field resumes its cycle where it left off instead of
       jumping ahead by however long the reader was elsewhere. */
    let scriptMs = 0;
    let lastPaintMs = clockStart;
    let pulseStart = -1;
    let lastPulseKey: number | string | null = null;
    let pulseOpen = false;

    /** quantised ink lookup: 13 steps is finer than any square or dot
        can express, so nothing is lost, and the fillStyle string is
        built at most once per weight per field */
    const inkFor = (t: number): string => {
      const q = Math.min(12, Math.max(0, Math.round(t * 12)));
      const cached = inkCache[q];
      if (cached !== undefined) return cached;
      const built = lookRef.current.color(q / 12) ?? "transparent";
      inkCache[q] = built;
      return built;
    };

    function buildSprites(): void {
      sprite = document.createElement("canvas");
      const size = Math.ceil(step * dpr);
      sprite.width = size * glyphs.length;
      sprite.height = size * BANDS;
      const sctx = sprite.getContext("2d");
      if (!sctx) return;
      sctx.font = `${Math.round(size * 0.94)}px ui-monospace, "SF Mono", "Cascadia Mono", Consolas, "Liberation Mono", Menlo, monospace`;
      sctx.textAlign = "center";
      sctx.textBaseline = "middle";
      for (let g = 0; g < glyphs.length; g++) {
        for (let b = 0; b < BANDS; b++) {
          const ink = lookRef.current.color(b / (BANDS - 1));
          if (ink == null) continue;
          sctx.fillStyle = ink;
          sctx.fillText(
            glyphs.charAt(g),
            size * g + size / 2,
            size * b + size * 0.55,
          );
        }
      }
    }

    function measure(): void {
      /* read the stylesheet's own resolution: a stale inline size would
         otherwise feed itself back through getBoundingClientRect */
      canvas.style.width = "";
      canvas.style.height = "";
      const box = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(box.width));
      height = Math.max(1, Math.round(box.height));
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      step = width < 760 && !dense ? Math.max(cell, 16) : cell;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      cols = Math.ceil(width / step) + 1;
      rows = Math.ceil(height / step) + 1;
      lastPaint = new Int32Array(cols * rows).fill(-1);
      buildSprites();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint(performance.now(), true);
    }

    /** The field value at a cell centre, before envelopes. Order matters:
        flow-bent noise, ambient re-tuning, quiet suppression, pointer,
        wavefront, resolve — so quiet zones win over every liveliness
        source. */
    function field(
      x: number,
      y: number,
      clock: number,
      resolve: number,
      tNow: number,
    ): number {
      /* domain bend: sample the noise through a slow curl of itself —
         the pattern gains streamlines without any visible displacement
         of the grid. The noise clock is quantised to eighths of a
         second: the field evolves in visible steps, so the repaint
         cache absorbs most frames — fewer redraws, smoother feel. */
      const nq = Math.floor(clock * 8) / 8;
      let gx = (x / step) * 0.055;
      let gy = (y / step) * 0.055;
      if (drift > 0) {
        /* the whole field slowly travels: one lattice cell every few
           minutes, so the matter relocates instead of boiling in place */
        gx += nq * drift * 0.5;
        gy += nq * drift * 0.13;
      }
      if (flow > 0) {
        const wx = lattice(gx * 0.9 + 11, gy * 0.9, nq * 0.5, seed + 19);
        const wy = lattice(gx * 0.9, gy * 0.9 + 7, nq * 0.5, seed + 23);
        gx += (wx - 0.5) * flow;
        gy += (wy - 0.5) * flow;
      }
      let v =
        lattice(gx, gy, nq, seed) * 0.62 +
        lattice((x / step) * 0.19, (y / step) * 0.19, nq * 1.6, seed + 7) *
          0.33;
      /* contrast: a thresholded field reads as sampled material —
         structure with quiet pockets — instead of uniform mush */
      const curve = lookRef.current.tune ?? [0.42, 2.1];
      v = (v - curve[0]) * curve[1];
      if (!reduced.matches && ambient > 0) {
        if (
          hash3(Math.floor(x / step), Math.floor(y / step), Math.floor(nq * 3), seed + 31) <
          0.05
        ) {
          v = Math.min(1, v + 0.2);
        }
      }
      const zones = lookRef.current.quiet;
      if (zones) {
        for (const q of zones) {
          const dx = Math.max(0, Math.abs(x / width - (q.x + q.w / 2)) - q.w / 2);
          const dy = Math.max(0, Math.abs(y / height - (q.y + q.h / 2)) - q.h / 2);
          const feather = q.feather ?? 0.04;
          /* full suppression inside the zone, a short dissolve beyond it —
             nothing reaches further, so neighbouring compositions survive */
          const hold = 1 - smooth(Math.min(1, Math.hypot(dx, dy) / feather));
          v *= 1 - (q.falloff ?? 1) * hold;
        }
      }
      if (pointerRadius > 0 && pointerCell.x > -9000) {
        const d = Math.hypot(pointerCell.x - x, pointerCell.y - y);
        if (d < pointerRadius * step) {
          v -= smooth(1 - d / (pointerRadius * step)) * 0.92;
        }
      }
      if (wavefront > 0 && !reduced.matches) {
        /* one slow diagonal band drifts through, lifting density as it
           passes — the field has weather */
        const s = (x / width + y / height) * 1.2;
        const wave = Math.sin(s * 6.2 - nq * 22 - seed);
        v += Math.max(0, wave) * wavefront;
      }
      v *= 0.5 + 0.5 * resolve;
      v = v < 0 ? 0 : v > 1 ? 1 : v;
      const shapeFn = lookRef.current.shape;
      if (shapeFn) {
        v = Math.max(
          0,
          Math.min(
            1,
            shapeFn(v, x / width, y / height, tNow, step / width, step / height),
          ),
        );
      }
      /* quiet zones are re-applied after the shape, so they win over
         every liveliness source — including max-blended structure, which
         otherwise bypasses its own suppression and paints over text */
      if (zones) {
        for (const q of zones) {
          const dx = Math.max(0, Math.abs(x / width - (q.x + q.w / 2)) - q.w / 2);
          const dy = Math.max(0, Math.abs(y / height - (q.y + q.h / 2)) - q.h / 2);
          const feather = q.feather ?? 0.04;
          const hold = 1 - smooth(Math.min(1, Math.hypot(dx, dy) / feather));
          v *= 1 - (q.falloff ?? 1) * hold;
        }
      }
      return v;
    }

    function collapseProgress(): number {
      if (!collapse) return 0;
      const cover = canvas.closest(".xp-cover");
      if (!cover) return 0;
      const box = cover.getBoundingClientRect();
      return Math.max(0, Math.min(1, -box.top / (box.height * 0.85)));
    }

    function paint(now: number, force = false): void {
      if (!sprite) return;
      /* a changed pulse key opens the material sweep; the effect also
         rebinds on the same change, so this only guards idle replays */
      if (pulseKey != null && pulseKey !== lastPulseKey) {
        pulseOpen = true;
        pulseStart = now;
        lastPulseKey = pulseKey;
      }
      /* the noise clock freezes under reduced motion: any forced repaint
         (resize, re-entry) re-evaluates the identical field, so the
         reader's one stable composition is exact, not approximate */
      const clock = reduced.matches
        ? Math.floor(seed * 13)
        : (now - clockStart) / 24000 + Math.floor(seed * 13);
      /* script time for portraits: seconds of painting, quantised to
         eighth-seconds so shape, glyph and displacement scripts repaint
         in visible steps — the repaint cache absorbs the frames in
         between. Frozen at 0 under reduced motion so the single static
         frame is a composed state, and clamped on wake so a long sleep
         never skips a beat of the cycle. */
      scriptMs += Math.min(Math.max(0, now - lastPaintMs), 120);
      lastPaintMs = now;
      const tNow = reduced.matches
        ? 0
        : Math.floor((scriptMs * 8) / 1000) / 8;
      const cellX = step / width;
      const cellY = step / height;
      const arrive = reduced.matches || lookRef.current.paused
        ? 1
        : smooth(Math.min(1, (now - arriveStart) / 1500));
      const collapseP = smooth(collapseProgress());
      /* the collapse is felt, not just scrolled: the field gives out
         while the cover is still half on screen */
      const resolve =
        arrive * Math.max(0, 1 - collapseP * 2.2);
      const densityScale = width < 760 ? (mode === "pixel" ? 1 : 0.68) : 1;
      const dispFn = lookRef.current.displace;

      let pulseP = 1;
      if (pulseOpen) {
        pulseP = Math.min(1, (now - pulseStart) / pulseMs);
      }

      /* a cell's previous paint is decodable from its cache key, so a
         move (displacement) can erase exactly where it last drew */
      const clearPrev = (index: number, c: number, r: number): void => {
        if (lastPaint[index] === -1) return;
        const d = lastPaint[index] % 262144;
        ctx.clearRect(
          c * step + Math.floor(d / 512) - 256,
          r * step + (d % 512) - 256,
          step,
          step,
        );
        lastPaint[index] = -1;
      };

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const index = r * cols + c;
          const x = c * step + step / 2;
          const y = r * step + step / 2;
          if (collapse && r < rows * collapseP * 1.12) {
            clearPrev(index, c, r);
            continue;
          }
          let v = field(x, y, clock, resolve, tNow) * densityScale;
          let alpha = 1;
          if (pulseOpen) {
            if (pulseP >= 1) {
              alpha = 0;
            } else {
              alpha = pulseDirection === "disperse"
                ? smooth(Math.min(1, pulseP * 3.2)) *
                  (1 - smooth(Math.max(0, (pulseP - 0.4) / 0.6)))
                : smooth(Math.min(1, pulseP * 1.5)) *
                  (1 - smooth(Math.max(0, (pulseP - 0.55) / 0.45)));
              /* the sweep carries its own density so the material reads
                 even over a quiet base field */
              v = Math.max(
                v * (0.35 + 0.65 * alpha),
                (0.3 + 0.42 * hash3(c, r, 9, seed)) * alpha,
              );
              if (pulseDirection === "disperse") {
                v *= 1 - pulseP * 0.3;
              }
            }
          }
          if (v <= 0.05 || alpha <= 0.002) {
            clearPrev(index, c, r);
            continue;
          }
          let dx = 0;
          let dy = 0;
          if (dispFn) {
            const d = dispFn(tNow, x / width, y / height);
            dx = Math.round(d[0]);
            dy = Math.round(d[1]);
          }
          const dKey = (dx + 256) * 512 + (dy + 256);

          if (mode === "pixel") {
            /* sparse signal fragments: only the field's upper range
               resolves, as solid squares whose size carries the
               strength — pixels, not wallpaper */
            const on = v > 0.5;
            const strength = on ? Math.min(1, (v - 0.5) / 0.5) : 0;
            const key =
              (on ? 1 + Math.round(strength * 12) : 0) * 262144 + dKey;
            if (!force && lastPaint[index] === key) continue;
            clearPrev(index, c, r);
            lastPaint[index] = key;
            if (!on) continue;
            const s = step * (0.24 + 0.6 * strength);
            ctx.fillStyle = inkFor(strength);
            ctx.fillRect(x - s / 2 + dx, y - s / 2 + dy, s, s);
            continue;
          }

          const band = Math.min(BANDS - 1, Math.floor(v * BANDS));
          if (mode === "dither") {
            /* ordered halftone: the Bayer matrix decides on/off, the
                dot carries the weight — sampled material, not glyphs */
            const on = v > BAYER[r & 3][c & 3];
            const key =
              (on ? Math.min(11, 1 + Math.floor(v * 11)) : 0) * 262144 +
              dKey;
            if (!force && lastPaint[index] === key) continue;
            clearPrev(index, c, r);
            lastPaint[index] = key;
            if (!on) {
              continue;
            }
            const size = step * (0.18 + 0.4 * v);
            ctx.fillStyle = inkFor(Math.min(1, 0.35 + v * 0.65));
            ctx.fillRect(
              x - size / 2 + dx,
              y - size / 2 + dy,
              size,
              size,
            );
            continue;
          }
          const glyphFn = lookRef.current.glyphAt;
          const override = glyphFn
            ? glyphFn(tNow, x / width, y / height, cellX, cellY)
            : -1;
          const glyph =
            override >= 0
              ? Math.min(glyphs.length - 1, override)
              : Math.min(glyphs.length - 1, Math.floor(v * glyphs.length));
          const key = (glyph * BANDS + band) * 262144 + dKey;
          if (!force && lastPaint[index] === key) continue;
          clearPrev(index, c, r);
          lastPaint[index] = key;
          const sw = sprite.width / glyphs.length;
          const sh = sprite.height / BANDS;
          ctx.drawImage(
            sprite,
            glyph * sw,
            band * sh,
            sw,
            sh,
            c * step + dx,
            r * step + dy,
            step,
            step,
          );
        }
      }

      if (pulseOpen && pulseP >= 1) {
        pulseOpen = false;
        lastPulseKey = pulseKey;
      }
    }

    function active(): boolean {
      return (
        !reduced.matches &&
        inView &&
        !document.hidden &&
        (ambient > 0 || pulseOpen || collapse)
      );
    }

    const tick = (now: number): void => {
      raf = 0;
      /* asleep: the last frame stands, the cycle remembers where it was,
         and the loop stops rescheduling itself. The sleep is not a
         freeze-frame event — a sleeping panel is one the reader is not
         looking at, and waking it continues the same cycle. */
      if (lookRef.current.paused) {
        lastPaintMs = now;
        return;
      }
      paint(now);
      if (active()) raf = window.requestAnimationFrame(tick);
    };

    const schedule = (): void => {
      if (raf || !inView || document.hidden || reduced.matches) return;
      if (lookRef.current.paused) return;
      raf = window.requestAnimationFrame(tick);
    };

    /* the mount effect owns the scheduler; `paused` changes reach it
       through wakeRef so a waking field repaints on the next frame */
    wakeRef.current = schedule;

    const stop = (): void => {
      if (raf) {
        window.cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const io = new IntersectionObserver((entries) => {
      inView = entries.some((entry) => entry.isIntersecting);
      if (inView) {
        measure();
        schedule();
      } else stop();
    });
    io.observe(canvas);

    const onVisibility = (): void => {
      if (document.hidden) stop();
      else schedule();
    };
    document.addEventListener("visibilitychange", onVisibility);

    /* only fields that actually read the pointer subscribe to
       pointermove — page signals and textures skip the per-move work
       entirely */
    const wantsPointer = pointerRadius > 0;

    const onMove = (event: PointerEvent): void => {
      if (event.pointerType === "touch" || coarse.matches) return;
      const box = canvas.getBoundingClientRect();
      pointerCell.x = event.clientX - box.left;
      pointerCell.y = event.clientY - box.top;
      schedule();
    };
    const onOut = (): void => {
      pointerCell.x = -9999;
      pointerCell.y = -9999;
      schedule();
    };
    if (wantsPointer) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerout", onOut);
    }

    /* window resize and the element ResizeObserver fire together on
       every real resize; coalesce the burst into one measure per frame */
    let measureQueued = false;
    const onResize = (): void => {
      if (measureQueued) return;
      measureQueued = true;
      window.requestAnimationFrame(() => {
        measureQueued = false;
        measure();
        schedule();
      });
    };
    window.addEventListener("resize", onResize);
    /* the canvas box can change without a window resize — styles landing
       late, layout settling — so watch the element itself */
    const ro =
      "ResizeObserver" in window ? new ResizeObserver(onResize) : null;
    if (ro) ro.observe(canvas);

    const onMotionChange = (): void => {
      measure();
      schedule();
    };
    reduced.addEventListener("change", onMotionChange);

    measure();
    schedule();

    return () => {
      stop();
      wakeRef.current = null;
      io.disconnect();
      if (ro) ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (wantsPointer) {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerout", onOut);
      }
      window.removeEventListener("resize", onResize);
      reduced.removeEventListener("change", onMotionChange);
    };
    /* colour/quiet reach the engine through lookRef, refreshed above, so
       inline prop functions never rebind the field mid-paint */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [glyphs, cell, seed, ambient, pointerRadius, collapse, pulseKey, pulseMs, pulseDirection, flow, wavefront, drift, mode, dense]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      role="presentation"
    />
  );
}
