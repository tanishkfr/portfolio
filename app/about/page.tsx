import type { Metadata } from "next";
import Link from "next/link";

const description =
  "About Tanishk, an interaction designer based in Bangalore. Fluxion Studios, independent studies, and product work.";

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

const influences = [
  {
    from: "Formula 1",
    lesson: "A car at 300kph tells the driver everything with almost no interface.",
  },
  {
    from: "Architecture",
    lesson: "You understand a building by moving through it, not from a photograph.",
  },
  {
    from: "Film",
    lesson: "A cut decides what you feel. Nothing on screen changed — only when you were allowed to see it.",
  },
  {
    from: "Printed books",
    lesson: "A page has no hover states. It still knows where your eye goes next.",
  },
];

export default function AboutPage() {
  return (
    <main id="main-content" className="about-shell">
      <header className="about-intro" data-reveal>
        <p className="eyebrow">About · Bangalore · available for work</p>
        <h1>Tanishk.</h1>
        <p className="about-role">
          Interaction designer. I design and build how products behave — the
          states, the timing, the parts people only notice when they go wrong.
        </p>
      </header>

      <div className="about-layout">
        <aside className="about-margin" aria-label="Practice facts">
          <dl className="about-facts">
            <div>
              <dt>Studio</dt>
              <dd>Fluxion Studios · co-founder</dd>
            </div>
            <div>
              <dt>Product</dt>
              <dd>Daynero · case study coming soon</dd>
            </div>
            <div>
              <dt>Independent</dt>
              <dd>Four working interaction studies</dd>
            </div>
            <div>
              <dt>Based</dt>
              <dd>Bangalore</dd>
            </div>
          </dl>
        </aside>

        <div className="about-letter">
          <p>
            I grew up caring about how things feel when you use them: cars,
            buildings, cuts in a film, the way a page is set. That curiosity
            turned into a practice that sits between design and engineering.
          </p>
          <p>
            Most of my time is spent on interfaces where the hard part is not
            the layout. It is what the system decides, remembers, explains, or
            lets someone change. I like projects where I can follow a question
            all the way through — writing, interaction, and the code that
            makes it run.
          </p>

          <h2>Currently</h2>
          <p>
            I co-founded Fluxion Studios with Shreyas. We design and build
            websites for businesses that already have a point of view. I also
            designed and built Daynero, an AI-native finance app, in a
            commercial startup context; the full case is still being written.
            Alongside that I keep four independent studies live — Design or
            Disaster, Pentimento, Invisible Interfaces, and Atlas — so the
            research can be used, not only described.
          </p>

          <h2>How I like to work</h2>
          <p>
            I am most useful when the brief is messy state, a product that
            acts for someone, or a question that needs a working prototype. I
            sketch, argue, build, and ship. AI helps me think and iterate; the
            concepts, the design decisions, and what ships are mine.
          </p>

          <h2>Outside interfaces</h2>
          <ul className="about-borrow">
            {influences.map((item) => (
              <li key={item.from}>
                <strong>{item.from}</strong>
                <span>{item.lesson}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className="about-contact" aria-labelledby="about-contact-title" data-reveal>
        <p className="eyebrow">Reach me</p>
        <h2 id="about-contact-title">In Bangalore, and available.</h2>
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
