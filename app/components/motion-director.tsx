"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function MotionDirector() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        "[data-scroll-reveal], [data-score-reveal], [data-reveal], .signature-artifact",
      ),
    );
    let frame = 0;

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

    if (media.matches || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-revealed"));
      return () => {
        media.removeEventListener("change", setMotionPreference);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        if (frame) window.cancelAnimationFrame(frame);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -7%", threshold: 0.08 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => {
      observer.disconnect();
      media.removeEventListener("change", setMotionPreference);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
