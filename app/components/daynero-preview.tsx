import Link from "next/link";
import type { Project } from "../data/portfolio";
import { ProjectSignature } from "./project-signature";

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
      className="daynero-preview"
      style={{ "--project-accent": project.accent } as React.CSSProperties}
    >
      <div className="daynero-return">
        <a href={returnHref}>← Return to selected work</a>
        <span>Commercial work · Preview</span>
      </div>

      <header className="daynero-hero" data-scroll-reveal>
        <div className="daynero-hero-copy">
          <p className="eyebrow">AI-native financial product · Case study in preparation</p>
          <h1 style={{ viewTransitionName: `project-${project.id}` }}>Daynero</h1>
          <p className="daynero-tagline">Less noise. Better money.</p>
          <p className="daynero-summary">
            A behavioral-finance app designed around daily decisions instead of
            a monthly reset. I designed and built the app experience and the
            public website; the full commercial case study is being documented.
          </p>
          <div className="daynero-actions">
            <a href="https://daynero.com/" target="_blank" rel="noreferrer">
              Visit daynero.com <span aria-hidden="true">↗</span>
            </a>
            <Link href="/#work">See published case studies</Link>
          </div>
        </div>

        <ProjectSignature
          artifact={project.artifact}
          focus="Adaptive finance · daily behavior"
        />
      </header>

      <dl className="daynero-facts" aria-label="Daynero project facts" data-scroll-reveal>
        <div>
          <dt>Context</dt>
          <dd>Active startup product</dd>
        </div>
        <div>
          <dt>My contribution</dt>
          <dd>App and website · design and build</dd>
        </div>
        <div>
          <dt>Product</dt>
          <dd>AI-native behavioral finance</dd>
        </div>
        <div>
          <dt>Evidence status</dt>
          <dd>Public surface live · full case pending</dd>
        </div>
      </dl>

      <section className="daynero-public" aria-labelledby="daynero-public-title" data-scroll-reveal>
        <header>
          <p className="eyebrow">What is public now</p>
          <h2 id="daynero-public-title">Money guidance that responds to the day.</h2>
          <p>
            Daynero publicly frames budgeting as a behavioral problem. Its core
            product ideas make guidance more immediate and personal.
          </p>
        </header>
        <div className="daynero-capabilities">
          <article>
            <span>01</span>
            <h3>Adaptive daily budget</h3>
            <p>Guidance changes with the person and their spending patterns in real time.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Goals in the loop</h3>
            <p>Priorities shape what the daily budget recommends instead of living in a separate plan.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Behavior made legible</h3>
            <p>The Meridian Score and personalized insights connect present habits to longer-term direction.</p>
          </article>
        </div>
      </section>

      <section className="daynero-boundary" aria-labelledby="daynero-boundary-title" data-scroll-reveal>
        <div>
          <p className="eyebrow">Evidence boundary</p>
          <h2 id="daynero-boundary-title">A preview, not a manufactured case study.</h2>
        </div>
        <div className="daynero-boundary-grid">
          <article>
            <span>What I can state</span>
            <ul>
              <li>I designed and built the app experience and public website.</li>
              <li>The live website establishes the product’s current public position.</li>
              <li>The work adds commercial product context to this portfolio.</li>
            </ul>
          </article>
          <article>
            <span>What comes with the full case</span>
            <ul>
              <li>The team, timeline, constraints, and product evolution.</li>
              <li>The specific interaction decisions and implementation trade-offs.</li>
              <li>Only outcomes and evidence that can be published responsibly.</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="daynero-close" data-scroll-reveal>
        <p>The work is live. The story will follow when it can be told properly.</p>
        <a href="https://daynero.com/" target="_blank" rel="noreferrer">
          Experience Daynero <span aria-hidden="true">↗</span>
        </a>
      </section>
    </main>
  );
}
