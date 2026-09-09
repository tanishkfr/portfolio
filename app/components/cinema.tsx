"use client";

import { useEffect } from "react";

/**
 * THE CAMERA.
 *
 * Native scroll feels like dragging a document. This eases the scroll
 * position toward a target every frame, which feels like a camera with mass —
 * the single change that separates a page from a world.
 *
 * It moves the real scroll position rather than transforming a wrapper. A
 * transformed wrapper is the usual shortcut and it breaks `position: sticky`,
 * `position: fixed`, anchor travel and focus scrolling. Keeping real scroll
 * keeps all four, so the descent's pinned stage and the rail still work.
 *
 * It publishes two things the whole site can compose against:
 *   --vel   signed scroll velocity, roughly -1 … 1
 *   --dir   1 travelling down, -1 travelling up
 *
 * Touch is left alone: iOS momentum is already better than anything worth
 * reimplementing, and fighting it causes rubber-banding. Reduced motion and
 * no-pointer devices fall through to native scroll entirely.
 */

const EASE = 0.14; // how much of the remaining distance is closed per frame
const MAX_VELOCITY = 55; // px/frame treated as full deflection

export function Cinema() {
  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let target = window.scrollY;
    let current = window.scrollY;
    let raf = 0;
    let running = false;
    let armed = false;
    let lastFrameAt = 0;

    // our own scrollTo calls must not be smoothed a second time by CSS
    const previousBehavior = root.style.scrollBehavior;

    const limit = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const disarm = () => {
      armed = false;
      running = false;
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
      root.style.scrollBehavior = previousBehavior;
      delete root.dataset.cinema;
      root.style.removeProperty("--vel");
    };

    const frame = () => {
      lastFrameAt = performance.now();
      const distance = target - current;

      if (Math.abs(distance) < 0.08) {
        current = target;
        window.scrollTo(0, current);
        root.style.setProperty("--vel", "0");
        running = false;
        raf = 0;
        return;
      }

      current += distance * EASE;
      window.scrollTo(0, current);

      const velocity = Math.max(
        -1,
        Math.min(1, (distance * EASE) / MAX_VELOCITY),
      );
      root.style.setProperty("--vel", velocity.toFixed(4));
      root.style.setProperty("--dir", velocity >= 0 ? "1" : "-1");

      raf = window.requestAnimationFrame(frame);
    };

    const run = () => {
      if (running) return;
      running = true;
      raf = window.requestAnimationFrame(frame);
    };

    const cameraOwns = () => {
      const x = window.innerWidth / 2;
      const y = Math.min(window.innerHeight * 0.42, window.innerHeight - 8);
      const hit = document.elementFromPoint(x, y);
      return Boolean(hit?.closest("[data-stage]"));
    };

    const onWheel = (event: WheelEvent) => {
      /* Never swallow a wheel event we cannot answer. This handler cancels the
         native scroll and moves the page itself, so if the frame loop is not
         actually running — a throttled or backgrounded tab, an animation
         timeline that never ticks — cancelling would leave the page unable to
         scroll at all. Taking over only once a real frame has fired means the
         worst case is plain native scrolling, never a frozen page. */
      if (!armed) return;
      // leave zoom gestures to the browser
      if (event.ctrlKey || event.metaKey) return;
      /* Heavy camera only while a pinned stage owns the viewport. The work
         index, notice, and close must answer the wheel immediately. */
      if (!cameraOwns()) {
        current = window.scrollY;
        target = window.scrollY;
        return;
      }

      /* A single granted frame is not proof the loop keeps ticking. If we are
         mid-animation and frames have stopped arriving, hand the page back
         permanently rather than keep eating gestures. Costs one wheel tick in
         the pathological case; the alternative is a page that cannot move. */
      if (running && performance.now() - lastFrameAt > 300) {
        disarm();
        return;
      }

      event.preventDefault();
      target = Math.max(0, Math.min(limit(), target + event.deltaY));
      run();
    };

    const adoptWindow = () => {
      current = window.scrollY;
      target = window.scrollY;
      running = false;
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
      root.style.setProperty("--vel", "0");
    };

    /* Anything that scrolls us from outside this loop — keyboard, an anchor,
       focusing an offscreen control, the Work link — must not be fought. */
    const onScroll = () => {
      if (Math.abs(window.scrollY - current) > 40) {
        adoptWindow();
        return;
      }
      if (running) return;
      if (Math.abs(window.scrollY - current) > 2) {
        current = window.scrollY;
        target = window.scrollY;
      }
    };

    const onResize = () => {
      target = Math.max(0, Math.min(limit(), target));
    };

    /* Arm only after the browser has actually granted us a frame. Until then
       the page scrolls natively, which is a perfectly good fallback. */
    const arming = window.requestAnimationFrame(() => {
      armed = true;
      root.style.scrollBehavior = "auto";
      root.dataset.cinema = "on";
      current = window.scrollY;
      target = window.scrollY;
    });

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("hashchange", adoptWindow);
    window.addEventListener("portfolio:pin", adoptWindow);

    return () => {
      window.cancelAnimationFrame(arming);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("hashchange", adoptWindow);
      window.removeEventListener("portfolio:pin", adoptWindow);
      if (raf) window.cancelAnimationFrame(raf);
      root.style.scrollBehavior = previousBehavior;
      delete root.dataset.cinema;
      root.style.removeProperty("--vel");
      root.style.removeProperty("--dir");
    };
  }, []);

  return null;
}
