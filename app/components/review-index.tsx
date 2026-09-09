"use client";

import Link from "next/link";
import { type CSSProperties } from "react";
import { projects } from "../data/portfolio";

const order = [
  "fluxion-studios",
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
        <p className="review-kicker">Quick review · 90 seconds</p>
        <h1>Tanishk</h1>
        <p>
          Interaction designer in Bangalore. A studio I co-founded, four live
          independent studies, and a product case that is still being written.
        </p>
      </header>

      <ol className="review-list">
        {ordered.map((project) => {
          const soon = project.availability === "coming-soon";
          return (
            <li
              key={project.id}
              style={{ "--accent": project.accent } as CSSProperties}
            >
              <div className="review-id">
                <h2>
                  {soon ? (
                    <span>{project.title}</span>
                  ) : (
                    <Link href={`/work/${project.slug}`}>{project.title}</Link>
                  )}
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
                    <dt>Role</dt>
                    <dd>{project.role}</dd>
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
                    {soon ? "Visit the product" : "Open live"}{" "}
                    <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  {project.sourceUrl ? (
                    <a href={project.sourceUrl} target="_blank" rel="noreferrer">
                      Source <span aria-hidden="true">↗</span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : null}
                  {soon ? (
                    <Link href={`/work/${project.slug}`}>Coming soon</Link>
                  ) : (
                    <Link href={`/work/${project.slug}`}>
                      Read the case <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <footer className="review-foot">
        <p>
          The four independent studies are mine end to end. Fluxion is a
          two-person studio. Daynero is commercial team work; the case will
          wait until it can be told properly.
        </p>
        <a href="mailto:madebytanishk@gmail.com">madebytanishk@gmail.com</a>
      </footer>
    </main>
  );
}
