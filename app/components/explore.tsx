"use client";

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";
import { caseCtaLabels, projects, type Project } from "../data/portfolio";
import { ROOM_WORLDS, rgb } from "../data/room-worlds";
import { modeHref } from "./mode";
import { hexToRgba, SignalField, type Quiet } from "./signal-field";
import { AtlasRule } from "./atlas-rule";
import { DayneroNumber } from "./daynero-number";
import { DisasterMark } from "./disaster-mark";
import { FluxionSpecimen } from "./fluxion-specimen";
import { InvisibleAway } from "./invisible-away";
import { PentimentoStrike } from "./pentimento-strike";
import { SpecimenRail } from "./specimen";
import { TransitionLink } from "./transition-link";

const order = [
  "design-or-disaster",
  "pentimento",
  "invisible-interfaces",
  "atlas",
  "fluxion-studios",
  "daynero",
];
const directions = {
  "fluxion-studios": { verb: "visit", layout: "wordmark" },
  "design-or-disaster": { verb: "point", layout: "evidence" },
  pentimento: { verb: "strike", layout: "revision" },
  "invisible-interfaces": { verb: "leave", layout: "absence" },
  atlas: { verb: "revise", layout: "lineage" },
  daynero: { verb: "spend", layout: "number" },
} as const;

const ordered = order
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is Project => Boolean(project));

/* The cover's quiet zones frame the name instead of blanketing it: the
   masthead and the claim's column stay crisp, and the field carries the
   rest — the side rails, the deck's right flank, the resolve band above
   the handoff. One array, shared by the glyph field and its atmosphere. */
const COVER_QUIET: Quiet[] = [
  { x: 0, y: 0, w: 1, h: 0.055, falloff: 0.92, feather: 0.02 },
  { x: 0.01, y: 0.26, w: 0.98, h: 0.3, falloff: 0.93, feather: 0.05 },
  { x: 0, y: 0.6, w: 0.52, h: 0.23, falloff: 0.88, feather: 0.05 },
  { x: 0, y: 0.855, w: 1, h: 0.09, falloff: 0.92, feather: 0.03 },
  { x: 0, y: 0.97, w: 1, h: 0.04, falloff: 1 },
];

function ProjectMechanic({ slug }: { slug: string }) {
  if (slug === "fluxion-studios") return <FluxionSpecimen />;
  if (slug === "design-or-disaster") {
    return (
      <DisasterMark
        src="/projects/design-or-disaster/case-010.jpg"
        alt="A case under critique in Design or Disaster."
      />
    );
  }
  if (slug === "pentimento") return <PentimentoStrike />;
  if (slug === "invisible-interfaces") return <InvisibleAway />;
  if (slug === "atlas") return <AtlasRule />;
  if (slug === "daynero") return <DayneroNumber />;
  return null;
}

/**
 * The masthead behaves. Each letter is its own variable-width state:
 * on first visit the letters settle out of the splash's compressed
 * notation into the hero's expanded width; afterwards the pointer's
 * distance drives a continuous gaussian field — the nearest letter
 * responds strongest, its neighbours inherit the remainder, and every
 * value eases toward its target with frame-rate-independent damping,
 * so no state ever snaps. Arrival, scroll compression and pointer
 * influence compose additively into one target per letter: the same
 * identity changing state, never three effects fighting. One rAF loop
 * drives all seven letters; reduced-motion readers get the resting
 * width and no listeners.
 */
