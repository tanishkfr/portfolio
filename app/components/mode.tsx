"use client";

import { useEffect, useState } from "react";

/**
 * Quick Review is the only published reading mode. Explore stays visible as
 * a construction notice, never as a route or persisted state.
 */

export function ModeSwitch() {
  const [showExploreNotice, setShowExploreNotice] = useState(false);

  useEffect(() => {
    if (!showExploreNotice) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setShowExploreNotice(false);
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [showExploreNotice]);

  return (
    <div className="mode-switch" role="group" aria-label="How do you want to read this?">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={showExploreNotice}
        onClick={() => setShowExploreNotice(true)}
      >
        Explore <span className="mode-status">Under construction</span>
      </button>
      <button
        type="button"
        aria-pressed="true"
        aria-label="Quick review"
      >
        <span className="mode-label-full">Quick review</span>
        <span className="mode-label-short">Review</span>
      </button>

      {showExploreNotice ? (
        <div
          className="mode-notice-backdrop"
          role="presentation"
          onClick={() => setShowExploreNotice(false)}
        >
          <section
            className="mode-notice"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mode-notice-title"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="mode-notice-kicker">Explore · in progress</p>
            <h2 id="mode-notice-title">Still being made.</h2>
            <p>
              Explore is under construction for now. Quick Review is the only
              published way to see the work.
            </p>
            <button
              className="mode-notice-close"
              type="button"
              onClick={() => setShowExploreNotice(false)}
            >
              Keep browsing
            </button>
          </section>
        </div>
      ) : null}
    </div>
  );
}
