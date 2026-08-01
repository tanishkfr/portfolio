"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { projects } from "../data/portfolio";
import { ROOM_WORLDS, rgb } from "../data/room-worlds";
import { AtlasRule } from "./atlas-rule";
import { DayneroNumber } from "./daynero-number";
import { DisasterMark } from "./disaster-mark";
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
  if (slug === "design-or-disaster" && shot) {
    return <DisasterMark src={shot.src} alt={shot.alt} />;
  }
  if (slug === "pentimento") return <PentimentoStrike />;
  if (slug === "invisible-interfaces") return <InvisibleAway />;
  if (slug === "atlas") return <AtlasRule />;
  if (slug === "daynero") return <DayneroNumber />;
  return null;
}

export function Works() {
  const [open, setOpen] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setOpen(null), []);

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
      <p className="xp-works-kicker">Five questions I couldn&apos;t drop</p>

      <ol className="xp-works-set" aria-hidden={open ? "true" : undefined}>
        {projects.map((project, index) => {
          const w = ROOM_WORLDS[project.slug];
          return (
            <li
              key={project.id}
              className="xp-works-item"
              data-room={project.slug}
              style={
                {
                  "--room": `rgb(${rgb(w.ground)})`,
                  "--accent-ink": w.accentInk,
                } as CSSProperties
              }
            >
              <button
                type="button"
                className="xp-works-open"
                onClick={(event) => {
                  returnTo.current = event.currentTarget;
                  setOpen(project.slug);
                }}
              >
                <span className="xp-works-num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="xp-works-name">{project.title}</span>
                <span className="xp-works-form">{project.form}</span>
                {/* the thesis stays in the set, not only inside the opened
                    room — a reviewer scanning the page, and a crawler, should
                    both get what each project argues without opening it */}
                <span className="xp-works-thesis">{project.thesis}</span>
                <span className="xp-works-cue" aria-hidden="true">
                  open
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* no JavaScript, no pop-out — but every case is still one link away */}
      <noscript>
        <ul className="xp-works-plain">
          {projects.map((project) => (
            <li key={project.id}>
              <a href={`/work/${project.slug}`}>{project.title}</a>
            </li>
          ))}
        </ul>
      </noscript>

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
