"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ROOM_WORLDS } from "../data/room-worlds";
import { SignalField } from "./signal-field";

/* ================================================================
   PROJECT PORTRAITS — one family of interaction demos.

   Every portrait is a legible, large-scale mini-demonstration of its
   project's own behaviour, composed in the DOM so its states stay
   readable before any interaction: the evidence mark, the struck
   sentence, the returned receipt, the revised rule, the assembled
   site, the safe number. A supporting ASCII field — the same
   SignalField engine the folio is drawn from — sits beneath each
   stage as texture, scaffolding and residue, never as the message.

   One shell gives the series its family: a mono instrument rack
   (project tag + live state readout), a framed stage, corner
   registration ticks, and one plain caption that states the
   behaviour. Inside the frame each project composes differently.

   Each portrait runs one passive loop that already tells its story,
   and a pointer/touch interaction that deepens it. Nothing depends
   on hover: the loop and the caption carry the meaning, so every
   figure is decorative-but-legible (role="img" with a text
   alternative) and never a keyboard trap. Reduced motion freezes
   each demo at its resolved state.
   ================================================================ */

/* ---------- shared time helpers ---------- */

const smooth = (edge: number): number => {
  const x = Math.min(1, Math.max(0, edge));
  return x * x * (3 - 2 * x);
};

/** normalised position in a period */
const cyc = (t: number, period: number, phase = 0): number =>
  (((t / period + phase) % 1) + 1) % 1;

/** an eased window over a cycle: rises at `a`, falls at `b` */
const env = (c: number, a: number, b: number, fade = 0.14): number =>
  smooth((c - a) / fade) * (1 - smooth((c - b) / fade));

/** a stable per-column hash, used for residue texture */
const columnHash = (nx: number, salt: number): number => {
  const h = Math.sin(Math.floor(nx * 22) * 137.31 + salt * 61.7) * 43758.5453;
  return h - Math.floor(h);
};

/** one slow blink, per-element phase */
const blink = (t: number, rate: number, phase: number): number =>
  0.5 + 0.5 * Math.sin(t * rate + phase);

/* ---------- hooks ---------- */

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/**
 * One portrait cycle. Each phase holds for its own duration; the loop
 * only runs while the sheet is the one being read, so five sleeping
 * portraits cost nothing. A jump() lets an interaction fast-forward the
 * narrative (strike it, look away, apply a judgment) without stopping
 * the cycle — the loop simply continues from the new phase. Under
 * reduced motion the cycle is frozen at the portrait's resolved state.
 */
function useCycle(
  durations: readonly number[],
  live: boolean,
  resolved: number,
): readonly [number, (next: number) => void] {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const [stepped, setStepped] = useState(false);
  const phaseRef = useRef(0);
  const elapsed = useRef(0);
  const last = useRef(0);

  const jump = useCallback((next: number) => {
    phaseRef.current = next;
    elapsed.current = 0;
    setStepped(true);
    setPhase(next);
  }, []);

  useEffect(() => {
    /* reduced motion: the cycle never starts, and the portrait is read
       at its resolved state (an interaction can still step it) */
    if (reduced || !live) return;
    let id = 0;
    last.current = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last.current, 400);
      last.current = now;
      elapsed.current += dt;
      const current = phaseRef.current;
      if (elapsed.current >= durations[current % durations.length]) {
        elapsed.current = 0;
        const next = (current + 1) % durations.length;
        phaseRef.current = next;
        setPhase(next);
      }
      id = window.setTimeout(() => tick(performance.now()), 160);
    };
    id = window.setTimeout(() => tick(performance.now()), 160);
    return () => window.clearTimeout(id);
  }, [live, reduced, resolved, durations]);

  const shown = reduced && !stepped ? resolved : phase;
  return [shown, jump] as const;
}

/**
 * A pointer action that only fires on a deliberate tap — press and
 * release without dragging — so a scroll over a portrait never
 * triggers its demo on touch.
 */
function useTapAction<E extends HTMLElement>(
  action: (event: ReactPointerEvent<E>) => void,
): {
  onPointerDown: (event: ReactPointerEvent<E>) => void;
  onPointerUp: (event: ReactPointerEvent<E>) => void;
} {
  const start = useRef({ x: 0, y: 0 });
  const onPointerDown = useCallback((event: ReactPointerEvent<E>) => {
    start.current = { x: event.clientX, y: event.clientY };
  }, []);
  const onPointerUp = useCallback(
    (event: ReactPointerEvent<E>) => {
      const moved =
        Math.abs(event.clientX - start.current.x) +
        Math.abs(event.clientY - start.current.y);
      if (moved <= 12) action(event);
    },
    [action],
  );
  return { onPointerDown, onPointerUp };
}

/** A value that counts to its target — the one live number. Frames are
    painted straight into the DOM so the tween costs no React renders;
    only the settled value goes through state. */
function CountUp({
  value,
  animate,
  className,
}: {
  value: number;
  animate: boolean;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  const from = useRef(value);
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!animate || from.current === value) {
      from.current = value;
      setDisplay(value);
      return;
    }
    const start = from.current;
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / 620);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = Math.round(start + (value - start) * eased);
      if (p < 1) {
        const el = numberRef.current;
        if (el) el.textContent = `₹${next.toLocaleString("en-IN")}`;
        raf = requestAnimationFrame(step);
      } else {
        from.current = value;
        setDisplay(value);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, animate]);

  return (
    <span className={className} ref={numberRef}>
      ₹{display.toLocaleString("en-IN")}
    </span>
  );
}

/* ================================================================
   SUPPORTING ASCII FIELDS — scaffolding, residue, signal.

   These scripts no longer draw the message. Each one keeps a quiet
   register in the project's own material: a targeting grid, machine
   residue in the margins, a bit column, a surveyor's rule, layout
   guides, a tick rule. They are read as texture behind the demo.
   ================================================================ */

/** 01 · DoD — the targeting grid and its slow scan line. */
function evidenceShape(v: number, nx: number, ny: number, t: number): number {
  const gx = Math.abs(((nx * 4) % 1) - 0.5);
  const gy = Math.abs(((ny * 5) % 1) - 0.5);
  let out = v * 0.5;
  if (gx > 0.466 || gy > 0.473) out = Math.max(out, 0.66);
  const scan = env(cyc(t, 11), 0.02, 0.5, 0.14);
  if (scan > 0 && Math.abs(ny - scan) < 0.02) out = Math.max(out, 0.8);
  return out;
}

/** 02 · Pentimento — machine residue, blinking in the margins. */
function revisionShape(v: number, nx: number, ny: number, t: number): number {
  let out = v * 0.42;
  const margin = nx < 0.055 || nx > 0.945;
  if (margin && columnHash(nx + ny, 3) > 0.4) {
    out = Math.max(out, 0.55 * (0.35 + 0.65 * blink(t, 0.9, ny * 21)));
  }
  return out;
}

/** 03 · Invisible Interfaces — the bit column that keeps working. */
function absenceShape(v: number, nx: number, ny: number, t: number): number {
  let out = v * 0.38;
  if (nx > 0.935) {
    const cell = Math.floor(ny * 16);
    const bit =
      Math.sin(cell * 12.9898 + Math.floor(t * 3.2) * 78.233) * 43758.5453;
    out = Math.max(out, 0.3 + 0.6 * (bit - Math.floor(bit)));
  }
  return out;
}

