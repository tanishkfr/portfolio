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
          <p className="xp-close-eyebrow" data-reveal>
            That is the work
          </p>
          <a
            className="xp-close-mail"
            href="mailto:madebytanishk@gmail.com"
            data-reveal="name"
          >
            write
          </a>
          <h2 className="xp-close-line" data-reveal>
            If any of it was useful.
          </h2>
          <p className="xp-close-sub" data-reveal="quiet">
            Bengaluru. Studio, four live studies, a product case still being
            written. Available.
          </p>
          <div className="xp-close-links" data-reveal>
            <a href="mailto:madebytanishk@gmail.com">
              madebytanishk@gmail.com ↗
            </a>
            <a
              href="https://twitter.com/madebytanishk"
              target="_blank"
              rel="noreferrer"
            >
              @madebytanishk ↗
            </a>
            <TransitionLink href="/contact">Contact →</TransitionLink>
            <TransitionLink href="/resume">Résumé →</TransitionLink>
            <TransitionLink href="/about">About →</TransitionLink>
          </div>
          <p className="xp-close-foot" data-reveal>
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
