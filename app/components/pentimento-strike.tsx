"use client";

import { useEffect, useState } from "react";

/**
 * PENTIMENTO — the person takes the page back.
 *
 * The machine reading leads alone. Strike it and authority moves: the
 * original stays legible above, struck through and labelled as withdrawn,
 * while the example reply rises below as the leading voice. Reversible,
 * because a correction should never be a trap either.
 */

export function PentimentoStrike() {
  const [struck, setStruck] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        setStruck(sessionStorage.getItem("xp-pent-struck") === "1");
      } catch {
        /* private mode */
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  function strike() {
    setStruck((value) => {
      const next = !value;
      try {
        sessionStorage.setItem("xp-pent-struck", next ? "1" : "0");
      } catch {
        /* private mode */
      }
      return next;
    });
  }

  return (
    <figure className="xp-room-shot xp-pent" data-struck={struck ? "true" : undefined}>
      <div className="xp-pent-stack">
        <p className="xp-pent-machine">
          <span className="xp-pent-tag">
            {struck ? "machine reading · withdrawn" : "machine reading"}
          </span>
          You fell out of love with film in 2023. The pattern is unmistakable.
        </p>
        {struck ? (
          <p className="xp-pent-mine">
            <span className="xp-pent-tag">Example reply</span>
            I only stopped logging it. The love was never in the data.
          </p>
        ) : null}
      </div>

      <button
        type="button"
        className="xp-pent-btn"
        onClick={strike}
        aria-pressed={struck}
      >
        {struck ? "Put it back" : "Strike it"}
      </button>
    </figure>
  );
}
