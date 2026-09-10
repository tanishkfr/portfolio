"use client";

import { useState } from "react";

/**
 * ATLAS — carry one rule until it changes shape.
 *
 * A design rule starts clean. Carry it into a harder, unlike case and it has
 * to rewrite itself; the forms it used to take stay behind as struck lineage.
 * A rule that never has to change under pressure was only ever a preference.
 */

const EVOLUTION = [
  { context: "the rule, as written", rule: "Confirm before you delete." },
  {
    context: "carried into — a single tap you can undo",
    rule: "Confirm before you delete, unless a tap can be taken back.",
  },
  {
    context: "carried into — an export you can't reverse",
    rule: "Confirm before anything you can't undo.",
  },
  {
    context: "carried into — fifty times a day",
    rule: "Confirm what's irreversible. Make the rest instant, and reversible.",
  },
];

export function AtlasRule() {
  const [step, setStep] = useState(0);
  const atEnd = step >= EVOLUTION.length - 1;

  return (
    <figure className="xp-room-shot xp-atlas">
      {step > 0 ? (
        <div className="xp-atlas-lineage" aria-hidden="true">
          {EVOLUTION.slice(0, step).map((entry, index) => (
            <p key={index} className="xp-atlas-past">
              {entry.rule}
            </p>
          ))}
        </div>
      ) : null}

      <p className="xp-atlas-context">{EVOLUTION[step].context}</p>
      <p className="xp-atlas-rule" aria-live="polite">
        {EVOLUTION[step].rule}
      </p>

      {atEnd ? (
        <p className="xp-atlas-note">
          Three cases changed the starting rule. Every earlier version is still visible.
        </p>
      ) : null}

      <button
        type="button"
        className="xp-atlas-btn"
        onClick={() =>
          setStep((current) =>
            atEnd ? 0 : Math.min(current + 1, EVOLUTION.length - 1),
          )
        }
      >
        {atEnd ? "Start over" : "Carry it into a harder case →"}
      </button>
    </figure>
  );
}
