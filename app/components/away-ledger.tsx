"use client";

import { useEffect, useState } from "react";

/**
 * The Invisible Interfaces case page practices its own argument:
 * it keeps a record of your absence. Time away from this tab is
 * counted through the same Page Visibility API the project uses,
 * held only in memory, and reported back when attention returns.
 * Nothing is stored, nothing is transmitted.
 */
export function AwayLedger() {
  const [awaySeconds, setAwaySeconds] = useState(0);
  const [returns, setReturns] = useState(0);

  useEffect(() => {
    let hiddenAt: number | null = null;

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        hiddenAt = Date.now();
        return;
      }
      if (hiddenAt !== null) {
        const delta = Math.round((Date.now() - hiddenAt) / 1000);
        hiddenAt = null;
        if (delta > 0) {
          setAwaySeconds((total) => total + delta);
          setReturns((count) => count + 1);
        }
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const minutes = Math.floor(awaySeconds / 60);
  const seconds = String(awaySeconds % 60).padStart(2, "0");

  return (
    <aside className="away-ledger" aria-label="Attention ledger for this page">
      <span className="away-ledger-title">Attention ledger</span>
      {returns === 0 ? (
        <p>
          This page practices the project&apos;s argument: it keeps a record of
          your absence. Leave the tab and return—the time away is counted,
          held only here, and never transmitted.
        </p>
      ) : (
        <p aria-live="polite">
          While you were away: <strong>{minutes}:{seconds}</strong>
          {returns > 1 ? ` across ${returns} departures` : ""}. Recorded on
          this page only, discarded when you close it.
        </p>
      )}
    </aside>
  );
}
