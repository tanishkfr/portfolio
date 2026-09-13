import type { Metadata } from "next";
import Link from "next/link";

const description =
  "About Tanishk, an interaction designer in Bengaluru who also builds.";

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

/**
 * Three practices, each answered by a piece of work. The principle is only
 * worth stating because there is a project that does it — no capability
 * cards, no second reveal.
 */
const practices = [
  {
    principle: "Make correction consequential",
    body: "If software writes about a person, their reply should outrank its sentence and the original should stay visible.",
    href: "/work/pentimento?from=work",
    label: "Pentimento",
  },
  {
    principle: "Make decisions inspectable",
    body: "A judgment should name the evidence it used, and a rule should show every case that changed it.",
    href: "/work/design-or-disaster?from=work",
    label: "Design or Disaster and Atlas",
  },
  {
    principle: "Make the return accountable",
    body: "When work leaves the screen, coming back should show what happened, what did not, and how to discard it.",
    href: "/work/invisible-interfaces?from=work",
    label: "Invisible Interfaces",
  },
];

export default function AboutPage() {
  return (
    <main id="main-content" className="about-shell">
      <header className="about-intro">
        <p className="eyebrow">About · Bengaluru · Available for work</p>
        <h1>I design interactions, then build the working version.</h1>
        <div className="about-lede">
          <p>
            I&apos;m Tanishk, an interaction designer in Bengaluru. I study
            Human-Centred Design at Srishti, design and build products, and
            co-run Fluxion Studios with Shreyas.
          </p>
          <p>
            My independent projects usually start with an interface behaviour I
            cannot stop thinking about: a critique with no evidence, software
            writing about a person, work that continues after someone leaves, or
            a rule that fails outside its original case. I build the interaction
            to see whether the idea survives.
          </p>
        </div>
      </header>

      <section className="about-practice" aria-labelledby="practice-title">
        <div className="about-practice-head">
          <p className="eyebrow">How I work</p>
          <h2 id="practice-title">Three things the work has to do.</h2>
        </div>
        <div className="practice-list">
          {practices.map((practice) => (
            <article key={practice.principle}>
              <h3>{practice.principle}</h3>
              <div>
                <p>{practice.body}</p>
                <Link href={practice.href}>{practice.label} →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-authorship" aria-labelledby="authorship-title">
        <p className="eyebrow">Authorship and context</p>
        <h2 id="authorship-title">What I actually did.</h2>
        <div>
          <p>
            I co-founded Fluxion and designed and built its public site with
            Shreyas. For Daynero, I designed and built the app experience and
            public website; its full case is still being documented. The four
            independent projects — Design or Disaster, Pentimento, Invisible
            Interfaces, and Atlas — are mine from concept through code.
          </p>
          <p>
            I work with AI deliberately. It helps me open up directions,
            pressure-test behaviour, and get from a rough prototype to working
            frontend code faster. I choose what is worth making, direct the
            visual and interaction decisions, edit the writing, and own what
            ships. Formula 1, buildings, films, and games keep the references
            from getting narrow.
          </p>
        </div>
      </section>

      <section className="about-contact" aria-labelledby="about-contact-title">
        <p className="eyebrow">Currently</p>
        <h2 id="about-contact-title">In Bengaluru and available for work.</h2>
        <div>
          <a href="mailto:madebytanishk@gmail.com">madebytanishk@gmail.com ↗</a>
          <a
            href="https://twitter.com/madebytanishk"
            target="_blank"
            rel="noreferrer"
          >
            @madebytanishk ↗<span className="sr-only"> (opens in a new tab)</span>
          </a>
          <Link href="/">See selected work →</Link>
        </div>
      </section>
    </main>
  );
}
