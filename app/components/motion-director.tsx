"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function MotionDirector() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const cleanups: Array<() => void> = [];
    let frame = 0;

    root.classList.add("motion-ready");

    const updateScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const scrollable = Math.max(
          document.documentElement.scrollHeight - window.innerHeight,
          1,
        );
        root.style.setProperty(
          "--page-progress",
          String(Math.min(window.scrollY / scrollable, 1)),
        );
        root.classList.toggle("is-scrolled", window.scrollY > 28);
        frame = 0;
      });
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", updateScroll));

    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>(
        "[data-reveal], .signature-artifact, .case-section",
      ),
    );

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach((target) => target.classList.add("is-revealed"));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -12%", threshold: 0.08 },
      );
      revealTargets.forEach((target) => observer.observe(target));
      cleanups.push(() => observer.disconnect());
    }

    if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
      const onPointerMove = (event: PointerEvent) => {
        root.style.setProperty("--pointer-x", event.clientX + "px");
        root.style.setProperty("--pointer-y", event.clientY + "px");
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      cleanups.push(() => window.removeEventListener("pointermove", onPointerMove));

      document
        .querySelectorAll<HTMLElement>("[data-project-row]")
        .forEach((row) => {
          const onRowMove = (event: PointerEvent) => {
            const rect = row.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
            row.style.setProperty("--row-x", String(x));
            row.style.setProperty("--row-y", String(y));
            row.style.setProperty("--proof-tilt-x", (0.5 - y) * 4 + "deg");
            row.style.setProperty("--proof-tilt-y", (x - 0.5) * 5 + "deg");
          };
          const onRowLeave = () => {
            row.style.setProperty("--row-x", "0.5");
            row.style.setProperty("--row-y", "0.5");
            row.style.setProperty("--proof-tilt-x", "0deg");
            row.style.setProperty("--proof-tilt-y", "0deg");
          };
          row.addEventListener("pointermove", onRowMove);
          row.addEventListener("pointerleave", onRowLeave);
          cleanups.push(() => {
            row.removeEventListener("pointermove", onRowMove);
            row.removeEventListener("pointerleave", onRowLeave);
          });
        });
    }

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
