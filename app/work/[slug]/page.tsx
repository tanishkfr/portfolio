import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AwayLedger } from "../../components/away-ledger";
import { RoomPaint } from "../../components/atmosphere";
import { CaseArtifact } from "../../components/case-artifacts";
import {
  CaseEvidenceSequence,
  CaseFigure,
  CaseMediaPair,
  EvidenceWrap,
} from "../../components/case-media";
import { CaseSignal } from "../../components/case-signal";
import { DayneroPreview } from "../../components/daynero-preview";
import { TransitionLink } from "../../components/transition-link";
import {
  caseCtaLabels,
  disclosure,
  getProject,
  isLensId,
  projects,
  type Project,
} from "../../data/portfolio";
import { projectSignals } from "../../data/project-signals";
import { ROOM_WORLDS, rgb } from "../../data/room-worlds";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string | string[] }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const canonicalPath = "/work/" + project.slug;
  const title = project.title + " — Tanishk";

  return {
    title: project.title,
    description: project.oneLine,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "article",
      locale: "en_IN",
      url: canonicalPath,
      siteName: "Tanishk — Interaction Designer",
      title,
      description: project.oneLine,
      images: [{ url: "/og.png", alt: title }],
    },
  };
}

/** Where a case sends you back, resolved from the origin it was opened from.
    Both readings land on Projects — the anchor picks the sheet or the row. */
function resolveReturn(slug: string, fromValue?: string) {
  if (fromValue === "explore" || fromValue === "work") {
    return { href: `/#piece-${slug}` };
  }
  if (isLensId(fromValue)) {
    return { href: `/?lens=${fromValue}#work` };
  }
  return { href: "/#work" };
}

/* The reasoning layer: each case composes a different argument from the
   same truthful material - the situation, the turn, the method, the
   system, the paths that were dropped. The order is the narrative. */
type ReasoningSection = "problem" | "decision" | "method" | "system" | "rejected";

const reasoningPlans: Record<string, ReasoningSection[]> = {
  "fluxion-studios": ["decision"],
  "design-or-disaster": ["decision", "method", "system", "rejected"],
  pentimento: ["decision", "method", "system", "rejected"],
  "invisible-interfaces": ["decision", "method", "rejected"],
  atlas: ["decision", "system", "method", "rejected"],
};

