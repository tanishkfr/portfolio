"use client";

import { useState } from "react";

/**
 * STAGE 2 — BEAT 3: "things I notice".
 *
 * The same control, built twice. Labels wait until after you have
 * used both — the job is the difference you feel, not the caption.
 */

function ToggleSpecimen() {
  const [careless, setCareless] = useState(false);
  const [considered, setConsidered] = useState(false);

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

function FocusSpecimen() {
  return (
    <figure className="xp-spec" data-reveal="figure">
      <form
        className="xp-spec-pair xp-field-pair"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="xp-field xp-field-plain">
          <span>Name</span>
          <input type="text" name="plain-name" autoComplete="off" />
        </label>
        <label className="xp-field xp-field-fine">
          <span>Name</span>
          <input type="text" name="fine-name" autoComplete="off" />
        </label>
      </form>
      <figcaption className="xp-spec-cap">
        <span className="xp-spec-label">The focus</span>
        Tab into both. One is a box. One tells you where you are.
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
          The difference is small. It&apos;s the whole job.
        </h2>
        <p className="xp-notice-sub" data-reveal="quiet">
          The same control, twice — careless, then considered. Try both.
        </p>
      </header>

      <div className="xp-notice-grid">
        <ToggleSpecimen />
        <PressSpecimen />
        <FocusSpecimen />
      </div>
    </section>
  );
}
