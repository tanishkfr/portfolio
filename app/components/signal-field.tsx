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
      coordinates — e.g. a vertical resolve ramp toward one edge. */
  shape?: (v: number, nx: number, ny: number) => number;
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
      Bayer-thresholded halftone dots. */
  mode?: "glyph" | "dither";
  pointerRadius?: number;
  pulseKey?: number | string | null;
  pulseMs?: number;
  pulseDirection?: "resolve" | "disperse";
  /** Disperse the field as its container scrolls out (the hero). */
  collapse?: boolean;
  className?: string;
};

const BANDS = 7;

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
  pointerRadius = 9,
  pulseKey = null,
  pulseMs = 1100,
  pulseDirection = "resolve",
  collapse = false,
  className,
}: SignalFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /** inline functions and tuples would rebind the effect every render;
      the engine reads them through this ref, refreshed before each paint */
  const lookRef = useRef({ color, quiet, shape, tune });

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const ctx0 = el.getContext("2d");
    if (!ctx0) return;
    const canvas = el;
    const ctx = ctx0;
    lookRef.current = { color, quiet, shape, tune };

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
    const pointerCell = { x: -9999, y: -9999 };
    let inView = false;
    let raf = 0;
    const clockStart = performance.now();
    const arriveStart = performance.now();
    let pulseStart = -1;
    let lastPulseKey: number | string | null = null;
    let pulseOpen = false;

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
      const box = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(box.width));
      height = Math.max(1, Math.round(box.height));
      dpr = Math.min(window.devicePixelRatio || 1, width < 760 ? 1.5 : 2);
      step = width < 760 ? Math.max(cell, 16) : cell;
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
    ): number {
      /* domain bend: sample the noise through a slow curl of itself —
         the pattern gains streamlines without any visible displacement
         of the grid */
      let gx = (x / step) * 0.055;
      let gy = (y / step) * 0.055;
      if (drift > 0) {
        /* the whole field slowly travels: one lattice cell every few
           minutes, so the matter relocates instead of boiling in place */
        gx += clock * drift * 0.5;
        gy += clock * drift * 0.13;
      }
      if (flow > 0) {
        const wx = lattice(gx * 0.9 + 11, gy * 0.9, clock * 0.5, seed + 19);
        const wy = lattice(gx * 0.9, gy * 0.9 + 7, clock * 0.5, seed + 23);
        gx += (wx - 0.5) * flow;
        gy += (wy - 0.5) * flow;
      }
      let v =
        lattice(gx, gy, clock, seed) * 0.62 +
        lattice((x / step) * 0.19, (y / step) * 0.19, clock * 1.6, seed + 7) *
          0.33;
      /* contrast: a thresholded field reads as sampled material —
         structure with quiet pockets — instead of uniform mush */
      const curve = lookRef.current.tune ?? [0.42, 2.1];
      v = (v - curve[0]) * curve[1];
      if (!reduced.matches && ambient > 0) {
        if (
          hash3(Math.floor(x / step), Math.floor(y / step), Math.floor(clock * 3), seed + 31) <
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
        const wave = Math.sin(s * 6.2 - clock * 22 - seed);
        v += Math.max(0, wave) * wavefront;
      }
      v *= 0.5 + 0.5 * resolve;
      v = v < 0 ? 0 : v > 1 ? 1 : v;
      const shapeFn = lookRef.current.shape;
      if (shapeFn) v = Math.max(0, Math.min(1, shapeFn(v, x / width, y / height)));
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
      const clock = (now - clockStart) / 24000 + Math.floor(seed * 13);
      const arrive = reduced.matches
        ? 1
        : smooth(Math.min(1, (now - arriveStart) / 1500));
      const collapseP = smooth(collapseProgress());
      /* the collapse is felt, not just scrolled: the field gives out
         while the cover is still half on screen */
      const resolve =
        arrive * Math.max(0, 1 - collapseP * 2.2);
      const densityScale = width < 760 ? 0.68 : 1;

      let pulseP = 1;
      if (pulseOpen) {
        pulseP = Math.min(1, (now - pulseStart) / pulseMs);
      }

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const index = r * cols + c;
          const x = c * step + step / 2;
          const y = r * step + step / 2;
          if (collapse && r < rows * collapseP * 1.12) {
            if (lastPaint[index] !== -1) {
              ctx.clearRect(c * step, r * step, step, step);
              lastPaint[index] = -1;
            }
            continue;
          }
          let v = field(x, y, clock, resolve) * densityScale;
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
            if (lastPaint[index] !== -1) {
              ctx.clearRect(c * step, r * step, step, step);
              lastPaint[index] = -1;
            }
            continue;
          }
          const band = Math.min(BANDS - 1, Math.floor(v * BANDS));
          if (mode === "dither") {
            /* ordered halftone: the Bayer matrix decides on/off, the
               dot carries the weight — sampled material, not glyphs */
            const on = v > BAYER[r & 3][c & 3];
            const key = on ? Math.min(11, 1 + Math.floor(v * 11)) : 0;
            if (!force && lastPaint[index] === key) continue;
            lastPaint[index] = key;
            if (!on) {
              ctx.clearRect(c * step, r * step, step, step);
              continue;
            }
            const size = step * (0.18 + 0.4 * v);
            ctx.fillStyle = lookRef.current.color(Math.min(1, 0.35 + v * 0.65)) ?? "transparent";
            ctx.fillRect(
              x - size / 2,
              y - size / 2,
              size,
              size,
            );
            continue;
          }
          const glyph = Math.min(glyphs.length - 1, Math.floor(v * glyphs.length));
          const key = glyph * BANDS + band;
          if (!force && lastPaint[index] === key) continue;
          lastPaint[index] = key;
          const sw = sprite.width / glyphs.length;
          const sh = sprite.height / BANDS;
          ctx.drawImage(
            sprite,
            glyph * sw,
            band * sh,
            sw,
            sh,
            c * step,
            r * step,
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
      paint(now);
      if (active()) raf = window.requestAnimationFrame(tick);
    };

    const schedule = (): void => {
      if (raf || !inView || document.hidden || reduced.matches) return;
      raf = window.requestAnimationFrame(tick);
    };

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

    const onMove = (event: PointerEvent): void => {
      if (event.pointerType === "touch" || pointerRadius <= 0 || coarse.matches)
        return;
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
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onOut);

    const onResize = (): void => {
      measure();
      schedule();
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
      io.disconnect();
      if (ro) ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("resize", onResize);
      reduced.removeEventListener("change", onMotionChange);
    };
    /* colour/quiet reach the engine through lookRef, refreshed above, so
       inline prop functions never rebind the field mid-paint */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [glyphs, cell, seed, ambient, pointerRadius, collapse, pulseKey, pulseMs, pulseDirection, flow, wavefront, drift, mode]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      role="presentation"
    />
  );
}
