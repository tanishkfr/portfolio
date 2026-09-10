import type { CSSProperties } from "react";
import type { Project } from "../data/portfolio";
import { RoomPaint } from "./atmosphere";
import { ComingSoonMark } from "./coming-soon";
import { TransitionLink } from "./transition-link";

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
        <TransitionLink href={returnHref}>← All work</TransitionLink>
        <span>Coming soon</span>
      </div>

      <header className="daynero-hero" data-reveal>
        <div className="daynero-hero-copy">
          <p className="eyebrow">Commercial product · case study coming soon</p>
          <h1>Daynero</h1>
          <p className="daynero-tagline">What you can spend today, and why.</p>
          <p className="daynero-summary">
            Daynero is an AI-native personal finance app for first-paycheck
            earners. Its main number shows what is safe to spend today and what
            that amount is based on. I designed and built the app experience
            and public website. The full case is still being documented.
          </p>
          <div className="daynero-actions">
            <a href="https://daynero.com/" target="_blank" rel="noreferrer">
              Visit daynero.com <span aria-hidden="true">↗</span>
            </a>
            <TransitionLink href="/#work">Back to selected work</TransitionLink>
          </div>
        </div>
        <aside className="daynero-soon-mark" aria-label="Daynero case study status">
          <ComingSoonMark
            title="Daynero"
            note="Personal finance for a first paycheck. Case study in progress."
          />
          <p>
            Product live · case record in progress. Team context, constraints,
            and outcomes will be added when the evidence is ready.
          </p>
        </aside>
      </header>
    </main>
  );
}
