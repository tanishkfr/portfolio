"use client";

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { caseCtaLabels, projects, type Project } from "../data/portfolio";
import { ROOM_WORLDS, rgb } from "../data/room-worlds";
import { SignalField, hexToRgba, type Quiet } from "./signal-field";
import { ProjectPortrait } from "./portrait";
import { TransitionLink } from "./transition-link";

const order = [
  "design-or-disaster",
  "pentimento",
  "invisible-interfaces",
  "atlas",
  "fluxion-studios",
  "daynero",
];
const layouts = {
  "fluxion-studios": "wordmark",
  "design-or-disaster": "evidence",
  pentimento: "revision",
  "invisible-interfaces": "absence",
  atlas: "lineage",
  daynero: "number",
} as const;

const ordered = order
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is Project => Boolean(project));

/* The cover's material hierarchy: TANISHK first, the sparse
   ultramarine pixel signal second, the claim third, and a faint glyph
   texture under everything. The quiet zones keep the masthead, the
   claim's column, the handoff line and the border crisp; one array is
   shared by both fields so the cover reads as one system. */
const COVER_QUIET: Quiet[] = [
  { x: 0, y: 0, w: 1, h: 0.055, falloff: 0.92, feather: 0.02 },
  { x: 0.01, y: 0.26, w: 0.98, h: 0.3, falloff: 0.93, feather: 0.05 },
  { x: 0, y: 0.6, w: 0.52, h: 0.23, falloff: 0.9, feather: 0.05 },
  { x: 0, y: 0.855, w: 1, h: 0.09, falloff: 0.94, feather: 0.03 },
  { x: 0, y: 0.97, w: 1, h: 0.04, falloff: 1 },
];

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
        {/* The cover's material: sparse ultramarine pixel signal is the
            primary register — digital fragments suspended around the
            identity, drifting, breathing, occasionally clustering, parting
            for the pointer. Beneath them a faint glyph texture keeps the
            field computational without ever competing. Both disperse as
            the cover scrolls into the work. */}
        <SignalField
          className="xp-cover-field"
          glyphs="·:+*#"
          cell={14}
          seed={11}
          ambient={0.26}
          flow={1.6}
          wavefront={0.07}
          drift={0.3}
          pointerRadius={0}
          collapse
          quiet={COVER_QUIET}
          tune={[0.54, 1.9]}
          shape={(v, nx, ny) =>
            v *
            (0.45 + 0.7 * Math.abs(nx - 0.5) * 2) *
            (0.4 + 1.25 * Math.pow(ny, 1.4))
          }
          color={(t) => `rgba(27, 33, 38, ${0.04 + 0.13 * t})`}
        />
        <SignalField
          className="xp-cover-pixels"
          mode="pixel"
          cell={20}
          seed={29}
          ambient={0.62}
          flow={1.3}
          wavefront={0.1}
          drift={0.4}
          pointerRadius={12}
          collapse
          quiet={COVER_QUIET}
          tune={[0.44, 2.1]}
          shape={(v, nx, ny, t) => {
            /* the signal holds three deliberate clusters around the
               identity's negative space — no scattered confetti between
               them; the settle band resolves toward the handoff */
            const rail = Math.pow(Math.abs(nx - 0.5) * 2, 1.6);
            const settle = 0.72 + 0.78 * Math.pow(ny, 1.25);
            const clusterA = Math.exp(
              -Math.pow((nx - 0.16) * 3.4, 2) -
                Math.pow((ny - 0.14 + 0.05 * Math.sin(t * 0.13)) * 2.8, 2),
            );
            const clusterB = Math.exp(
              -Math.pow((nx - 0.82) * 3.4, 2) -
                Math.pow((ny - 0.68 + 0.06 * Math.sin(t * 0.11 + 2)) * 2.7, 2),
            );
            const clusterC = Math.exp(
              -Math.pow((nx - 0.86) * 4.0, 2) -
                Math.pow((ny - 0.2 + 0.04 * Math.sin(t * 0.09 + 4)) * 3.0, 2),
            );
            return v *
              (0.3 + 0.5 * rail + 1.5 * clusterA + 1.15 * clusterB + 1.25 * clusterC) *
              settle;
          }}
          color={(t) => `rgba(58, 31, 240, ${0.18 + 0.55 * t})`}
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
                I design what interfaces <strong>do</strong>.
              </p>
              <p className="xp-cover-deck">
                Product and interaction design, built end to end.
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
            Selected projects
          </p>
        </header>

        <nav className="xp-field-index" aria-label="Explore projects">
          <ol>
            {ordered.map((project, index) => (
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
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="xp-piece-stack">
          {ordered.map((project, index) => {
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
                  data-layout={layouts[project.slug as keyof typeof layouts]}
                  style={
                    {
                      "--piece-index": index + 1,
                      "--piece-z": index + 1,
                      "--room": `rgb(${rgb(world.ground)})`,
                      "--room-ink": world.ink,
                      "--accent-ink": world.accentInk,
                      "--accent": project.accent,
                      "--title-word": Math.max(
                        ...project.title.split(" ").map((word) => word.length),
                      ),
                    } as CSSProperties
                  }
                >
                  <div className="xp-piece-spine" aria-hidden="true">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span className="xp-piece-spine-pip" />
                  </div>

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

                  {/* The project portrait: an abstract, living
                      representation of the project's behaviour — the
                      folio's own interpretation of the work, from the
                      same computational material. The real interface
                      lives in the case study. */}
                  <div className="xp-piece-stage">
                    <ProjectPortrait slug={project.slug} />
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
