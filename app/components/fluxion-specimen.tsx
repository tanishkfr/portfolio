"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { SpecimenAmbient } from "./specimen";

/**
 * The Fluxion field is the studio's specimen board.
 *
 * The live studio site is registered onto it the way a proof sheet holds a
 * print: one dominant desktop home plate carrying most of the weight, the
 * same site at mobile width layered over its lower corner as a matted
 * register, and the notation in Fluxion's own red. Every frame is a real
 * capture of https://fluxion-studios.vercel.app/. Nothing here is a mockup
 * or an invented screen.
 *
 * The one interaction is an inspection behaviour: moving over the board
 * separates the layered crop from the plate by a few pixels, so the sheet
 * reads as physical layers rather than a flattened image. It is disabled
 * for reduced-motion and coarse-pointer readers, who get the same
 * composition at rest.
 */
export function FluxionSpecimen() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const REST = 0;
    const DRIFT = 4.5; // the crop's travel; the plate inherits a third of it
    let frame = 0;
    let dx = REST;
    let dy = REST;

    const write = () => {
      frame = 0;
      el.style.setProperty("--spec-x", `${dx.toFixed(2)}px`);
      el.style.setProperty("--spec-y", `${dy.toFixed(2)}px`);
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(write);
    };
    const move = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const nx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const ny = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      dx = Math.max(-1, Math.min(1, nx)) * DRIFT;
      dy = Math.max(-1, Math.min(1, ny)) * DRIFT;
      queue();
    };
    const rest = () => {
      dx = REST;
      dy = REST;
      queue();
    };

    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", rest);
    el.addEventListener("pointercancel", rest);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", rest);
      el.removeEventListener("pointercancel", rest);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <figure className="xp-room-shot xp-flux" ref={ref}>
      {/* The studio's own computational matter: directional flow in the
          wordmark's red, drifting behind the board — the same field the
          Quick view wordmark carries. */}
      <SpecimenAmbient slug="fluxion-studios" seed={61} />
      <div className="xp-flux-head">
        <div className="xp-flux-brand">
          <Image
            unoptimized
            src="/projects/fluxion/wordmark-transparent.png"
            width={669}
            height={42}
            sizes="(max-width: 960px) 60vw, 16rem"
            alt=""
          />
        </div>
        <p className="xp-flux-stamp" aria-hidden="true">
          Site / 2026
        </p>
      </div>

      <div className="xp-flux-sheet">
        <p className="xp-flux-legend">
          <span>01 / Home</span>
          <a
            className="xp-flux-live"
            href="https://fluxion-studios.vercel.app/"
            target="_blank"
            rel="noreferrer"
          >
            Live build <span aria-hidden="true">↗</span>
          </a>
        </p>

        <div className="xp-flux-frame">
          <figure className="xp-flux-plate">
            <Image
              unoptimized
              src="/projects/fluxion/site-home-desktop.png"
              width={1440}
              height={900}
              sizes="(max-width: 832px) 92vw, 48vw"
              alt="The live Fluxion Studios home page: its masthead, section navigation, headline, and start-project action."
            />
          </figure>

          <figure className="xp-flux-detail">
            <figcaption>02 / Mobile</figcaption>
            <Image
              unoptimized
              src="/projects/fluxion/site-home-mobile.png"
              width={390}
              height={844}
              sizes="(max-width: 832px) 20vw, 9rem"
              alt="The same live home page at mobile width."
            />
          </figure>
        </div>
      </div>

      <figcaption className="xp-flux-cap">
        Studio website · designed and built in-house
      </figcaption>
    </figure>
  );
}
