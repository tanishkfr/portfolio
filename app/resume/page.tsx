import type { Metadata } from "next";
import Link from "next/link";
import { PrintResume } from "../components/print-resume";

const description =
  "Résumé — Tanishk, interaction designer in Bengaluru. Available for work.";

export const metadata: Metadata = {
  title: "Résumé",
  description,
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return (
    <main id="main-content" className="resume-shell">
      <header className="resume-intro">
        <p className="resume-kicker">Résumé · Bengaluru · Available for work</p>
        <h1>Tanishk</h1>
        <p>
          Interaction designer studying Human-Centred Design at Srishti. I work
          from product framing and interaction design through frontend implementation.
        </p>
        <p className="resume-actions">
          <PrintResume />
          <a href="mailto:madebytanishk@gmail.com">madebytanishk@gmail.com</a>
        </p>
      </header>

      <section>
        <h2>Current</h2>
        <p>
          <strong>Daynero</strong> — AI-native personal finance. Designed and
          built the app experience and public website. Case study coming soon.
        </p>
      </section>

      <section>
        <h2>Studio</h2>
        <p>
          <strong>Fluxion Studios</strong> — co-founded with Shreyas. We design
          and build websites for businesses with a point of view.{" "}
          <a href="https://fluxion-studios.vercel.app/" target="_blank" rel="noreferrer">
            fluxion-studios.vercel.app
          </a>
        </p>
      </section>

      <section>
        <h2>Independent investigations</h2>
        <ul>
          <li>
            <strong>Design or Disaster</strong> — spatial critique archive.
            Judgment must identify its evidence.
          </li>
          <li>
            <strong>Pentimento</strong> — algorithmic autobiography. Human
            correction leads.
          </li>
          <li>
            <strong>Invisible Interfaces</strong> — delegated computing.
            Absence is the input; return produces a receipt.
          </li>
          <li>
            <strong>Atlas</strong> — reasoning instrument. One rule changes
            across three unlike cases.
          </li>
        </ul>
      </section>

      <section>
        <h2>Practice</h2>
        <p>
          Interaction design, product thinking, research through making, and
          frontend implementation. Based in Bengaluru.
        </p>
      </section>

      <p className="resume-back">
        <Link href="/">← Selected work</Link>
        <Link href="/about">About</Link>
      </p>
    </main>
  );
}
