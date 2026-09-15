"use client";

import { SignalField, type Quiet } from "./signal-field";
import { TransitionLink } from "./transition-link";

/**
 * THE CLOSING NOTE.
 *
 * One quiet beat between the last sheet and the global footer: the
 * folio's argument on the left, a faint glyph pattern settling on the
 * right — the material at its calmest, no signal fragments. The text
 * column is structurally clear of the canvas; quiet zones still
 * dissolve every edge facing the words.
 */

const CLOSE_TEXTURE_QUIET: Quiet[] = [
  { x: 0, y: 0, w: 0.16, h: 1, falloff: 1, feather: 0.06 },
  { x: 0, y: 0, w: 1, h: 0.08, falloff: 0.9, feather: 0.04 },
  { x: 0, y: 0.92, w: 1, h: 0.08, falloff: 0.85, feather: 0.04 },
];

export function CloseBridge() {
  return (
    <section
      className="xp-close"
      aria-labelledby="close-note"
      data-close-note
    >
      <SignalField
        className="xp-close-texture"
        cell={14}
        seed={129}
        ambient={0.22}
        flow={1.4}
        drift={0.3}
        pointerRadius={0}
        quiet={CLOSE_TEXTURE_QUIET}
        color={(t) => `rgba(27, 33, 38, ${0.03 + 0.09 * t})`}
      />
      <h2 className="xp-close-statement" id="close-note">
        {"I'm interested in interfaces that explain themselves, adapt, and leave evidence behind."}
      </h2>
      <p className="xp-close-note">
        {"If that sounds like the kind of problem you're working on, I'd like to hear about it."}
      </p>
      <TransitionLink className="xp-close-link" href="/contact">
        Contact <span aria-hidden="true">↗</span>
      </TransitionLink>
    </section>
  );
}
