"use client";

import { useEffect, useRef, useState } from "react";
import { SignalField } from "./signal-field";
import { SpecimenAmbient } from "./specimen";

/**
 * PENTIMENTO — the person takes the page back.
 *
 * The machine reading leads alone. Strike it and authority moves: the
 * original stays legible above, struck through and labelled as withdrawn,
 * while the example reply rises below as the leading voice. Reversible,
 * because a correction should never be a trap either.
 *
 * The material grammar: when the machine reading's authority is
 * contested it is shown for a moment as unstable matter — on STRIKE the
 * sentence fragments and settles into its withdrawn state; when the
 * person puts it back the material recomposes. STAND (no interaction)
 * stays crisp; the field exists only for the transition.
 */

type Pulse = { key: number; direction: "disperse" | "resolve" } | null;

export function PentimentoStrike() {
  const [struck, setStruck] = useState(false);
  const [pulse, setPulse] = useState<Pulse>(null);
  const transitionMs = 950;
  const pulseRef = useRef(0);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        setStruck(sessionStorage.getItem("xp-pent-struck") === "1");
      } catch {
        /* private mode */
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(pulseRef.current);
    };
  }, []);

  function strike() {
    const next = !struck;
    setStruck(next);
    try {
      sessionStorage.setItem("xp-pent-struck", next ? "1" : "0");
    } catch {
      /* private mode */
    }
    /* the material is the transition, not the state: under reduced
       motion the correction settles instantly and no field plays */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    window.clearTimeout(pulseRef.current);
    setPulse({
      key: Date.now(),
      direction: next ? "disperse" : "resolve",
    });
    pulseRef.current = window.setTimeout(
      () => setPulse(null),
      transitionMs + 80,
    );
  }

  return (
    <figure className="xp-room-shot xp-pent" data-struck={struck ? "true" : undefined}>
      {/* The contested reading sits in unstable matter even at rest: a
          quiet fragment field behind the machine's claim, clear of the
          person's correction below. The strike sweeps the same material. */}
      <SpecimenAmbient slug="pentimento" seed={73} />
      <div className="xp-pent-stack">
        {pulse ? (
          <SignalField
            className="xp-pent-field"
            glyphs="·:+*#"
            cell={10}
            seed={pulse.direction === "disperse" ? 41 : 57}
            ambient={0}
            pointerRadius={0}
            pulseKey={pulse.key}
            pulseMs={transitionMs}
            pulseDirection={pulse.direction}
            /* the fragments drift with the same field the hero uses */
            flow={pulse.direction === "disperse" ? 2.4 : 1.4}
            color={(t) => `rgba(125, 38, 87, ${0.22 + 0.55 * t})`}
          />
        ) : null}
        <p className="xp-pent-machine">
          <span className="xp-pent-tag">
            {struck ? "machine reading · withdrawn" : "machine reading"}
          </span>
          You fell out of love with film in 2023. The pattern is unmistakable.
        </p>
        {struck ? (
          <p className="xp-pent-mine">
            <span className="xp-pent-tag">Example reply</span>
            I only stopped logging it. The love was never in the data.
          </p>
        ) : null}
      </div>

      <button
        type="button"
        className="xp-pent-btn"
        onClick={strike}
        aria-pressed={struck}
      >
        {struck ? "Put it back" : "Strike it"}
      </button>
    </figure>
  );
}
