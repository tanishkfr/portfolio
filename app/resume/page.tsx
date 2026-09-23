import type { Metadata } from "next";
import Link from "next/link";
import { PrintResume } from "../components/print-resume";
import { PageSignal } from "../components/page-signal";

const description =
  "Résumé | Tanishk, product and interaction designer in Bengaluru. Experience, selected work, leadership, education and tools.";

export const metadata: Metadata = {
  title: "Résumé",
  description,
  alternates: { canonical: "/resume" },
};

/**
 * The résumé, read on the web. The content is the supplied PDF's own text —
 * sections, roles, dates and wording — translated into the portfolio's
 * design system rather than an A4 imitation. The PDF stays the canonical
 * downloadable document; this page is the readable one.
 */

type Entry = {
  title: string;
  titleHref?: string;
  titleExternal?: boolean;
  role?: string;
  dates?: string;
  lines: string[];
  links?: { label: string; href: string }[];
};

const experience: Entry[] = [
  {
    title: "Daynero",
    titleHref: "https://daynero.com/",
    titleExternal: true,
    role: "UI/UX Designer",
    dates: "2026 – Present",
    lines: [
      "Designing a personal finance product for first-paycheck earners in India, currently pre-MVP with a waitlist of roughly 200–300 people.",
      "Shaped the core experience around one question: \u201CHow much can I safely spend today?\u201D This turns account and spending data into a daily budget and contextual guidance.",
      "Own product design across the five-person team, working directly with product and engineering from product logic through interface behaviour.",
      "Designed the product around transaction understanding, manual spending, financial context and AI guidance rather than treating AI as a standalone chat feature.",
    ],
  },
  {
    title: "Fluxion Studios",
    titleHref: "https://fluxion-studios.vercel.app/",
    titleExternal: true,
    role: "Co-founder & Product Designer",
    dates: "2026 – Present",
    lines: [
      "Co-founded a two-person design studio working directly with small businesses on paid digital projects.",
      "Turn client conversations into scoped products: defining requirements, pricing work, writing proposals and deciding what can realistically be designed and built.",
      "Stay involved beyond design, working through implementation constraints, client revisions and deployment rather than handing off at Figma.",
      "Designed and shipped Taamboolam's live hospitality website, taking it from client requirements through interface design, enquiry flows, production QA and deployment.",
    ],
    links: [{ label: "Taamboolam ↗", href: "https://taamboolam.com" }],
  },
];

const selectedWork: Entry[] = [
  {
    title: "Ariadne",
    titleHref: "https://github.com/tanishkfr/ariadne",
    titleExternal: true,
    role: "Creator & Maintainer",
    lines: [
      "AI can produce work faster than we can trust it.",
      "I kept hitting the same problem while building with AI: agents could generate work much faster than I could reliably verify it. So I built Ariadne, an installable developer tool that structures AI-assisted work around evidence, validation, independent review and escalation.",
      "Released through v1.6.7, with automated checks for implementation, review, release and rollback, including a validated update and rollback path.",
    ],
  },
  {
    title: "Athena",
    role: "Product & UX Design",
    lines: [
      "Understanding something isn’t the same as being able to retrieve it.",
      "Qualitative research with students, including a focus group and 1:1 interviews, kept surfacing the same contradiction: digital tools made information easier to understand, but that did not mean learners could recall or apply it later.",
      "Designed and prototyped Athena around a learn → explain/apply → review loop, separating content consumption from evidence that the learner could actually use what they had learned.",
    ],
  },
  {
    title: "Invisible Interfaces",
    titleHref: "https://invisible-interfaces.vercel.app/",
    titleExternal: true,
    role: "Independent Design Research",
    lines: [
      "What happens when interfaces stop asking for attention?",
      "An interactive web essay and set of interface experiments exploring how products can move work away from explicit taps, menus and commands toward behaviour shaped by context, intent and system state.",
    ],
  },
];

const leadership: Entry[] = [
  {
    title: "Teens for Cancer Patients, South Bangalore",
    role: "Co-President",
    dates: "2022 – 2025",
    lines: [
      "Led fundraising and awareness initiatives with the chapter, helping raise INR 1L+ for cancer-patient support.",
    ],
  },
];

