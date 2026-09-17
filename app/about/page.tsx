import type { Metadata } from "next";
import Link from "next/link";
import { PageSignal } from "../components/page-signal";

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
    status: "shipping",
    body: "I'm the product designer at Daynero, a five-person team building a personal-finance product for first-paycheck earners in India. I own design across the app and the public website, working directly with product and engineering; the case study here is a preview until the full record can be published.",
  },
  {
    lead: "Fluxion Studios — the studio I co-founded.",
    status: "building",
    body: "I co-run a two-person studio for small businesses in Bengaluru. I scope and price the work, design it, and build it — our own site and Taamboolam's live hospitality site both went from first conversation to deployed without a handoff.",
  },
  {
    lead: "Independent interaction research.",
    status: "in progress",
    body: "Design or Disaster, Pentimento, Invisible Interfaces, and Atlas are mine from question through code. Each one began with an interface behaviour I kept thinking about, and each ends as a working artifact rather than a write-up.",
  },
  {
    lead: "Ariadne — the system under my AI workflow.",
    status: "maintaining",
    body: "Ariadne is the tool I built and still maintain for software work done with AI. It splits a job into roles, checks each step with tests and evidence before accepting it, retries what fails, and keeps a record so a release can be validated or rolled back. It is released through v1.6.7 and public on GitHub — a working system, not a demo.",
  },
];

export default function AboutPage() {
  return (
    <main id="main-content" className="about-shell">
      <header className="about-intro">
        <PageSignal variant="about" />
        <p className="eyebrow">About · Bengaluru · Available for work</p>
        <h1>From Pixels to Products.</h1>
        <div className="about-lede">
          <p>
            I&apos;m Tanishk — a product and interaction designer in Bengaluru. I
            move between research, interface behaviour, prototypes and working
            code; the part I care about is what an interface does once someone
            is actually using it. I also build the tools my own work runs on,
            which is where most of my time with AI goes.
          </p>
          <p>
            I&apos;m studying for a B.Des in Human Centered Design at Srishti
            Manipal (2024–2028), I&apos;m the product designer at Daynero, and I
            co-run Fluxion Studios, a two-person practice that designs and ships
            for small businesses.
          </p>
        </div>
        {/* The facts, kept whole but read as workspace state rather than a
            résumé table: a small desk panel with a path, a status and the
            four things a reader would otherwise have to hunt for. */}
        <div className="about-console">
          <p className="about-console-bar">
            <span className="about-console-pip" aria-hidden="true" />
            <span className="about-console-path">~/tanishk</span>{" "}
            <span className="about-console-status">
              status: open to work
            </span>
          </p>
          <dl className="about-facts" aria-label="Tanishk at a glance">
            <div>
              <dt>based</dt>
              <dd>Bengaluru, India · 12.9716° N, 77.5946° E</dd>
            </div>
            <div>
              <dt>studying</dt>
              <dd>B.Des, Human Centered Design — Srishti Manipal (2024–2028)</dd>
            </div>
            <div>
              <dt>working</dt>
              <dd>
                product design at Daynero · Fluxion Studios (co-founder) ·
                independent interaction research
              </dd>
            </div>
            <div>
              <dt>open to</dt>
              <dd>product, UI/UX, and interaction design roles</dd>
            </div>
          </dl>
        </div>
      </header>

      <section className="about-current" aria-labelledby="current-title">
        <div className="about-practice-head">
          <p className="eyebrow">Currently making</p>
          <h2 id="current-title">Four things running right now.</h2>
        </div>
        <div className="current-list">
          {currentWork.map((item) => (
            <article key={item.lead}>
              <header className="current-head">
                <h3>{item.lead}</h3>
                <p className="current-status">{item.status}</p>
              </header>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-practice" aria-labelledby="practice-title">
        <div className="about-practice-head">
          <p className="eyebrow">How I design</p>
          <h2 id="practice-title">Three tests every idea has to pass.</h2>
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
        <p className="eyebrow">Working with AI</p>
        <h2 id="authorship-title">Where it sits in my process.</h2>
        <div>
          <p>
            I use AI deliberately. It helps me open up directions,
            pressure-test behaviour, and get from a rough prototype to working
            frontend code faster. I choose what is worth making, direct the
            visual and interaction decisions, edit the writing, and own what
            ships. For me that sits inside the practice rather than beside it:
            I design interfaces, products and research tools, and AI changes
            how those get designed and built.
          </p>
          <p>
            I stay close to the build: scope, pricing, and constraints are
            agreed before a project starts, and I&apos;d rather settle a
            question in the browser than argue it from a static mockup.
          </p>
          <p>
            Ownership is stated on every case: the four independent projects in
            Projects are mine end to end; Fluxion is a two-person practice;
            Daynero is commercial team work, and its full case is still being
            documented.
          </p>
          <p>
            Buildings, films, and games keep the references from getting
            narrow.
          </p>
        </div>
        {/* The desk itself, named once, outside the prose column so the
            four paragraphs keep their 2 x 2 rhythm. */}
        <p className="about-tools">
          <span className="about-tools-key">tools/</span>
          figma · framer · react · next.js · javascript · html/css · git ·
          ai-assisted development
        </p>
      </section>

      <section className="about-contact" aria-labelledby="about-contact-title">
        <p className="eyebrow">Currently</p>
        <h2 id="about-contact-title">In Bengaluru, and open to new product roles.</h2>
        <div>
          <a href="mailto:madebytanishk@gmail.com">madebytanishk@gmail.com ↗</a>
          <Link href="/">See selected work →</Link>
          <Link href="/resume">Résumé →</Link>
        </div>
      </section>
    </main>
  );
}
