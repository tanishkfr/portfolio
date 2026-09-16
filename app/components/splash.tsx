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
 * The first state transition of the portfolio: the name arrives as
 * compressed notation, then resolves into its authored width while the
 * signal rule draws beneath it - the same rule that opens the folio.
 *
 * The cover's material is already present — literally. Both fields run
 * the cover's exact configs (same seed, cell, ambient, flow, drift,
 * tune, quiet geometry, and the cover's own shape scripts), and the
 * engine's shared clock keeps every field in one noise phase, so this
 * overlay is the hero's opening frames, not a separate composition.
 * When it lifts, the hero field beneath shows the very same matter at
 * the very same phase — no reset, no duplicate field, no jump. Once
 * per session, skippable by any interaction, never blocking the page
 * underneath, removed from the DOM when done.
 */

type Phase = "hold" | "resolve" | "done";

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
    let seen = false;
    try {
      seen = sessionStorage.getItem("splash") === "seen";
    } catch {
      /* private mode: play once per page load */
    }

    const finish = () => {
      setPhase("done");
      try {
        sessionStorage.setItem("splash", "seen");
      } catch {
        /* private mode: play once per page load */
      }
    };

    /* A session that has already seen the splash, or a reduced-motion
       reader, skips the hold outright - resolved within one frame, so
       state is not synchronised inside the effect body. */
    if (seen) {
      const id = window.requestAnimationFrame(finish);
      return () => window.cancelAnimationFrame(id);
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const id = window.requestAnimationFrame(() => finish());
      return () => window.cancelAnimationFrame(id);
    }

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

    /* dismissible immediately: any interaction lifts the splash at once */
    const dismiss = () => finish();
    window.addEventListener("pointerdown", dismiss, { once: true });
    window.addEventListener("keydown", dismiss, { once: true });
    window.addEventListener("wheel", dismiss, { once: true, passive: true });

    const holdTimer = window.setTimeout(() => setPhase("resolve"), 250);
    const doneTimer = window.setTimeout(finish, 900);

    return () => {
      window.clearTimeout(holdTimer);
      window.clearTimeout(doneTimer);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("wheel", dismiss);
    };
  }, []);

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
        cell={20}
        seed={29}
        ambient={0.62}
        flow={1.3}
        wavefront={0.1}
        drift={0.4}
        pointerRadius={0}
        quiet={quiet}
        tune={[0.4, 2.1]}
        shape={coverPixelShape}
        color={(t) => `rgba(58, 31, 240, ${0.18 + 0.55 * t})`}
      />
      <span className="splash-rule">
        <span className="splash-rule-fill" ref={ruleRef} />
      </span>
      <span className="splash-name">Tanishk</span>
      <span className="splash-note">Portfolio · 2026</span>
    </div>
  );
}
