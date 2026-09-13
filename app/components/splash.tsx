"use client";

import { useEffect, useState } from "react";

/**
 * The first state transition of the portfolio: the name arrives as
 * compressed notation, then resolves into its authored width while the
 * signal rule draws beneath it - the same rule that opens the folio.
 * Once per session, skippable by any interaction, never blocking the
 * page underneath, removed from the DOM when done.
 */

type Phase = "hold" | "resolve" | "done";

export function SplashGate() {
  const [phase, setPhase] = useState<Phase>("hold");

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

    const dismiss = () => finish();
    const holdTimer = window.setTimeout(() => setPhase("resolve"), 650);
    const doneTimer = window.setTimeout(finish, 1500);
    window.addEventListener("pointerdown", dismiss, { once: true });
    window.addEventListener("keydown", dismiss, { once: true });
    window.addEventListener("wheel", dismiss, { once: true, passive: true });

    return () => {
      window.clearTimeout(holdTimer);
      window.clearTimeout(doneTimer);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("wheel", dismiss);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div className="splash" data-phase={phase} aria-hidden="true">
      <span className="splash-rule" />
      <span className="splash-name">Tanishk</span>
      <span className="splash-note">Portfolio · 2026</span>
    </div>
  );
}
