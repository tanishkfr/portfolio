"use client";

import { useEffect, useRef } from "react";

/**
 * TWO SCENES ABOUT THE PERSON.
 *
 * Explore says what he believes and shows what he built, but never says what
 * he actually does or where any of it comes from. A reviewer should not have
 * to infer either.
 *
 * RANGE holds one sentence and swaps the verb in it — architect, design,
 * write, implement — because the claim is not that he does four jobs but that
 * one person carried each project through all four.
 *
 * BORROWED names five things taken from outside interface design and the
 * lesson each handed over. Not hobbies: the interesting fact is never that
 * someone likes Formula 1, it is what they took from it.
 *
 * Both scrub against their own stage progress the way the descent does, so
 * they read as one continuous move rather than a list arriving. Weights
 * plateau and the offset is signed, so an outgoing line leaves upward while
 * the next waits below and the two never share a line.
 */

const VERBS = ["architect", "design", "write", "implement"];

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

/** triangular weights with a plateau, and a signed offset so nothing collides */
function useScrub(count: number) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const travel = el.offsetHeight - window.innerHeight;
      const p =
        travel > 0
          ? Math.max(0, Math.min(1, -el.getBoundingClientRect().top / travel))
          : 0;
      const band = 1 / (count - 1);
      for (let i = 0; i < count; i += 1) {
        const offset = (p - i * band) / band;
        el.style.setProperty(
          `--w${i}`,
          Math.min(1, Math.max(0, (1 - Math.abs(offset)) * 2.6 - 0.85)).toFixed(4),
        );
        el.style.setProperty(
          `--o${i}`,
          Math.min(1.5, Math.max(-1.5, offset)).toFixed(4),
        );
      }
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [count]);

  return ref;
}

export function Range() {
  const ref = useScrub(VERBS.length);

  return (
    <section
      className="xp-range"
      ref={ref}
      data-stage
      aria-label="One person carried each of these through architecture, design, writing and implementation."
    >
      <div className="xp-range-pin">
        <p className="xp-range-lead">
          Every one of them,
          <br />I{" "}
          <span className="xp-range-swap">
            {VERBS.map((verb, i) => (
              <span
                key={verb}
                className="xp-range-verb"
                style={{ "--i": i } as React.CSSProperties}
              >
                {verb}
              </span>
            ))}
          </span>{" "}
          myself.
        </p>
        <p className="xp-range-note">
          Concept, interface, the writing, and the code that makes it run. The
          range is the point — the decisions that matter live between those
          jobs, not inside one of them.
        </p>
      </div>
    </section>
  );
}

export function Borrowed() {
  const ref = useScrub(BORROWED.length);

  return (
    <section
      className="xp-borrow"
      ref={ref}
      data-stage
      aria-label="Five things borrowed from outside interface design"
    >
      <div className="xp-borrow-pin">
        <p className="xp-borrow-kicker">I steal from everywhere except interfaces</p>
        <ol className="xp-borrow-set">
          {BORROWED.map((item, i) => (
            <li
              key={item.from}
              className="xp-borrow-beat"
              style={{ "--i": i } as React.CSSProperties}
            >
              <p className="xp-borrow-from">{item.from}</p>
              <p className="xp-borrow-lesson">{item.lesson}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