/** 04 · Atlas — the surveyor's field: branch ticks and a base rule. */
function atlasShape(v: number, nx: number, ny: number, t: number): number {
  let out = v * 0.24;
  if (nx < 0.045 && columnHash(ny, 7) > 0.35) {
    out = Math.max(out, 0.5 + 0.3 * blink(t, 0.7, ny * 14));
  }
  if (ny > 0.945 && columnHash(nx, 11) > 0.3) out = Math.max(out, 0.7);
  return out;
}

/** 05 · Fluxion — the layout guides the build resolves onto. */
function fluxShape(v: number, nx: number, ny: number, t: number): number {
  let out = v * 0.3;
  const guide = Math.min(
    Math.abs(nx - 0.25),
    Math.abs(nx - 0.5),
    Math.abs(nx - 0.75),
  );
  if (guide < 0.007) out = Math.max(out, 0.62);
  const row = Math.abs(((ny * 6) % 1) - 0.5);
  if (row > 0.472) out = Math.max(out, 0.44 + 0.16 * blink(t, 0.5, ny * 9));
  return out;
}

/** 06 · Daynero — the ledger's balance fence and margin ticks. */
function numberShape(v: number, nx: number, ny: number, t: number): number {
  let out = v * 0.3;
  const margin = nx < 0.09 || nx > 0.91;
  const tick = Math.abs(((ny * 20) % 1) - 0.5);
  if (margin && tick > 0.34) {
    out = Math.max(out, 0.45 + 0.18 * blink(t, 1.1, ny * 30));
  }
  const fence = Math.max(Math.abs(nx - 0.16), Math.abs(nx - 0.84));
  if (fence < 0.006) out = Math.max(out, 0.42);
  return out;
}

/** 02 · Athena — the review queue along the right margin, over a progress
    spine. The field is wired to the demo through one live phase ref: when
    a weak concept is scheduled, the queue brightens — what was not
    retrieved comes back. */
const athenaPhase = { current: 0 };
function athenaShape(v: number, nx: number, ny: number, t: number): number {
  let out = v * 0.24;
  if (nx > 0.94) {
    const tick = Math.abs(((ny * 18) % 1) - 0.5);
    if (tick > 0.3) {
      const base = 0.34 + 0.22 * blink(t, 0.95, ny * 26);
      const calledBack =
        athenaPhase.current >= 4 ? 0.3 + 0.28 * Math.sin(t * 2.6 + ny * 9) : 0;
      out = Math.max(out, Math.min(1, base + calledBack));
    }
  }
  if (ny > 0.95 && columnHash(nx, 9) > 0.4) out = Math.max(out, 0.55);
  return out;
}

/* ================================================================
   THE SHELL — one frame for every behaviour.
   ================================================================ */

type PortraitMeta = {
  /** the instrument-rack tag, lowercase mono */
  tag: string;
  /** one plain line: what the demo does */
  caption: string;
  /** the pointer affordance, shown on hover only (never the meaning) */
  hint: string;
  /** the figure's text alternative (the authored demo) */
  a11y: string;
  /**
   * The real project, shown full-frame in the same stage as the demo:
   * a verified recording where one exists, otherwise a real capture.
   * One frame, two states — authored representation, real evidence.
   */
  real: {
    /** what the evidence actually is, stated plainly under the frame */
    label: string;
    kind: "video" | "image";
    /** video file, or the static capture */
    src: string;
    /** poster / fallback frame — always a real capture */
    poster: string;
    /** the text alternative for the real evidence */
    alt: string;
    /**
     * How the capture meets the plate. Every artifact in this folio is a
     * UI capture, so the answer is the same everywhere: fit it, never
     * crop it. `cover` remains available for a future asset that is
     * genuinely a crop — a poster, a texture — but nothing here is one,
     * and cropping 10–20% of an axis to fill a box is how evidence
     * quietly stops being evidence.
     */
    fit?: "cover" | "contain";
    position?: string;
  };
  glyphs: string;
  cell: number;
  seed: number;
  ambient: number;
  flow?: number;
  wavefront?: number;
  drift?: number;
  tune?: [number, number];
  ground: string;
  ink: string;
  /**
   * Caption and rack ink. A caption states an evidence boundary, so it is
   * a reading colour, not a whisper: these sit at an alpha that clears
   * 4.5:1 against their own ground at caption size.
   */
  muted: string;
  /**
   * The ground the real artifact stands on, sampled from the artifact
   * itself. The frame keeps the room's paper while it shows the authored
   * demonstration; when the real project takes the frame, the frame's own
   * ground goes with it, so a letterboxed capture sits on its own margin
   * rather than on the portfolio's.
   */
  plate: string;
  /**
   * Reading ink for the plate. The rack and the caption keep their places
   * when the real project arrives — the rack still states which state the
   * frame is in, the caption still states what the evidence is and where
   * its boundary lies — but they now sit *on the artifact's own surface*
   * rather than on the room's, so they need ink that is legible there.
   * On a light room carrying a dark application, the whole frame goes
   * dark behind the work; that change of surface is the moment.
   */
  plateInk: string;
  accent: string;
  color: (t: number) => string | null;
  shape: (
    v: number,
    nx: number,
    ny: number,
    t: number,
    cellX: number,
    cellY: number,
  ) => number;
};

