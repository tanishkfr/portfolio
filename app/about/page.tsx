import type { Metadata } from "next";
import Link from "next/link";

const description =
  "About Tanishk, an interaction designer based in Bangalore and available for work.";

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    locale: "en_IN",
    url: "/about",
    siteName: "Tanishk — Interaction Designer",
    title: "About — Tanishk",
    description,
    images: [{ url: "/og.png", alt: "About Tanishk" }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@madebytanishk",
    title: "About — Tanishk",
    description,
    images: ["/og.png"],
  },
};

const capabilities = [
  {
    number: "01",
    title: "Interaction systems",
    body: "I define states, transitions, authority boundaries, recovery paths, and the rules that make complex behavior feel coherent.",
  },
  {
    number: "02",
    title: "Research-through-design",
    body: "I use working artifacts to turn abstract questions into interactions that can be inspected, challenged, and eventually studied.",
  },
  {
    number: "03",
    title: "End-to-end prototyping",
    body: "I carry concepts through writing, visual direction, implementation, accessibility, testing, and deployment instead of stopping at a static handoff.",
  },
];

export default function AboutPage() {
  return (
    <main id="main-content" className="about-shell about-shell--alive">
      <header className="about-intro" data-reveal>
        <p className="eyebrow">About · Bangalore · Available for work</p>
        <h1>I work on the behavior underneath the interface.</h1>
        <div className="about-lede">
          <p>
            I am Tanishk, an interaction designer based in Bangalore. I design
            products and research instruments for moments when people need to
            understand a system, contest its interpretation, recover its
            history, or decide how much authority to give it.
          </p>
          <p>
            My recent independent work moves across creative tools,
            algorithmic autobiography, design criticism, delegated computing,
            and reasoning systems. The subjects change; the recurring concern
            is whether an interface makes its own terms visible.
          </p>
        </div>
        <dl className="about-facts" aria-label="Practice facts">
          <div>
            <dt>Practice</dt>
            <dd>Independent interaction design</dd>
          </div>
          <div>
            <dt>Proof</dt>
            <dd>Five live interactive artifacts</dd>
          </div>
          <div>
            <dt>Ownership</dt>
            <dd>Architecture, design, writing, and implementation</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>Bangalore · Available for work</dd>
          </div>
        </dl>
      </header>

      <section className="capability-section" aria-labelledby="capability-title" data-reveal>
        <p className="eyebrow">What I bring to a team</p>
        <h2 id="capability-title">From system premise to working behavior.</h2>
        <div className="capability-grid">
          {capabilities.map((capability) => (
            <article key={capability.number} data-reveal>
              <span>{capability.number}</span>
              <h3>{capability.title}</h3>
              <p>{capability.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="principle-section" aria-labelledby="principle-title" data-reveal>
        <div>
          <p className="eyebrow">How I work</p>
          <h2 id="principle-title">Clarity is a form of agency.</h2>
        </div>
        <div className="principle-list">
          <article data-reveal>
            <h3>Make the hidden decision inspectable.</h3>
            <p>
              If a system remembers, interprets, recommends, or acts, the
              interface should reveal enough of that process for a person to
              understand and challenge it.
            </p>
          </article>
          <article data-reveal>
            <h3>Preserve change without pretending the past vanished.</h3>
            <p>
              Revision, correction, and undo are not edge cases. They are how
              interfaces acknowledge that judgment changes over time.
            </p>
          </article>
          <article data-reveal>
            <h3>Build the argument into the interaction.</h3>
            <p>
              A project should not need a wall of explanatory copy to make its
              central idea felt. The behavior itself has to carry the claim.
            </p>
          </article>
          <article data-reveal>
            <h3>Keep claims inside the evidence boundary.</h3>
            <p>
              A working prototype proves that an interaction can exist. It does
              not automatically prove desirability, trust, learning, or impact.
            </p>
          </article>
        </div>
      </section>

      <section className="authorship-section" aria-labelledby="authorship-title" data-reveal>
        <p className="eyebrow">Authorship and tools</p>
        <h2 id="authorship-title">I architect, design, write, and implement.</h2>
        <div>
          <p>
            The work in this portfolio was independently conceived and built by
            me over the past several months. Across the projects I was the
            primary architect, ideator, interaction designer, writer, visual
            director, and implementer.
          </p>
          <p>
            AI assisted ideation, critique, source discovery, and code
            iteration. Final concept selection, research framing, design
            decisions, editing, implementation decisions, and authorship are
            mine. Each case study states its specific evidence and limits.
          </p>
        </div>
      </section>

      <section className="about-contact" aria-labelledby="about-contact-title" data-reveal>
        <p className="eyebrow">Currently</p>
        <h2 id="about-contact-title">Based in Bangalore and available for work.</h2>
        <div>
          <a href="mailto:madebytanishk@gmail.com">madebytanishk@gmail.com ↗</a>
          <a
            href="https://twitter.com/madebytanishk"
            target="_blank"
            rel="noreferrer"
          >
            @madebytanishk ↗
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <Link href="/#work">See selected work →</Link>
        </div>
      </section>
    </main>
  );
}
