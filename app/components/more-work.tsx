import Image from "next/image";
import { TransitionLink } from "./transition-link";

/**
 * MORE WORK — the shelf after the five selected projects.
 *
 * Not another sticky-case sequence and not a preview browser. Ariadne
 * leads as a real maintained tool: its evidence is the repository's own
 * workflow documentation and its verified release, not a mock dashboard.
 * The three screenshot projects follow at a readable size. Everything
 * here links to something that exists.
 */

/** Real stage table, taken from Ariadne's WORKFLOW.md. */
const ariadneStages = [
  { id: "S0–S1", name: "Route + Discover", role: "Strategist" },
  { id: "S2", name: "Research", role: "Strategist" },
  { id: "S3", name: "Direct", role: "Design director" },
  { id: "S4", name: "Build", role: "Architect → Implementer" },
  /* the stage whose role includes the independent Reviewer */
  { id: "S5", name: "Verify", role: "Implementer → Reviewer", verify: true },
  { id: "S6", name: "Ship & Learn", role: "Implementer + Strategist" },
] as const;

/** Real gate names, from the same document. Every gate is human-only. */
const ariadneGates = [
  "Direction Lock",
  "Dependency",
  "Build Complete",
  "Ship",
  "Publish",
] as const;

type ShelfItem = {
  name: string;
  form: string;
  note: string;
  meta: string;
  href: string;
  linkLabel: string;
  image: { src: string; alt: string; width: number; height: number };
};

const shelf: ShelfItem[] = [
  {
    name: "8BIT Boxer",
    form: "Webcam game · playable",
    note: "A tiny first-person pixel-art boxing game played with a laptop webcam: two gloves mirror your hands and a heavy bag lights up targets for sixty seconds.",
    meta: "Playable in the browser · camera processed on-device",
    href: "https://bag-bop.vercel.app/",
    linkLabel: "Play it",
    image: {
      src: "/projects/8bit-boxer/play.jpg",
      alt: "A round in progress in 8BIT Boxer's demo mode: the heavy bag, the gloves and the round HUD, captured in the game itself.",
      width: 1600,
      height: 1000,
    },
  },
  {
    name: "Pentimento",
    form: "Interactive essay",
    note: "Software writes a claim about a person; the person can accept, rewrite, or strike it, and their version leads the page.",
    meta: "Working piece · study pending",
    href: "/work/pentimento?from=work",
    linkLabel: "Read case study",
    image: {
      src: "/projects/pentimento/correction.jpg",
      alt: "The correction in progress: the machine's sentence struck through, with the person's own account leading the passage.",
      width: 1600,
      height: 1000,
    },
  },
  {
    name: "Atlas",
    form: "Rule testing tool",
    note: "A provisional rule is carried through three unlike cases, and hold, refine, or fracture is kept in its lineage.",
    meta: "Working tool · audit open",
    href: "/work/atlas?from=work",
    linkLabel: "Read case study",
    image: {
      src: "/projects/atlas/lineage.jpg",
      alt: "The start of an Atlas trace: the written rule and the first recorded rewording, with the case that caused it.",
      width: 1440,
      height: 900,
    },
  },
];

export function MoreWork() {
  return (
    <section className="more-work" aria-labelledby="more-work-title">
      <header className="more-work-head">
        <p className="more-work-kicker" id="more-work-title">
          More work
        </p>
        <p className="more-work-note">
          Tools, games and experiments beyond my selected projects.
        </p>
      </header>

      {/* Featured: a maintained developer tool. Its proof is its own
          documentation and release, shown as text — no invented UI. */}
      <article className="mw-feature" aria-labelledby="mw-feature-name">
        <div className="mw-feature-copy">
          <p className="more-work-form">Developer tool · maintained</p>
          <h3 className="mw-feature-name" id="mw-feature-name">
            Ariadne
          </h3>
          <p className="mw-feature-line">
            A human-gated workflow for AI-assisted creative production:
            evidence, validation, independent review, and safe release.
          </p>
          <p className="mw-feature-meta">
            v1.6.7 · latest release, September 2026
          </p>
          <a
            className="mw-feature-link"
            href="https://github.com/tanishkfr/ariadne"
            target="_blank"
            rel="noreferrer"
            data-external="true"
          >
            Open the repository <span aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>

        <div
          className="mw-feature-doc"
          aria-label="Ariadne's documented workflow: stages, roles and gates"
        >
          <p className="mw-doc-head">
            <span>WORKFLOW.md</span>
            <span>stages · roles · gates</span>
          </p>
          <ol className="mw-stages">
            {ariadneStages.map((stage) => (
              <li key={stage.id} data-verify={"verify" in stage && stage.verify ? "true" : undefined}>
                <span className="mw-stage-id">{stage.id}</span>
                <span className="mw-stage-name">{stage.name}</span>
                <span className="mw-stage-role">{stage.role}</span>
              </li>
            ))}
          </ol>
          <p className="mw-gates">
            <span className="mw-gates-label">Human approval gates</span>
            {ariadneGates.map((gate) => (
              <span className="mw-gate" key={gate}>
                {gate}
              </span>
            ))}
          </p>
          <p className="mw-doc-note">
            Only Verify is checked by someone other than its author, and no
            gate can be passed without a person.
          </p>
        </div>
      </article>

      <ul className="more-work-shelf">
        {shelf.map((item) => (
          <li key={item.name} className="more-work-item">
            {item.href.startsWith("/") ? (
              <TransitionLink className="more-work-link" href={item.href}>
                <ShelfBody item={item} />
                <span className="more-work-open">
                  {item.linkLabel} <span aria-hidden="true">→</span>
                </span>
              </TransitionLink>
            ) : (
              <a
                className="more-work-link"
                href={item.href}
                target="_blank"
                rel="noreferrer"
                data-external="true"
              >
                <ShelfBody item={item} />
                <span className="more-work-open">
                  {item.linkLabel} <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </span>
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ShelfBody({ item }: { item: ShelfItem }) {
  return (
    <>
      <span className="more-work-visual">
        <Image
          src={item.image.src}
          alt={item.image.alt}
          width={item.image.width}
          height={item.image.height}
          sizes="(min-width: 60rem) 22rem, 100vw"
        />
      </span>
      <span className="more-work-body">
        <span className="more-work-form">{item.form}</span>
        <strong className="more-work-name">{item.name}</strong>
        <span className="more-work-line">{item.note}</span>
        <span className="more-work-meta">{item.meta}</span>
      </span>
    </>
  );
}
