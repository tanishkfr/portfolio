import Image from "next/image";

/**
 * SCENE — the word becomes the next room.
 *
 * After Arrival names the premise, "see" detaches and grows until it is
 * architecture. Scroll carves it open. Through the cut: the first project
 * colour, already in the page, so the work does not wait behind a heading.
 *
 * Without JavaScript --t is 1: the word is large, the cut is open, the
 * work is visible. The sequence is the enhancement.
 */

export function Rift() {
  return (
    <section
      className="xp-rift"
      data-stage
      data-room="fluxion-studios"
      aria-label="The work starts here"
    >
      <div className="xp-rift-pin">
        <p className="xp-rift-kicker">the work starts here</p>
        <p className="xp-rift-word" aria-hidden="true">
          see
        </p>
        <p className="xp-rift-note">
          The interesting part is usually the behaviour, not the skin.
        </p>
        <div className="xp-rift-world" aria-hidden="true">
          <span className="xp-rift-brand">
            <Image
              unoptimized
              src="/projects/fluxion/wordmark-dark.png"
              width={669}
              height={42}
              sizes="(max-width: 768px) 82vw, 58vw"
              alt=""
              priority
            />
          </span>
          <span className="xp-rift-ghost-cap">the studio, live</span>
        </div>
      </div>
    </section>
  );
}
