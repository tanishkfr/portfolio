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
import { flagshipOrder, projectSignals } from "../data/project-signals";
import { ProjectProof } from "./project-proof";

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

  const orderedProjects = useMemo(() => {
    const order = activeLens === "all" ? flagshipOrder : lens.order;
    return order
      .map((slug) => projects.find((project) => project.slug === slug))
      .filter((project): project is Project => Boolean(project));
  }, [activeLens, lens]);

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
    <main id="main-content" className="index-shell index-shell--alive">
      <section className="orientation orientation--instrument" aria-labelledby="practice-title">
        <div className="orientation-main" data-reveal>
          <p className="eyebrow">Tanishk · Interaction Designer · Bangalore</p>
          <h1 id="practice-title">
            I design the moment a system <em>explains itself.</em>
          </h1>
          <p className="orientation-deck">
            Five independently built products and research instruments about
            memory, judgment, delegation, and accountable system behavior.
          </p>
        </div>

        <aside className="orientation-aside" data-reveal aria-label="Practice summary">
          <p className="availability-statement">
            <span className="availability-dot" aria-hidden="true" />
            Available for interaction design work
          </p>
          <dl className="orientation-facts">
            <div>
              <dt>Proof</dt>
              <dd>05 live interactive artifacts</dd>
            </div>
            <div>
              <dt>Ownership</dt>
              <dd>Concept, design, writing, and code</dd>
            </div>
            <div>
              <dt>Practice</dt>
              <dd>Products · research · systems</dd>
            </div>
          </dl>
          <a className="orientation-cta" href="#work">
            Start with the work <span aria-hidden="true">↓</span>
          </a>
        </aside>

        <div className="orientation-trace" aria-hidden="true" data-reveal>
          <span>Observe</span>
          <i />
          <span>Expose</span>
          <i />
          <span>Contest</span>
          <i />
          <span>Revise</span>
          <b />
        </div>
      </section>

      <section className="work-index work-index--proof" id="work" aria-labelledby="work-heading">
        <div className="index-heading" data-reveal>
          <div>
            <p className="eyebrow">Selected work · 05 live artifacts</p>
            <h2 id="work-heading">Inspect the behavior, not just the outcome.</h2>
          </div>
          <div className="index-reading">
            <p className="lens-prompt" id="lens-prompt">
              {activeLens === "all"
                ? "Remainder leads the default path. Choose a question to reorganize the same practice without hiding any project."
                : lens.prompt}
            </p>
            <p className="index-instruction">
              Hover, focus, or tap a project to inspect its interaction proof.
            </p>
          </div>
        </div>

        <div className="lens-console" data-reveal>
          <span>Reorder by question</span>
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
        </div>

        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {lens.label}. All five projects remain visible.
        </p>

        <ol className="project-list project-list--staged" id="project-list">
          {orderedProjects.map((project, index) => {
            const signal = projectSignals[project.artifact];
            const projectHref = "/work/" + project.slug + "?from=" + activeLens;
            const flagship = project.slug === "remainder";

            return (
              <li
                className={
                  "project-row project-row--proof project-row--" +
                  project.artifact +
                  (flagship ? " is-flagship" : "")
                }
                data-project-row
                data-reveal
                key={project.id}
                style={
                  {
                    "--project-accent": project.accent,
                    "--row-x": 0.5,
                    "--row-y": 0.5,
                    "--proof-tilt-x": "0deg",
                    "--proof-tilt-y": "0deg",
                    viewTransitionName: "project-" + project.id,
                  } as CSSProperties
                }
              >
                <div className="project-index-mark">
                  <span className="project-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {flagship ? <small>Flagship product</small> : null}
                </div>

                <div className="project-primary">
                  <div className="project-kicker">
                    <span>{project.form}</span>
                    <span>{signal.status}</span>
                  </div>
                  <h3>
                    <a href={projectHref}>
                      {project.title}
                      <span className="project-arrow" aria-hidden="true">↗</span>
                    </a>
                  </h3>
                  <p className="project-description lens-copy" key={activeLens}>
                    {descriptionFor(project, activeLens)}
                  </p>
                  <dl className="project-scan">
                    <div>
                      <dt>Design signal</dt>
                      <dd>{signal.focus}</dd>
                    </div>
                    <div>
                      <dt>Interaction</dt>
                      <dd>{signal.interaction}</dd>
                    </div>
                    <div>
                      <dt>Evidence</dt>
                      <dd>{signal.proof}</dd>
                    </div>
                  </dl>
                </div>

                <a
                  className="project-proof-link"
                  href={projectHref}
                  aria-label={"Open the " + project.title + " case study"}
                >
                  <ProjectProof project={project} />
                  <span className="proof-caption">
                    Interaction proof <i aria-hidden="true">→</i>
                  </span>
                </a>

                <div className="project-meta project-meta--actions">
                  <span>{project.year} · Independent</span>
                  <a href={projectHref}>
                    Read case study <span aria-hidden="true">→</span>
                  </a>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={"Open " + project.title + " live work in a new tab"}
                  >
                    Open live work <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="practice-note" aria-labelledby="practice-note-title" data-reveal>
        <p className="eyebrow">Working position</p>
        <div>
          <h2 id="practice-note-title">
            Good interaction does more than make a system usable. It makes the
            system&apos;s terms visible enough to challenge.
          </h2>
          <Link href="/about">How I work →</Link>
        </div>
      </section>

      <section className="home-contact" aria-labelledby="home-contact-title" data-reveal>
        <p className="eyebrow">Available for work</p>
        <h2 id="home-contact-title">Bring me the interaction nobody has made clear yet.</h2>
        <a href="mailto:madebytanishk@gmail.com">madebytanishk@gmail.com ↗</a>
      </section>
    </main>
  );
}
