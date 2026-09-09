"use client";

import { LookUnder } from "./look-under";

/**
 * TWO SCENES ABOUT THE PERSON — now optional depth, after the work.
 *
 * RANGE is one sentence with four verbs under it.
 * BORROWED is five lessons as a spread, not a five-viewport corridor.
 */

const BORROWED: { from: string; lesson: string }[] = [
  {
    from: "Formula 1",
    lesson:
      "A car at 300kph tells its driver everything with almost no interface. Constraint is what makes it readable.",
  },
  {
    from: "Architecture",
    lesson: "You never understand a building from a photograph. You understand it by moving through it.",
  },
  {
    from: "Film",
    lesson:
      "A cut decides what you feel. Nothing on screen changed — only when you were allowed to see it.",
  },
  {
    from: "Printed books",
    lesson:
      "A page has no states and nothing to hover. It still knows exactly where your eye goes next.",
  },
  {
    from: "Games with weather",
    lesson:
      "Atmosphere does the work exposition cannot. You know the rules of a place before anyone tells you them.",
  },
];

export function Range() {
  return (
    <section
      className="xp-range"
      aria-label="One person carried each of these through architecture, design, writing and implementation."
    >
      <div className="xp-range-pin">
        <LookUnder
          label="Show what else I do besides design"
          rest={0.22}
          surface={
            <p className="xp-range-lead">
              Every one of them,
              <br />I <em>design</em> myself.
            </p>
          }
          under={
            <p className="xp-range-lead xp-range-lead--under">
              Every one of them,
              <br />I architect, design, write, implement myself.
            </p>
          }
        />
        <p className="xp-range-note">
          Concept, interface, writing, and the code that runs it. The useful
          decisions usually sit between those jobs, not inside one of them.
        </p>
      </div>
    </section>
  );
}

export function Borrowed() {
  return (
    <section
      className="xp-borrow"
      aria-label="Five things borrowed from outside interface design"
    >
      <div className="xp-borrow-pin">
        <p className="xp-borrow-kicker">I steal from everywhere except interfaces</p>
        <ol className="xp-borrow-set">
          {BORROWED.map((item) => (
            <li key={item.from} className="xp-borrow-beat">
              <p className="xp-borrow-from">{item.from}</p>
              <p className="xp-borrow-lesson">{item.lesson}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
