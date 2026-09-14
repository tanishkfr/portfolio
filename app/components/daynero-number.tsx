"use client";

import { useEffect, useRef, useState } from "react";

/**
 * DAYNERO — an illustrative spending example.
 *
 * Three sample events show how a daily figure might respond to what someone
 * did. This is a scripted demonstration of an interface response, not the
 * product's budgeting model and not a financial recommendation. The amount
 * reports the change it actually applied, including when it is already at
 * zero and cannot move.
 */

const ACTIONS = [
  { label: "Bought a coffee", delta: -4 },
  { label: "Skipped lunch out", delta: 9 },
  { label: "Added a forgotten bill", delta: -22 },
];

const START = 62;

export function DayneroNumber() {
  const [amount, setAmount] = useState(START);
  const [display, setDisplay] = useState(START);
  const [note, setNote] = useState<string | null>(null);
  const displayRef = useRef(START);
  const raf = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    cancelAnimationFrame(raf.current);
    if (reduced) {
      displayRef.current = amount;
      raf.current = requestAnimationFrame(() => setDisplay(amount));
      return;
    }
    const start = displayRef.current;
    const end = amount;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 200);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = Math.round(start + (end - start) * eased);
      displayRef.current = value;
      setDisplay(value);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [amount]);

  function apply(delta: number) {
    setAmount((current) => {
      const next = Math.max(0, current + delta);
      const applied = next - current;
      if (applied === 0) {
        setNote("Nothing changes — today's amount is already at £0.");
      } else {
        setNote(
          `Today's amount is £${Math.abs(applied)} ${
            applied < 0 ? "lower" : "higher"
          }.`,
        );
      }
      return next;
    });
  }

  function reset() {
    setAmount(START);
    setNote("Reset to the starting example.");
  }

  return (
    <figure className="xp-room-shot xp-day">
      <span className="xp-day-tag">Illustrative spending example</span>
      <p className="xp-day-label">You can spend today</p>
      <p className="xp-day-amount">£{display}</p>
      <p className="xp-day-note" aria-live="polite">
        {note ?? "Choose a sample event. Sample events show an interface response, not the product's budgeting model or financial advice."}
      </p>

      <div className="xp-day-actions">
        {ACTIONS.map((action, index) => (
          <button
            key={index}
            type="button"
            className="xp-day-btn"
            onClick={() => apply(action.delta)}
          >
            {action.label}
            <span>{action.delta > 0 ? `+£${action.delta}` : `−£${-action.delta}`}</span>
          </button>
        ))}
        <button type="button" className="xp-day-btn xp-day-reset" onClick={reset}>
          Reset
        </button>
      </div>
    </figure>
  );
}
