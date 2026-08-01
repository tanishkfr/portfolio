"use client";

import { Arrival } from "./arrival";
import { Atmosphere } from "./atmosphere";
import { Beat } from "./beat";
import { Cinema } from "./cinema";
import { Descent } from "./descent";
import { Notice } from "./notice";
import { Borrowed, Range } from "./practice";
import { Works } from "./works";
import { SceneDirector } from "./scene-director";
import { TransitionLink } from "./transition-link";

/**
 * EXPLORE — the world you look *under*.
 *
 * The viewport is a stage, not a scrollport. Scenes are pinned and hold for a
 * scroll budget of their own choosing, and scrolling advances *through* a scene
 * before it moves to the next — which is why a long descent does not read as a
 * long document. Budgets vary deliberately: a held sequence earns three or four
 * viewports, a single line of punctuation earns one.
 *
 * Three engines run underneath. Cinema eases the scroll so it has mass.
 * Atmosphere mixes the ground colour from whichever rooms are nearest, so light
 * changes as you travel instead of cutting at a seam. SceneDirector tells every
 * scene where it stands and every stage how far through itself you are.
 *
 * Nothing here gates content on a frame loop: every scroll-driven value falls
 * back to a state where the writing is fully legible.
 */

export function Explore() {
  return (
    <main id="main-content" className="xp">
      {/* the camera, the ground, and the director of every scene */}
      <Cinema />
      <Atmosphere />
      <SceneDirector />

      {/* the opening: a pinned stage you scrub the premise across */}
      <Arrival />

      {/* the descent, which ends on "and every year it shows me less" */}
      <Descent />

      {/* Beats are the rhythm. Two long developed scenes back to back flatten
          into one; a single held line between them resets the ear. */}
      <Beat>So I got in the habit of looking under things.</Beat>

      {/* things I notice */}
      <Notice />

      {/* what he actually does, and where it comes from */}
      <Range />
      <Borrowed />

      {/* The argument has been made — the premise, what he notices, what he
          does, and where it all comes from. Only now do the five that answer
          it stand together, and each one opens into its own full-screen room. */}
      <Works />

      {/* the close: bookend the opening, then contact */}
      <section className="xp-close" data-scene aria-label="Contact">
        <p className="xp-close-eyebrow" data-reveal>
          You&apos;ve looked under all of it
        </p>
        <h2 className="xp-close-line" data-reveal="name">
          That was the part you don&apos;t see.
        </h2>
        <p className="xp-close-sub" data-reveal>
          Five studies in what systems decide, explain, and let people change.
          If any of it landed, I&apos;d like to hear from you.
        </p>
        <div className="xp-close-links" data-reveal>
          <a href="mailto:madebytanishk@gmail.com">madebytanishk@gmail.com ↗</a>
          <a
            href="https://twitter.com/madebytanishk"
            target="_blank"
            rel="noreferrer"
          >
            @madebytanishk ↗
          </a>
          <TransitionLink href="/resume">Résumé →</TransitionLink>
          <TransitionLink href="/about">About →</TransitionLink>
        </div>
        <p className="xp-close-foot" data-reveal>
          {/* the strike is a visual joke only — spoken aloud it would invert
              the sentence, so it is hidden and the true line is what reads */}
          Bengaluru ·{" "}
          <span className="xp-close-strike" aria-hidden="true">
            not looking
          </span>{" "}
          available for work
        </p>
      </section>
    </main>
  );
}
