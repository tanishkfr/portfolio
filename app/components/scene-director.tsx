"use client";

import { useEffect } from "react";

/**
 * THE DIRECTOR.
 *
 * Every element marked `data-scene` is told continuously where it stands
 * relative to the middle of the screen:
 *
 *   --p     -1 waiting below · 0 centred · 1 gone above
 *   --away  0 centred · 1 at either edge   (abs of --p)
 *
 * That single signed number is enough for a whole choreography. Depth layers
 * multiply it to move at different rates, so the scene has thickness. Content
 * fades against `--away`, which means it *leaves* as well as arrives — the
 * thing a one-shot reveal can never do, and the reason scrolling here should
 * feel like travelling past something rather than a list appearing.
 *
 * One loop for every scene rather than a listener each. Scenes that mount
 * later — the read-mode switch remounts all of Explore — are picked up by a
 * MutationObserver, because a scene that is never measured would sit frozen
 * at its waiting position forever.
 */

export function SceneDirector() {
  useEffect(() => {
    let scenes: HTMLElement[] = [];
    let frame = 0;

    let stages: HTMLElement[] = [];

    const collect = () => {
      scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
      stages = Array.from(document.querySelectorAll<HTMLElement>("[data-stage]"));
    };

    const measure = () => {
      frame = 0;
      const middle = window.innerHeight / 2;

      /* A stage is pinned for the length of its own scroll budget, so what
         matters is not where it sits on screen but how far through it you are.
         --t runs 0 → 1 across the budget, which lets one held composition
         carry several beats instead of one fade. */
      for (const stage of stages) {
        const box = stage.getBoundingClientRect();
        const travel = stage.offsetHeight - window.innerHeight;
        const t = travel > 0 ? Math.max(0, Math.min(1, -box.top / travel)) : 0;
        stage.style.setProperty("--t", t.toFixed(4));
        /* Marks that this stage really is being driven. Layouts that collapse
           a scene into a single frame (the case stack) engage only once this is
           set, so without it they stay in readable flow. */
        stage.dataset.staged = "on";
      }

      for (const scene of scenes) {
        const box = scene.getBoundingClientRect();
        const centre = box.top + box.height / 2;
        const span = window.innerHeight / 2 + box.height / 2;
        const p = span > 0 ? Math.max(-1, Math.min(1, (middle - centre) / span)) : 0;
        scene.style.setProperty("--p", p.toFixed(4));
        scene.style.setProperty("--away", Math.abs(p).toFixed(4));
      }
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    collect();
    measure();

    const mutations = new MutationObserver(() => {
      collect();
      measure();
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      mutations.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
