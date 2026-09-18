"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function MotionDirector() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const view = window;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    /* Elements waiting for their entrance.
       ------------------------------------------------------------------
       Geometry decides, not IntersectionObserver. The historical reason:
       the old hidden state was a clip-path that clipped the element's
       own box to zero area, and Chromium folded that clip into the
       observer's intersection rect, so a hidden target reported ratio 0
       for as long as it was hidden and could never be observed as
       arriving. The entrance is an opacity fade now, which an observer
       could see — but the sweep stays, because it is simpler than an
       observer, fails open by construction, and measures the box the
       reader will actually see. */
    const pending = new Set<HTMLElement>();

    root.classList.add("motion-ready");

    const reveal = (element: HTMLElement) => {
      pending.delete(element);
      element.classList.add("is-revealed");
    };

    const revealAll = () => {
      pending.forEach((element) => element.classList.add("is-revealed"));
      pending.clear();
    };

    /* Entrance thresholds, in the units the observer used: the bottom
       seventh of the viewport is dead space, and an element must be at
       least eight percent arrived before its entrance plays. Anything the
       viewport has already passed, or that spans the whole visible band,
       or that has no measurable box, fails open instead of staying
       hidden. */
    const sweep = () => {
      if (!pending.size) return;
      const limit = view.innerHeight * 0.93;
      pending.forEach((element) => {
        const box = element.getBoundingClientRect();
        if (!box.height || !box.width) {
          reveal(element);
          return;
        }
        if (box.bottom <= 0) {
          // already scrolled past: fail open
          reveal(element);
          return;
        }
        if (box.top <= 0 && box.bottom >= limit) {
          // taller than the visible band: nothing to withhold
          reveal(element);
          return;
        }
        if (box.top >= limit) return;
        const arrived = Math.min(box.bottom, limit) - box.top;
        if (arrived >= box.height * 0.08) reveal(element);
      });
    };

    const updateDocumentState = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - view.innerHeight;
      const progress = scrollable > 0 ? Math.min(view.scrollY / scrollable, 1) : 0;
      /* Both states are consumed only by the header, so they are written
         there rather than on the root: a root-level custom property
         invalidates style for the whole document on every scroll frame. */
      const host =
        document.querySelector<HTMLElement>(".site-header") ?? root;
      host.style.setProperty("--scroll-progress", progress.toFixed(4));
      host.dataset.scrolled = view.scrollY > 20 ? "true" : "false";
      /* A sweep can never be allowed to withhold content: if measuring
         throws, the page fails open rather than staying blank. */
      try {
        sweep();
      } catch {
        revealAll();
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = view.requestAnimationFrame(updateDocumentState);
    };

    const setMotionPreference = () => {
      root.dataset.motion = media.matches ? "reduced" : "full";
      // Reduced motion renders everything at once; the CSS already forces
      // it, and marking the elements keeps the state honest.
      if (media.matches) revealAll();
    };

    setMotionPreference();
    updateDocumentState();
    media.addEventListener("change", setMotionPreference);
    view.addEventListener("scroll", onScroll, { passive: true });
    view.addEventListener("resize", onScroll);

    const track = (element: HTMLElement) => {
      if (element.classList.contains("is-revealed")) return;
      if (media.matches) {
        reveal(element);
        return;
      }
      /* Content here on arrival has nothing to acknowledge: reveal it
         outright rather than waiting on a frame, so a first screen can
         never be left blank. Content the viewport has already passed
         fails open for the same reason. */
      const box = element.getBoundingClientRect();
      if (box.top < view.innerHeight && box.bottom > 0) {
        reveal(element);
        return;
      }
      if (box.bottom <= 0) {
        reveal(element);
        return;
      }
      pending.add(element);
    };

    const trackTree = (node: ParentNode) => {
      if (node instanceof HTMLElement && node.matches("[data-reveal]")) {
        track(node);
      }
      node.querySelectorAll<HTMLElement>("[data-reveal]").forEach(track);
    };

    trackTree(document);

    /* Changing read mode, or any later mount, replaces sections without
       changing the route, so this effect does not re-run. Reveals that
       mount later must still be caught or they stay clipped for good. */
    const mutations = new MutationObserver((records) => {
      let added = false;
      records.forEach((record) =>
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            trackTree(node);
            added = true;
          }
        }),
      );
      if (added) onScroll();
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    /* A sweep only runs on scroll, so content that becomes visible through
       a reflow — an image arriving, a section expanding — would otherwise
       wait for a scroll that may never come. Watching the document's own
       size covers those without a timer. */
    let resizeObserver: ResizeObserver | null = null;
    if ("ResizeObserver" in view) {
      resizeObserver = new ResizeObserver(onScroll);
      resizeObserver.observe(document.documentElement);
    }

    return () => {
      mutations.disconnect();
      resizeObserver?.disconnect();
      media.removeEventListener("change", setMotionPreference);
      view.removeEventListener("scroll", onScroll);
      view.removeEventListener("resize", onScroll);
      if (frame) view.cancelAnimationFrame(frame);
      pending.clear();
    };
  }, [pathname]);

  return null;
}
