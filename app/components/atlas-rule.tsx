"use client";

import { useRef, useState } from "react";
import { SignalField } from "./signal-field";

/**
 * ATLAS — an authored rule revision.
 *
 * This is a scripted example, not the visitor's reasoning: one rule carried
 * through the same three cases the case study uses. Each press advances the
 * provocation; the wording that survives stays, and every earlier version
 * remains visible below. The project's real instrument is where the visitor
 * does the revising.
 */

const EVOLUTION = [
  {
    case: "Starting rule",
    rule: "Outside tap may dismiss a reversible overlay.",
  },
  {
    case: "Lightbox · low consequence",
    rule: "Outside tap may dismiss a reversible overlay.",
  },
  {
    case: "Financial transfer · high consequence",
    rule: "Outside tap may dismiss a reversible overlay only when dismissal cannot lose work or create consequence.",
  },
  {
    case: "Switch access · a different event model",
    rule: "Dismissal must be defined by intent and consequence — not by an outside-tap event some input models do not have.",
  },
];

const STRETCH = ["88%", "88%", "97%", "105%"];

export function AtlasRule() {
  const [step, setStep] = useState(0);
  const [pulse, setPulse] = useState<{ key: number; dir: "disperse" | "resolve" } | null>(null);
  const timer = useRef(0);
  const atEnd = step >= EVOLUTION.length - 1;
  const current = EVOLUTION[step];

  function advance(): void {
    const next = atEnd ? 0 : Math.min(step + 1, EVOLUTION.length - 1);
    setStep(next);
    if (next === step) return;
    /* the rule under pressure: one short destabilise before the new
       wording settles — under reduced motion it just changes */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPulse({ key: Date.now(), dir: "disperse" });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPulse(null), 640);
  }

  return (
    <figure className="xp-room-shot xp-atlas">
      <span className="xp-atlas-tag">An authored rule revision</span>

      <p className="xp-atlas-context">{current.case}</p>
      <p
        className="xp-atlas-rule"
        aria-live="polite"
        style={{ fontStretch: STRETCH[step] }}
      >
        {pulse ? (
          <SignalField
            className="xp-atlas-field"
            glyphs="·:+*#"
            cell={10}
            seed={83 + step}
            ambient={0}
            pointerRadius={0}
            pulseKey={pulse.key}
            pulseMs={560}
            pulseDirection={pulse.dir}
            flow={1.6}
            color={(t) => `rgba(18, 97, 90, ${0.18 + 0.48 * t})`}
          />
        ) : null}
        {current.rule}
      </p>

      {step > 0 ? (
        <div className="xp-atlas-lineage">
          <p className="xp-atlas-lineage-label">Earlier wording</p>
          {EVOLUTION.slice(0, step).map((entry, index) => (
            <p key={index} className="xp-atlas-past">
              <span>{entry.case}</span>
              {entry.rule}
            </p>
          ))}
        </div>
      ) : null}

      {atEnd ? (
        <p className="xp-atlas-note">
          Three authored cases changed the starting rule. Every earlier version
          is still visible. Whether the rule transfers is not proven.
        </p>
      ) : null}

      <button
        type="button"
        className="xp-atlas-btn"
        onClick={advance}
      >
        {atEnd ? "Start over" : "Show the next case →"}
      </button>
    </figure>
  );
}
