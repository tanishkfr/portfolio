import type { Metadata } from "next";
import Link from "next/link";
import { LookUnder } from "../components/look-under";

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

const capabilities = [
  {
    number: "01",
    title: "States and edge cases",
    body: "I map what can happen, what the interface needs to explain, and how someone can undo or recover.",
  },
  {
    number: "02",
    title: "Product and interface",
    body: "I work from the product premise and content through interaction, visual design, and a working frontend.",
  },
  {
    number: "03",
    title: "Working research",
    body: "When a question is too abstract, I build the interaction and find out where the idea stops making sense.",
  },
  {
    number: "04",
    title: "AI-assisted making",
    body: "I like using AI to open up design directions, test interface ideas, and move from a rough interaction to working frontend code faster.",
  },
];

export default function AboutPage() {
  return (
    <main id="main-content" className="about-shell">
      <header className="about-intro" data-reveal>
        <p className="eyebrow">About · Bengaluru · Available for work</p>
        <h1>I design interactions, then build the working version.</h1>
        <div className="about-lede">
          <p>
            I&apos;m Tanishk, an interaction designer in Bengaluru. I study
            Human-Centred Design at Srishti, design and build products, and
            co-run Fluxion Studios with Shreyas.
          </p>
          <p>
            My independent projects usually start with an interface behaviour
            I cannot stop thinking about: a critique with no evidence,
            software writing about a person, work that continues after someone
            leaves, or a rule that fails outside its original case. I build the
            interaction to see whether the idea survives.
          </p>
        </div>
        <LookUnder
          className="about-under"
          label="A little more about how I work"
          rest={0}
          surface={
            <div className="about-under-copy about-under-copy--profile">
              <span>On paper</span>
              <div>
                <p>Interaction designer · frontend builder · HCD student</p>
                <small>Bengaluru · Fluxion co-founder · available for work</small>
              </div>
            </div>
          }
          under={
            <div className="about-under-copy about-under-copy--practice">
              <span>In practice</span>
              <div>
                <p>
                  I move between product questions, interface detail, and code.
                  AI helps me explore wider and build faster; Formula 1,
                  buildings, films, and games keep the references from getting narrow.
                </p>
                <small>The tools can widen the search. I still make—and own—the decisions.</small>
              </div>
            </div>
          }
        />
        <dl className="about-facts" aria-label="Practice facts">
          <div>
            <dt>Studio</dt>
            <dd>Fluxion Studios · co-founder</dd>
          </div>
          <div>
            <dt>Product</dt>
            <dd>Daynero · case study coming soon</dd>
          </div>
          <div>
            <dt>Independent work</dt>
            <dd>Four working interaction projects</dd>
          </div>
          <div>
            <dt>Range</dt>
            <dd>Product framing · interaction design · frontend</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>Bengaluru · Available for work</dd>
          </div>
        </dl>
      </header>

      <section className="capability-section" aria-labelledby="capability-title" data-reveal>
        <p className="eyebrow">What I bring to a team</p>
        <h2 id="capability-title">What I can take on.</h2>
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
          <h2 id="principle-title">Four rules I keep using.</h2>
        </div>
        <div className="principle-list">
          <article data-reveal>
            <h3>Show the decision.</h3>
            <p>If software interprets or recommends something, a person should be able to see enough to question it.</p>
          </article>
          <article data-reveal>
            <h3>Make correction a real path.</h3>
            <p>Undo, refusal, and recovery should change the result, not sit in a note beside it.</p>
          </article>
          <article data-reveal>
            <h3>Let the interaction do the explaining.</h3>
            <p>I build the central idea into the behaviour before I write the case study around it.</p>
          </article>
          <article data-reveal>
            <h3>Say what the evidence cannot prove.</h3>
            <p>A working prototype shows that the interaction can run. Claims about people have to wait for research.</p>
          </article>
        </div>
      </section>

      <section className="authorship-section" aria-labelledby="authorship-title" data-reveal>
        <p className="eyebrow">Authorship and context</p>
        <h2 id="authorship-title">What I actually did.</h2>
        <div>
          <p>
            I co-founded Fluxion and designed and built its public site with
            Shreyas. For Daynero, I designed and built the app experience and
            public website. Its full case study is still being documented.
          </p>
          <p>
            The four independent projects are mine from concept through code.
            I like working with AI, especially where interaction design meets
            frontend. I use it to explore directions, pressure-test behaviour,
            find useful references, and get from a rough prototype to working
            code faster. I choose what is worth making, direct the visual and
            interaction decisions, edit the writing, and own what ships.
          </p>
        </div>
      </section>

      <section className="about-contact" aria-labelledby="about-contact-title" data-reveal>
        <p className="eyebrow">Currently</p>
        <h2 id="about-contact-title">In Bengaluru and available for work.</h2>
        <div>
          <a href="mailto:madebytanishk@gmail.com">madebytanishk@gmail.com ↗</a>
          <a href="https://twitter.com/madebytanishk" target="_blank" rel="noreferrer">
            @madebytanishk ↗<span className="sr-only"> (opens in a new tab)</span>
          </a>
          <Link href="/">See selected work →</Link>
        </div>
      </section>
    </main>
  );
}
