"use client";

import { useState } from "react";

/**
 * STAGE 2 — BEAT 3: "things I notice".
 *
 * Personality, from truth: he notices the interaction details most people
 * scroll past. So here are the same controls built twice — once carelessly,
 * once considered — and the visitor gets to feel the difference. Every
 * specimen is real and interactive; nothing is asserted that isn't shown.
 */

function ToggleSpecimen() {
  const [careless, setCareless] = useState(false);
  const [considered, setConsidered] = useState(true);

  return (
    <figure className="xp-spec" data-reveal="figure">
      <div className="xp-spec-pair">
        <button
          type="button"
          role="switch"
          aria-checked={careless}
          aria-label="Careless toggle"
          className="xp-toggle xp-toggle-plain"
          data-on={careless}
          onClick={() => setCareless((v) => !v)}
        >
          <span className="xp-toggle-knob" />
        </button>
        <button
          type="button"
          role="switch"
          aria-checked={considered}
          aria-label="Considered toggle"
          className="xp-toggle xp-toggle-fine"
          data-on={considered}
          onClick={() => setConsidered((v) => !v)}
        >
          <span className="xp-toggle-knob" />
        </button>
      </div>
      <figcaption className="xp-spec-cap">
        <span className="xp-spec-label">The switch</span>
        One snaps. One settles. You feel the second one before you can name it.
      </figcaption>
    </figure>
  );
}

function PressSpecimen() {
  return (
    <figure className="xp-spec" data-reveal="figure">
      <div className="xp-spec-pair">
        <button type="button" className="xp-press xp-press-plain">
          Save
        </button>
        <button type="button" className="xp-press xp-press-fine">
          Save
        </button>
      </div>
      <figcaption className="xp-spec-cap">
        <span className="xp-spec-label">The press</span>
        Push both. One ignores you. One gives the press back.
      </figcaption>
    </figure>
  );
}

export function Notice() {
  return (
    <section
      id="notice"
      className="xp-notice"
      data-scene
      aria-label="Things I notice"
    >
      <header className="xp-notice-head">
        <p className="xp-notice-kicker">What I can&apos;t stop noticing</p>
        <h2 className="xp-notice-title" data-reveal="name">
          I notice the parts most people scroll past.
        </h2>
        <p className="xp-notice-sub" data-reveal="quiet">
          The same control, built twice — once carelessly, once considered.
          Try both. The difference is small, and it&apos;s the whole job.
        </p>
      </header>

      <div className="xp-notice-grid">
        <ToggleSpecimen />
        <PressSpecimen />
      </div>
    </section>
  );
}
