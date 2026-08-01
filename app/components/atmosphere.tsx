"use client";

import { useEffect } from "react";
import { HOUSING, ROOM_WORLDS } from "../data/room-worlds";

/**
 * THE ATMOSPHERE.
 *
 * One ground behind the whole descent, whose colour is mixed from whichever
 * rooms are nearest. Hard-edged rooms were the mistake: a seam reads as the
 * boundary between two sections of a document, which is the exact impression
 * we are trying to lose. A ground that warms toward oxblood before you arrive
 * and cools toward pine as you leave reads as light changing in a building —
 * you feel the next room before you can see it.
 *
 * Each room's influence falls off over its own height plus half a screen, so
 * influences overlap and always resolve back to the housing's bistre in the
 * stretches between rooms.
 */

export function Atmosphere() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    let rooms: HTMLElement[] = [];

    const collect = () => {
      rooms = Array.from(document.querySelectorAll<HTMLElement>("[data-room]"));
    };

    const measure = () => {
      frame = 0;
      const view = window.innerHeight;

      let r = HOUSING[0];
      let g = HOUSING[1];
      let b = HOUSING[2];
      let claimed = 0;

      for (const room of rooms) {
        const world = ROOM_WORLDS[room.dataset.room ?? ""];
        if (!world) continue;

        /* Influence is how much of the screen the room currently occupies, not
           how near its centre is. Rooms are pinned stages two to three
           viewports tall, and a centre-distance falloff over a height like
           that smears every room across its neighbours — a tall room would
           start tinting the ground long before you reached it. Overlap is
           independent of budget: full while the room holds the screen,
           crossfading only at the boundaries where one hands over. */
        const box = room.getBoundingClientRect();
        const overlap = Math.max(0, Math.min(box.bottom, view) - Math.max(box.top, 0));
        const near = view > 0 ? Math.min(1, overlap / view) : 0;
        if (near <= 0) continue;

        // ease the handover so neither room snaps in at the seam
        const weight = near * near * (3 - 2 * near);
        const room_ = world.ground;
        r += (room_[0] - HOUSING[0]) * weight;
        g += (room_[1] - HOUSING[1]) * weight;
        b += (room_[2] - HOUSING[2]) * weight;
        claimed += weight;
      }

      // two overlapping rooms must not drive the mix past either colour
      if (claimed > 1) {
        r = HOUSING[0] + (r - HOUSING[0]) / claimed;
        g = HOUSING[1] + (g - HOUSING[1]) / claimed;
        b = HOUSING[2] + (b - HOUSING[2]) / claimed;
      }

      root.style.setProperty(
        "--atmos",
        `${Math.round(r)} ${Math.round(g)} ${Math.round(b)}`,
      );
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

  return <div className="xp-atmos" aria-hidden="true" />;
}
