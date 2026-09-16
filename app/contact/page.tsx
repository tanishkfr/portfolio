import type { Metadata } from "next";
import Link from "next/link";
import { PageSignal } from "../components/page-signal";

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
    <main id="main-content" className="contact-shell">
      {/* The page signal holds the open right side of the top region;
          every word of the letter sits in its quiet zone. */}
      <PageSignal variant="contact" />
      <header className="contact-intro" data-reveal>
        <h1>You bring the problem. I&apos;ll design how it behaves.</h1>
        <p className="contact-body">
          I&apos;m a product and interaction designer in Bengaluru. I design
          and build interfaces — product work, working prototypes, and
          research-through-making.
        </p>
        <p className="contact-body">
          Useful conversations: confusing states, software that decides things
          on its own, flows nobody can explain, or a question worth building an
          answer for.
        </p>
        <p className="contact-sign">
          <a href="mailto:madebytanishk@gmail.com">madebytanishk@gmail.com</a>
        </p>
      </header>

      <p className="contact-links">
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
        <Link href="/">← Back to projects</Link>
      </div>
    </main>
  );
}
