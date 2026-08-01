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
    body: "I define states, transitions, authority boundaries, recovery paths, and the rules that make complex behavior coherent.",
  },
  {
    number: "02",
    title: "Product thinking",
    body: "I move between the product premise, the interface people touch, and the implementation decisions that make it real.",
  },
  {
    number: "03",
    title: "Research through making",
    body: "I use working artifacts to turn abstract questions into interactions that can be inspected, challenged, and tested.",
  },
];

export default function AboutPage() {
  return (
    <main id="main-content" className="about-shell">
      <header className="about-intro" data-reveal>
        <p className="eyebrow">About · Bangalore · Available for work</p>
        <h1>I design the rules people feel.</h1>
        <div className="about-lede">
          <p>
            I am Tanishk, an interaction designer based in Bangalore. I work
            on products where the difficult part is not the screen—it is what
            the system decides, remembers, explains, or lets a person change.
          </p>
          <p>
            My current commercial work is Daynero, an AI-native financial app.
            Alongside it, I build independent investigations into criticism,
            algorithmic autobiography, delegated computing, and reasoning.
          </p>
        </div>
        <dl className="about-facts" aria-label="Practice facts">
          <div>
            <dt>Current product</dt>
            <dd>Daynero · app and public website</dd>
          </div>
          <div>
            <dt>Independent work</dt>
            <dd>Four working interaction studies</dd>
          </div>
          <div>
            <dt>Range</dt>
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
        <h2 id="capability-title">From product premise to working behavior.</h2>
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
            <p>If a system interprets, recommends, remembers, or acts, the interface should reveal enough for a person to understand and challenge it.</p>
          </article>
          <article data-reveal>
            <h3>Design the response, not just the result.</h3>
            <p>Correction, refusal, recovery, and undo are central interactions whenever a system carries authority.</p>
          </article>
          <article data-reveal>
            <h3>Build the argument into the behavior.</h3>
            <p>A project should make its central idea felt through interaction before a case study has to explain it.</p>
          </article>
          <article data-reveal>
            <h3>Keep claims inside the evidence.</h3>
            <p>A working product proves what exists. Human outcomes require human evidence, and the writing should never blur that line.</p>
          </article>
        </div>
      </section>

      <section className="authorship-section" aria-labelledby="authorship-title" data-reveal>
        <p className="eyebrow">Authorship and context</p>
        <h2 id="authorship-title">I architect, design, write, and implement.</h2>
        <div>
          <p>
            For Daynero, I designed and built the app experience and public
            website in a commercial startup context. Its full case study will
            name the team, constraints, and outcomes that can be shared.
          </p>
          <p>
            The four research artifacts were self-directed and independently
            built by me. AI assisted ideation, critique, source discovery, and
            code iteration; final concept selection, design decisions, editing,
            implementation decisions, and authorship are mine.
          </p>
        </div>
      </section>

      <section className="about-contact" aria-labelledby="about-contact-title" data-reveal>
        <p className="eyebrow">Currently</p>
        <h2 id="about-contact-title">Based in Bangalore and available for work.</h2>
        <div>
          <a href="mailto:madebytanishk@gmail.com">madebytanishk@gmail.com ↗</a>
          <a href="https://twitter.com/madebytanishk" target="_blank" rel="noreferrer">
            @madebytanishk ↗<span className="sr-only"> (opens in a new tab)</span>
          </a>
          <Link href="/#work">See selected work →</Link>
        </div>
      </section>
    </main>
  );
}
