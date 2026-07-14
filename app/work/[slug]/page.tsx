import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CaseArtifact } from "../../components/case-artifacts";
import { CaseNavigator } from "../../components/case-navigator";
import { DayneroPreview } from "../../components/daynero-preview";
import {
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
    <div className="project-actions case-actions">
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

  const related = project.relatedSlugs
    .map((relatedSlug) => getProject(relatedSlug))
    .filter((candidate): candidate is Project => Boolean(candidate));

  return (
    <main
      id="main-content"
      className={`project-shell case-study-v2 project-${project.artifact}`}
      style={{ "--project-accent": project.accent } as React.CSSProperties}
    >
      <div className="project-return case-return">
        <a href={returnHref}>← Return to selected work</a>
        <span>{signal.focus}</span>
      </div>

      <header className="case-hero">
        <div className="case-hero-meta">
          <p className="eyebrow">Case {String(projects.indexOf(project) + 1).padStart(2, "0")} · {project.form}</p>
          <p>{project.year} · {project.status}</p>
        </div>

        <div className="case-title-lockup">
          <h1 style={{ viewTransitionName: `project-${project.id}` }}>
            {project.title}
          </h1>
          <p className="case-thesis">{project.thesis}</p>
        </div>

        <div className="case-hero-brief">
          <div>
            <p className="case-label">The question</p>
            <p className="case-question">{project.question}</p>
          </div>
          <div>
            <p className="case-label">What I built</p>
            <p className="case-summary">{project.oneLine}</p>
            <ProjectActions project={project} />
          </div>
        </div>

        <dl className="case-facts" aria-label={`${project.title} project facts`}>
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

      <section className="case-contribution" aria-labelledby="case-contribution-title">
        <div>
          <p className="case-label">My contribution</p>
          <h2 id="case-contribution-title">What I made accountable.</h2>
        </div>
        <div>
          <p>{project.contribution}</p>
          <ul aria-label="Responsibilities">
            {project.responsibilities.map((responsibility) => (
              <li key={responsibility}>{responsibility}</li>
            ))}
          </ul>
        </div>
      </section>

      <CaseArtifact project={project} />

      <div className="case-layout case-layout-v2">
        <CaseNavigator title={project.title} chapterTitles={project.chapterTitles} />

        <article className="case-story case-story-v2">
          <section className="case-chapter case-context" id="context">
            <p className="case-index">01 / Context</p>
            <h2>{project.chapterTitles.context}</h2>
            <p className="case-lede">{project.problem.title}</p>
            <div className="case-prose">
              {project.problem.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <aside className="case-question-card">
              <span>The design question</span>
              <p>{project.question}</p>
            </aside>
          </section>

          <section className="case-chapter case-pivot" id="pivot">
            <p className="case-index">02 / Pivot</p>
            <h2>{project.chapterTitles.pivot}</h2>
            <p className="case-lede">{project.pivot.title}</p>
            <div className="pivot-sequence">
              <article>
                <span>Before</span>
                <p>{project.pivot.before}</p>
              </article>
              <article>
                <span>The realization</span>
                <p>{project.pivot.realization}</p>
              </article>
              <article>
                <span>After</span>
                <p>{project.pivot.after}</p>
              </article>
            </div>
            <div className="rejected-paths" aria-label="Rejected approaches">
              <div className="rejected-heading">
                <span>What I rejected</span>
                <p>Each alternative made the project easier to recognize—and less worth building.</p>
              </div>
              {project.rejectedPaths.map((path) => (
                <article key={path.title}>
                  <h3>{path.title}</h3>
                  <p>{path.reason}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="case-chapter case-interaction" id="interaction">
            <p className="case-index">03 / Interaction</p>
            <h2>{project.chapterTitles.interaction}</h2>
            <p className="case-lede">{project.interactionIntro}</p>
            <ol className="case-sequence">
              {project.interactionSteps.map((step, index) => (
                <li key={step}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="case-chapter case-system" id="system">
            <p className="case-index">04 / System</p>
            <h2>{project.chapterTitles.system}</h2>

            <div className="system-model" aria-label="System model">
              {project.systemLayers.map((layer, index) => (
                <article key={layer.label}>
                  <span>{String(index + 1).padStart(2, "0")} · {layer.label}</span>
                  <h3>{layer.title}</h3>
                  <p>{layer.body}</p>
                </article>
              ))}
            </div>

            <div className="decision-ledger">
              <div className="decision-ledger-head">
                <span>Decision</span>
                <span>What I chose</span>
                <span>What it changed</span>
              </div>
              {project.decisions.map((decision) => (
                <article key={decision.title}>
                  <h3>{decision.title}</h3>
                  <p>{decision.choice}</p>
                  <p>{decision.consequence}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="case-chapter case-proof" id="proof">
            <p className="case-index">05 / Evidence boundary</p>
            <h2>{project.chapterTitles.proof}</h2>

            <div className="evidence-ledger">
              <section>
                <span className="evidence-state evidence-state--built">Built and verified</span>
                <ul>
                  {project.demonstrated.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section>
                <span className="evidence-state evidence-state--open">Not yet proven</span>
                <ul>
                  {project.limits.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="next-test">
              <p className="case-label">The next honest test</p>
              <h3>{project.nextTest.title}</h3>
              <p>{project.nextTest.body}</p>
              <div>
                <span>Decision rule</span>
                <p>{project.nextTest.success}</p>
              </div>
            </div>

            <p className="project-disclosure">{project.disclosure}</p>
          </section>
        </article>
      </div>

      <section className="relation-section case-relations" aria-labelledby="relation-title">
        <p className="eyebrow">Continue through the question</p>
        <h2 id="relation-title">Two related investigations.</h2>
        <div className="relation-grid">
          {related.map((candidate) => (
            <a
              key={candidate.slug}
              href={`/work/${candidate.slug}?from=${fromLens}`}
              style={{ "--relation-accent": candidate.accent } as React.CSSProperties}
            >
              <span>{candidate.form}</span>
              <strong>{candidate.title}</strong>
              <p>
                {fromLens === "all"
                  ? candidate.thesis
                  : candidate.lensRelations[fromLens]}
              </p>
              <span aria-hidden="true">Read the case →</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
