"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function MotionDirector() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    // declared up here because the scroll handler below reads it before the
    // observer that sets it exists
    let observerFired = false;

    root.classList.add("motion-ready");

    const setMotionPreference = () => {
      root.dataset.motion = media.matches ? "reduced" : "full";
    };

    const updateDocumentState = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
      root.style.setProperty("--scroll-progress", progress.toFixed(4));
      root.dataset.scrolled = window.scrollY > 20 ? "true" : "false";

      /* Backstop. Reveals must fail open: if someone has scrolled a whole
         screen and the observer has still never fired, it is not going to,
         and choreography is not worth a blank page. Reveal everything and
         stop checking. */
      if (!observerFired && window.scrollY > window.innerHeight) {
        observerFired = true;
        document
          .querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)")
          .forEach((element) => element.classList.add("is-revealed"));
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateDocumentState);
    };

    setMotionPreference();
    updateDocumentState();
    media.addEventListener("change", setMotionPreference);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // With reduced motion, or without the observer, content is simply
    // present — arrival is acknowledged, never required.
    const instant = media.matches || !("IntersectionObserver" in window);

    let observer: IntersectionObserver | null = null;
    if (!instant) {
      observer = new IntersectionObserver(
        (entries) => {
          observerFired = true;
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-revealed");
            observer?.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -7%", threshold: 0.08 },
      );
    }

    const track = (element: HTMLElement) => {
      if (element.classList.contains("is-revealed")) return;
      if (!observer) {
        element.classList.add("is-revealed");
        return;
      }
      /* Anything already on screen is revealed outright rather than waiting
         on the observer. Entrances acknowledge arrival, so there is nothing
         to acknowledge about content that was here on arrival — and it means
         a first screen can never be left blank if the observer is throttled
         or never fires. */
      const box = element.getBoundingClientRect();
      if (box.top < window.innerHeight && box.bottom > 0) {
        element.classList.add("is-revealed");
        return;
      }
      observer.observe(element);
    };

    const trackTree = (node: ParentNode) => {
      if (node instanceof HTMLElement && node.matches("[data-reveal]")) {
        track(node);
      }
      node.querySelectorAll<HTMLElement>("[data-reveal]").forEach(track);
    };

    trackTree(document);

    /* Changing read mode remounts whole sections without changing the
       route, so this effect does not re-run. Reveals that mount later must
       still be picked up, or they stay at opacity 0 for good — which would
       leave a reviewer returning from Quick review on a blank page. */
    const mutations = new MutationObserver((records) => {
      records.forEach((record) =>
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) trackTree(node);
        }),
      );
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer?.disconnect();
      mutations.disconnect();
      media.removeEventListener("change", setMotionPreference);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
