import type { CSSProperties } from "react";
import type { Project } from "../data/portfolio";
import { RoomPaint } from "./atmosphere";
import { CaseSignal } from "./case-signal";
import { CaseFigure } from "./case-media";
import { ROOM_WORLDS } from "../data/room-worlds";
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
        <span>Early product preview · public site live</span>
      </div>

      <header className="daynero-hero" data-reveal>
        <div className="daynero-hero-copy">
          <p className="eyebrow">Main UI/UX designer · app and website</p>
          <h1>Daynero</h1>
          <p className="daynero-tagline">
            What you can spend today, and why.
          </p>
          <p className="daynero-summary">
            Daynero is an early-stage personal-finance product for people
            earning their first salary. Its central number answers what is
            safe to spend today. I am its main UI/UX designer: the public
            website was designed by me with feedback from the founder, and
            the app&apos;s design system has been through three iterations. The
            website is live; the app is still pre-MVP.
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

      {/* The one real product-design surface that is public: the live
          marketing site. Presented as what it is — the shipped public
          website, not proof that the app has shipped. */}
      <section className="case-evidence" aria-label="The live public site" data-reveal>
        <header className="record-head">
          <p className="case-label">What is live</p>
          <h2>The public product site, as shipped.</h2>
        </header>
        <CaseFigure
          src="/projects/daynero/site-home-desktop.png"
          alt="Daynero's live public website: the behavioural personal-finance proposition with its daily-budget, goals, score and insights sections, and the waitlist entry."
          width={1440}
          height={900}
          label="The public website"
          caption="Daynero's public site, live at daynero.com, designed and built by Tanishk. It presents the product proposition and collects waitlist sign-ups; the app itself remains pre-MVP, and no private product surface is shown here."
        />
      </section>

      {/* The app's design work, stated without exposing internal artifacts:
          the three design-system iterations are real and counted, the
          tension they answer is stated as a design goal, and no app flow
          is shown or implied. */}
      <section className="case-reasoning" aria-label="The design work" data-reveal>
        <header className="record-head">
          <p className="case-label">The design work</p>
          <h2>Approachable for a first salary, credible for money.</h2>
        </header>
        <div className="reason-block">
          <p className="case-label">The design tension</p>
          <div className="story-prose">
            <p>
              How do you make a finance app feel approachable to someone
              earning their first salary, without making it look simplistic
              or financially unreliable? That balance of clarity,
              approachability, and a credible financial-product identity at
              the same time is what the app&apos;s design has been working
              against from the start.
            </p>
          </div>
        </div>
        <div className="reason-block">
          <p className="case-label">The iterations</p>
          <div className="story-prose">
            <p>
              The app&apos;s design system has gone through three iterations. Each
              pass reworked the interface&apos;s visual foundation: layout,
              colour, hierarchy, and how the daily budget and recent activity
              are presented. The most recent version moves the app to a
              lighter, more editorial home screen, with clearer category
              colour and the day summarised in one line. The iterations are
              evidence of a design process in progress, not user validation;
              the artifacts stay internal while the product is pre-MVP.
            </p>
          </div>
        </div>
      </section>

      {/* An honest record in miniature: the situation, the turn, what
          exists now, what is not yet proven. Same grammar as the
          published cases, no invented evidence. */}
      <section className="case-reasoning" aria-labelledby="reasoning-title" data-reveal>
        <CaseSignal
          accent={ROOM_WORLDS.daynero.accentInk}
          ink={ROOM_WORLDS.daynero.ink}
          seed={1337}
        />
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
