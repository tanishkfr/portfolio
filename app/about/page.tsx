import type { Metadata } from "next";
import Link from "next/link";

const description =
  "About Tanishk — a product and interaction designer in Bengaluru who designs and builds.";

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    locale: "en_IN",
    url: "/about",
    siteName: "Tanishk — Product & Interaction Designer",
    title: "About — Tanishk",
    description,
    images: [{ url: "/og.png", alt: "About Tanishk" }],
  },
};

/**
 * The page reads person-first: who Tanishk is, where he works and studies,
 * what he is actually doing, and what the practice demands — with the three
 * principles kept, because each is answered by a real project. Nothing is
 * invented to humanise it.
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

const currentWork = [
  {
    lead: "Daynero — product design in a real team.",
    body: "I'm the product designer at Daynero, a five-person team building a personal-finance product for first-paycheck earners in India. I own design across the app and the public website, working directly with product and engineering; the case study here is a preview until the full record can be published.",
  },
  {
    lead: "Fluxion Studios — the studio I co-founded.",
    body: "I co-run a two-person studio for small businesses in Bengaluru. I scope and price the work, design it, and build it — our own site and Taamboolam's live hospitality site both went from first conversation to deployed without a handoff.",
  },
  {
    lead: "Independent interaction research.",
    body: "Design or Disaster, Pentimento, Invisible Interfaces, and Atlas are mine from question through code — each started with an interface behaviour I couldn't resolve and ends as a working artifact, not a write-up.",
  },
  {
    lead: "The tooling under my own practice.",
    body: "Ariadne is an installable developer tool I built and maintain. It came out of a problem I kept hitting first-hand: AI can produce work faster than anyone can verify it, so the tool structures AI-assisted work around evidence and review.",
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
            I&apos;m Tanishk — a product and interaction designer in Bengaluru.
            I design and build digital products, interfaces, and interaction
            systems. I&apos;m studying for a B.Des in Human Centered Design at
            Srishti Manipal (2024–2028), I co-run Fluxion Studios, a two-person
            studio, and I&apos;m the product designer at Daynero.
          </p>
          <p>
            What I&apos;m interested in underneath: what interfaces do — how
            they respond, decide, remember, and explain themselves. Most of my
            own projects start with one behaviour I can&apos;t leave alone — a
            critique with no evidence, software writing about a person, work
            that continues after someone leaves, a rule that fails outside its
            original case. I build the interaction to find out whether the idea
            survives.
          </p>
        </div>
        <dl className="about-facts" aria-label="Tanishk at a glance">
          <div>
            <dt>Based in</dt>
            <dd>Bengaluru, India</dd>
          </div>
          <div>
            <dt>Studying</dt>
            <dd>B.Des, Human Centered Design — Srishti Manipal (2024–2028)</dd>
          </div>
          <div>
            <dt>Currently</dt>
            <dd>
              Product design at Daynero · Fluxion Studios (co-founder) ·
              independent interaction research
            </dd>
          </div>
          <div>
            <dt>Open to</dt>
            <dd>Product, UI/UX, and interaction design roles</dd>
          </div>
        </dl>
      </header>

      <section className="about-current" aria-labelledby="current-title">
        <div className="about-practice-head">
          <p className="eyebrow">What I actually do</p>
          <h2 id="current-title">The work, right now.</h2>
        </div>
        <div className="current-list">
          {currentWork.map((item) => (
            <article key={item.lead}>
              <h3>{item.lead}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

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
        <p className="eyebrow">Working with AI · as a collaborator</p>
        <h2 id="authorship-title">What I actually did.</h2>
        <div>
          <p>
            I work with AI deliberately. It helps me open up directions,
            pressure-test behaviour, and get from a rough prototype to working
            frontend code faster. I choose what is worth making, direct the
            visual and interaction decisions, edit the writing, and own what
            ships.
          </p>
          <p>
            As a collaborator I stay close to the build: scope, pricing, and
            constraints are stated before a project starts, and I&apos;d rather
            settle a question in the browser than argue it from a static
            mockup.
          </p>
          <p>
            Ownership is stated on every case: the four independent projects in
            Projects are mine end to end; Fluxion is a two-person practice;
            Daynero is commercial team work, and its full case is still being
            documented.
          </p>
          <p>
            Buildings, films, and games keep the references from getting
            narrow. I tend to notice how things behave, not just how they
            look.
          </p>
        </div>
      </section>

      <section className="about-contact" aria-labelledby="about-contact-title">
        <p className="eyebrow">Currently</p>
        <h2 id="about-contact-title">In Bengaluru and available for work.</h2>
        <div>
          <a href="mailto:madebytanishk@gmail.com">madebytanishk@gmail.com ↗</a>
          <Link href="/">See selected work →</Link>
          <Link href="/resume">Résumé →</Link>
        </div>
      </section>
    </main>
  );
}
