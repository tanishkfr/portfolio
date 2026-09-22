"use client";

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { caseCtaLabels, projects, selectedSlugs, type Project } from "../data/portfolio";
import { ROOM_WORLDS, rgb } from "../data/room-worlds";
import { SignalField, hexToRgba } from "./signal-field";
import { ProjectPortrait } from "./portrait";
import { backdropFor } from "./backdrop";
import {
  COVER_QUIET,
  COVER_QUIET_NARROW,
  coverPixelShape,
  coverTextureShape,
} from "./cover-material";
import { TransitionLink } from "./transition-link";

/* The folio's primary sequence is SELECTED WORK, defined once in the data
   file and re-stated here. Five sheets, numbered 01–05. Pentimento and
   Atlas keep their cases and routes but are no longer in this sequence. */
const order = [...selectedSlugs];
const layouts = {
  athena: "learn",
  "design-or-disaster": "evidence",
  pentimento: "revision",
  "invisible-interfaces": "absence",
  atlas: "lineage",
  daynero: "number",
} as const;

const ordered = order
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is Project => Boolean(project));

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
    const SETTLE_AT = seen ? 0 : 230; // begin as the splash resolves
    const SETTLE_STEP = 70;
    const SETTLE_DUR = 640;
    const REACH = 190; // gaussian sigma: one letter strong, two faint
    const LIFT = 15; // widest pointer response, in wdth points
    const RISE = 2; // nearest letter's positional lift, in px
    const DAMP = 13; // critical-feeling damping rate (1/s)

    const widths = letters.map((_, i) => (seen ? REST : FROM - i * 2.5));
    const lifts = letters.map(() => 0);
    /* the hover kick: each letter is a spring. Entering a letter loads
       it upward; the spring then lets it drop through rest and bounce
       back — the wordmark reacting like the field's own matter. */
    const kicks = letters.map(() => 0);
    const kickV = letters.map(() => 0);
    const lastW = letters.map(() => Number.NaN);
    const lastY = letters.map(() => Number.NaN);
    const pointer = { x: -9999, y: -9999, inside: false };
    /* Cached geometry: letter centres and the cover's resting box. The
       loop writes `font-variation-settings`, which re-shapes the glyphs —
       so reading any layout box inside the loop would force a synchronous
       layout of work it just invalidated, every frame, for as long as the
       pointer is over the hero. Measuring on entry/resize instead keeps
       the loop pure: math and style writes, nothing else. */
    const cover = el.closest<HTMLElement>(".xp-cover");
    let centers: { x: number; y: number }[] = [];
    let coverTop = 0;
    let coverHeight = 0;
    const measureGeometry = () => {
      centers = letters.map((l) => {
        const r = l.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
      if (cover) {
        const box = cover.getBoundingClientRect();
        coverTop = box.top + window.scrollY;
        coverHeight = box.height;
      }
    };
    let frame = 0;
    let start = 0;
    let last = 0;
    let lastTravel = Number.NaN;
    let quiet = 0;

    const easeOut = (t: number) => 1 - (1 - t) ** 3;

    const step = (now: number) => {
      if (!start) start = now;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      /* Below the cover there is nothing for the name to answer to:
         go idle and wait for an event that could matter again. */
      const coverBottom = cover ? coverTop + coverHeight - window.scrollY : 0;
      if (coverBottom <= 0 && !pointer.inside) {
        frame = 0;
        last = 0;
        return;
      }
      const travel =
        cover && coverHeight
          ? Math.min(1, Math.max(0, window.scrollY / (coverHeight * 0.55)))
          : 0;
      /* one smoothing factor per frame, applied to every letter */
      const k = 1 - Math.exp(-dt * DAMP);
      /* Track whether anything is still actually moving. Once the spring
         has settled and the scroll offset has stopped changing, the loop
         halts and waits for scroll/pointer input again — otherwise it
         rewrites every letter's variable-font axis forever at rest. */
      let moving = pointer.inside || Math.abs(travel - lastTravel) > 0.0002;
      letters.forEach((letter, i) => {
        const from = FROM - i * 2.5;
        const t =
          (now - start - (SETTLE_AT + i * SETTLE_STEP)) / SETTLE_DUR;
        const settled = easeOut(Math.min(1, Math.max(0, t)));
        let target = from + (REST - from) * settled;
        target -= travel * 24;
        let lift = 0;
        const c = centers[i];
        if (pointer.inside && c) {
          const dx = pointer.x - c.x;
          const dy = pointer.y - c.y;
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
        /* the spring: underdamped, so an entered letter jumps high and
           swings through rest once before settling */
        kickV[i] += (-190 * kicks[i] - 9.5 * kickV[i]) * dt;
        kicks[i] += kickV[i] * dt;
        /* Only write when the value has moved enough to see. Skipping the
           no-op write avoids re-shaping the variable-width glyph every
           frame while the name is effectively still. */
        const w = widths[i];
        if (!(Math.abs(w - lastW[i]) < 0.05)) {
          letter.style.fontVariationSettings = `"wdth" ${w.toFixed(1)}`;
          lastW[i] = w;
        }
        const y = lifts[i] + kicks[i];
        if (!(Math.abs(y - lastY[i]) < 0.05)) {
          letter.style.transform = `translateY(${y.toFixed(2)}px)`;
          lastY[i] = y;
        }
        if (
          Math.abs(target - w) > 0.02 ||
          Math.abs(lift - lifts[i]) > 0.02 ||
          Math.abs(kickV[i]) > 0.05 ||
          Math.abs(kicks[i]) > 0.05
        ) {
          moving = true;
        }
      });
      lastTravel = travel;
      quiet = moving ? 0 : quiet + 1;
      if (!pointer.inside && quiet > 3) {
        frame = 0;
        last = 0;
        return;
      }
      frame = requestAnimationFrame(step);
    };

    const wake = () => {
      if (!frame) {
        last = 0;
        quiet = 0;
        frame = requestAnimationFrame(step);
      }
    };
    const move = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (!pointer.inside) {
        /* entering the cover is the one moment that needs fresh geometry;
           the loop itself never measures */
        pointer.inside = true;
        measureGeometry();
      }
      wake();
    };
    const leave = () => {
      pointer.inside = false;
      wake();
    };

    /* loading the spring: entering a letter lifts it by a share of its
       own height, so the jump scales with the name's rendered size */
    const enterers = letters.map((letter, i) => {
      const load = () => {
        kicks[i] = -0.22 * letter.offsetHeight;
        kickV[i] = 0;
        wake();
      };
      letter.addEventListener("pointerenter", load);
      return load;
    });

    measureGeometry();
    wake();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("resize", measureGeometry);
    document.fonts?.ready.then(measureGeometry).catch(() => {});
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("resize", measureGeometry);
      enterers.forEach((load, i) =>
        letters[i].removeEventListener("pointerenter", load),
      );
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
  const [active, setActive] = useState(-1);
  /* Below the pinned-sheet breakpoint the cover's quiet geometry
     follows its own, content-height composition. */
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 52rem)");
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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
            identity, drifting and breathing. Beneath them a faint glyph
            texture keeps the field computational without competing. The
            whole cover — name, signal, texture — scrolls as one
            composition: no layer disperses separately. */}
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
          quiet={narrow ? COVER_QUIET_NARROW : COVER_QUIET}
          tune={[0.54, 1.9]}
          shape={coverTextureShape}
          color={(t) => `rgba(27, 33, 38, ${0.04 + 0.13 * t})`}
        />
        <SignalField
          className="xp-cover-pixels"
          mode="pixel"
          cell={22}
          seed={29}
          ambient={0.72}
          flow={1.3}
          wavefront={0.1}
          drift={0.4}
          pointerRadius={14}
          quiet={narrow ? COVER_QUIET_NARROW : COVER_QUIET}
          tune={[0.4, 2.1]}
          shape={coverPixelShape}
          color={(t) => `rgba(58, 31, 240, ${0.24 + 0.66 * t})`}
        />
        <div className="xp-cover-pin">
          <div className="xp-cover-head">
            <p>Bengaluru, India</p>
            <p>The folio · 2026</p>
          </div>

          <div className="xp-cover-mast">
            <h1 id="explore-title">
              <CoverName />
              <span className="sr-only">Tanishk</span>
            </h1>
            <p className="xp-cover-claim">
              Designing <strong>behavior</strong>, not just screens.
            </p>
            <p className="xp-cover-deck">
              Product &amp; interaction designer. From research to working code.
            </p>
          </div>

          {/* The handoff is a real control, not furniture: an anchor into
              the field, so keyboard and no-JS readers reach the same
              destination. Smooth travel and the sticky header's offset
              come from the platform (html scroll-behaviour and
              scroll-padding), with the reduced-motion override. One clear
              action: explore the work. */}
          <a className="xp-cover-handoff" href="#work">
            <p>Explore selected work</p>
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section className="xp-field" id="work" aria-labelledby="field-title">
        <header className="xp-field-head">
          {/* The wall's own label, and the section heading the five
              project titles are subsections of — an h2, so the document
              reads TANISHK → Selected projects → each work. */}
          <h2 className="xp-field-kicker" id="field-title">
            Selected projects
          </h2>
        </header>

        {/* The index is the folio's wall label as much as a menu: each row
            states the name at display scale, then the two things a reader
            evaluating work quickly needs before committing to a sheet —
            what it is, and when. Nothing longer than that goes in a row;
            the case speaks for itself.

            The publication state used to sit here as a third, tagged line
            ("Live site", "Working prototype", …) with its own status mark.
            It made every row three ideas tall and put a badge where a
            reader is trying to read a name. The state still exists — it is
            stated once per sheet, in the row's own evidence boundary, where
            it belongs next to the artefact rather than in a menu. */}
        <nav className="xp-field-index" aria-label="Explore projects">
          <ol>
            {ordered.map((project, index) => (
              <li
                key={project.slug}
                data-current={(active === index && active >= 0) || undefined}
                style={{ "--accent": project.accent } as CSSProperties}
              >
                <a
                  href={`#piece-${project.slug}`}
                  aria-current={
                    active === index && active >= 0 ? "location" : undefined
                  }
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{project.title}</strong>
                  <span className="xp-index-record">
                    <span>
                      {project.form} · {project.year}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="xp-piece-stack">
          {ordered.map((project, index) => {
            const world = ROOM_WORLDS[project.slug];
            const backdrop = backdropFor(project.slug);

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
                  data-room={project.slug}
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
                    {/* The room's paper: one quiet glyph composition in
                        the project's own pigment, printed behind the
                        column the sheet speaks in — the paper you can
                        actually see. It sleeps with the sheet, so only
                        the room being read is alive. */}
                    {backdrop ? (
                      <SignalField
                        className="xp-piece-backdrop"
                        glyphs={backdrop.glyphs}
                        cell={backdrop.cell}
                        dense
                        paused={active !== index}
                        seed={backdrop.seed}
                        ambient={backdrop.ambient}
                        flow={backdrop.flow}
                        drift={backdrop.drift}
                        tune={backdrop.tune}
                        pointerRadius={0}
                        shape={backdrop.shape}
                        glyphAt={backdrop.glyphAt}
                        color={(t) => hexToRgba(world.accentInk, 0.09 + 0.17 * t)}
                      />
                    ) : null}
                    <p className="xp-piece-meta">
                      {project.form} · {project.year}
                    </p>
                    <h3 className="xp-piece-title">
                      <TransitionLink href={`/work/${project.slug}?from=explore`}>
                        {project.title}
                      </TransitionLink>
                    </h3>
                    <p className="xp-piece-intro">{project.plain}</p>
                    <div className="xp-piece-actions">
                      <TransitionLink href={`/work/${project.slug}?from=explore`}>
                        {caseCtaLabels(project).internal}
                        <span className="xp-cta-arrow" aria-hidden="true"> →</span>
                      </TransitionLink>
                      {project.liveUrl ? (
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
                      ) : null}
                    </div>
                  </div>

                  {/* The stage now leads with real project evidence: the
                      portrait's ASCII demo and field are the frame/residue
                      (dimmed beneath), while the project's own interface
                      capture is always present — never hover-only. Athena
                      has no shipped screens, so its stage states the loop
                      and the boundary in words instead. */}
                  <div className="xp-piece-stage">
                    {/* keyed by live state: when a sheet sleeps, its portrait
                        remounts to the authored demo with the recording
                        stopped, so no preview survives off-sheet */}
                    <ProjectPortrait
                      key={`${project.slug}-${active === index ? "live" : "idle"}`}
                      slug={project.slug}
                      live={active === index}
                    />
                  </div>

                  <p className="xp-piece-status">{project.status}</p>
                </article>
              </Fragment>
            );
          })}
        </div>
      </section>
    </main>
  );
}
