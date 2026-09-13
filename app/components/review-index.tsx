"use client";

import Link from "next/link";
import { type CSSProperties } from "react";
import { projects, type Project } from "../data/portfolio";
import { SiteFooter } from "./site-footer";
import { TransitionLink } from "./transition-link";
import { AtlasRule } from "./atlas-rule";
import { DayneroNumber } from "./daynero-number";
import { DisasterMark } from "./disaster-mark";
import { FluxionMark } from "./fluxion-mark";
import { InvisibleAway } from "./invisible-away";
import { PentimentoStrike } from "./pentimento-strike";

const order = [
  "design-or-disaster",
  "pentimento",
  "invisible-interfaces",
  "atlas",
  "fluxion-studios",
  "daynero",
];

/**
 * Work — the fast index.
 *
 * One job: let a reviewer see every project, clearly, without ceremony.
 * The identity lives in the header and in Explore; this page is a list.
 *
 * Each row's middle column is the project's own working object — the same
 * instruments the folio operates, at index scale. Nothing here is a
 * screenshot of an interface: mark the evidence, strike the claim, spend
 * the day. The row reads without touching any of it; touching it is what
 * makes the row more than a link.
 */
function HomeStage({ project }: { project: Project }) {
  switch (project.artifact) {
    case "fluxion":
      return <FluxionMark />;
    case "disaster":
      return (
        <DisasterMark
          src="/projects/design-or-disaster/case-010.jpg"
          alt="A case under critique in Design or Disaster."
        />
      );
    case "pentimento":
      return <PentimentoStrike />;
    case "invisible":
      return <InvisibleAway />;
    case "atlas":
      return <AtlasRule />;
    case "daynero":
      return <DayneroNumber />;
  }
}

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
          In the order they were made. Each row links to the full case, and the
          row&rsquo;s own object is live — mark it, strike it, revise it.
        </p>
      </header>

      <ol className="review-list">
        {ordered.map((project) => {
          const soon = project.availability === "coming-soon";
          const href = `/work/${project.slug}?from=work`;
          return (
            <li
              key={project.id}
              id={`project-${project.slug}`}
              className="work-row"
              data-artifact={project.artifact}
              style={{ "--accent": project.accent } as CSSProperties}
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
                <HomeStage project={project} />
              </div>

              <div className="work-row-body">
                <p className="work-row-line">{project.oneLine}</p>
                <p className="work-row-contrib">{project.contribution}</p>
                <p className="work-row-status">{project.status}</p>
                <p className="work-row-actions">
                  <TransitionLink href={href}>
                    {soon ? "See the preview" : "Read case"}
                    <span aria-hidden="true"> →</span>
                  </TransitionLink>
                  <a href={project.liveUrl} target="_blank" rel="noreferrer">
                    Open live <span aria-hidden="true">↗</span>
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
          two-person studio I co-founded with Shreyas. Daynero is commercial
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
