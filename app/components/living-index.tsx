"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  getLens,
  lenses,
  projects,
  type LensId,
  type Project,
} from "../data/portfolio";

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

function lensFromLocation(): LensId {
  const value = new URL(window.location.href).searchParams.get("lens");
  return lenses.some((lens) => lens.id === value) ? (value as LensId) : "all";
}

function descriptionFor(project: Project, lens: LensId) {
  return lens === "all" ? project.oneLine : project.lensRelations[lens];
}

export function LivingIndex({ initialLens }: { initialLens: LensId }) {
  const [activeLens, setActiveLens] = useState<LensId>(initialLens);
  const lens = getLens(activeLens);

  useEffect(() => {
    const onPopState = () => setActiveLens(lensFromLocation());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const orderedProjects = useMemo(
    () =>
      lens.order
        .map((slug) => projects.find((project) => project.slug === slug))
        .filter((project): project is Project => Boolean(project)),
    [lens],
  );

  function chooseLens(nextLens: LensId) {
    if (nextLens === activeLens) return;

    const update = () => setActiveLens(nextLens);
    const doc = document as ViewTransitionDocument;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (doc.startViewTransition && !reduceMotion) doc.startViewTransition(update);
    else update();

    const nextUrl = new URL(window.location.href);
    if (nextLens === "all") nextUrl.searchParams.delete("lens");
    else nextUrl.searchParams.set("lens", nextLens);
    nextUrl.hash = "work";
    window.history.pushState({ lens: nextLens }, "", nextUrl);
  }

  return (
    <main id="main-content" className="index-shell">
      <section className="orientation" aria-labelledby="practice-title">
        <div className="orientation-main">
          <p className="eyebrow">Tanishk · Interaction Designer · Bangalore</p>
          <h1 id="practice-title">
            I design interfaces that make hidden system behavior visible enough
            to understand, question, and change.
          </h1>
        </div>
        <div className="orientation-aside">
          <p>
            Product architecture, research-through-design, and working
            prototypes built end to end.
          </p>
          <a href="#work">Explore five projects ↓</a>
        </div>
      </section>

      <section className="work-index" id="work" aria-labelledby="work-heading">
        <div className="index-heading">
          <div>
            <p className="eyebrow">Selected work · 05</p>
            <h2 id="work-heading">One practice, read through four questions.</h2>
          </div>
          <p className="lens-prompt" id="lens-prompt">
            {lens.prompt}
          </p>
        </div>

        <nav
          className="lens-nav"
          aria-label="Ways to read the work"
          aria-describedby="lens-prompt"
        >
          {lenses.map((item) => (
            <button
              className="lens-control"
              type="button"
              key={item.id}
              aria-pressed={item.id === activeLens}
              aria-controls="project-list"
              onClick={() => chooseLens(item.id)}
            >
              <span className="lens-short">{item.shortLabel}</span>
              <span className="lens-full">{item.label}</span>
            </button>
          ))}
        </nav>

        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {lens.label}. All five projects remain visible.
        </p>

        <ol className="project-list" id="project-list">
          {orderedProjects.map((project, index) => (
            <li
              className="project-row"
              key={project.id}
              style={
                {
                  "--project-accent": project.accent,
                  viewTransitionName: `project-${project.id}`,
                } as CSSProperties
              }
            >
              <span className="project-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="project-primary">
                <div className="project-kicker">
                  <span>{project.form}</span>
                  <span>{project.status}</span>
                </div>
                <h3>
                  <Link href={`/work/${project.slug}?from=${activeLens}`}>
                    {project.title}
                    <span className="project-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </Link>
                </h3>
                <p className="project-description">
                  {descriptionFor(project, activeLens)}
                </p>
              </div>
              <div className="project-meta">
                <span>{project.year}</span>
                <Link href={`/work/${project.slug}?from=${activeLens}`}>
                  Read case study <span aria-hidden="true">→</span>
                </Link>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${project.title} live work in a new tab`}
                >
                  Live work <span aria-hidden="true">↗</span>
                </a>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="practice-note" aria-labelledby="practice-note-title">
        <p className="eyebrow">Working position</p>
        <div>
          <h2 id="practice-note-title">
            Good interaction does more than make a system usable. It makes the
            system&apos;s terms visible enough to challenge.
          </h2>
          <Link href="/about">How I work →</Link>
        </div>
      </section>

      <section className="home-contact" aria-labelledby="home-contact-title">
        <p className="eyebrow">Available for work</p>
        <h2 id="home-contact-title">Have a difficult interaction problem?</h2>
        <a href="mailto:madebytanishk@gmail.com">madebytanishk@gmail.com ↗</a>
      </section>
    </main>
  );
}
