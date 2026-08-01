"use client";

import { useState, type CSSProperties, type MouseEvent } from "react";

/**
 * DESIGN OR DISASTER — point before you pronounce.
 *
 * You mark the exact place on the screen that shaped your read. Only then do
 * four other readings surface on the same screen — yours is one of five, and
 * there is no answer key. The interaction is the thesis: mark first, argue
 * second. Non-blocking; the name is always a door to the full case.
 */

const OTHER_READINGS: { x: number; y: number }[] = [
  { x: 56, y: 29 },
  { x: 26, y: 52 },
  { x: 77, y: 66 },
  { x: 45, y: 86 },
];

export function DisasterMark({ src, alt }: { src: string; alt: string }) {
  const [mark, setMark] = useState<{ x: number; y: number } | null>(null);

  function place(event: MouseEvent<HTMLButtonElement>) {
    if (mark) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const keyboard = event.clientX === 0 && event.clientY === 0;
    const x = keyboard ? 50 : ((event.clientX - rect.left) / rect.width) * 100;
    const y = keyboard ? 42 : ((event.clientY - rect.top) / rect.height) * 100;
    setMark({
      x: Math.min(Math.max(x, 4), 96),
      y: Math.min(Math.max(y, 4), 96),
    });
  }

  return (
    <figure
      className="xp-room-shot xp-dod"
      data-marked={mark ? "true" : undefined}
      /* arrival is driven by the room it stands in, not a one-shot reveal */
    >
      <button
        type="button"
        className="xp-dod-surface"
        onClick={place}
        aria-label={
          mark
            ? "Your read is marked on the screen"
            : "Point at the evidence that shapes your read"
        }
      >
        {/* Not lazy: this sits inside a horizontally translated rail, which
            the browser never counts as approaching the viewport, so it stayed
            unloaded with no intrinsic size and collapsed to a 1px sliver. It
            is the only image in the track — loading it up front is cheap. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} decoding="async" />
        <span className="xp-dod-tint" aria-hidden="true" />

        {mark ? (
          <>
            {OTHER_READINGS.map((reading, index) => (
              <span
                key={index}
                className="xp-dod-mark xp-dod-mark--other"
                style={
                  {
                    left: `${reading.x}%`,
                    top: `${reading.y}%`,
                    animationDelay: `${0.12 + index * 0.1}s`,
                  } as CSSProperties
                }
                aria-hidden="true"
              />
            ))}
            <span
              className="xp-dod-mark xp-dod-mark--mine"
              style={{ left: `${mark.x}%`, top: `${mark.y}%` } as CSSProperties}
            >
              <span className="xp-dod-tag">your read</span>
            </span>
          </>
        ) : (
          <span className="xp-dod-prompt" aria-hidden="true">
            point at the evidence
          </span>
        )}
      </button>

      <figcaption className="xp-dod-cap" aria-live="polite">
        {mark
          ? "Yours, and four others. One screen — five verdicts, no answer key."
          : "Point before you pronounce. Mark what shaped your read."}
      </figcaption>
    </figure>
  );
}
