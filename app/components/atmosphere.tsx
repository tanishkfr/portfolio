"use client";

import { useEffect } from "react";
import { HOUSING, ROOM_WORLDS, rgb } from "../data/room-worlds";

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
 *
 * Mounted once for the whole site; every `[data-room]` on the page — the
 * case's own sections and the folio's sheets — is a room it can stand in.
 */

export function Atmosphere() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    let rooms: HTMLElement[] = [];
    /* the last mix actually written, so a scroll that changes nothing
       does not touch the root style on every frame */
    let written = "";

    const collect = () => {
      rooms = Array.from(document.querySelectorAll<HTMLElement>("[data-room]"));
    };

    const measure = () => {
      frame = 0;
      const view = window.innerHeight;

      /* Composited in document order, not averaged. Rooms overlap by
         design — the folio pins its sheets on top of one another, so two
         or three of them cover the screen at once — and an average of
         stacked rooms never reaches any room's own paper: the ground
         lags behind the reader as a permanent in-between. Painting each
         room over the last with its own coverage means the topmost room
         you can see is the ground you are standing on, while a room still
         handing over fades in exactly as much as it has arrived. */
      let r = HOUSING[0];
      let g = HOUSING[1];
      let b = HOUSING[2];

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
        r += (room_[0] - r) * weight;
        g += (room_[1] - g) * weight;
        b += (room_[2] - b) * weight;
      }

      const mixed = `${Math.round(r)} ${Math.round(g)} ${Math.round(b)}`;
      if (mixed === written) return;
      written = mixed;
      root.style.setProperty("--atmos", mixed);
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
      root.style.setProperty(
        "--atmos",
        `${HOUSING[0]} ${HOUSING[1]} ${HOUSING[2]}`,
      );
    };
  }, []);

  /* the engine's whole output is the custom property it writes */
  return null;
}

export function RoomPaint({ slug }: { slug: string | null }) {
  useEffect(() => {
    const world = slug ? ROOM_WORLDS[slug] : null;
    const root = document.documentElement;
    if (!world) {
      root.style.setProperty("--atmos", `${HOUSING[0]} ${HOUSING[1]} ${HOUSING[2]}`);
      return;
    }
    root.style.setProperty("--atmos", rgb(world.ground));
    return () => {
      root.style.setProperty("--atmos", `${HOUSING[0]} ${HOUSING[1]} ${HOUSING[2]}`);
    };
  }, [slug]);
  return null;
}
