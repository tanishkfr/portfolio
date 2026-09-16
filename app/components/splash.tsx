"use client";

import { useEffect, useRef, useState } from "react";
import { SignalField } from "./signal-field";
import {
  COVER_QUIET,
  COVER_QUIET_NARROW,
  coverPixelShape,
  coverTextureShape,
} from "./explore";

/**
 * The first state transition of the portfolio: the name holds while the
 * signal rule draws beneath it, then the whole plate dissolves into the
 * hero — the splash name scaling up into the cover wordmark's own
 * coordinates while the identical field underneath takes over.
 *
 * The cover's material is already present — literally. Both fields run
 * the cover's exact configs (same seed, cell, ambient, flow, drift,
 * tune, quiet geometry, and the cover's own shape scripts), and the
 * engine's shared clock keeps every field in one noise phase, so this
 * overlay is the hero's opening frames, not a separate composition.
 * The lift is a fade, not a cut: because the matter underneath is the
 * same matter at the same phase, the overlay dissolving into the hero
 * reads as one scene, never a reset. Once per session, skippable by
 * any interaction, never blocking the page underneath, removed from
 * the DOM when done.
 */

type Phase = "hold" | "resolve" | "lift" | "done";

export function SplashGate() {
  const [phase, setPhase] = useState<Phase>("hold");
  const [narrow, setNarrow] = useState(false);
  const ruleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 52rem)");
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    /* A session that has already seen the splash, or a reduced-motion
       reader, skips the hold outright - resolved within one frame, so
       state is not synchronised inside the effect body. */
    let seen = false;
    try {
      seen = sessionStorage.getItem("splash") === "seen";
    } catch {
      /* private mode: play once per page load */
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      const id = window.requestAnimationFrame(() => setPhase("done"));
      return () => window.cancelAnimationFrame(id);
    }

    const holdTimer = window.setTimeout(() => setPhase("resolve"), 250);

    /* The bar is driven from THIS effect's clock — the same origin as
       the lift timer below — so its completion is guaranteed before
       the handoff no matter when the stylesheet lands or hydration
       settles. A CSS animation would start at the server-rendered
       first paint instead, and drift against the timer. */
    const bar = ruleRef.current;
    if (bar && typeof bar.animate === "function") {
      bar.animate(
        [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
        {
          duration: 620,
          delay: 40,
          easing: "cubic-bezier(0.32, 0.6, 0.28, 1)",
          fill: "forwards",
        },
      );
    }

    /* dismissible immediately: any interaction starts the lift early */
    const dismiss = () => setPhase("lift");
    window.addEventListener("pointerdown", dismiss, { once: true });
    window.addEventListener("keydown", dismiss, { once: true });
    window.addEventListener("wheel", dismiss, { once: true, passive: true });

    /* The lift is its own beat: the plate's ink, rule and meta fade
       while the cover's field — identical matter underneath — takes
       over, and the splash name grows into the wordmark's coordinates.
       The session flag lands with the dissolve, so the splash never
       replays mid-fade on a refresh. */
    const liftTimer = window.setTimeout(() => {
      try {
        sessionStorage.setItem("splash", "seen");
      } catch {
        /* private mode: play once per page load */
      }
      setPhase("lift");
    }, 900);

    return () => {
      window.clearTimeout(holdTimer);
      window.clearTimeout(liftTimer);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("wheel", dismiss);
    };
  }, []);

  /* The dissolve: the lift phase holds the overlay while the opacity
     transition plays, and the unmount lands after its fade completes —
     the hero is never revealed by a cut. */
  useEffect(() => {
    if (phase !== "lift") return;
    const t = window.setTimeout(() => setPhase("done"), 680);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (phase === "done") return null;

  const quiet = narrow ? COVER_QUIET_NARROW : COVER_QUIET;

  return (
    <div className="splash" data-phase={phase} aria-hidden="true">
      <SignalField
        className="splash-field"
        cell={14}
        seed={11}
        ambient={0.26}
        flow={1.6}
        wavefront={0.07}
        drift={0.3}
        pointerRadius={0}
        quiet={quiet}
        tune={[0.54, 1.9]}
        shape={coverTextureShape}
        color={(t) => `rgba(27, 33, 38, ${0.04 + 0.13 * t})`}
      />
      <SignalField
        className="splash-pixels"
        mode="pixel"
        cell={22}
        seed={29}
        ambient={0.72}
        flow={1.3}
        wavefront={0.1}
        drift={0.4}
        pointerRadius={14}
        quiet={quiet}
        tune={[0.4, 2.1]}
        shape={coverPixelShape}
        color={(t) => `rgba(58, 31, 240, ${0.24 + 0.66 * t})`}
      />
      <span className="splash-rule">
        <span className="splash-rule-fill" ref={ruleRef} />
      </span>
      <span className="splash-name">Tanishk</span>
      <span className="splash-note">Portfolio · 2026</span>
    </div>
  );
}
