import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CaseArtifact } from "../../components/case-artifacts";
import {
  getLens,
  getProject,
  isLensId,
  projects,
  type Project,
} from "../../data/portfolio";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string | string[] }>;
};

type CaseLanguage = {
  interaction: string;
  decisions: string;
  evidence: string;
  limits: string;
};

const caseLanguage: Record<Project["artifact"], CaseLanguage> = {
  remainder: {
    interaction: "From conversation to reviewed memory.",
    decisions: "Judgment is a system boundary.",
    evidence: "What the product demonstrates.",
    limits: "What remains unproven.",
  },
  disaster: {
    interaction: "A verdict begins with a mark.",
    decisions: "Disagreement is designed, not averaged.",
    evidence: "What the archive demonstrates.",
    limits: "What the archive does not claim.",
  },
  pentimento: {
    interaction: "The subject edits the account.",
    decisions: "Correction changes the page hierarchy.",
    evidence: "What the artifact demonstrates.",
    limits: "What research still has to establish.",
  },
  invisible: {
    interaction: "Leaving is the consequential action.",
    decisions: "Absence only matters when return is accountable.",
    evidence: "What the exhibition demonstrates.",
    limits: "Where the argument stops.",
  },
  atlas: {
    interaction: "A rule travels until it breaks.",
    decisions: "The trace matters more than the answer.",
    evidence: "What the instrument demonstrates.",
    limits: "What remains to be studied.",
  },
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
  const lens = getLens(fromLens);
  const language = caseLanguage[project.artifact];
  const returnHref =
    fromLens === "all" ? "/#work" : "/?lens=" + fromLens + "#work";
  const related = project.relatedSlugs
    .map((relatedSlug) => getProject(relatedSlug))
    .filter((candidate): candidate is Project => Boolean(candidate));

  return (
    <main
      id="main-content"
      className={"project-shell project-" + project.artifact}
      style={{ "--project-accent": project.accent } as React.CSSProperties}
    >
      <div className="project-return">
        <Link href={returnHref}>← Return to {lens.label}</Link>
      </div>

      <header className="project-threshold">
        <div className="threshold-meta">
          <p className="eyebrow">{project.context}</p>
          <p>
            {project.year} · {project.status}
          </p>
        </div>
        <h1 style={{ viewTransitionName: "project-" + project.id }}>
          {project.title}
        </h1>
        <div className="threshold-grid">
          <p className="project-question">{project.question}</p>
          <div>
            <p className="project-summary">{project.oneLine}</p>
            <dl className="project-facts">
              <div>
                <dt>Role</dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt>Built with</dt>
                <dd>{project.tools.join(" · ")}</dd>
              </div>
            </dl>
            <div className="project-actions">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={"Open " + project.title + " live work in a new tab"}
              >
                Open live work <span aria-hidden="true">↗</span>
                <small>New tab</small>
              </a>
              <a
                href={project.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                View source <span aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <CaseArtifact project={project} />

      <div className="case-layout">
        <aside
          className="case-toc"
          aria-label={project.title + " case study sections"}
        >
          <p className="eyebrow">Case study</p>
          <nav>
            <a href="#problem">01 · Problem</a>
            <a href="#shift">02 · Shift</a>
            <a href="#interaction">03 · Interaction</a>
            <a href="#decisions">04 · Decisions</a>
            <a href="#evidence">05 · Evidence</a>
            <a href="#limits">06 · Limits</a>
          </nav>
        </aside>

        <article className="case-story">
          <section className="case-section" id="problem">
            <p className="case-number">01 · The problem</p>
            <h2>{project.problem.title}</h2>
            {project.problem.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>

          <section className="case-section" id="shift">
            <p className="case-number">02 · The shift</p>
            <h2>{project.shift.title}</h2>
            {project.shift.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>

          <section className="case-section" id="interaction">
            <p className="case-number">03 · The interaction</p>
            <h2>{language.interaction}</h2>
            <p>{project.interactionIntro}</p>
            <ol className="interaction-sequence">
              {project.interactionSteps.map((step, index) => (
                <li key={step}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="case-section" id="decisions">
            <p className="case-number">04 · Design decisions</p>
            <h2>{language.decisions}</h2>
            <div className="decision-grid">
              {project.decisions.map((decision) => (
                <article key={decision.title}>
                  <h3>{decision.title}</h3>
                  <p>{decision.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="case-section evidence-section" id="evidence">
            <p className="case-number">05 · Evidence boundary</p>
            <h2>{language.evidence}</h2>
            <ul className="evidence-list">
              {project.demonstrated.map((item) => (
                <li key={item}>
                  <span aria-hidden="true">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="case-section limits-section" id="limits">
            <p className="case-number">06 · Limits and next move</p>
            <h2>{language.limits}</h2>
            <ul className="limits-list">
              {project.limits.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="next-step">
              <span>Next</span>
              <p>{project.nextStep}</p>
            </div>
            <p className="project-disclosure">{project.disclosure}</p>
          </section>

          <blockquote className="contribution-quote">
            <p>{project.contribution}</p>
            <cite>{project.title} · Contribution</cite>
          </blockquote>
        </article>
      </div>

      <section className="relation-section" aria-labelledby="relation-title">
        <p className="eyebrow">Continue through a relationship</p>
        <h2 id="relation-title">The next project is connected by a question.</h2>
        <div className="relation-grid">
          {related.map((candidate) => (
            <Link
              key={candidate.slug}
              href={"/work/" + candidate.slug + "?from=" + fromLens}
              style={
                { "--relation-accent": candidate.accent } as React.CSSProperties
              }
            >
              <span>{candidate.form}</span>
              <strong>{candidate.title}</strong>
              <p>
                {fromLens === "all"
                  ? candidate.oneLine
                  : candidate.lensRelations[fromLens]}
              </p>
              <span aria-hidden="true">Read case study →</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
