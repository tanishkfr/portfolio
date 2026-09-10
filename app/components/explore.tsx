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
 * EXPLORE — one story.
 *
 * 1  Arrival   I design interfaces — and the part you don't see.
 * 2  Descent   Interfaces now act with less asking.
 * 3  Rift      That behaviour still has to be designed.
 * 4  Work      Proof. So I built these.
 * 5  Notice    Quiet craft.
 * 6  Close     Write.
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

      <section className="xp-close" data-scene aria-label="Contact">
        <a
          className="xp-close-mail"
          href="mailto:madebytanishk@gmail.com"
          data-reveal="name"
        >
          write
        </a>
        <p className="xp-close-line">
          If any of it was useful.
        </p>
        <div className="xp-close-links">
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
          <TransitionLink href="/about">About →</TransitionLink>
        </div>
        <p className="xp-close-foot">
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