function CoverName() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const letters = Array.from(
      el.querySelectorAll<HTMLElement>(".xp-cover-letter"),
    );
    let seen = false;
    try {
      seen = sessionStorage.getItem("splash") === "seen";
    } catch {
      /* private mode: play the arrival */
    }

    const REST = 122; // the resting width, the CSS font-stretch value
    const FROM = 60; // the splash's compressed notation
    const SETTLE_AT = seen ? 0 : 760; // begin as the splash resolves
    const SETTLE_STEP = 70;
    const SETTLE_DUR = 900;
    const REACH = 190; // gaussian sigma: one letter strong, two faint
    const LIFT = 15; // widest pointer response, in wdth points
    const RISE = 2; // nearest letter's positional lift, in px
    const DAMP = 13; // critical-feeling damping rate (1/s)

    const widths = letters.map((_, i) => (seen ? REST : FROM - i * 2.5));
    const lifts = letters.map(() => 0);
    const pointer = { x: -9999, y: -9999, inside: false };
    const cover = el.closest<HTMLElement>(".xp-cover");
    let frame = 0;
    let start = 0;
    let last = 0;

    const easeOut = (t: number) => 1 - (1 - t) ** 3;

    const step = (now: number) => {
      if (!start) start = now;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      /* Below the cover there is nothing for the name to answer to:
         go idle and wait for an event that could matter again. */
      const coverBottom = cover
        ? cover.offsetTop + cover.offsetHeight - window.scrollY
        : 0;
      if (coverBottom <= 0 && !pointer.inside) {
        frame = 0;
        last = 0;
        return;
      }
      const rects = pointer.inside
        ? letters.map((l) => l.getBoundingClientRect())
        : null;
      const travel = cover
        ? Math.min(1, Math.max(0, window.scrollY / (cover.offsetHeight * 0.55)))
        : 0;
      /* one smoothing factor per frame, applied to every letter */
      const k = 1 - Math.exp(-dt * DAMP);
      letters.forEach((letter, i) => {
        const from = FROM - i * 2.5;
        const t =
          (now - start - (SETTLE_AT + i * SETTLE_STEP)) / SETTLE_DUR;
        const settled = easeOut(Math.min(1, Math.max(0, t)));
        let target = from + (REST - from) * settled;
        target -= travel * 24;
        let lift = 0;
        if (rects) {
          const r = rects[i];
          const dx = pointer.x - (r.left + r.width / 2);
          const dy = pointer.y - (r.top + r.height / 2);
          /* gaussian falloff: continuous in distance, no threshold —
             the nearest letter reads strongest, neighbours inherit
             exactly the remainder of the same curve */
          const influence = Math.exp(
            -(dx * dx + dy * dy) / (2 * REACH * REACH),
          );
          target += LIFT * influence;
          lift = -RISE * influence;
        }
        widths[i] += (target - widths[i]) * k;
        lifts[i] += (lift - lifts[i]) * k;
        letter.style.fontVariationSettings = `"wdth" ${widths[i].toFixed(1)}`;
        letter.style.transform = `translateY(${lifts[i].toFixed(2)}px)`;
      });
      frame = requestAnimationFrame(step);
    };

    const wake = () => {
      if (!frame) {
        last = 0;
        frame = requestAnimationFrame(step);
      }
    };
    const move = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.inside = true;
      wake();
    };
    const leave = () => {
      pointer.inside = false;
      wake();
    };

    wake();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <span className="xp-cover-name" ref={ref} aria-hidden="true">
      {"TANISHK".split("").map((letter, index) => (
        <span key={index} className="xp-cover-letter">
          {letter}
        </span>
      ))}
    </span>
  );
}

