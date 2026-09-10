"use client";

import { Arrival } from "./arrival";
import { Atmosphere } from "./atmosphere";
import { Cinema } from "./cinema";
import { Descent } from "./descent";
import { Notice } from "./notice";
import { Rift } from "./rift";
import { Works } from "./works";
import { SceneDirector } from "./scene-director";
import { TransitionLink } from "./transition-link";

/**
 * EXPLORE — seven scenes, not fourteen sections.
 *
 * 01 Arrival     wipe the generic line off the real one
 * 02 Descent     software asks less — a control erodes
 * 03 Rift        the word "see" becomes architecture, then tears
 * 04 Work        projects invade; each plate is a different object
 * 05 Notice      quiet craft. almost no motion
 * 06 Finale      write, as composition
 */

export function Explore() {
  return (
    <main id="main-content" className="xp">
      <Cinema />
      <Atmosphere />
      <SceneDirector />

      <Arrival />
      <Descent />
      <Rift />
      <Works />
      <Notice />

      <section
        className="xp-close"
        data-scene
        data-stage
        aria-label="Contact"
      >
        <div className="xp-close-pin">
          <p className="xp-close-eyebrow">That is the work</p>
          <a
            className="xp-close-mail"
            href="mailto:madebytanishk@gmail.com"
          >
            write
          </a>
          <h2 className="xp-close-line">If any of it was useful.</h2>
          <p className="xp-close-sub">
            In Bengaluru. Available for interaction and product design work.
          </p>
          <div className="xp-close-links">
            <a className="xp-close-external" href="mailto:madebytanishk@gmail.com">
              madebytanishk@gmail.com <span aria-hidden="true">↗</span>
            </a>
            <a
              className="xp-close-external"
              href="https://twitter.com/madebytanishk"
              target="_blank"
              rel="noreferrer"
            >
              @madebytanishk <span aria-hidden="true">↗</span>
            </a>
            <TransitionLink className="xp-close-next" href="/about">
              About <span aria-hidden="true">→</span>
            </TransitionLink>
          </div>
          <p className="xp-close-foot">
            Bengaluru ·{" "}
            <span className="xp-close-strike" aria-hidden="true">
              not looking
            </span>{" "}
            available for work
          </p>
        </div>
      </section>
    </main>
  );
}