const education: Entry[] = [
  {
    title: "Srishti Manipal Institute of Art, Design and Technology",
    role: "B.Des, Human Centered Design",
    dates: "2024 – 2028",
    lines: [],
  },
  {
    title: "Google UX Design Professional Certificate",
    lines: [],
  },
  {
    title: "Meta Front-End Developer Professional Certificate",
    lines: [],
  },
];

function EntryBlock({ entry }: { entry: Entry }) {
  return (
    <article className="resume-entry">
      <header className="resume-entry-head">
        <h3 className="resume-entry-title">
          {entry.titleHref ? (
            <a
              href={entry.titleHref}
              target="_blank"
              rel="noreferrer"
            >
              {entry.title}
              <span aria-hidden="true"> ↗</span>
            </a>
          ) : (
            entry.title
          )}
        </h3>
        {(entry.role || entry.dates) && (
          <p className="resume-entry-meta">
            {entry.role}
            {entry.role && entry.dates && <span aria-hidden="true"> · </span>}
            {entry.dates}
          </p>
        )}
      </header>
      {entry.lines.length > 0 && (
        <ul className="resume-entry-lines">
          {entry.lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
      {entry.links && (
        <p className="resume-entry-links">
          {entry.links.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
        </p>
      )}
    </article>
  );
}

function Section({
  num,
  title,
  entries,
  claims = false,
}: {
  num: string;
  title: string;
  entries: Entry[];
  claims?: boolean;
}) {
  return (
    <section
      className={`resume-section${claims ? " resume-section--claims" : ""}`}
      aria-labelledby={`resume-${num}`}
    >
      <h2 className="resume-section-title" id={`resume-${num}`}>
        <span aria-hidden="true">{num}</span> · {title}
      </h2>
      {entries.map((entry) => (
        <EntryBlock key={entry.title} entry={entry} />
      ))}
    </section>
  );
}

export default function ResumePage() {
  return (
    <main id="main-content" className="resume-shell">
      <link
        rel="preload"
        href="/fonts/instrument-serif-400italic-latin.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <header className="resume-intro">
        <PageSignal variant="resume" />
        <p className="resume-kicker">Tanishk · Bengaluru · Available for work</p>
        <h1>Tanishk Salagame</h1>
        <p className="resume-role">Product Designer / Interaction Designer</p>
        <p className="resume-lede">
          Designing behaviour, not just screens. I move between research,
          interface behaviour, prototypes and working code in my roles as the product
          designer at Daynero, co-founder of Fluxion Studios, and the author of
          four independent interaction projects.
        </p>
        <p className="resume-actions">
          <a
            className="resume-pdf"
            href="/Tanishk_Salagame_Resume.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Open the résumé (PDF) <span aria-hidden="true">↗</span>
          </a>
          <PrintResume />
        </p>
        <p className="resume-contact">
          <a href="mailto:madebytanishk@gmail.com">madebytanishk@gmail.com</a>
          <a
            href="https://madebytanishk.vercel.app/"
            target="_blank"
            rel="noreferrer"
          >
            Portfolio
          </a>
          <a
            href="https://www.linkedin.com/in/tanishksalagame/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a href="https://github.com/tanishkfr" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </p>
      </header>

      <Section num="01" title="Experience" entries={experience} />
      <Section num="02" title="Selected work" entries={selectedWork} claims />
      <Section num="03" title="Leadership" entries={leadership} />
      <Section num="04" title="Education" entries={education} />

      <section className="resume-section" aria-labelledby="resume-05">
        <h2 className="resume-section-title" id="resume-05">
          <span aria-hidden="true">05</span> · Tools & build
        </h2>
        <article className="resume-entry">
          <h3 className="resume-entry-title resume-entry-title--small">
            Design
          </h3>
          <p className="resume-tools">Figma · Framer</p>
        </article>
        <article className="resume-entry">
          <h3 className="resume-entry-title resume-entry-title--small">
            Build
          </h3>
          <p className="resume-tools">
            React · Next.js · JavaScript · HTML/CSS · Git · AI-assisted
            development
          </p>
        </article>
      </section>

      <p className="resume-back">
        <Link href="/">← Back to projects</Link>
        <Link href="/about">About</Link>
      </p>
    </main>
  );
}
