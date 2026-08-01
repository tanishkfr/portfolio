"use client";

import { useState } from "react";

/**
 * PENTIMENTO — the person takes the page back.
 *
 * A confident machine reading leads the type. Strike it and authority moves:
 * the machine's sentence recedes into a struck underpainting while the
 * person's reply rises into the leading voice. The withdrawal stays visible —
 * the system yields without hiding that it made the claim. Reversible, because
 * no correction should be a trap either.
 */

export function PentimentoStrike() {
  const [struck, setStruck] = useState(false);

  return (
    <figure
      className="xp-room-shot xp-pent"
      data-struck={struck ? "true" : undefined}
      /* arrival is driven by the room it stands in, not a one-shot reveal */
    >
      <div className="xp-pent-stack">
        <p className="xp-pent-machine">
          <span className="xp-pent-tag">
            {struck ? "the machine's reading — withdrawn" : "the machine's reading"}
          </span>
          You fell out of love with film in 2023. The pattern is unmistakable.
        </p>
        <p className="xp-pent-mine">
          <span className="xp-pent-tag">your reply</span>
          I only stopped logging it. The love was never in the data.
        </p>
      </div>

      <button
        type="button"
        className="xp-pent-btn"
        onClick={() => setStruck((value) => !value)}
        aria-pressed={struck}
      >
        {struck ? "Put it back" : "Strike it"}
      </button>
    </figure>
  );
}