export function Explore() {
  const mainRef = useRef<HTMLElement>(null);
  /* No sheet is "current" until one has actually crossed the reading
     line: a first-index default would paint Design or Disaster as
     selected while the visitor is still on the cover. */
  const [active, setActive] = useState(-1);

  /* One passive, rAF-throttled loop: the index marks the sheet you are
     reading, and it goes quiet for reduced-motion readers. */
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pieces = Array.from(
      main.querySelectorAll<HTMLElement>("[data-explore-piece]"),
    );
    let frame = 0;

    const measure = () => {
      frame = 0;
      const line = window.innerHeight * 0.42;
      let next = -1;
      pieces.forEach((piece, index) => {
        if (piece.getBoundingClientRect().top <= line) next = index;
      });
      setActive(next);
    };

    const queueMeasure = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", queueMeasure, { passive: true });
    window.addEventListener("resize", queueMeasure);
    motion.addEventListener("change", queueMeasure);

    return () => {
      window.removeEventListener("scroll", queueMeasure);
      window.removeEventListener("resize", queueMeasure);
      motion.removeEventListener("change", queueMeasure);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <main id="main-content" className="xp" ref={mainRef}>
      <section
        className="xp-cover"
        data-explore-cover
        aria-labelledby="explore-title"
      >
        {/* The identity is the resolved anchor; the surrounding
            computational field is still forming — density glyphs settle
            as the folio arrives, answer the pointer softly, and disperse
            as the cover scrolls into the field below. Under the glyphs a
            halftone atmosphere drifts in ultramarine: the sampler's
            weather, felt as a wash, never as a panel. */}
        <SignalField
          className="xp-cover-atmos"
          mode="dither"
          cell={22}
          seed={87}
          ambient={0.58}
          flow={2.6}
          wavefront={0.19}
          drift={0.7}
          pointerRadius={0}
          collapse
          quiet={COVER_QUIET}
          shape={(v, nx, ny) =>
            /* the atmosphere pools in the same rails and settle band, so
               the cover reads as one weather system, not two layers */
            v *
            (0.4 + 1.15 * Math.pow(Math.abs(nx - 0.5) * 2, 1.35)) *
            (0.45 + 1.05 * ny)
          }
          color={(t) => `rgba(58, 31, 240, ${0.04 + 0.1 * t})`}
        />
        <SignalField
          className="xp-cover-field"
          glyphs="·:+*#"
          cell={11}
          seed={11}
          ambient={0.66}
          flow={2.2}
          wavefront={0.14}
          drift={0.45}
          pointerRadius={12}
          collapse
          quiet={COVER_QUIET}
          shape={(v, nx, ny) => {
            /* the edges carry the matter; one plume rises through the
               right rail where the deck's negative space opens */
            const rail = Math.pow(Math.abs(nx - 0.5) * 2, 1.1);
            const settle = Math.pow(ny, 1.25);
            const plume = Math.exp(
              -Math.pow((nx - 0.78) * 3.6, 2) - Math.pow((ny - 0.7) * 2.6, 2),
            );
            return v * (0.5 + 0.8 * rail + 0.75 * plume) * (0.34 + 1.4 * settle);
          }}
          color={(t) =>
            t >= 0.92
              ? "rgba(58, 31, 240, 0.45)"
              : `rgba(27, 33, 38, ${0.1 + 0.34 * t})`
          }
        />
        <div className="xp-cover-pin">
          <div className="xp-cover-head">
            <p>Product / Interaction Designer · Bengaluru</p>
            <p>The folio · 2026</p>
          </div>

          <div className="xp-cover-mast">
            <h1 id="explore-title">
              <CoverName />
              <span className="sr-only">Tanishk</span>
            </h1>
            <span className="xp-cover-rule" aria-hidden="true" />
            <div className="xp-cover-axis">
              <p className="xp-cover-claim">
                Things that only make sense in <strong>motion</strong>.
              </p>
              <p className="xp-cover-deck">
                I design and build interfaces where the behaviour is the
                point — the projects begin below.
              </p>
            </div>
          </div>

          <div className="xp-cover-handoff">
            <p>Six projects · each one live online</p>
            <span aria-hidden="true">↓</span>
          </div>
        </div>
      </section>

      <section className="xp-field" id="work" aria-labelledby="field-title">
        <header className="xp-field-head">
          <p className="xp-field-kicker" id="field-title">
            One sheet per project — scroll through, or jump from the index
          </p>
          <p className="xp-field-mode">
            The same projects, as a plain list:{" "}
            <Link href={modeHref("review")}>
              Quick view <span aria-hidden="true">→</span>
            </Link>
          </p>
        </header>

        <nav className="xp-field-index" aria-label="Explore projects">
          <ol>
            {ordered.map((project, index) => {
              const direction = directions[project.slug as keyof typeof directions];
              return (
                <li
                  key={project.slug}
                  data-current={(active === index && active >= 0) || undefined}
                >
                  <a
                    href={`#piece-${project.slug}`}
                    aria-current={
                      active === index && active >= 0 ? "location" : undefined
                    }
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{project.title}</strong>
                    <small>{direction.verb}</small>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="xp-piece-stack">
          {ordered.map((project, index) => {
            const direction = directions[project.slug as keyof typeof directions];
            const world = ROOM_WORLDS[project.slug];

            return (
              <Fragment key={project.slug}>
                <span
                  className="xp-piece-anchor"
                  id={`piece-${project.slug}`}
                  aria-hidden="true"
                />
                <article
                  className="xp-piece"
                  data-explore-piece
                  data-project={project.slug}
                  data-layout={direction.layout}
                  style={
                    {
                      "--piece-index": index + 1,
                      "--piece-z": index + 1,
                      "--room": `rgb(${rgb(world.ground)})`,
                      "--room-ink": world.ink,
                      "--accent-ink": world.accentInk,
                      "--accent": project.accent,
                    } as CSSProperties
                  }
                >
                  <div className="xp-piece-spine" aria-hidden="true">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span>{direction.verb}</span>
                  </div>

                  {/* The sheet's signal rail: the spine margin carries a
                      thin line of the project's own computational matter,
                      full height, in its pigment — the same edge device
                      every Quick view row runs. The specimen itself is
                      live in the stage below. */}
                  <SpecimenRail
                    slug={project.slug}
                    tone="full"
                    seed={37 + index * 5}
                    orientation="edge"
                  />

                  {/* Connective tissue between stable states: as this
                      sheet takes over the drawer, its top edge resolves
                      out of its own pigment — the material moment
                      between one project and the next. */}
                  {active === index ? (
                    <SignalField
                      className="xp-piece-field"
                      glyphs="·:+*#"
                      cell={11}
                      seed={29 + index * 5}
                      ambient={0}
                      pointerRadius={0}
                      pulseKey={`arrival-${index}`}
                      pulseMs={340}
                      pulseDirection="resolve"
                      color={(t) => hexToRgba(world.accentInk, 0.12 + 0.4 * t)}
                    />
                  ) : null}

                  <div className="xp-piece-copy">
                    <p className="xp-piece-meta">
                      {project.form} · {project.year}
                    </p>
                    <h3 className="xp-piece-title">
                      <TransitionLink href={`/work/${project.slug}?from=explore`}>
                        {project.title}
                      </TransitionLink>
                    </h3>
                    <p className="xp-piece-plain">{project.plain}</p>
                    <p className="xp-piece-thesis">{project.thesis}</p>
                    <div className="xp-piece-actions">
                      <TransitionLink href={`/work/${project.slug}?from=explore`}>
                        {caseCtaLabels(project).internal}
                        <span className="xp-cta-arrow" aria-hidden="true"> →</span>
                      </TransitionLink>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        data-external="true"
                      >
                        {caseCtaLabels(project).external}
                        <span className="xp-cta-arrow" aria-hidden="true"> ↗</span>
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </div>
                  </div>

                  <div className="xp-piece-stage">
                    <ProjectMechanic slug={project.slug} />
                  </div>

                  <p className="xp-piece-status">{project.status}</p>
                </article>
              </Fragment>
            );
          })}
        </div>
      </section>

      <section className="xp-close" aria-labelledby="explore-close-title">
        {/* The close is narrative: it states the argument, then hands off —
            first to the one action the statement was leading to, then to
            the global footer, which carries every address and destination. */}
        <p className="xp-close-kicker">That is the state of the work.</p>
        <h2 id="explore-close-title">
          Have something that needs a better behaviour?
        </h2>
        <TransitionLink className="xp-close-cta" href="/contact">
          Tell me about it <span className="xp-cta-arrow" aria-hidden="true">→</span>
        </TransitionLink>
      </section>
    </main>
  );
}
