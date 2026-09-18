import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import {
  projects,
  selectedNumber,
  selectedSlugs,
  type Project,
} from "../data/portfolio";

const description =
  "The five selected projects in one fast reading: what each one is, what I did, and what exists now.";

export const metadata: Metadata = {
  title: "Quick review",
  description,
  alternates: { canonical: "/quick-review" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/quick-review",
    siteName: "Tanishk — Product & Interaction Designer",
    title: "Quick review — Tanishk",
    description,
    images: [{ url: "/og.png", alt: "Tanishk — Quick review" }],
  },
};

/**
 * QUICK REVIEW — the fast reading. Recruiters, reviewers and admissions
 * readers should get the whole body of work in about ninety seconds.
 *
 * This page is deliberately dependency-free: no client components, no
 * image optimizer, no entrance animation, no intersection observers. It
 * must render complete from the first server byte, with JavaScript
 * disabled, at reduced motion, and never depend on scrolling, hovering
 * or animation completion to become visible. Plain <img> elements with
 * explicit dimensions keep the layout stable without a runtime.
 */

/** One real capture per selected project. */
const visuals: Record<
  string,
  { src: string; alt: string; width: number; height: number; eager?: boolean } | undefined
> = {
  "fluxion-studios": {
    src: "/projects/fluxion/site-home-desktop.png",
    alt: "The Fluxion Studios homepage as shipped.",
    width: 1440,
    height: 900,
    eager: true,
  },
  athena: {
    src: "/projects/athena/dashboard-finished.png",
    alt: "Athena's project dashboard in the working prototype: resources and demonstrated knowledge shown apart.",
    width: 2538,
    height: 1605,
  },
  daynero: {
    src: "/projects/daynero/site-home-mobile.png",
    alt: "The Daynero public website on a phone.",
    width: 390,
    height: 844,
  },
  "invisible-interfaces": {
    src: "/projects/invisible-interfaces/return.png",
    alt: "The Invisible Interfaces return receipt after the tab was hidden.",
    width: 1440,
    height: 900,
  },
  "design-or-disaster": {
    src: "/projects/design-or-disaster/case-001-marked.png",
    alt: "A marked screen in Design or Disaster, with the evidence sentence attached before any verdict.",
    width: 1440,
    height: 900,
  },
};

const ordered = selectedSlugs
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is Project => Boolean(project));

export default function QuickReviewPage() {
  return (
    <main id="main-content" className="qr-shell">
      <header className="qr-head">
        <p className="eyebrow">Quick review · five selected projects</p>
        <h1>Five projects, the short version.</h1>
        <p className="qr-lede">
          One screen per project: what it is, what I did, what exists now, and
          where to read more. About a minute and a half, no animation needed.
        </p>
        <p className="qr-back">
          <Link href="/">Explore the full reading →</Link>
        </p>
      </header>

      <ol className="qr-list">
        {ordered.map((project) => {
          const visual = visuals[project.slug];
          return (
            <li
              key={project.slug}
              className="qr-item"
              style={{ "--accent": project.accent } as CSSProperties}
            >
              <p className="qr-num">{selectedNumber(project.slug)}</p>

              <div className="qr-visual">
                {visual ? (
                  /* Deliberate plain img: this route must render with no
                     client runtime and no image-optimizer dependency, so it
                     can never fail to render. Dimensions are explicit. */
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={visual.src}
                    alt={visual.alt}
                    width={visual.width}
                    height={visual.height}
                    loading={visual.eager ? "eager" : "lazy"}
                    decoding="async"
                  />
                ) : (
                  <p className="qr-visual-note">
                    Research prototype · no shipped screen published
                  </p>
                )}
              </div>

              <div className="qr-body">
                <p className="qr-form">
                  {project.form} · {project.context}
                </p>
                <h2>
                  <Link href={`/work/${project.slug}?from=work`}>
                    {project.title}
                  </Link>
                </h2>
                <p className="qr-line">{project.plain}</p>
                <dl className="qr-facts">
                  <div>
                    <dt>What I did</dt>
                    <dd>{project.contribution}</dd>
                  </div>
                  <div>
                    <dt>What exists now</dt>
                    <dd>{project.status}</dd>
                  </div>
                </dl>
                <p className="qr-actions">
                  <Link href={`/work/${project.slug}?from=work`}>
                    Read case study <span aria-hidden="true">→</span>
                  </Link>
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      data-external="true"
                    >
                      {project.liveLabel} <span aria-hidden="true">↗</span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : null}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <footer className="qr-foot">
        <p>
          Pentimento and Atlas keep their full cases in More work. The
          independent projects are mine end to end; Fluxion is a two-person
          studio; Daynero is commercial team work with its full case still
          being documented.
        </p>
        <p className="qr-foot-links">
          <a href="mailto:madebytanishk@gmail.com">madebytanishk@gmail.com</a>
          <Link href="/about">About →</Link>
          <Link href="/resume">Résumé →</Link>
        </p>
      </footer>
    </main>
  );
}
