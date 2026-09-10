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
  twitter: {
    card: "summary_large_image",
    creator: "@madebytanishk",
    title: "Contact — Tanishk",
    description,
    images: ["/og.png"],
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
      </header>

      <p className="contact-note">
        Complex states, software making decisions, or a research question that
        needs code: those are the problems I like working on.
      </p>

      <p className="contact-sign">
        <a href="mailto:madebytanishk@gmail.com">madebytanishk@gmail.com</a>
        <a
          href="https://twitter.com/madebytanishk"
          target="_blank"
          rel="noreferrer"
          aria-label="Open @madebytanishk on X in a new tab"
        >
          @madebytanishk ↗
        </a>
      </p>

      <div className="contact-return" data-reveal>
        <Link href="/">← Return to selected work</Link>
      </div>
    </main>
  );
}
