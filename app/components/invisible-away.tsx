"use client";

import { useEffect, useRef, useState } from "react";

/**
 * INVISIBLE INTERFACES — absence is the input.
 *
 * The job only advances while your attention is elsewhere. Leave (switch tabs,
 * or click another window) and it works; come back and it hands you a receipt
 * of what happened while you weren't watching. Progress is computed from real
 * time-away, so nothing runs behind a fake spinner — the accountability is the
 * point.
 */

export function InvisibleAway() {
  const [progress, setProgress] = useState(0);
  const [receipt, setReceipt] = useState<string | null>(null);
  const progressRef = useRef(0);
  const awayStart = useRef<number | null>(null);

  useEffect(() => {
    const leave = () => {
      if (awayStart.current == null) awayStart.current = Date.now();
    };
    const back = () => {
      if (awayStart.current == null) return;
      const elapsed = Date.now() - awayStart.current;
      awayStart.current = null;
      if (elapsed < 400 || progressRef.current >= 100) return;
      const next = Math.min(100, progressRef.current + elapsed / 110);
      const gained = Math.round(next - progressRef.current);
      progressRef.current = next;
      setProgress(next);
      const seconds = Math.max(1, Math.round(elapsed / 1000));
      setReceipt(
        next >= 100
          ? `It finished while you were gone — ${seconds}s away, and it never needed you.`
          : `Away ${seconds}s · +${gained}% done · nothing needed you.`,
      );
    };
    const onVisibility = () => (document.hidden ? leave() : back());

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", leave);
    window.addEventListener("focus", back);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", leave);
      window.removeEventListener("focus", back);
    };
  }, []);

  const done = progress >= 100;

  return (
    <figure
      className="xp-room-shot xp-away"
      data-done={done ? "true" : undefined}
      /* arrival is driven by the room it stands in, not a one-shot reveal */
    >
      <span className="xp-away-tag">delegated · runs while you look away</span>
      <p className="xp-away-title">
        {done
          ? "Done. You never had to watch it."
          : "It only works when you're not watching."}
      </p>

      <div
        className="xp-away-meter"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Work completed while you were away"
      >
        <span className="xp-away-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="xp-away-pct">{Math.round(progress)}% — done while away</p>

      <p className="xp-away-receipt" aria-live="polite">
        {receipt ??
          "Switch tabs, or click another window — then come back for the receipt."}
      </p>
    </figure>
  );
}
