"use client";

import { useEffect, useRef } from "react";

/**
 * The state diamond IS the pointer on fine-pointer devices.
 *
 * Lifecycle contract: the native cursor is hidden (html[data-cursor=
 * "custom"]) if and only if the diamond is positioned and visible.
 * Both are set together by `engage()` and cleared together by
 * `disengage()`, so there is no state in which the page has neither
 * cursor. Engagement happens on the first pointermove — the diamond is
 * placed at the true hotspot before it is revealed — and re-engagement
 * happens on every subsequent move, so leaving the document (browser
 * chrome, another window, the edge of the screen) can never strand the
 * page without a cursor: return flow re-shows the diamond on the first
 * move back. Blur and tab-hide disengage immediately. Coarse pointers
 * never engage at all, and a pointer-kind change tears the system down.
 *
 * States, mirroring the site's state grammar:
 *
 *   rest    — hollow diamond, over reading matter and neutral ground
 *   active  — filled, over anything actionable (links, buttons, toggles)
 *   text    — a slim vertical bar, over selectable text and fields, so
 *             reading and selecting keep the caret vocabulary
 *
 * A press scales the diamond down inside the same transform chain —
 * feedback, not animation. It never intercepts events.
 */

type State = "rest" | "text" | "active";

/* The diamond's own half-extents, per state — the values mirror the CSS
   box sizes so the visual centre sits exactly on the pointer hotspot. */
const HOTSPOT: Record<State, [number, number]> = {
  rest: [6, 6], // 12px diamond
  text: [1, 10], // 2px × 1.25rem bar
  active: [7.5, 7.5], // 15px diamond
};

const TEXT_FIELD =
  "input:not([type='checkbox']):not([type='radio']):not([type='range']):not([type='button']):not([type='submit']):not([type='reset']), textarea, [contenteditable='true'], [contenteditable='']";

const ACTIONABLE =
  "a, button, select, summary, [role='button'], [role='slider'], label, input[type='checkbox'], input[type='radio'], input[type='range'], .xp-piece-title";

const READABLE =
  "p, li, dt, dd, h1, h2, h3, h4, h5, h6, figcaption, blockquote, th, td";

export function PointerMark() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return;
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;

    let lastX = -40;
    let lastY = -40;
    let lastState: State = "rest";
    let pressed = false;
    let engaged = false;

    const resolveState = (target: Element | null): State => {
      if (!target) return "rest";
      if (target.closest(TEXT_FIELD)) return "text";
      if (target.closest(ACTIONABLE)) return "active";
      if (target.closest(READABLE)) return "text";
      return "rest";
    };

    /* One inline transform carries position, orientation and press: the
       chain applies right-to-left, so the diamond scales and turns about
       its own centre and then lands with that centre on the pointer
       hotspot. Rotation stays in the inline chain — composing it as a
       separate `rotate` property would reorder the matrix and throw the
       diamond off the hotspot. */
    const place = () => {
      const [dx, dy] = HOTSPOT[lastState];
      const parts = [
        `translate(${Math.round(lastX) - dx}px, ${Math.round(lastY) - dy}px)`,
      ];
      if (lastState !== "text") parts.push("rotate(45deg)");
      if (pressed) parts.push("scale(0.8)");
      el.dataset.state = lastState;
      el.style.transform = parts.join(" ");
    };

    /* Engagement is idempotent and re-runs on every move: the mark is
       placed first, revealed second, and only then does the native
       cursor step aside. Whatever hid the mark — the document edge,
       browser chrome, a window switch — the next move repairs. */
    const engage = () => {
      place();
      if (engaged) return;
      engaged = true;
      el.dataset.visible = "true";
      root.dataset.cursor = "custom";
    };

    /* Disengagement returns the native cursor at once: the attribute
       and the mark's visibility are cleared together, so the page is
       never left with neither cursor. */
    const disengage = () => {
      if (!engaged) return;
      engaged = false;
      el.dataset.visible = "false";
      delete root.dataset.cursor;
    };

    /* Direct per-event writes: no rAF queue, no trailing offset, no
       easing — the diamond moves with the pointer's own report. */
    const move = (event: PointerEvent) => {
      lastX = event.clientX;
      lastY = event.clientY;
      lastState = resolveState(event.target as Element | null);
      engage();
    };

    /* Scrolling changes what sits under a still pointer; the state
       follows without waiting for the next move. */
    const scroll = () => {
      if (!engaged) return;
      const under = document.elementFromPoint(lastX, lastY);
      lastState = resolveState(under);
      place();
    };

    const down = () => {
      pressed = true;
      if (engaged) place();
    };
    const up = () => {
      pressed = false;
      if (engaged) place();
    };
    const leave = () => disengage();
    const blur = () => disengage();
    const visibility = () => {
      if (document.hidden) disengage();
    };
    const kindChanged = () => {
      /* The device switched pointer kinds (rare, e.g. detachable
         keyboards): a coarse pointer must never carry the mark. */
      if (!fine.matches) {
        disengage();
        el.remove();
      }
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("blur", blur);
    document.addEventListener("visibilitychange", visibility);
    document.documentElement.addEventListener("pointerleave", leave);
    fine.addEventListener("change", kindChanged);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("blur", blur);
      document.removeEventListener("visibilitychange", visibility);
      document.documentElement.removeEventListener("pointerleave", leave);
      fine.removeEventListener("change", kindChanged);
      /* Unmount or teardown always hands the cursor back. */
      delete root.dataset.cursor;
    };
  }, []);

  return <div ref={ref} className="pointer-mark" aria-hidden="true" data-visible="false" />;
}
