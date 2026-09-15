"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SignalField } from "./signal-field";

/**
 * INVISIBLE INTERFACES — absence, and an honest return.
 *
 * This miniature records exactly one thing: time away from this page, read
 * through the Page Visibility API. Nothing progresses while you watch, and
 * nothing claims to restore anything. When you return it hands back the
 * observed duration — and a separate, explicit path to inspect the project's
 * real example return, so nothing is promised that cannot be opened.
 *
 * That inspection is deliberately NOT an inline expansion. Each project sheet
 * pins while you read it, so anything the sheet grows downward lands behind
 * the incoming sheet before it can be read. Opening the example return
 * instead layers a self-contained inspection panel over the sheet's stage:
 * the sheet keeps its size, the next sheet's arrival is unchanged, and the
 * result stays inside the intended panel. Escape or the close control
 * returns focus to the trigger.
 */

export function InvisibleAway() {
  const [awayMs, setAwayMs] = useState<number | null>(null);
  const [returns, setReturns] = useState(0);
  const [showReturn, setShowReturn] = useState(false);
  const hiddenAt = useRef<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

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

  /* The inspection layer owns the keyboard while open: it is announced
     as modal, so Tab is wrapped within it, Escape dismisses, focus
     enters on open and returns to the trigger on close. */
  useEffect(() => {
    if (!showReturn) return;
    closeRef.current?.focus({ preventScroll: true });
    const trigger = triggerRef.current;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowReturn(false);
        return;
      }
      if (event.key !== "Tab") return;
      const overlay = overlayRef.current;
      if (!overlay) return;
      const focusable = Array.from(
        overlay.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const inside = active instanceof Node && overlay.contains(active);
      if (event.shiftKey && (active === first || !inside)) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && (active === last || !inside)) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      trigger?.focus({ preventScroll: true });
    };
  }, [showReturn]);

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
        ref={triggerRef}
        type="button"
        className="xp-away-inspect"
        aria-expanded={showReturn}
        onClick={() => setShowReturn(true)}
      >
        Inspect the project&apos;s example return
      </button>

      {/* The material grammar of this project. While the room waits it
          carries a sparse binary signal — delegated work has not been
          observed yet. On each return the signal sweeps dense and
          resolves: the room re-materialises, and the receipt settles
          back into crisp evidence. */}
      {awayMs == null ? (
        <SignalField
          className="xp-away-field"
          glyphs="01"
          cell={12}
          seed={23}
          ambient={0.22}
          flow={1.8}
          wavefront={0.1}
          pointerRadius={0}
          color={(t) => `rgba(230, 171, 63, ${0.05 + 0.3 * t})`}
        />
      ) : (
        <SignalField
          className="xp-away-field"
          glyphs="01"
          cell={12}
          seed={23 + returns}
          ambient={0}
          pointerRadius={0}
          pulseKey={returns}
          pulseMs={1500}
          pulseDirection="disperse"
          color={(t) => `rgba(230, 171, 63, ${0.08 + 0.36 * t})`}
        />
      )}

      {showReturn ? (
        <div
          ref={overlayRef}
          className="xp-away-example"
          role="dialog"
          aria-modal="true"
          aria-label="The project's example return screen"
        >
          <div className="xp-away-example-bar">
            <p>
              <strong>The project&apos;s actual return screen.</strong> Staged
              work, a receipt, and a discard path. Nothing here ran to produce
              it.
            </p>
            <button
              ref={closeRef}
              type="button"
              className="xp-away-example-close"
              onClick={() => setShowReturn(false)}
            >
              Close the example
            </button>
          </div>
          <Image
            unoptimized
            src="/projects/invisible-interfaces/return.png"
            width={1440}
            height={1000}
            sizes="(max-width: 900px) 92vw, 42rem"
            alt="The Invisible Interfaces return scene: the restored image beside a work receipt listing what changed, what was preserved, and how to discard the result."
          />
          <small>
            The return scene argues with one object: what changed, what stayed
            untouched, and the one action that removes the result.
          </small>
        </div>
      ) : null}
    </figure>
  );
}
