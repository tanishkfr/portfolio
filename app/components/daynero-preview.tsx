import type { CSSProperties } from "react";
import type { Project } from "../data/portfolio";
import { RoomPaint } from "./atmosphere";
import { TransitionLink } from "./transition-link";

/**
 * Daynero is a deliberate preview, not a spectacle. The product is
 * commercial and the team context is real, but the case evidence is not yet
 * publishable, so the page states the premise, the contribution, and the
 * boundary — and nothing it cannot support.
 */
export function DayneroPreview({
  project,
  returnHref,
}: {
  project: Project;
  returnHref: string;
}) {
  return (
    <main
      id="main-content"
      className="daynero-preview daynero-soon"
      data-room="daynero"
      style={
        {
          "--project-accent": project.accent,
          "--accent": project.accent,
        } as CSSProperties
      }
    >
      <RoomPaint slug="daynero" />
      <div className="daynero-return">
        <TransitionLink href={returnHref}>{"← Projects / " + project.title}</TransitionLink>
        <span>Commercial product · case in preparation</span>
      </div>

      <header className="daynero-hero" data-reveal>
        <div className="daynero-hero-copy">
          <p className="eyebrow">Product design · implementation</p>
          <h1>Daynero</h1>
          <p className="daynero-tagline">
            What you can spend today, and why.
          </p>
          <p className="daynero-summary">
            Daynero is an AI-native personal finance app for first-paycheck
            earners. Its central number answers what is safe to spend today.
            I designed the app experience and the public website.
          </p>
          <div className="daynero-actions">
            <a href={project.liveUrl} target="_blank" rel="noreferrer">
              {project.liveLabel} <span aria-hidden="true">↗</span>
            </a>
            <TransitionLink href={returnHref}>Back to projects</TransitionLink>
          </div>
          <p className="daynero-note">
            Full case in preparation: team context, constraints, and publishable
            outcomes.
          </p>
        </div>
      </header>

      {/* An honest record in miniature: the situation, the turn, what
          exists now, what is not yet proven. Same grammar as the
          published cases, no invented evidence. */}
      <section className="case-reasoning" aria-labelledby="reasoning-title" data-reveal>
        <header className="record-head">
          <p className="case-label">The reasoning</p>
          <h2 id="reasoning-title">{project.pivot.title}</h2>
        </header>

        <div className="reason-block">
          <p className="case-label">The situation</p>
          <h3>{project.problem.title}</h3>
          <div className="story-prose">
            {project.problem.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="reason-block">
          <p className="case-label">The turn</p>
          <ol className="reason-decision">
            <li>
              <span>Where it started</span>
              <p>{project.pivot.before}</p>
            </li>
            <li>
              <span>What changed</span>
              <p>{project.pivot.realization}</p>
            </li>
            <li>
              <span>Where it landed</span>
              <p>{project.pivot.after}</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="case-record" aria-labelledby="record-title" data-reveal>
        <header className="record-head">
          <p className="case-label">The record</p>
          <h2 id="record-title">Decisions and open questions.</h2>
        </header>

        <div className="record-boundary">
          <section>
            <span className="boundary-state boundary-state--built">Built and working</span>
            <ul>
              {project.demonstrated.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <span className="boundary-state boundary-state--open">Not yet proven</span>
            <ul>
              {project.limits.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="record-next">
          <p className="case-label">Next test</p>
          <h3>{project.nextTest.title}</h3>
          <p>{project.nextTest.body}</p>
          <p className="record-rule">
            <span>What would count</span>
            {project.nextTest.success}
          </p>
        </div>

        <p className="record-disclosure">{project.disclosure}</p>
      </section>

      <p className="case-end-flow">
        <TransitionLink href={returnHref}>← Back to projects</TransitionLink>
      </p>
    </main>
  );
}
