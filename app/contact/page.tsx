import type { Metadata } from "next";
import Link from "next/link";

const description = "Contact Tanishk about interaction and product design work.";

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/contact",
    siteName: "Tanishk — Interaction Designer",
    title: "Contact — Tanishk",
    description,
    images: [{ url: "/og.png", alt: "Contact Tanishk" }],
  },
};

export default function ContactPage() {
  return (
    <main id="main-content" className="contact-shell contact-letter">
      <header className="contact-intro" data-reveal>
        <h1>If the interaction is hard to explain, show me.</h1>
        <p>
          I&apos;m in Bengaluru and open to interaction and product design
          roles, plus prototyping and research-through-making projects.
        </p>
        <p className="contact-sign">
          <a href="mailto:madebytanishk@gmail.com">madebytanishk@gmail.com</a>
        </p>
      </header>

      <p className="contact-note">
        Complex states, software making decisions, or a research question that
        needs code: those are the problems I like working on.
        <a
          className="contact-social"
          href="https://www.linkedin.com/in/tanishksalagame/"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn ↗
        </a>
        <a
          className="contact-social"
          href="https://github.com/tanishkfr"
          target="_blank"
          rel="noreferrer"
        >
          GitHub ↗
        </a>
        <a
          className="contact-social"
          href="/Tanishk_Salagame_Resume.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Résumé · PDF ↗
        </a>
      </p>

      <div className="contact-return" data-reveal>
        <Link href="/">← Return to selected work</Link>
      </div>
    </main>
  );
}