function ReasoningSections({ project }: { project: Project }) {
  const plan = reasoningPlans[project.slug] ?? [];
  const sections: React.ReactNode[] = [];
  for (const section of plan) {
    if (section === "problem" && project.problem) {
      sections.push(
        <div className="reason-block" key="problem">
          <p className="case-label">The situation</p>
          <h3>{project.problem.title}</h3>
          <div className="story-prose">
            {project.problem.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>,
      );
    }
    if (section === "decision") {
      sections.push(
        <div className="reason-block" key="decision">
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
        </div>,
      );
    }
    if (section === "method" && project.interactionSteps.length > 0) {
      sections.push(
        <div className="reason-block" key="method">
          <p className="case-label">How the interaction works</p>
          <p className="reason-intro">{project.interactionIntro}</p>
          <ol className="reason-method">
            {project.interactionSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>,
      );
    }
    if (section === "system" && project.systemLayers.length > 0) {
      sections.push(
        <div className="reason-block" key="system">
          <p className="case-label">The system underneath</p>
          <ol className="reason-system">
            {project.systemLayers.map((layer) => (
              <li key={layer.label}>
                <span>{layer.label}</span>
                <div>
                  <strong>{layer.title}</strong>
                  <p>{layer.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>,
      );
    }
    if (section === "rejected" && project.rejectedPaths.length > 0) {
      sections.push(
        <div className="reason-block" key="rejected">
          <p className="case-label">Considered, then dropped</p>
          <ul className="reason-rejected">
            {project.rejectedPaths.map((path) => (
              <li key={path.title}>
                <strong>{path.title}</strong>
                <p>{path.reason}</p>
              </li>
            ))}
          </ul>
        </div>,
      );
    }
  }
  return <>{sections}</>;
}

/* Why the next project follows this one — the relationship, stated once
   per case instead of a repeated "read this next" line. */
const relationReasons: Record<string, string> = {
  "fluxion-studios":
    "The studio site shows what we ship; this shows the judgment we argue about before shipping.",
  "design-or-disaster":
    "A mark records one judgment. This asks how a rule should answer to it.",
  pentimento:
    "A correction fixes one claim. This keeps the lineage of every rule a case changed.",
  "invisible-interfaces":
    "Once work returns, someone has to judge it. This makes that judgment contestable.",
  atlas: "Rules should answer to evidence. This is where the evidence gets marked.",
};

function ProjectActions({ project }: { project: Project }) {
  return (
    <div className="case-actions">
      <a
        href={project.liveUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`${project.liveLabel} (opens in a new tab)`}
        data-external="true"
      >
        {project.liveLabel} <span className="xp-cta-arrow" aria-hidden="true">↗</span>
        <small>New tab</small>
      </a>
      {project.sourceUrl ? (
        <a href={project.sourceUrl} target="_blank" rel="noreferrer" data-external="true">
          Inspect the source <span className="xp-cta-arrow" aria-hidden="true">↗</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : null}
    </div>
  );
}

export default async function ProjectPage({
  params,
  searchParams,
}: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  if (slug !== project.slug) redirect("/work/" + project.slug);

  const search = await searchParams;
  const fromValue = Array.isArray(search.from) ? search.from[0] : search.from;
  const returnTo = resolveReturn(project.slug, fromValue);
  const fromParam =
    fromValue === "explore" || fromValue === "work" || isLensId(fromValue)
      ? fromValue
      : "work";
  const signal = projectSignals[project.artifact];

  if (project.availability === "preview" || project.availability === "coming-soon") {
    return <DayneroPreview project={project} returnHref={returnTo.href} />;
  }

  const story = project.story;
  const related = project.relatedSlugs
    .map((relatedSlug) => getProject(relatedSlug))
    .filter((candidate): candidate is Project => Boolean(candidate));
  const [next, secondary] = related;

  const world = ROOM_WORLDS[project.slug];
  const caseSeed =
    [...project.slug].reduce((hash, ch) => (hash * 31 + ch.charCodeAt(0)) & 0xffff, 17) % 997;

  return (
    <main
      id="main-content"
      className={`case shell case--${project.artifact}`}
      data-world={project.artifact}
      data-room={project.slug}
      style={
        {
          "--project-accent": project.accent,
          "--accent": project.accent,
          "--room": world ? `rgb(${rgb(world.ground)})` : undefined,
        } as CSSProperties
      }
    >
      <RoomPaint slug={project.slug} />
      <div className="case-return">
        <p className="case-crumb">
          <TransitionLink href={returnTo.href}>← Projects</TransitionLink>
          <span aria-hidden="true">/</span>
          <span className="case-crumb-here">{project.title}</span>
        </p>
        <span className="case-signal">{signal.focus}</span>
      </div>

      <a className="case-skip" href="#case-writing">
        Skip to the written case
      </a>

      {/* The opening does one job: identify the project, state what Tanishk
          contributed, and hand over something to inspect. The demonstration
          follows; the signature plate and mural do not. */}
      <header className="case-hero">
        <div className="case-hero-meta record-line">
          <span>
            Case {String(projects.indexOf(project) + 1).padStart(2, "0")} ·{" "}
            {project.form}
          </span>
          <span>
            {project.year} · {project.status}
          </span>
        </div>

        <div className="case-hero-top">
          <div className="case-hero-main">
            <h1>{project.title}</h1>
            <p className="case-summary">{project.oneLine}</p>
            <ProjectActions project={project} />
          </div>

          <dl
            className="case-facts"
            aria-label={`${project.title} project facts`}
          >
            <div>
              <dt>Contribution</dt>
              <dd>{project.contribution}</dd>
            </div>
            <div>
              <dt>Context</dt>
              <dd>{project.context}</dd>
            </div>
          </dl>
        </div>

        <CaseArtifact project={project} />

        {/* Real interface evidence, captured from the deployed artifact
            or shipped site — placed where the case talks about it. */}
        {project.slug === "fluxion-studios" ? (
          <EvidenceWrap>
            <CaseMediaPair
              desktop={{
                src: "/projects/fluxion/site-home-desktop.png",
                alt: "The Fluxion Studios homepage as shipped: the studio's opening section with its navigation, process and founders.",
              }}
              mobile={{
                src: "/projects/fluxion/site-home-mobile.png",
                alt: "The same homepage on a phone: the sections stack with the enquiry entry remaining reachable.",
              }}
              label="The shipped site"
              caption="Fluxion's public site, live at fluxion-studios.vercel.app — designed, written and implemented in-house. Desktop and mobile from the same build."
              priority
            />
          </EvidenceWrap>
        ) : null}

        {project.slug === "design-or-disaster" ? (
          <EvidenceWrap>
            <CaseFigure
              src="/projects/design-or-disaster/case-001-marked.png"
              alt="Case 001 on the live archive: a Hierarchy lens chosen, four markers placed on the interface, and the evidence sentence attached before any verdict."
              width={1440}
              height={900}
              label="A marked screen, live"
              caption="Case 001 on the working archive — the Hierarchy lens chosen, four markers placed, each one carrying an evidence sentence. Only after the evidence exists can a verdict be submitted."
            />
          </EvidenceWrap>
        ) : null}


        {project.artifact === "invisible" ? <AwayLedger /> : null}

        <p className="case-tools record-line">
          <span>Scale · {project.scale}</span>
          <span>Built with · {project.tools.join(" · ")}</span>
        </p>
      </header>

      {story ? (
        <article className="case-story" id="case-writing">
          <section className="story-beat" data-reveal>
            <p className="case-label">The situation</p>
            <h2 className="story-statement">{project.problem.title}</h2>
            <div className="story-prose">
              {project.problem.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="story-beat" data-reveal>
            <p className="case-label">What it is</p>
            <div className="story-prose">
              {story.contribution.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <blockquote className="story-turn" data-reveal>
            <p>{story.turn}</p>
          </blockquote>

          <section className="story-beat" data-reveal>
            <p className="case-label">What changed during the build</p>
            <div className="story-prose">
              {story.reflection.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        </article>
      ) : null}

      {/* The reasoning layer: the consequential decision, the method,
      the system, the dropped paths — composed per project, not per
      template. */}
      <section className="case-reasoning" aria-labelledby="reasoning-title" data-reveal>
        <CaseSignal
          accent={world?.accentInk ?? project.accent}
          ink={world?.ink ?? "#1b2126"}
          seed={caseSeed}
        />
        <header className="record-head">
          <p className="case-label">The reasoning</p>
          <h2 id="reasoning-title">{project.pivot.title}</h2>
        </header>
        <ReasoningSections project={project} />
      </section>

      {/* The record: the decisions, the honest boundary, the next
          test. Scannable, not narrated — the proof, not the pitch. */}
      <section className="case-record" aria-labelledby="record-title" data-reveal>
        <header className="record-head">
          <p className="case-label">The record</p>
          <h2 id="record-title">Decisions and open questions.</h2>
        </header>

        <div className="record-decisions">
          {project.decisions.map((decision) => (
            <article key={decision.title}>
              <h3>{decision.title}</h3>
              <p className="record-choice">{decision.choice}</p>
              <p className="record-consequence">{decision.consequence}</p>
            </article>
          ))}
        </div>

        {project.clientWork ? (
          <div className="record-client">
            <header className="record-head">
              <p className="case-label">{project.clientWork.label}</p>
              <h3>{project.clientWork.title}</h3>
            </header>
            <CaseFigure
              src="/projects/fluxion/taamboolam-home.png"
              alt="The Taamboolam homestay website as shipped: the opening with the house description, room enquiry and floor navigation."
              width={1440}
              height={900}
              label="Shipped client build"
              caption="The public site as delivered — interface design, enquiry flow, production QA and deployment."
            />
            <dl className="case-facts">
              {project.clientWork.rows.map((row) => (
                <div key={row.term}>
                  <dt>{row.term}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
            {project.clientWork.href ? (
              <a
                className="record-client-link"
                href={project.clientWork.href}
                target="_blank"
                rel="noreferrer"
              >
                {project.clientWork.hrefLabel}{" "}
                <span aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : null}
          </div>
        ) : null}

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

        {project.sources ? (
          <div className="record-sources">
            <p className="case-label">Sources</p>
            <ul>
              {project.sources.map((source) => (
                <li key={source.href}>
                  <a href={source.href} target="_blank" rel="noreferrer">
                    {source.label} <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  <span>{source.supports}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="record-next">
          <p className="case-label">Next test</p>
          <h3>{project.nextTest.title}</h3>
          <p>{project.nextTest.body}</p>
          <p className="record-rule">
            <span>What would count</span>
            {project.nextTest.success}
          </p>
        </div>

        <p className="record-disclosure">
          {project.disclosure || disclosure}
        </p>
      </section>

      {next ? (
        <section
          className="case-relations"
          aria-labelledby="relation-title"
          data-reveal
        >
          <p className="eyebrow">Next</p>
          <h2 id="relation-title">
            {relationReasons[project.slug] ??
              "The next project takes the same question one step further."}
          </h2>
          <TransitionLink
            className="relation-primary"
            href={`/work/${next.slug}?from=${fromParam}`}
            style={{ "--relation-accent": next.accent } as CSSProperties}
          >
            <span>{next.form}</span>
            <strong>{next.title}</strong>
            <p>{next.plain}</p>
            <span className="xp-cta-arrow" aria-hidden="true">
              {caseCtaLabels(next).internal} →
            </span>
          </TransitionLink>
          {secondary ? (
            <Link
              className="relation-secondary"
              href={`/work/${secondary.slug}?from=${fromParam}`}
            >
              Also: {secondary.title} →
            </Link>
          ) : null}
          <p className="case-end-flow">
            <TransitionLink href={returnTo.href}>← Back to projects</TransitionLink>
          </p>
        </section>
      ) : null}

      {/* Evidence sequences: the real correction / revision runs, captured
          from the live artifacts so the visitor can see the actual output
          beside the argument it demonstrates. */}
      {project.slug === "pentimento" ? (
        <CaseEvidenceSequence
          label="The correction, live"
          intro="One machine-written claim through its full reply."
          steps={[
            {
              src: "/projects/pentimento/draft-overview.png",
              alt: "Maya's first draft: three machine-written sentences remain as claims, each underlined for reply.",
              width: 1440,
              height: 900,
              step: "The contested draft",
              caption: "Maya's first draft, written from her public film diary — three sentences remain as claims the subject can answer.",
            },
            {
              src: "/projects/pentimento/claim-evidence.png",
              alt: "A claim opened: the evidence behind the machine's reading, with the reply options visible.",
              width: 1440,
              height: 900,
              step: "Evidence shown",
              caption: "Opening a claim shows what the software drew on. Maya is fictional, staged from authored material — no participant data exists.",
            },
            {
              src: "/projects/pentimento/struck.png",
              alt: "The machine's sentence struck through; the person's correction now leads the passage.",
              width: 1440,
              height: 900,
              step: "Struck",
              caption: "The machine's sentence struck: its account recedes and Maya's correction takes the reading.",
            },
            {
              src: "/projects/pentimento/second-draft.png",
              alt: "The settled second draft, with the person's version leading the document.",
              width: 1440,
              height: 900,
              step: "The final page",
              caption: "The settled second draft: the person's account leads, the machine's reading is visibly overruled.",
            },
          ]}
        />
      ) : null}

      {project.slug === "atlas" ? (
        <CaseEvidenceSequence
          label="One real run"
          intro="A rule carried through three unlike cases, in the live tool."
          steps={[
            {
              src: "/projects/atlas/rule-test.png",
              alt: "The Atlas rule test: the starting rule editable in place, with the lightbox case ready below.",
              width: 1440,
              height: 900,
              step: "The starting rule",
              caption: "The test opens with a suggested rule — editable before any pressure, so the assumption being carried is explicit.",
            },
            {
              src: "/projects/atlas/trace-lineage.png",
              alt: "The completed trace: the starting rule, a refinement after the lightbox, a rewrite after the financial transfer, and the final wording after switch access.",
              width: 1440,
              height: 900,
              step: "The lineage",
              caption: "A completed run: hold, refine and fracture each demanded rewording, and the trace keeps which case caused every change.",
            },
          ]}
        />
      ) : null}
    </main>
  );
}
