"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

/**
 * THE SIGNATURE INSTRUMENT.
 *
 * One family: a finished surface, an underpainting, a reveal amount.
 * Pointer/touch scrubs the reveal. Keyboard uses arrows. Reduced motion
 * gets a toggle. The finished layer is never the only way to read the
 * underneath — assistive tech gets both, with the under layer first in
 * the accessibility tree when it carries the live mechanic.
 */

type LookUnderProps = {
  surface: ReactNode;
  under: ReactNode;
  label: string;
  className?: string;
  /** 0–1 starting reveal. A sliver teaches the wipe without hiding the work. */
  rest?: number;
  /** Visible control copy. A revealed panel keeps a visible way back. */
  revealLabel?: string;
  collapseLabel?: string;
};

export function LookUnder({
  surface,
  under,
  label,
  className = "",
  rest = 0.12,
  revealLabel = "Reveal",
  collapseLabel = "Close",
}: LookUnderProps) {
  const id = useId();
  const frame = useRef<HTMLDivElement>(null);
  const [reveal, setReveal] = useState(rest);
  const [restReveal, setRestReveal] = useState(rest);
  const [dragging, setDragging] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  /* A phone has no room for a partly peeled surface. The layered mecha-
     nism stays, but the resting state is fully concealed: nothing shows
     the index in clipped fragments, and the seam handle and Reveal
     control still say a second layer is there. Desktop keeps its rest. */
  useEffect(() => {
    const media = window.matchMedia("(max-width: 48rem)");
    const sync = () => {
      const next = media.matches ? 0 : rest;
      setRestReveal(next);
      setReveal((value) => (value > 0.5 ? value : next));
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [rest]);

  const setFromClientX = useCallback(
    (clientX: number) => {
      const box = frame.current?.getBoundingClientRect();
      if (!box || box.width <= 0) return;
      const next = Math.max(0, Math.min(1, (clientX - box.left) / box.width));
      setReveal(next);
    },
    [],
  );

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    setFromClientX(event.clientX);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setFromClientX(event.clientX);
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragging(false);
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 0.2 : 0.08;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      setReveal((value) => Math.min(1, value + step));
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      setReveal((value) => Math.max(0, value - step));
    }
    if (event.key === "Home") {
      event.preventDefault();
      setReveal(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      setReveal(1);
    }
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      setReveal((value) => (value > 0.5 ? restReveal : 1));
    }
  };

  return (
    <div
      ref={frame}
      className={`xp-under ${className}`.trim()}
      data-dragging={dragging || undefined}
      data-revealed={reveal > 0.5 ? "true" : undefined}
      style={{ "--reveal": reveal } as CSSProperties}
    >
      <div className="xp-under-back">{under}</div>
      <div
        className="xp-under-front"
        aria-hidden="true"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {surface}
      </div>
      <div
        className="xp-under-read"
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(reveal * 100)}
        aria-valuetext={`${Math.round(reveal * 100)} percent revealed`}
        aria-describedby={`${id}-hint`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
      />
      <p id={`${id}-hint`} className="sr-only">
        Drag, or use arrow keys, to reveal more.
      </p>
      {/* A visible control so the reveal never depends on discovering the
          gesture. It is the only way in for reduced-motion and touch, and a
          convenience everywhere else. */}
      <button
        type="button"
        className="xp-under-toggle"
        aria-pressed={reveal > 0.5}
        onClick={() => setReveal((value) => (value > 0.5 ? restReveal : 1))}
      >
        {reveal > 0.5 ? collapseLabel : revealLabel}
      </button>
    </div>
  );
}
