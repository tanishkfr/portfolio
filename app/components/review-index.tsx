"use client";

import Link from "next/link";
import { type CSSProperties } from "react";
import { caseCtaLabels, projects, type Project } from "../data/portfolio";
import { modeHref } from "./mode";
import { SiteFooter } from "./site-footer";
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

/**
 * Quick view — the fast index.
 *
 * One job: let a reviewer see every project, clearly, without ceremony.
 * The identity lives in the header and in Explore; this page is a list,
 * and it says so — the opening names itself as the other reading of the
 * same projects Explore tells properly.
 *
 * Each row's middle column is the project's portrait — the same abstract,
 * living representation the folio mounts, at index scale: same material,
 * same behaviour, quieter. It reads without touching anything.
 */
export function ReviewIndex() {
  const ordered = order
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is Project => project != null);

  return (
    <>
      <main id="main-content" className="review">
      <header className="review-opening">
        <h1>Six selected projects.</h1>
        <p className="review-note">
          In the order they were made. Each row links to the full case; the
          row&rsquo;s portrait is the project&rsquo;s behaviour, drawn from the
          same material as the folio.
        </p>
        <p className="review-mode">
          The same projects as Explore, without the ceremony:{" "}
          <Link href={modeHref("full")}>
            Explore <span aria-hidden="true">→</span>
          </Link>
        </p>
      </header>

      <ol className="review-list">
        {ordered.map((project) => {
          const href = `/work/${project.slug}?from=work`;
          return (
            <li
              key={project.id}
              id={`project-${project.slug}`}
              className="work-row"
              data-artifact={project.artifact}
              style={
                {
                  "--accent": project.accent,
                  "--title-word": Math.max(
                    ...project.title.split(" ").map((word) => word.length),
                  ),
                } as CSSProperties
              }
            >
              <div className="work-row-id">
                <h2>
                  <TransitionLink href={href}>
                    {project.title}
                  </TransitionLink>
                </h2>
                <p className="work-row-form">{project.form}</p>
              </div>

              <div className="work-row-stage" data-reveal="figure">
                <ProjectPortrait
                  slug={project.slug}
                  tone="index"
                />
              </div>

              <div className="work-row-body">
                <p className="work-row-line">{project.oneLine}</p>
                <p className="work-row-contrib">{project.contribution}</p>
                <p className="work-row-status">{project.status}</p>
                <p className="work-row-actions">
                  <TransitionLink href={href}>
                    {caseCtaLabels(project).internal}
                    <span className="xp-cta-arrow" aria-hidden="true"> →</span>
                  </TransitionLink>
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" data-external="true">
                    {caseCtaLabels(project).external}
                    <span className="xp-cta-arrow" aria-hidden="true"> ↗</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <footer className="review-foot">
        <p>
          The four independent projects are mine end to end. Fluxion is a
          two-person studio I co-founded. Daynero is commercial
          team work; its full case is still being documented.
        </p>
        <p className="review-foot-links">
          <a href="mailto:madebytanishk@gmail.com">madebytanishk@gmail.com</a>
          <Link href="/about">About →</Link>
          <Link href="/resume">Résumé →</Link>
        </p>
      </footer>
    </main>
      <SiteFooter year={new Date().getFullYear()} force />
    </>
  );
}