function PortraitShell({
  slug,
  live,
  read,
  children,
}: {
  slug: string;
  live: boolean;
  read: string;
  children: ReactNode;
}) {
  const meta = PORTRAITS[slug];
  /* One frame, two states: the authored demo, and the real project.
     There is no button. A resting fine pointer previews the real project
     after a short intent delay; keyboard focus does the same; a tap on a
     touch screen toggles it. Pressing the demo takes priority, so an
     interactive portrait is never taken over mid-interaction. */
  const [showing, setShowing] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hoverTimer = useRef<number | null>(null);
  /* an interaction with the demo wins over the preview until the pointer
     leaves the frame */
  const hoverSuppressed = useRef(false);
  const isVideo = meta.real.kind === "video";
  /* The preview is only live while its sheet is the one being read. This is
     derived, not stored: the parent keys this portrait by its live state, so
     a sleeping sheet remounts back to its demo with the recording stopped. */
  const active = showing && live;
  /* Hover, focus and touch all reach the real project. Reduced motion is
     not excluded here — it removes autoplay instead, so the still frame and
     its controls are still reachable without any motion. */
  const visible = active || ((hovering || focused) && live);

  const clearHoverTimer = () => {
    if (hoverTimer.current) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };

  useEffect(() => clearHoverTimer, []);

  /* A short intent delay: a pointer passing through never flashes the
     recording, and a pointer that lands on the demo to interact with it
     cancels the preview before it opens. */
  const onEnter = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || hoverSuppressed.current) return;
    clearHoverTimer();
    hoverTimer.current = window.setTimeout(() => {
      hoverTimer.current = null;
      setHovering(true);
    }, 260);
  };

  const onLeave = () => {
    clearHoverTimer();
    hoverSuppressed.current = false;
    setHovering(false);
  };

  /* A touch screen has no hover, so a tap toggles the preview — the same
     reach the button used to give, without the button. A mouse press keeps
     its old meaning: the demo wins, and the preview waits for the pointer
     to leave. */
  const onDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") {
      setShowing((value) => !value);
      return;
    }
    clearHoverTimer();
    hoverSuppressed.current = true;
    setHovering(false);
  };

  /* Keyboard reaches the same preview the pointer does — and only the
     keyboard. A tap or a click also focuses a focusable frame, so an
     ungated focus route made the tap's second half impossible: the closing
     tap cleared `showing` and the focus it had just created re-opened the
     real project in the same commit, leaving a toggle that could only turn
     on. `:focus-visible` is the browser's own answer to which focus the
     reader asked for, and the header already uses it for the same reason.
     Engines without support keep the previous behaviour. */
  const onFocus = (event: FocusEvent<HTMLElement>) => {
    let visible = true;
    try {
      visible = event.currentTarget.matches(":focus-visible");
    } catch {
      /* no :focus-visible: focus is the cue */
    }
    if (visible) setFocused(true);
  };
  const onBlur = () => setFocused(false);

  /* the recording plays only while its preview is visible, its sheet is the
     one being read, the tab is visible, and motion is allowed */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const allowed = visible && !document.hidden && !reduced;
    if (allowed) {
      const playing = video.play();
      if (playing && typeof playing.catch === "function") playing.catch(() => {});
    } else {
      video.pause();
    }
  }, [visible, reduced]);

  /* a hidden tab stops the recording; returning resumes it */
  useEffect(() => {
    if (!isVideo) return;
    const onVisibility = () => {
      const video = videoRef.current;
      if (!video) return;
      if (document.hidden) {
        video.pause();
        return;
      }
      if (visible && !reduced) {
        const playing = video.play();
        if (playing && typeof playing.catch === "function") playing.catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [isVideo, visible, reduced]);

  const mediaStyle = meta.real.position
    ? { objectPosition: meta.real.position }
    : undefined;

  return (
    <div className="xpp-wrap">
      <figure
        className="xp-portrait"
        data-portrait={slug}
        data-live={live ? "true" : "false"}
        data-view={visible ? "real" : "demo"}
        tabIndex={0}
        /* A focusable frame whose state is its interaction needs a name.
           `role="figure"` takes none from its caption in Chromium, so the
           tree exposed this as an unnamed focusable group: a reader landed
           on it with nothing to go on. The name is the frame's own tag —
           the line the rack already shows, which is aria-hidden, so this
           restores information rather than repeating it. */
        role="group"
        aria-label={meta.tag}
        onFocus={onFocus}
        onBlur={onBlur}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        onPointerDown={onDown}
        style={
          {
            background: meta.ground,
            "--accent-ink": ROOM_WORLDS[slug]?.accentInk,
            "--pp-ink": meta.ink,
            "--pp-muted": meta.muted,
            "--pp-accent": meta.accent,
            "--pp-ground": meta.ground,
            "--pp-plate": meta.plate,
            "--pp-plate-ink": meta.plateInk,
            "--pp-rule": `color-mix(in srgb, ${meta.ink} 20%, transparent)`,
          } as CSSProperties
        }
      >
        <SignalField
          className="xp-portrait-field"
          glyphs={meta.glyphs}
          cell={meta.cell}
          paused={!live || visible}
          seed={meta.seed}
          ambient={meta.ambient}
          flow={meta.flow}
          wavefront={meta.wavefront}
          drift={meta.drift}
          tune={meta.tune}
          pointerRadius={0}
          color={meta.color}
          shape={meta.shape}
        />
        <div className="xpp-rack">
          <span className="xpp-tag" aria-hidden="true">
            {meta.tag}
          </span>
          <span className="xpp-read" aria-hidden="true">
            {visible ? "real project" : read}
          </span>
        </div>

        <div className="xpp-stage">
          {/* STATE A — the authored demonstration, with a text alternative */}
          <div
            className="xpp-demo-layer"
            role="img"
            aria-label={meta.a11y}
            aria-hidden={visible ? "true" : undefined}
          >
            <span className="xpp-reg xpp-reg--tl" />
            <span className="xpp-reg xpp-reg--tr" />
            <span className="xpp-reg xpp-reg--bl" />
            <span className="xpp-reg xpp-reg--br" />
            <span className="xpp-hint">{meta.hint}</span>
            {children}
          </div>

          {/* STATE B — the real project, filling the same frame.
              Real media is requested only once this sheet is the one being
              read: the poster frame for recordings, and the still capture
              itself. Off-screen sheets keep their authored demonstration
              and download nothing until the reader arrives. The evidence
              paths stay in the markup as data attributes either way, so
              every portrait still names its real capture. */}
          <div className="xpp-real" aria-hidden={visible ? undefined : "true"}>
            {isVideo ? (
              <video
                ref={videoRef}
                className="xpp-real-media"
                data-fit={meta.real.fit ?? "cover"}
                data-src={meta.real.src}
                data-poster={meta.real.poster}
                poster={live ? meta.real.poster : undefined}
                src={live ? meta.real.src : undefined}
                preload="none"
                muted
                playsInline
                controls={reduced}
                aria-label={meta.real.alt}
                style={mediaStyle}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="xpp-real-media"
                data-fit={meta.real.fit ?? "cover"}
                data-src={meta.real.src}
                src={live ? meta.real.src : undefined}
                loading="lazy"
                decoding="async"
                alt={visible ? meta.real.alt : ""}
                style={mediaStyle}
              />
            )}
          </div>
        </div>

        <figcaption className="xpp-caption">
          <span className="xpp-caption-text">
            {visible ? meta.real.label : meta.caption}
          </span>
          {/* The preview affordance: a small tag under the caption, so the
              portrait's second state is discoverable before anyone hovers
              it. It keeps its line in every state, so waking it cannot
              reflow the sheet, and it is awake only for the sheet being
              read — and only while the real project is still closed. */}
          <span
            className="xpp-invite"
            data-on={live && !visible ? "true" : undefined}
          >
            <span className="xpp-invite-fine">hover for preview</span>
            <span className="xpp-invite-touch">tap for preview</span>
          </span>
        </figcaption>
      </figure>
    </div>
  );
}

/* ================================================================
   01 · DESIGN OR DISASTER — point at the evidence, then judge.
   A screen carries a quiet, contested surface. A target travels
   in, locks a region, and a mark lands; three juror readings light
   up beside it. Cycle: scan → mark 01 → mark 02 → mark 03 →
   hold the comparison → release. Pointing anywhere places your own
   mark and adds it to the tally.
   ================================================================ */

const DOD_DURATIONS = [1300, 1100, 1100, 1100, 3000, 700] as const;
const DOD_RESOLVED = 4;

const DOD_REGIONS = [
  { x: 74, y: 21, w: 23, h: 31 },
  { x: 3, y: 22, w: 48, h: 31 },
  { x: 34, y: 59, w: 32, h: 22 },
] as const;

const DOD_START = { x: 6, y: 84 };

/* a screen skeleton, not a product: header, hero, cards, buttons */
const DOD_BLOCKS = [
  { x: 5, y: 7, w: 90, h: 6, tone: "bar" },
  { x: 7, y: 15, w: 20, h: 2.6, tone: "line" },
  { x: 70, y: 14, w: 24, h: 3.4, tone: "line" },
  { x: 5, y: 24, w: 44, h: 26, tone: "hero" },
  { x: 8, y: 28, w: 26, h: 2.6, tone: "line" },
  { x: 8, y: 33, w: 34, h: 5, tone: "lineStrong" },
  { x: 8, y: 41, w: 16, h: 5, tone: "button" },
  { x: 54, y: 24, w: 18, h: 12, tone: "card" },
  { x: 76, y: 24, w: 19, h: 26, tone: "card" },
  { x: 57, y: 29, w: 12, h: 2, tone: "line" },
  { x: 57, y: 33, w: 9, h: 2, tone: "line" },
  { x: 79, y: 40, w: 13, h: 5, tone: "lineStrong" },
  { x: 5, y: 55, w: 90, h: 2.4, tone: "line" },
  { x: 5, y: 61, w: 28, h: 17, tone: "card" },
  { x: 36, y: 61, w: 28, h: 17, tone: "card" },
  { x: 67, y: 61, w: 28, h: 17, tone: "card" },
  { x: 8, y: 65, w: 14, h: 2.4, tone: "line" },
  { x: 39, y: 65, w: 14, h: 2.4, tone: "line" },
  { x: 70, y: 65, w: 14, h: 2.4, tone: "line" },
  { x: 8, y: 71, w: 20, h: 2.4, tone: "line" },
  { x: 39, y: 71, w: 20, h: 2.4, tone: "line" },
  { x: 70, y: 71, w: 20, h: 2.4, tone: "line" },
  { x: 5, y: 85, w: 20, h: 8, tone: "button" },
  { x: 75, y: 85, w: 20, h: 8, tone: "button" },
] as const;

const DOD_READINGS = [
  { juror: "j1", lens: "hierarchy", bar: 34 },
  { juror: "j3", lens: "trust", bar: 62 },
  { juror: "j5", lens: "feeling", bar: 48 },
] as const;

function EvidenceDemo({ live }: { live: boolean }) {
  const [phase] = useCycle(DOD_DURATIONS, live, DOD_RESOLVED);
  const [placed, setPlaced] = useState<{ x: number; y: number; id: number }[]>(
    [],
  );
  const [inside, setInside] = useState(false);
  const screenRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const pointRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);
  const seq = useRef(0);

  const loopMarks = phase >= 1 && phase <= 4 ? Math.min(3, phase) : 0;
  const total = Math.min(3, loopMarks + placed.length);
  const target = phase >= 1 && phase <= 4 ? DOD_REGIONS[Math.min(2, phase - 1)] : null;
  const cross = target
    ? { x: target.x + target.w / 2, y: target.y + target.h / 2 }
    : DOD_START;

  const track = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    pointRef.current = { x: event.clientX, y: event.clientY };
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const el = cursorRef.current;
      const box = screenRef.current?.getBoundingClientRect();
      if (!el || !box) return;
      el.style.transform = `translate(${pointRef.current.x - box.left}px, ${pointRef.current.y - box.top}px)`;
    });
  };

  const place = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!live) return;
    const box = screenRef.current?.getBoundingClientRect();
    if (!box) return;
    const x = ((event.clientX - box.left) / box.width) * 100;
    const y = ((event.clientY - box.top) / box.height) * 100;
    seq.current += 1;
    setPlaced((prev) => [...prev.slice(-2), { x, y, id: seq.current }]);
  };

  const leave = () => {
    setInside(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  };

  const screenTap = useTapAction<HTMLDivElement>((event) => place(event));

  return (
    <PortraitShell
      slug="design-or-disaster"
      live={live}
      read={`marks ${String(total).padStart(2, "0")}`}
    >
      <div className="xpp-dod xpp-demo">
        <div
          className="xpp-dod-screen"
          ref={screenRef}
          onPointerMove={track}
          onPointerEnter={() => setInside(true)}
          onPointerLeave={leave}
          {...screenTap}
        >
          {DOD_BLOCKS.map((block, index) => (
            <span
              key={index}
              className="xpp-dod-block"
              data-tone={block.tone}
              style={{
                left: `${block.x}%`,
                top: `${block.y}%`,
                width: `${block.w}%`,
                height: `${block.h}%`,
              }}
            />
          ))}
          {target ? (
            <span
              className="xpp-dod-target"
              style={
                {
                  width: `${target.w}%`,
                  height: `${target.h}%`,
                  "--tx": target.x,
                  "--ty": target.y,
                } as CSSProperties
              }
            />
          ) : null}
          {Array.from({ length: loopMarks }, (_, index) => {
            const region = DOD_REGIONS[index];
            return (
              <span
                key={`loop-${index}`}
                className="xpp-dod-mark"
                data-kind="loop"
                style={{
                  left: `${region.x + region.w / 2}%`,
                  top: `${region.y + region.h / 2}%`,
                }}
              >
                <span className="xpp-dod-tag">{DOD_READINGS[index].juror}</span>
              </span>
            );
          })}
          {placed.map((mark) => (
            <span
              key={mark.id}
              className="xpp-dod-mark"
              data-kind="yours"
              style={{ left: `${mark.x}%`, top: `${mark.y}%` }}
            >
              <span className="xpp-dod-tag">you</span>
            </span>
          ))}
          <span
            className="xpp-dod-cross"
            data-idle={target ? undefined : "true"}
            style={{ "--cx": cross.x, "--cy": cross.y } as CSSProperties}
          />
          <span
            className="xpp-dod-cursor"
            data-on={inside ? "true" : undefined}
            ref={cursorRef}
          />
        </div>

        <ul className="xpp-dod-readings">
          {DOD_READINGS.map((reading, index) => (
            <li key={reading.juror} data-lit={index < total || undefined}>
              <span className="xpp-dod-juror">{reading.juror}</span>
              <span className="xpp-dod-lens">{reading.lens}</span>
              <span className="xpp-dod-track">
                <i style={{ width: `${reading.bar}%` }} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </PortraitShell>
  );
}

/* ================================================================
   02 · PENTIMENTO — the machine drafts, the person rewrites.
   A machine sentence stands in a framed first draft with its
   evidence; a strike sweeps it; it stays visible as a faint
   underpainting; the person's correction writes itself in as the
   heaviest line in the panel. Tap the draft to strike it, tap
   again to restore it.
   ================================================================ */

const PENT_DURATIONS = [1700, 750, 900, 1500, 3400, 700] as const;
const PENT_RESOLVED = 4;

const PENT_CLAIM = "You return to films about leaving.";
const PENT_FIX = "I watch what I'm not ready to say out loud yet.";
const PENT_EVIDENCE = [
  "letterboxd.csv · 214 entries",
  "17 rewatches · 2019–2024",
  "confidence · medium",
] as const;

function PentimentoDemo({ live }: { live: boolean }) {
  const [phase, jump] = useCycle(PENT_DURATIONS, live, PENT_RESOLVED);
  const reduced = useReducedMotion();
  const striking = phase >= 1;
  const struck = phase >= 2;
  const rewritten = phase >= 3;
  const read = rewritten ? "draft 2 · yours" : struck ? "struck" : "draft 1";

  const tap = () => {
    if (!live) return;
    /* reduced motion has no sweep to watch, so the tap lands on the
       outcome rather than a phase the frozen loop cannot leave */
    jump(struck ? 0 : reduced ? PENT_RESOLVED : 2);
  };
  const tapGuard = useTapAction<HTMLDivElement>(tap);

  return (
    <PortraitShell slug="pentimento" live={live} read={read}>
      <div
        className="xpp-pent xpp-demo"
        data-striking={striking ? "true" : undefined}
        data-struck={struck ? "true" : undefined}
        data-rewritten={rewritten ? "true" : undefined}
        {...tapGuard}
      >
        <div className="xpp-pent-draft">
          <p className="xpp-pent-label">
            <span>first draft · written by the system</span>
            <span className="xpp-pent-state">{struck ? "kept as evidence" : "uncorrected"}</span>
          </p>
          <p className="xpp-pent-claim">
            {PENT_CLAIM}
            <span className="xpp-pent-bar" />
          </p>
          <ul className="xpp-pent-evidence">
            {PENT_EVIDENCE.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div className="xpp-pent-fix">
          <p className="xpp-pent-label">
            <span>second draft · written by you</span>
            <span className="xpp-pent-state">has the last word</span>
          </p>
          <p className="xpp-pent-fix-line">
            {PENT_FIX.split(" ").map((word, index) => (
              <span key={index} style={{ "--w": index } as CSSProperties}>
                {word}{" "}
              </span>
            ))}
          </p>
          <span className="xpp-pent-rule" />
        </div>
      </div>
    </PortraitShell>
  );
}

/* ================================================================
   03 · INVISIBLE INTERFACES — leave, it keeps working, return.
   A bounded restoration plate: rows waiting, a status pip. When
   attention leaves, the plate quiets, the bit column keeps
   streaming and the steps complete one by one. On return the plate
   brightens and a receipt slides in with the record. Tap to look
   away; the real tab visibility drives the same story.
   ================================================================ */

const ABS_DURATIONS = [2400, 700, 2300, 700, 2800, 900] as const;
const ABS_RESOLVED = 4;

const ABS_STEPS = [
  "scan negatives",
  "repair dust",
  "rebuild tone",
  "render preview",
] as const;

const ABS_BITS =
  "01001101 01110101 01110011 01100101 00100000 01110111 01101111 01110010 01101011 00100000 01101001 01101110 00100000 01110100 01101000 01100101 00100000 01100100 01100001 01110010 01101011";

function AbsenceDemo({ live }: { live: boolean }) {
  const [phase, jump] = useCycle(ABS_DURATIONS, live, ABS_RESOLVED);
  const reduced = useReducedMotion();
  const away = phase === 1 || phase === 2;
  const done = phase >= 2 && phase <= 4;
  const receipt = phase === 4;
  const read = ["present", "away · working", "away · working", "returned", "receipt", "reset"][
    phase
  ];

  /* The project's own mechanic: hidden time is the input. If the
     visitor leaves the tab while this sheet is the one being read,
     the demo goes away and works; returning shows the receipt. */
  useEffect(() => {
    if (!live) return;
    const onVisibility = () => jump(document.hidden ? 2 : 4);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [live, jump]);

  const tap = () => {
    if (!live) return;
    /* reduced motion has no absence sequence to watch, so the tap lands
       on the receipt — the point of the story — or returns to present */
    jump(receipt ? 0 : reduced ? ABS_RESOLVED : 1);
  };
  const tapGuard = useTapAction<HTMLDivElement>(tap);

  return (
    <PortraitShell slug="invisible-interfaces" live={live} read={read}>
      <div
        className="xpp-abs xpp-demo"
        data-away={away ? "true" : undefined}
        data-done={done ? "true" : undefined}
        data-receipt={receipt ? "true" : undefined}
        {...tapGuard}
      >
        <div className="xpp-abs-plate">
          <div className="xpp-abs-head">
            <span>restoration · 1 file</span>
            <span className="xpp-abs-state">
              {receipt ? "complete" : away ? "working" : "idle"}
            </span>
          </div>
          <ul className="xpp-abs-steps">
            {ABS_STEPS.map((step, index) => (
              <li
                key={step}
                data-done={done ? "true" : undefined}
                style={{ "--i": index } as CSSProperties}
              >
                <span className="xpp-abs-tick" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
          <p className="xpp-abs-bits">
            <span>
              {ABS_BITS} · {ABS_BITS}
            </span>
          </p>
          <p className="xpp-abs-away">tab hidden · still working</p>
        </div>

        <div className="xpp-abs-receipt">
          <p className="xpp-abs-receipt-head">
            <span>receipt</span>
            <span>returned</span>
          </p>
          <ul>
            <li>
              <span>4 of 4 steps</span>
              <i>completed</i>
            </li>
            <li>
              <span>1 file changed</span>
              <i>0 removed</i>
            </li>
            <li>
              <span>original kept</span>
              <i>discard available</i>
            </li>
          </ul>
        </div>
      </div>
    </PortraitShell>
  );
}

/* ================================================================
   04 · ATLAS — a rule, tested, revised, kept.
   The provisional rule stands at the top; three distant cases put
   pressure on it; the visitor's judgment (hold, refine, fracture)
   rewrites the rule below while every change joins the lineage
   rail. Tap a case to apply its judgment; tap the provisional rule
   to start over.
   ================================================================ */

const ATL_DURATIONS = [1600, 1500, 1600, 1700, 3200, 800] as const;
const ATL_RESOLVED = 4;

const ATL_RULE = "Tap outside a dialog to close it.";

const ATL_CASES = [
  { id: "01", name: "Lightbox", note: "low stakes", verdict: "hold" },
  { id: "02", name: "Transfer", note: "high stakes", verdict: "refine" },
  { id: "03", name: "Switch access", note: "no pointer", verdict: "fracture" },
] as const;

const ATL_REVISED = [
  { note: "awaiting pressure", parts: [{ text: "Not tested yet." }] },
  { note: "held · no change", parts: [{ text: ATL_RULE }] },
  {
    note: "refined · case 02",
    parts: [
      { text: "Tap outside to close it — " },
      { text: "unless an unsaved action would be lost.", hl: true },
    ],
  },
  {
    note: "rewritten · case 03",
    parts: [
      { text: "Close is never triggered by " },
      { text: "an outside tap alone.", hl: true },
    ],
  },
] as const;

function AtlasDemo({ live }: { live: boolean }) {
  const [phase, jump] = useCycle(ATL_DURATIONS, live, ATL_RESOLVED);
  const applied = phase >= 4 ? 3 : Math.min(3, phase);
  const revised = ATL_REVISED[applied];
  const version = applied <= 1 ? 1 : applied;
  const read = `rule v${version} · lineage ${String(applied).padStart(2, "0")}`;

  const tapCase = (index: number) => {
    if (!live) return;
    jump(index + 1);
  };
  const caseTap = useTapAction<HTMLUListElement>((event) => {
    const item = (event.target as HTMLElement).closest<HTMLElement>("li[data-case]");
    if (!item) return;
    const index = Number(item.dataset.case);
    if (Number.isFinite(index)) tapCase(index);
  });
  const ruleTap = useTapAction<HTMLDivElement>(() => {
    if (live) jump(0);
  });

  return (
    <PortraitShell slug="atlas" live={live} read={read}>
      <div className="xpp-atl xpp-demo">
        <div className="xpp-atl-flow">
          <div className="xpp-atl-block xpp-atl-block--rule" {...ruleTap}>
            <p className="xpp-atl-label">provisional rule</p>
            <p className="xpp-atl-text">{ATL_RULE}</p>
          </div>

          <ul className="xpp-atl-cases" {...caseTap}>
            {ATL_CASES.map((item, index) => (
              <li
                key={item.id}
                data-case={index}
                data-judged={index < applied || undefined}
                data-next={index === applied && applied < 3 ? "true" : undefined}
              >
                <span className="xpp-atl-case-id">{item.id}</span>
                <span className="xpp-atl-case-name">{item.name}</span>
                <span className="xpp-atl-case-note">{item.note}</span>
                <span className="xpp-atl-verdict">{item.verdict}</span>
              </li>
            ))}
          </ul>

          <div className="xpp-atl-block xpp-atl-block--revised">
            <p className="xpp-atl-label">
              <span>revised rule</span>
              <span className="xpp-atl-note">{revised.note}</span>
            </p>
            <p className="xpp-atl-text xpp-atl-text--strong" key={applied}>
              {revised.parts.map((part, index) =>
                "hl" in part && part.hl ? (
                  <em className="xpp-atl-hl" key={index}>
                    {part.text}
                  </em>
                ) : (
                  <span key={index}>{part.text}</span>
                ),
              )}
            </p>
          </div>
        </div>

        <aside className="xpp-atl-rail">
          <p className="xpp-atl-label">lineage</p>
          <ol>
            {ATL_CASES.map((item, index) => (
              <li
                key={item.id}
                data-on={index < applied || undefined}
                style={{ "--i": index } as CSSProperties}
              >
                <span className="xpp-atl-node" />
                <span className="xpp-atl-rail-text">
                  {item.id} · {item.verdict}
                </span>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </PortraitShell>
  );
}

/* ================================================================
   05 · FLUXION STUDIOS — fragments, structure, system, shipped.
   Seven loose pieces drift in the open, then lock into a page:
   wordmark, nav, hero line, cards, image, footer. The browser
   chrome snaps around them and the phone companion arrives. Hover
   or tap the stage to build it; leave to scatter the pieces again.
   ================================================================ */

const FLX_DURATIONS = [2400, 2400, 3600, 800] as const;
const FLX_RESOLVED = 2;

function FluxionDemo({ live }: { live: boolean }) {
  const [phase, jump] = useCycle(FLX_DURATIONS, live, FLX_RESOLVED);
  const [hover, setHover] = useState(false);
  const built = hover || phase === 1 || phase === 2;
  const shipped = hover || phase === 2;
  const read = shipped
    ? "shipped · live"
    : built
      ? "assembling"
      : "loose fragments";

  const enter = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") setHover(true);
  };

  const tap = () => {
    if (!live) return;
    jump(phase >= 2 ? 0 : 2);
  };
  const buildTap = useTapAction<HTMLDivElement>(tap);

  return (
    <PortraitShell
      slug="fluxion-studios"
      live={live}
      read={read}
    >
      <div
        className="xpp-flx xpp-demo"
        data-built={built ? "true" : undefined}
        data-shipped={shipped ? "true" : undefined}
        onPointerEnter={enter}
        onPointerLeave={() => setHover(false)}
        {...buildTap}
      >
        <div className="xpp-flx-desk">
          <div className="xpp-flx-chrome">
            <i />
            <i />
            <i />
            <span>fluxion.studios</span>
          </div>
          <div className="xpp-flx-page">
            <span
              className="xpp-flx-piece xpp-flx-mark"
              data-piece="mark"
              style={{ "--i": 0 } as CSSProperties}
            >
              Fluxion
            </span>
            <span
              className="xpp-flx-piece xpp-flx-nav"
              data-piece="nav"
              style={{ "--i": 1 } as CSSProperties}
            >
              work · studio · contact
            </span>
            <span
              className="xpp-flx-piece xpp-flx-hero"
              data-piece="hero"
              style={{ "--i": 2 } as CSSProperties}
            >
              Sites for businesses that already have a voice.
            </span>
            <span
              className="xpp-flx-piece xpp-flx-card"
              data-piece="card1"
              style={{ "--i": 3 } as CSSProperties}
            >
              <b>Scope</b>
              <em>stated first</em>
            </span>
            <span
              className="xpp-flx-piece xpp-flx-card"
              data-piece="card2"
              style={{ "--i": 4 } as CSSProperties}
            >
              <b>Build</b>
              <em>in-house</em>
            </span>
            <span
              className="xpp-flx-piece xpp-flx-image"
              data-piece="image"
              style={{ "--i": 5 } as CSSProperties}
            />
            <span
              className="xpp-flx-piece xpp-flx-footer"
              data-piece="footer"
              style={{ "--i": 6 } as CSSProperties}
            />
          </div>
        </div>
        <div className="xpp-flx-phone">
          <span className="xpp-flx-phone-mark">Fluxion</span>
          <span className="xpp-flx-phone-block" />
          <span className="xpp-flx-phone-row" />
          <span className="xpp-flx-phone-row" />
          <span className="xpp-flx-phone-row" />
        </div>
        <span className="xpp-flx-stamp">shipped</span>
      </div>
    </PortraitShell>
  );
}

/* ================================================================
   06 · DAYNERO — a month of spending, one safe number.
   A ledger card carries the safe daily amount, the division it
   came from, and the money that fed it. Spending events land one
   by one; each landing sends a spark into the number and the
   number recalculates. Tap a pending row to log it now.
   ================================================================ */

const DAY_DURATIONS = [2400, 1600, 1600, 1600, 3200, 800] as const;
const DAY_RESOLVED = 4;

const DAY_START = { safe: 1000, left: 24000, days: 24 };
const DAY_TX = [
  { name: "Books", amount: 640, safe: 973, left: 23360 },
  { name: "Metro pass", amount: 160, safe: 967, left: 23200 },
  { name: "Dinner out", amount: 540, safe: 944, left: 22660 },
] as const;
const DAY_MIX = "in ₹42,000 · out ₹18,000 · buffer ₹6,000";

function DayneroDemo({ live }: { live: boolean }) {
  const [phase, jump] = useCycle(DAY_DURATIONS, live, DAY_RESOLVED);
  const reduced = useReducedMotion();
  const landed = phase === 5 ? 0 : Math.min(3, phase);
  const current = landed === 0 ? DAY_START : DAY_TX[landed - 1];
  const read = `safe · ₹${current.safe.toLocaleString("en-IN")}`;

  const tapRow = (index: number) => {
    if (!live) return;
    jump(index + 1);
  };

  const reset = () => {
    if (!live) return;
    jump(0);
  };

  const cardTap = useTapAction<HTMLDivElement>(reset);
  const rowTap = useTapAction<HTMLUListElement>((event) => {
    const item = (event.target as HTMLElement).closest<HTMLElement>("li[data-index]");
    if (!item) return;
    const index = Number(item.dataset.index);
    if (Number.isFinite(index)) tapRow(index);
  });

  return (
    <PortraitShell slug="daynero" live={live} read={read}>
      <div className="xpp-day xpp-demo">
        <div className="xpp-day-card" {...cardTap}>
          <div className="xpp-day-head">
            <span>safe to spend · today</span>
            <span className="xpp-day-pip">live</span>
          </div>
          <p className="xpp-day-number">
            <CountUp value={current.safe} animate={live && !reduced} />
          </p>
          <p className="xpp-day-calc">
            ₹{current.left.toLocaleString("en-IN")} left ÷ {DAY_START.days} days
          </p>
          <p className="xpp-day-mix">{DAY_MIX}</p>
        </div>

        <ul className="xpp-day-rows" {...rowTap}>
          {DAY_TX.map((tx, index) => (
            <li
              key={tx.name}
              data-index={index}
              data-landed={index < landed || undefined}
              data-pending={index >= landed ? "true" : undefined}
            >
              <span className="xpp-day-tick" />
              <span className="xpp-day-row-name">{tx.name}</span>
              <span className="xpp-day-row-amount">₹{tx.amount}</span>
              <span className="xpp-day-spark" />
            </li>
          ))}
        </ul>
      </div>
    </PortraitShell>
  );
}

/* ================================================================
   02 · ATHENA — reading is not knowing.
   A source is read; instead of being marked complete it asks the
   learner to explain the idea. The explanation becomes evidence
   linked to its source, and a concept that was not retrieved is
   scheduled for review. One moment, not the whole product. The
   answer shown is a staged demonstration, labelled as such.
   ================================================================ */

const ATH_DURATIONS = [2300, 2700, 3000, 2400, 3000, 700] as const;
const ATH_RESOLVED = 4;

/** Athena's three review modes, as built. */
const ATH_MODES = ["Explain Back", "Cue Cards", "Apply It"] as const;

function AthenaDemo({ live }: { live: boolean }) {
  const [phase, jump] = useCycle(ATH_DURATIONS, live, ATH_RESOLVED);
  const reduced = useReducedMotion();
  /* the field reads the demo's phase, so the review queue in the margin
     answers the story beat for beat */
  useEffect(() => {
    athenaPhase.current = phase;
  }, [phase]);
  const read = [
    "review · setup",
    "attempt",
    "feedback",
    "activity ≠ knowledge",
    "review · earlier",
    "reset",
  ][phase];

  const tap = () => {
    if (!live) return;
    /* reduced motion has no sequence to watch, so the tap lands on the
       outcome — the weak concept coming back — or returns to the start */
    jump(
      phase === ATH_RESOLVED ? 0 : reduced ? ATH_RESOLVED : Math.min(phase + 1, 4),
    );
  };
  const tapGuard = useTapAction<HTMLDivElement>(tap);

  return (
    <PortraitShell slug="athena" live={live} read={read}>
      <div className="xpp-ath xpp-demo" data-phase={phase} {...tapGuard}>
        <div className="xpp-ath-main">
          {/* the review setup: a mode is chosen, the source is closed */}
          <div className="xpp-ath-plate">
            <p className="xpp-ath-head">
              <span>review · attention</span>
            </p>
            <ul className="xpp-ath-modes">
              {ATH_MODES.map((mode, index) => (
                <li
                  key={mode}
                  data-on={index === 0 ? "true" : undefined}
                  data-dim={phase >= 1 && index !== 0 ? "true" : undefined}
                >
                  {mode}
                </li>
              ))}
            </ul>
            <p className="xpp-ath-scope">
              paragraph 2 · respond without the source
            </p>
          </div>

          {/* the attempt: the learner's own words, and how sure they felt */}
          <div className="xpp-ath-response" data-on={phase >= 1 ? "true" : undefined}>
            <p className="xpp-ath-quote">
              “Attention is not only about removing distractions; the structure
              of a task changes what gets noticed.”
            </p>
            <p className="xpp-ath-conf">confident</p>
          </div>

          {/* the product's core distinction, made structural */}
          <div className="xpp-ath-split" data-on={phase >= 3 ? "true" : undefined}>
            <p className="xpp-ath-meter">
              <span className="xpp-ath-meter-k">activity</span>
              <span className="xpp-ath-meter-bar" data-full="true" />
              <span className="xpp-ath-meter-v">explored · noted</span>
            </p>
            <p className="xpp-ath-meter">
              <span className="xpp-ath-meter-k">knowledge</span>
              <span className="xpp-ath-meter-bar" data-part="true" />
              <span className="xpp-ath-meter-v">developing</span>
            </p>
          </div>
        </div>

        <div className="xpp-ath-side">
          {/* feedback: what was demonstrated, what is missing, and where to fix it */}
          <ol className="xpp-ath-flow">
            <li data-on={phase >= 2 ? "true" : undefined}>
              <span className="xpp-ath-k">demonstrated</span>
              <span className="xpp-ath-v">
                you connected attention to task structure
              </span>
            </li>
            <li
              className="xpp-ath-gap"
              data-on={phase >= 2 ? "true" : undefined}
            >
              <span className="xpp-ath-k">gap</span>
              <span className="xpp-ath-v">
                how salience competes for attention
              </span>
            </li>
            <li
              className="xpp-ath-sourcerow"
              data-on={phase >= 2 ? "true" : undefined}
            >
              <span className="xpp-ath-k">source</span>
              <span className="xpp-ath-v">
                paragraph 2 · open passage <span aria-hidden="true">→</span>
              </span>
            </li>
          </ol>
          <p
            className="xpp-ath-review"
            data-on={phase >= 4 ? "true" : undefined}
          >
            <span className="xpp-ath-review-k">next</span>
            <span className="xpp-ath-review-v">
              weak concept · retry later
            </span>
          </p>
        </div>

        <p className="xpp-ath-note">
          illustrative scenario · not a participant quotation or a measured
          outcome
        </p>
      </div>
    </PortraitShell>
  );
}

/* ================================================================
   THE MATERIALS — one config per project portrait, keyed by artifact.
   ================================================================ */

const PORTRAITS: Record<string, PortraitMeta> = {
  "design-or-disaster": {
    tag: "05 · evidence map",
    caption: "Point at the evidence. The readings follow your mark.",
    hint: "place a mark",
    real: {
      kind: "video",
      src: "/projects/design-or-disaster/preview.mp4",
      poster: "/projects/design-or-disaster/poster.jpg",
      alt: "The live Design or Disaster tool: a lens is chosen, a mark is placed on the interface, evidence is written, a verdict is committed, and the five juror readings appear beside it.",
      label: "Design or Disaster · live tool: mark, evidence, then the panel's ruling (authored jurors)",
      fit: "contain",
    },
    a11y:
      "Diagram: a mark is placed on an interface and three juror readings light up beside it.",
    glyphs: "·:+*#",
    cell: 12,
    seed: 41,
    ambient: 0.3,
    flow: 0.4,
    drift: 0.12,
    tune: [0.5, 1.8],
    ground: "#150f0c",
    ink: "#fff6e8",
    muted: "rgba(255, 246, 232, 0.78)",
    accent: "#ef4a35",
    /* the artifact's own ground, sampled from the capture it shows */
    plate: "#1f1811",
    /* reading ink for that plate: the frame's labels move onto the
       artifact's own surface when the real project takes the frame */
    plateInk: "#fff6e8",
    color: (t) =>
      t >= 0.9
        ? "rgba(239, 74, 53, 0.8)"
        : `rgba(255, 246, 232, ${0.05 + 0.2 * t})`,
    shape: evidenceShape,
  },
  pentimento: {
    tag: "right of reply",
    caption: "The software gets a draft. You get the final word.",
    hint: "strike it",
    real: {
      kind: "image",
      src: "/projects/pentimento/second-draft.png",
      poster: "/projects/pentimento/second-draft.png",
      alt: "Pentimento's settled second draft, with the person's version leading.",
      label: "Pentimento · settled second draft",
      fit: "contain",
    },
    a11y:
      "Diagram: a machine-written sentence is struck through and a person's rewrite rises into its place.",
    glyphs: "·:+x",
    cell: 12,
    seed: 57,
    ambient: 0.18,
    drift: 0.08,
    tune: [0.48, 1.9],
    ground: "#3b1830",
    ink: "#fdf3f9",
    muted: "rgba(253, 243, 249, 0.78)",
    accent: "#e08ab8",
    /* the artifact's own ground, sampled from the capture it shows */
    plate: "#15100c",
    /* reading ink for that plate: the frame's labels move onto the
       artifact's own surface when the real project takes the frame */
    plateInk: "#fdf3f9",
    color: (t) =>
      t >= 0.9
        ? "rgba(224, 138, 184, 0.85)"
        : `rgba(247, 236, 245, ${0.06 + 0.24 * t})`,
    shape: revisionShape,
  },
  "invisible-interfaces": {
    tag: "04 · absence & receipt",
    caption: "Leave the tab and it keeps working. Return to a receipt.",
    hint: "look away",
    real: {
      kind: "image",
      src: "/projects/invisible-interfaces/return.png",
      poster: "/projects/invisible-interfaces/return.png",
      alt: "The Invisible Interfaces return receipt: what changed during absence, what was left untouched, and how to discard the work.",
      label: "Invisible Interfaces · return receipt (staged artifact — absence not reproducible in capture)",
      fit: "contain",
    },
    a11y:
      "Diagram: a restoration panel dims while work continues, then returns with a receipt of what changed.",
    glyphs: "01",
    cell: 17,
    seed: 23,
    ambient: 0.12,
    flow: 0.5,
    tune: [0.5, 1.9],
    ground: "#0f0e0a",
    ink: "#fdf3dd",
    muted: "rgba(253, 243, 221, 0.78)",
    accent: "#e6ab3f",
    /* the artifact's own ground, sampled from the capture it shows */
    plate: "#000000",
    /* reading ink for that plate: the frame's labels move onto the
       artifact's own surface when the real project takes the frame */
    plateInk: "#fdf3dd",
    color: (t) =>
      t >= 0.9
        ? "rgba(230, 171, 63, 0.7)"
        : `rgba(230, 171, 63, ${0.06 + 0.24 * t})`,
    shape: absenceShape,
  },
  atlas: {
    tag: "rule pressure",
    caption: "Every hold, refinement, and fracture stays in the lineage.",
    hint: "press a case",
    real: {
      kind: "image",
      src: "/projects/atlas/trace-lineage.png",
      poster: "/projects/atlas/trace-lineage.png",
      alt: "The Atlas trace: the starting rule, each rewrite, and the case that caused it.",
      label: "Atlas · one rule's lineage",
      fit: "contain",
    },
    a11y:
      "Diagram: a provisional rule is tested against three cases and rewritten, with every change kept in a lineage.",
    glyphs: "·:+|",
    cell: 11,
    seed: 79,
    ambient: 0.16,
    drift: 0.1,
    tune: [0.46, 2.0],
    ground: "#0a2422",
    ink: "#eaf6f3",
    muted: "rgba(234, 246, 243, 0.78)",
    accent: "#5fd0c4",
    /* the artifact's own ground, sampled from the capture it shows */
    plate: "#faf8f4",
    /* reading ink for that plate: the frame's labels move onto the
       artifact's own surface when the real project takes the frame */
    plateInk: "#0d1817",
    color: (t) =>
      t >= 0.9
        ? "rgba(95, 208, 196, 0.8)"
        : `rgba(210, 240, 235, ${0.05 + 0.22 * t})`,
    shape: atlasShape,
  },
  "fluxion-studios": {
    tag: "01 · studio build",
    caption: "Loose pieces, one system — the studio site ships from it.",
    hint: "build it",
    real: {
      kind: "video",
      src: "/projects/fluxion/preview.mp4",
      poster: "/projects/fluxion/poster.jpg",
      alt: "The shipped Fluxion Studios site: the homepage, then the studio's own call to action to the enquiry form, where a project type is chosen and an illustrative brief is written.",
      label: "Fluxion Studios · live site: homepage → enquiry form, with a project type and brief",
      fit: "contain",
      position: "center top",
    },
    a11y:
      "Diagram: loose layout pieces assemble into a studio website and a companion phone frame.",
    glyphs: "·:+*#",
    cell: 12,
    seed: 61,
    ambient: 0.2,
    flow: 0.3,
    tune: [0.5, 1.8],
    ground: "#f1c9cd",
    ink: "#2a0d12",
    muted: "rgba(42, 13, 18, 0.78)",
    accent: "#b01020",
    /* the artifact's own ground, sampled from the capture it shows */
    plate: "#0a0505",
    /* reading ink for that plate: the frame's labels move onto the
       artifact's own surface when the real project takes the frame */
    plateInk: "#fff6ee",
    color: (t) =>
      t >= 0.92
        ? "rgba(140, 10, 24, 0.8)"
        : `rgba(176, 16, 32, ${0.06 + 0.26 * t})`,
    shape: fluxShape,
  },
  athena: {
    tag: "02 · evidence, not activity",
    caption: "Reading something is not the same as knowing it.",
    hint: "attempt, then look",
    real: {
      kind: "video",
      src: "/projects/athena/preview.mp4",
      poster: "/projects/athena/poster.jpg",
      alt: "The Athena prototype: an Explain Back attempt is written from memory, then feedback names what was demonstrated, what was not yet demonstrated, and the source passage to check.",
      label: "Athena · Explain Back on the local prototype (feedback is the app's scripted sample)",
      fit: "contain",
    },
    a11y:
      "Diagram: a learner answers a review question from memory, then feedback names what was demonstrated, what is missing and the source passage that would fix it. Activity and knowledge evidence are shown as separate records.",
    glyphs: "·:+*#",
    cell: 12,
    seed: 97,
    ambient: 0.16,
    flow: 0.35,
    drift: 0.08,
    tune: [0.5, 1.9],
    ground: "#fffaf0",
    ink: "#173461",
    muted: "rgba(23, 52, 97, 0.78)",
    accent: "#d95f32",
    /* the artifact's own ground, sampled from the capture it shows */
    plate: "#fff9ed",
    /* reading ink for that plate: the frame's labels move onto the
       artifact's own surface when the real project takes the frame */
    plateInk: "#173461",
    color: (t) =>
      t >= 0.9
        ? "rgba(217, 95, 50, 0.7)"
        : `rgba(23, 52, 97, ${0.05 + 0.2 * t})`,
    shape: athenaShape,
  },
  daynero: {
    tag: "03 · safe to spend",
    caption: "A month of spending, compressed into one safe number.",
    hint: "log a spend",
    real: {
      kind: "image",
      src: "/projects/daynero/budget.jpg",
      poster: "/projects/daynero/budget.jpg",
      alt: "The Daynero public website: the daily-budget proposition, stating that the budget adapts in real time to spending patterns.",
      label: "Daynero · public website: the daily-budget proposition (the app is pre-MVP)",
      fit: "contain",
      position: "center top",
    },
    a11y:
      "Diagram: spending events land one by one and a single safe-to-spend number recalculates.",
    glyphs: "·:+*#",
    cell: 12,
    seed: 83,
    ambient: 0.18,
    flow: 0.3,
    drift: 0.08,
    tune: [0.48, 1.9],
    ground: "#161c0d",
    ink: "#f2f8dd",
    muted: "rgba(242, 248, 221, 0.78)",
    accent: "#c9f24e",
    /* the artifact's own ground, sampled from the capture it shows */
    plate: "#090909",
    /* reading ink for that plate: the frame's labels move onto the
       artifact's own surface when the real project takes the frame */
    plateInk: "#f2f8dd",
    color: (t) =>
      t >= 0.9
        ? "rgba(201, 242, 78, 0.85)"
        : `rgba(185, 221, 85, ${0.06 + 0.24 * t})`,
    shape: numberShape,
  },
};

/** The project portrait: one legible interaction demo per project,
    drawn in the folio's own material. `live` is the folio's rule that
    only the sheet being read stays awake; sleeping portraits hold
    their phase and cost nothing. */
export function ProjectPortrait({
  slug,
  live = true,
}: {
  slug: string;
  live?: boolean;
}) {
  if (!PORTRAITS[slug]) return null;
  switch (slug) {
    case "design-or-disaster":
      return <EvidenceDemo live={live} />;
    case "pentimento":
      return <PentimentoDemo live={live} />;
    case "invisible-interfaces":
      return <AbsenceDemo live={live} />;
    case "atlas":
      return <AtlasDemo live={live} />;
    case "fluxion-studios":
      return <FluxionDemo live={live} />;
    case "athena":
      return <AthenaDemo live={live} />;
    case "daynero":
      return <DayneroDemo live={live} />;
    default:
      return null;
  }
}

