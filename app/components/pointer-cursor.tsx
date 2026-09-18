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
    /* High-polling mice report hundreds of moves per second, and a scroll
       fires its own event per frame. Everything below is coalesced into
       one frame: the per-event work is storing a coordinate and a target;
       the state walks (closest selectors) and the elementFromPoint hit
       test run at most once per frame, and only when the element under
       the pointer has actually changed. */
    let pendingTarget: Element | null = null;
    let resolvedTarget: Element | null = null;
    let frame = 0;
    let frameAt = 0;

    const resolveState = (target: Element | null): State => {
      /* real pointer targets are elements, but an edge (a scrollbar, a
         detached node, a text node) must not be able to throw here */
      if (!target || typeof target.closest !== "function") return "rest";
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

    const sync = () => {
      frame = 0;
      frameAt = 0;
      try {
        if (pendingTarget !== resolvedTarget) {
          resolvedTarget = pendingTarget;
          lastState = resolveState(resolvedTarget);
        }
        place();
      } catch {
        /* A failure here must never become a frozen diamond with the
           native cursor hidden: hand the cursor back, and the next move
           rebuilds from scratch. */
        disengage();
      }
    };

    const schedule = () => {
      /* A stuck frame id (a throw before the callback ran, a dropped
         frame on a backgrounded tab) would otherwise stop the mark
         updating forever. Anything older than a few frames is replaced. */
      if (frame) {
        if (performance.now() - frameAt < 300) return;
        window.cancelAnimationFrame(frame);
      }
      frameAt = performance.now();
      frame = window.requestAnimationFrame(sync);
    };

    /* Engagement is idempotent. The first move places the mark at the true
       hotspot synchronously — before the native cursor steps aside, so
       there is never a frame with the mark somewhere else — and every
       later move only schedules the next frame. */
    const engage = () => {
      if (!engaged) {
        engaged = true;
        resolvedTarget = pendingTarget;
        lastState = resolveState(resolvedTarget);
        place();
        el.dataset.visible = "true";
        root.dataset.cursor = "custom";
        return;
      }
      schedule();
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

    /* Per-event work: store and schedule. Nothing else. */
    const move = (event: PointerEvent) => {
      lastX = event.clientX;
      lastY = event.clientY;
      pendingTarget = event.target as Element | null;
      engage();
    };

    /* Scrolling changes what sits under a still pointer; the state
       follows without waiting for the next move — coalesced like the
       moves, so a fast wheel never queues hit tests. */
    const scroll = () => {
      if (!engaged) return;
      pendingTarget = document.elementFromPoint(lastX, lastY);
      schedule();
    };

    const down = (event: PointerEvent) => {
      pressed = true;
      if (!engaged) {
        /* a press is a fresh, reliable signal that a fine pointer is
           present: re-engage rather than leaving the diamond off until
           the next move reparks it */
        lastX = event.clientX;
        lastY = event.clientY;
        pendingTarget = event.target as Element | null;
        engage();
        return;
      }
      place();
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
      /* The device switched pointer kinds (rare: detachable keyboards, a
         touch laptop reporting coarse for a moment). Hand the cursor
         back — but never remove the node, so a flip back to fine can
         re-engage without a reload. */
      if (!fine.matches) disengage();
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
      if (frame) window.cancelAnimationFrame(frame);
      /* Unmount or teardown always hands the cursor back. */
      delete root.dataset.cursor;
    };
  }, []);

  return <div ref={ref} className="pointer-mark" aria-hidden="true" data-visible="false" />;
}
