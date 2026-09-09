import type { Metadata } from "next";
import Link from "next/link";

const description = "Contact Tanishk for interaction design opportunities.";

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
        <h1>
          Bring me the interaction nobody has made{" "}
          <span className="xp-close-strike" aria-hidden="true">
            pretty
          </span>{" "}
          clear yet.
        </h1>
        <p>
          I am based in Bangalore and open to interaction design, product
          design, research-through-design, and prototyping opportunities.
        </p>
      </header>

      <p className="contact-note">
        I am most useful when the{" "}
        <em>behavior is the hard part</em>
        — complex state, AI authority, a research question that needs a working
        artifact.
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
        <Link href="/#work">← Return to selected work</Link>
      </div>
    </main>
  );
}
