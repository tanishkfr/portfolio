"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * INVISIBLE INTERFACES — absence, and an honest return.
 *
 * This miniature records exactly one thing: time away from this page, read
 * through the Page Visibility API. Nothing progresses while you watch, and
 * nothing claims to restore anything. When you return it hands back the
 * observed duration — and a separate, explicit path to inspect the project's
 * real example return, so nothing is promised that cannot be opened.
 */

export function InvisibleAway() {
  const [awayMs, setAwayMs] = useState<number | null>(null);
  const [returns, setReturns] = useState(0);
  const [showReturn, setShowReturn] = useState(false);
  const hiddenAt = useRef<number | null>(null);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        hiddenAt.current = Date.now();
        return;
      }
      if (hiddenAt.current == null) return;
      const elapsed = Date.now() - hiddenAt.current;
      hiddenAt.current = null;
      if (elapsed < 500) return;
      setAwayMs(elapsed);
      setReturns((count) => count + 1);
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const seconds = awayMs == null ? 0 : Math.max(1, Math.round(awayMs / 1000));

  return (
    <figure className="xp-room-shot xp-away" data-returned={awayMs != null ? "true" : undefined}>
      <span className="xp-away-tag">delegated · observed locally</span>
      <p className="xp-away-title">Absence demonstration.</p>
      <p className="xp-away-scope">
        This records one thing and nothing else: time away from this page.
        It does not restore files, run a job, or predict anything.
      </p>

      <p className="xp-away-receipt" aria-live="polite">
        {awayMs == null
          ? "Leave this tab, then come back. The observed time will appear here."
          : `Away ${seconds}s (return ${returns}). Recorded on this page only.`}
      </p>

      <p className="xp-away-statement" aria-live="polite">
        {awayMs == null
          ? "No restoration is performed."
          : "This demonstration recorded time away. No restoration was performed."}
      </p>

      <button
        type="button"
        className="xp-away-inspect"
        aria-expanded={showReturn}
        onClick={() => setShowReturn((value) => !value)}
      >
        {showReturn ? "Hide the example return" : "Inspect the project's example return"}
      </button>

      {showReturn ? (
        <div className="xp-away-example">
          <Image
            unoptimized
            src="/projects/invisible-interfaces/return.png"
            width={1440}
            height={1000}
            sizes="(max-width: 900px) 90vw, 42vw"
            alt="The Invisible Interfaces return scene: the restored image beside a work receipt listing what changed, what was preserved, and how to discard the result."
          />
          <small>
            The project&apos;s actual return screen — staged work, a receipt, and
            a discard path. Nothing here ran to produce it.
          </small>
        </div>
      ) : null}
    </figure>
  );
}
