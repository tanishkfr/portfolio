"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { SignalField } from "./signal-field";
import {
  COVER_QUIET,
  COVER_QUIET_NARROW,
  coverPixelShape,
  coverTextureShape,
} from "./explore";

/**
 * The first state transition of the portfolio: the name holds while the
 * signal rule draws beneath it, then the plate merges into the hero —
 * the rule and the meta evaporate, the name rides its greenroom
 * transform into the wordmark's exact rendered coordinates, and the
 * identical field underneath takes over.
 *
 * The cover's material is already present — literally. Both fields run
 * the cover's exact configs (same seed, cell, ambient, flow, drift,
 * tune, quiet geometry, and the cover's own shape scripts), and the
 * engine's shared clock keeps every field in one noise phase, so this
 * overlay is the hero's opening frames, not a separate composition.
 * The name is measured live at lift time and lands exactly on the
 * wordmark it becomes, so the unmount never reads as an event: the
 * splash is simply done being a separate layer. Once per session,
 * skippable by any interaction, never blocking the page underneath,
 * removed from the DOM when done.
 */

type Phase = "hold" | "resolve" | "lift" | "done";

export function SplashGate() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("hold");
  const [narrow, setNarrow] = useState(false);
  const ruleRef = useRef<HTMLSpanElement>(null);
  /** the merge is single-shot: the gate outlives its own plate */
  const merged = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 52rem)");
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    /* The splash is the hero's opening frames — it merges into the cover
       wordmark, which only exists on the folio. On any other route there
       is nothing to merge into, and a full-screen overlay over a page a
       reviewer opened directly (Quick review especially) would read as a
       blank screen until its timers ran. So off the folio it resolves
       immediately, before any timer is scheduled. */
    if (pathname !== "/") {
      const id = window.requestAnimationFrame(() => setPhase("done"));
      return () => window.cancelAnimationFrame(id);
    }
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
    };
  }, [pathname]);

  /* Dismissible while it is still holding — and only then. The gate
     never unmounts (it returns null once done), so listeners bound to
     the mount effect would outlive it: a later wheel or click would
     drag the phase back to "lift" and replay the whole merge over the
     hero. Binding them to the holding phases means they are gone the
     moment the lift starts. */
  useEffect(() => {
    if (phase !== "hold" && phase !== "resolve") return;
    const dismiss = () => setPhase("lift");
    window.addEventListener("pointerdown", dismiss, { once: true });
    window.addEventListener("keydown", dismiss, { once: true });
    window.addEventListener("wheel", dismiss, { once: true, passive: true });
    return () => {
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("wheel", dismiss);
    };
  }, [phase]);

  /* The merge: measured live, not choreographed by hand. The splash
     name glides onto the wordmark's own box — centre to centre, scaled
     by the two boxes' width ratio — while the plate's furniture fades
     around it. When the transform lands, the name sits exactly over
     the hero's wordmark, so removing the plate is invisible: the
     splash has merged, not left. */
  useEffect(() => {
    if (phase !== "lift" || merged.current) return;
    /* once per session, whatever asks: the glide and the unmount are
       single-shot, so no late event can bring the plate back */
    merged.current = true;
    try {
      sessionStorage.setItem("splash", "seen");
    } catch {
      /* private mode: play once per page load */
    }

    const slug = document.querySelector<HTMLElement>(".splash-name");
    const hero = document.querySelector<HTMLElement>(".xp-cover-name");
    if (
      slug &&
      hero &&
      typeof slug.animate === "function" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const from = slug.getBoundingClientRect();
      const to = hero.getBoundingClientRect();
      const scale = to.width / from.width;
      const dx =
        to.left + to.width / 2 - (from.left + from.width / 2);
      const dy =
        to.top + to.height / 2 - (from.top + from.height / 2);
      slug.animate(
        [
          { transform: "translate(0, 0) scale(1)" },
          {
            transform: `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(${scale.toFixed(3)})`,
          },
        ],
        {
          duration: 680,
          easing: "cubic-bezier(0.22, 0.9, 0.26, 1)",
          fill: "forwards",
        },
      );
    }

    const t = window.setTimeout(() => setPhase("done"), 700);
    return () => window.clearTimeout(t);
  }, [phase]);

  /* Never paint the overlay off the folio, even for the single frame
     before the effect above resolves. */
  if (phase === "done" || pathname !== "/") return null;

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
