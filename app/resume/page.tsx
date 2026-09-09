import type { Metadata } from "next";
import Link from "next/link";
import { PrintResume } from "../components/print-resume";

const description =
  "Résumé — Tanishk, interaction designer in Bangalore. Available for work.";

export const metadata: Metadata = {
  title: "Résumé",
  description,
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return (
    <main id="main-content" className="resume-shell">
      <header className="resume-intro">
        <p className="resume-kicker">Résumé · Bangalore · Available for work</p>
        <h1>Tanishk</h1>
        <p>
          Interaction designer. I architect, design, write, and implement
          systems where the difficult part is not the screen — it is what the
          system decides, remembers, explains, or lets a person change.
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
            <strong>Atlas</strong> — reasoning instrument. A rule earns
            authority by surviving unlike cases.
          </li>
        </ul>
      </section>

      <section>
        <h2>Practice</h2>
        <p>
          Interaction systems, product thinking, research through making.
          Based in Bangalore.
        </p>
      </section>

      <p className="resume-back">
        <Link href="/#work">← Selected work</Link>
        <Link href="/about">About</Link>
      </p>
    </main>
  );
}
