"use client";

import Link from "next/link";
import { type CSSProperties } from "react";
import { projects } from "../data/portfolio";

/**
 * Quick review: no field, no discovery, no ceremony.
 *
 * A reviewer with four minutes and two hundred tabs open gets the
 * whole record at a glance — what each thing is, what I did, how
 * big it is, and where to go and use it. Every project here is live.
 */

const order = [
  "design-or-disaster",
  "pentimento",
  "invisible-interfaces",
  "atlas",
  "daynero",
];

export function ReviewIndex() {
  const ordered = order
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project) => project != null);

  return (
    <main id="main-content" className="review">
      <header className="review-head">
        <h1>Tanishk</h1>
        <p>
          Interaction designer in Bangalore. Four things I built to answer
          questions I couldn&apos;t stop asking, and one I built for a company.
          All five are live — you can use them right now.
        </p>
      </header>

      <ol className="review-list">
        {ordered.map((project) => (
          <li
            key={project.id}
            style={{ "--accent": project.accent } as CSSProperties}
          >
            <div className="review-id">
              <h2>
                <Link href={`/work/${project.slug}`}>{project.title}</Link>
              </h2>
              <p className="review-form">{project.form}</p>
            </div>

            <div className="review-body">
              <p className="review-line">{project.oneLine}</p>

              <dl className="review-facts">
                <div>
                  <dt>What I did</dt>
                  <dd>{project.contribution}</dd>
                </div>
                <div>
                  <dt>Scale</dt>
                  <dd>{project.scale}</dd>
                </div>
                <div>
                  <dt>Mine or ours</dt>
                  <dd>{project.ownership}</dd>
                </div>
                <div>
                  <dt>Where it stands</dt>
                  <dd>{project.status}</dd>
                </div>
              </dl>

              <p className="review-links">
                <a href={project.liveUrl} target="_blank" rel="noreferrer">
                  Use it <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                {project.sourceUrl ? (
                  <a href={project.sourceUrl} target="_blank" rel="noreferrer">
                    Source <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : null}
                <Link href={`/work/${project.slug}`}>
                  Read the case <span aria-hidden="true">→</span>
                </Link>
              </p>
            </div>
          </li>
        ))}
      </ol>

      <footer className="review-foot">
        <p>
          The four independent projects are mine end to end — concept,
          research, design, and code. Daynero is commercial team work; that
          case is still being written, and I&apos;m not going to fake it until
          it is.
        </p>
        <a href="mailto:madebytanishk@gmail.com">madebytanishk@gmail.com</a>
      </footer>
    </main>
  );
}
