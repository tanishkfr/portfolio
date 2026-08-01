import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AwayLedger } from "../../components/away-ledger";
import { CaseArtifact } from "../../components/case-artifacts";
import { DayneroPreview } from "../../components/daynero-preview";
import { ProjectSigil, SignaturePlate } from "../../components/project-sigil";
import { TransitionLink } from "../../components/transition-link";
import {
  disclosure,
  getProject,
  isLensId,
  projects,
  type Project,
} from "../../data/portfolio";
import { projectSignals } from "../../data/project-signals";

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
    twitter: {
      card: "summary_large_image",
      creator: "@madebytanishk",
      title,
      description: project.oneLine,
      images: ["/og.png"],
    },
  };
}

function ProjectActions({ project }: { project: Project }) {
  return (
    <div className="case-actions">
      <a
        href={project.liveUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${project.title} live work in a new tab`}
      >
        Experience the project <span aria-hidden="true">↗</span>
        <small>New tab</small>
      </a>
      {project.sourceUrl ? (
        <a href={project.sourceUrl} target="_blank" rel="noreferrer">
          Inspect the source <span aria-hidden="true">↗</span>
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
  const fromLens = isLensId(fromValue) ? fromValue : "all";
  const signal = projectSignals[project.artifact];
  const returnHref = fromLens === "all" ? "/#work" : `/?lens=${fromLens}#work`;

  if (project.availability === "preview") {
    return <DayneroPreview project={project} returnHref={returnHref} />;
  }

  const story = project.story;
  const related = project.relatedSlugs
    .map((relatedSlug) => getProject(relatedSlug))
    .filter((candidate): candidate is Project => Boolean(candidate));

  return (
    <main
      id="main-content"
      className={`case shell case--${project.artifact}`}
      data-world={project.artifact}
      style={
        {
          "--project-accent": project.accent,
          // on a case, the world's own ink is the only colour — it takes
          // over every housing mark that has no colour of its own
          "--accent": project.accent,
        } as React.CSSProperties
      }
    >
      <div className="case-return">
        <TransitionLink href={returnHref}>← All work</TransitionLink>
        <span>{signal.focus}</span>
      </div>

      <header className="case-hero">
        {/* the room's mural: the world's mark at architectural scale */}
        <span className="case-mural" aria-hidden="true">
          <ProjectSigil artifact={project.artifact} />
        </span>
        <div className="case-hero-meta record-line">
          <span>
            Case {String(projects.indexOf(project) + 1).padStart(2, "0")} ·{" "}
            {project.form}
          </span>
          <span>
            {project.year} · {project.status}
          </span>
        </div>

        <div className="case-title-lockup">
          <h1 style={{ viewTransitionName: `project-${project.id}` }}>
            {project.title}
          </h1>
          <p className="case-thesis">{project.thesis}</p>
        </div>

        <SignaturePlate artifact={project.artifact} focus={signal.focus} />

        {project.artifact === "invisible" ? <AwayLedger /> : null}

        <div className="case-hero-brief" data-reveal>
          <p className="case-summary">{project.oneLine}</p>
          <ProjectActions project={project} />
        </div>

        <dl className="case-facts" aria-label={`${project.title} project facts`} data-reveal>
          <div>
            <dt>Ownership</dt>
            <dd>{project.ownership}</dd>
          </div>
          <div>
            <dt>My role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt>Scale</dt>
            <dd>{project.scale}</dd>
          </div>
          <div>
            <dt>Built with</dt>
            <dd>{project.tools.join(" · ")}</dd>
          </div>
        </dl>
      </header>

      {/* Play first, read second: the working proof meets the
          reviewer before any prose does. */}
      <CaseArtifact project={project} />

      {story ? (
        <article className="case-story">
          <section className="story-beat" data-reveal>
            <p className="case-label">Why I built it</p>
            <div className="story-prose">
              {story.intro.map((paragraph) => (
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
            <p className="case-label">What it changed</p>
            <div className="story-prose">
              {story.reflection.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        </article>
      ) : null}

      {/* The record: the decisions, the honest boundary, the next
          test. Scannable, not narrated — the proof, not the pitch. */}
      <section className="case-record" aria-labelledby="record-title" data-reveal>
        <header className="record-head">
          <p className="case-label">The record</p>
          <h2 id="record-title">What I decided, and what I haven&apos;t proven.</h2>
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
          <p className="case-label">The next honest test</p>
          <h3>{project.nextTest.title}</h3>
          <p>{project.nextTest.body}</p>
          <p className="record-rule">
            <span>What would count</span>
            {project.nextTest.success}
          </p>
        </div>

        <p className="record-disclosure">{disclosure}</p>
      </section>

      <section className="case-relations" aria-labelledby="relation-title" data-reveal>
        <p className="eyebrow">Continue through the question</p>
        <h2 id="relation-title">Two related investigations.</h2>
        <div className="relation-grid">
          {related.map((candidate) => (
            <TransitionLink
              key={candidate.slug}
              href={`/work/${candidate.slug}?from=${fromLens}`}
              style={{ "--relation-accent": candidate.accent } as React.CSSProperties}
            >
              <span>{candidate.form}</span>
              <strong>{candidate.title}</strong>
              <p>{candidate.thesis}</p>
              <span aria-hidden="true">Read the case →</span>
            </TransitionLink>
          ))}
        </div>
      </section>
    </main>
  );
}
