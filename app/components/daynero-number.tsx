"use client";

import { useEffect, useRef, useState } from "react";

/**
 * DAYNERO — one number, on the clock.
 *
 * The commercial one, so it's warmer. A single figure — what today can carry —
 * that responds to what you actually did, not a monthly reset. The number
 * tweens as it moves, and the line beneath it answers like a person would.
 */

const ACTIONS = [
  { label: "Bought a coffee", delta: -4, note: "Today's amount is £4 lower." },
  { label: "Skipped lunch out", delta: 9, note: "Today's amount is £9 higher." },
  { label: "Added a forgotten bill", delta: -22, note: "Today's amount is £22 lower." },
];

const START = 62;

export function DayneroNumber() {
  const [amount, setAmount] = useState(START);
  const [display, setDisplay] = useState(START);
  const [note, setNote] = useState<string | null>(null);
  const displayRef = useRef(START);
  const raf = useRef(0);

  useEffect(() => {
    cancelAnimationFrame(raf.current);
    const start = displayRef.current;
    const end = amount;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 480);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = Math.round(start + (end - start) * eased);
      displayRef.current = value;
      setDisplay(value);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [amount]);

  return (
    <figure className="xp-room-shot xp-day">
      <span className="xp-day-tag">today · responds to what you actually did</span>
      <p className="xp-day-label">You can spend today</p>
      <p className="xp-day-amount">£{display}</p>
      <p className="xp-day-note" aria-live="polite">
        {note ?? "Choose an event to update today's amount."}
      </p>

      <div className="xp-day-actions">
        {ACTIONS.map((action, index) => (
          <button
            key={index}
            type="button"
            className="xp-day-btn"
            onClick={() => {
              setAmount((current) => Math.max(0, current + action.delta));
              setNote(action.note);
            }}
          >
            {action.label}
            <span>{action.delta > 0 ? `+£${action.delta}` : `−£${-action.delta}`}</span>
          </button>
        ))}
      </div>
    </figure>
  );
}
