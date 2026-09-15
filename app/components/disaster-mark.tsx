"use client";

import { useState, type CSSProperties, type MouseEvent } from "react";
import { SignalField } from "./signal-field";

/**
 * DESIGN OR DISASTER — point before you pronounce.
 *
 * You mark the place on the screen that shaped your read. The mark can be
 * moved as often as you like, by pointer or by naming a region, before any
 * other reading appears. Then four *authored* example marks show on the same
 * coordinate system, each with its own argument. There is no answer key, and
 * the example marks are labelled as examples rather than judgments.
 */

const REGIONS = [
  { label: "Top bar", x: 50, y: 12 },
  { label: "Primary action", x: 64, y: 44 },
  { label: "Status area", x: 26, y: 30 },
  { label: "Lower list", x: 50, y: 80 },
] as const;

const EXAMPLE_READINGS = [
  {
    x: 56,
    y: 29,
    label: "Hierarchy",
    reading: "The motion competes with the primary decision.",
  },
  {
    x: 26,
    y: 52,
    label: "Access",
    reading: "The control's meaning disappears without precise vision.",
  },
  {
    x: 77,
    y: 66,
    label: "Trust",
    reading: "The visual certainty exceeds the evidence behind the state.",
  },
  {
    x: 45,
    y: 86,
    label: "Task",
    reading: "The interface asks for orientation before it enables action.",
  },
] as const;

const clamp = (value: number) => Math.min(Math.max(value, 4), 96);

export function DisasterMark({ src, alt }: { src: string; alt: string }) {
  const [mark, setMark] = useState<{ x: number; y: number } | null>(null);
  const [region, setRegion] = useState<string | null>(null);

  function place(event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const keyboard = event.clientX === 0 && event.clientY === 0;
    const x = keyboard ? 50 : ((event.clientX - rect.left) / rect.width) * 100;
    const y = keyboard ? 44 : ((event.clientY - rect.top) / rect.height) * 100;
    setRegion(null);
    setMark({ x: clamp(x), y: clamp(y) });
  }

  function chooseRegion(label: string, x: number, y: number) {
    setRegion(label);
    setMark({ x, y });
  }

  return (
    <figure className="xp-room-shot xp-dod">
      <button
        type="button"
        className="xp-dod-surface"
        onClick={place}
        aria-label={
          mark
            ? "Adjust your mark on the evidence"
            : "Point at the evidence that shapes your read"
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} decoding="async" />

        {/* The reading material: when the visitor marks a place, that
            region passes through the sampler — a brief ordered dither
            around the mark, resolving into the explicit mark. Evidence
            before judgment, shown as matter. */}
        {mark ? (
          <SignalField
            className="xp-dod-field"
            mode="dither"
            cell={9}
            seed={61}
            ambient={0}
            pointerRadius={0}
            pulseKey={`${mark.x | 0}:${mark.y | 0}`}
            pulseMs={820}
            pulseDirection="disperse"
            color={(t) => `rgba(239, 74, 53, ${0.16 + 0.44 * t})`}
            shape={(v, nx, ny) => {
              const d = Math.hypot(nx - mark.x / 100, ny - mark.y / 100);
              return v * 0.25 + Math.exp(-Math.pow(d * 6.5, 2)) * 0.85;
            }}
          />
        ) : null}

        {mark ? (
          <>
            {EXAMPLE_READINGS.map((reading, index) => (
              <span
                key={reading.label}
                className="xp-dod-mark xp-dod-mark--other"
                style={
                  {
                    left: `${reading.x}%`,
                    top: `${reading.y}%`,
                    animationDelay: `${0.12 + index * 0.08}s`,
                  } as CSSProperties
                }
                aria-hidden="true"
              />
            ))}
            <span
              className="xp-dod-mark xp-dod-mark--mine"
              style={{ left: `${mark.x}%`, top: `${mark.y}%` } as CSSProperties}
            >
              <span className="xp-dod-tag">
                {region ? `your mark · ${region}` : "your mark"}
              </span>
            </span>
          </>
        ) : (
          <span className="xp-dod-prompt" aria-hidden="true">
            point at the evidence
          </span>
        )}
      </button>

      <div className="xp-dod-controls">
        <div className="xp-dod-regions" role="group" aria-label="Choose a region of the screen">
          <span className="xp-dod-controls-label">Or name a region</span>
          {REGIONS.map((item) => (
            <button
              key={item.label}
              type="button"
              aria-pressed={region === item.label}
              onClick={() => chooseRegion(item.label, item.x, item.y)}
            >
              {item.label}
            </button>
          ))}
        </div>
        {mark ? (
          <button
            type="button"
            className="xp-dod-reset"
            onClick={() => {
              setMark(null);
              setRegion(null);
            }}
          >
            Reset
          </button>
        ) : null}
      </div>

      <figcaption className="xp-dod-cap" aria-live="polite">
        {mark
          ? "Your mark, with four authored example marks. Five readings, no answer key."
          : "Point before you pronounce. Mark what shaped your read."}
      </figcaption>

      {mark ? (
        <div className="xp-dod-readings">
          <p className="xp-dod-readings-label">
            Authored example marks — not visitor judgments
          </p>
          <ul>
            {EXAMPLE_READINGS.map((reading) => (
              <li key={reading.label}>
                <span>{reading.label}</span>
                {reading.reading}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </figure>
  );
}
