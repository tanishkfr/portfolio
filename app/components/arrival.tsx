/**
 * ARRIVAL.
 *
 * A pinned stage rather than a screen you scroll past. It holds for three
 * viewports of scroll, and what you are actually doing with that scroll is
 * running a read-head across a sentence: ahead of it the generic line nobody
 * would remember, behind it the line that survived.
 *
 * So the premise is not stated and it is not hidden behind a hover anyone
 * could miss — it is the first thing your own scrolling does. The two lines
 * sit in the same box at the same size, so the wipe swaps one legible sentence
 * for another and never double-exposes them.
 *
 * Server-rendered as the real <h1>; the draft is decorative and hidden from
 * assistive tech. With no JavaScript --t stays 1, which leaves the finished
 * line fully revealed and the invitation visible — the sequence is the
 * enhancement, never the only way to read it.
 */

export function Arrival() {
  return (
    <section
      className="xp-arrive"
      data-stage
      aria-label="Tanishk, interaction designer"
    >
      <div className="xp-arrive-pin">
        <p className="xp-arrive-kicker">Bengaluru — available for work</p>

        {/* Both sentences begin "I design", so only the tail is ever in doubt.
            Wiping the whole block would collide two different line-breaks and
            read as nonsense halfway through; holding the prefix still and
            rolling just the tail means every position in the scrub is a real
            sentence. The h1 reads as the finished line to assistive tech. */}
        <h1 className="xp-arrive-line">
          I design{" "}
          <span className="xp-arrive-swap">
            <span className="xp-arrive-tail is-was" aria-hidden="true">
              apps and interfaces.
            </span>
            <span className="xp-arrive-tail is-now">
              the part you don&apos;t see.
            </span>
          </span>
        </h1>

        <p className="xp-arrive-note">
          Four independent projects, a studio I co-founded, and a product case still in progress.
        </p>

        <p className="xp-arrive-cue" aria-hidden="true">
          keep scrolling
        </p>
      </div>
    </section>
  );
}
