"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { projects } from "../data/portfolio";
import { ROOM_WORLDS, rgb } from "../data/room-worlds";
import { AtlasRule } from "./atlas-rule";
import { ComingSoonMark } from "./coming-soon";
import { DisasterMark } from "./disaster-mark";
import { FluxionMark } from "./fluxion-mark";
import { InvisibleAway } from "./invisible-away";
import { PentimentoStrike } from "./pentimento-strike";
import { TransitionLink } from "./transition-link";

/**
 * THE WORK, TOGETHER — AND ONE AT A TIME.
 *
 * The five stand as one set: a column of names on paper, all present, nothing
 * waiting behind a scroll position. Reading the set costs nothing.
 *
 * Opening one is the event. It does not navigate and it does not scroll — the
 * project bleeds out to fill the screen, its colour becomes the room, and its
 * mechanic is live inside it. Closing puts you back exactly where you stood.
 * That is the difference between a list of links and a thing you can pick up.
 *
 * It behaves like a dialog because it is one: focus moves in and is handed
 * back, Escape closes, the page behind cannot scroll, and the set is hidden
 * from assistive tech while it is open. Without JavaScript every name is still
 * one plain link to its case.
 */

const shots: Record<string, { src: string; alt: string }> = {
  "design-or-disaster": {
    src: "/projects/design-or-disaster/case-001.jpg",
    alt: "A case under critique in Design or Disaster.",
  },
};

function Mechanic({ slug }: { slug: string }) {
  const shot = shots[slug];
  if (slug === "fluxion-studios") return <FluxionMark />;
  if (slug === "design-or-disaster" && shot) {
    return <DisasterMark src={shot.src} alt={shot.alt} />;
  }
  if (slug === "pentimento") return <PentimentoStrike />;
  if (slug === "invisible-interfaces") return <InvisibleAway />;
  if (slug === "atlas") return <AtlasRule />;
  if (slug === "daynero") {
    return (
      <ComingSoonMark
        title="Daynero"
        note="Personal finance for a first paycheck. Case study in progress."
      />
    );
  }
  return null;
}

export function Works() {
  const [open, setOpen] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    if (window.location.hash !== "#work") return;
    const work = document.getElementById("work");
    if (!work) return;
    const top = work.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, Math.max(0, top - 8));
    window.dispatchEvent(new Event("portfolio:pin"));
  }, []);

  useEffect(() => {
    if (!open) {
      // hand the keyboard back to the name that opened it
      returnTo.current?.focus();
      returnTo.current = null;
      return;
    }

    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      root.style.overflow = previous;
    };
  }, [open, close]);

  const opened = open ? projects.find((p) => p.slug === open) : null;
  const world = open ? ROOM_WORLDS[open] : null;

  return (
    <section id="work" className="xp-works" aria-label="Selected work">
      {/* A real heading, not an eyebrow floating above nothing. This section
          previously had no heading at all — so navigating by heading, the work
          did not exist — and the label above it was doing a heading's job in a
          heading's place without a heading's weight. */}
      <h2 className="xp-works-title">Selected work</h2>

      <ol className="xp-works-set" aria-hidden={open ? "true" : undefined}>
        {projects.map((project) => {
          const w = ROOM_WORLDS[project.slug];
          return (
            <li
              key={project.id}
              className="xp-works-item"
              data-room={project.slug}
              style={
                {
                  "--room": `rgb(${rgb(w.ground)})`,
                  "--room-ink": w.ink,
                  "--accent-ink": w.accentInk,
                } as CSSProperties
              }
            >
              <div className="xp-works-meta">
                {/* A real heading with a real link. Previously the name was a
                    span inside a button: nothing to navigate to by heading,
                    and cmd-click, middle-click and copy-link were all dead on
                    a work index — the one page where they are used most. */}
                <h3 className="xp-works-name">
                  <TransitionLink href={`/work/${project.slug}`}>
                    {project.title}
                  </TransitionLink>
                </h3>
                <span className="xp-works-form">{project.form}</span>
                {/* the thesis stays in the set, not only inside the opened
                    room — a reviewer scanning the page, and a crawler, should
                    both get what each project argues without opening it */}
                <p className="xp-works-thesis">{project.thesis}</p>
                {project.availability === "coming-soon" ? (
                  <TransitionLink href={`/work/${project.slug}`} className="xp-works-open">
                    Coming soon
                    <span aria-hidden="true"> →</span>
                  </TransitionLink>
                ) : (
                  <button
                    type="button"
                    className="xp-works-open"
                    onClick={(event) => {
                      returnTo.current = event.currentTarget;
                      setOpen(project.slug);
                    }}
                  >
                    Open
                    <span aria-hidden="true"> ↗</span>
                  </button>
                )}
              </div>

              <div className="xp-works-plate">
                <Mechanic slug={project.slug} />
              </div>
            </li>
          );
        })}
      </ol>

      {opened && world ? (
        <div
          className="xp-open"
          role="dialog"
          aria-modal="true"
          aria-label={opened.title}
          tabIndex={-1}
          ref={panelRef}
          style={
            {
              "--accent": opened.accent,
              "--room": `rgb(${rgb(world.ground)})`,
              "--room-ink": world.ink,
              "--accent-ink": world.accentInk,
            } as CSSProperties
          }
        >
          <div className="xp-open-bar">
            <p className="xp-open-form">{opened.form}</p>
            <button type="button" className="xp-open-close" onClick={close}>
              Close
            </button>
          </div>

          <div className="xp-open-body">
            <h3 className="xp-open-name">{opened.title}</h3>
            <p className="xp-open-q">{opened.question}</p>
            <div className="xp-open-stage">
              <Mechanic slug={opened.slug} />
            </div>
            <p className="xp-open-more">
              <TransitionLink href={`/work/${opened.slug}`}>
                Read the full case →
              </TransitionLink>
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
