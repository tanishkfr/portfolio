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
        <h1>Have something worth building?</h1>
        <p className="contact-body">
          I&apos;m a product and interaction designer in Bengaluru. I work
          across product design, interaction design, prototypes, and design
          that gets built.
        </p>
      </header>

      <div className="contact-paths" data-reveal>
        <section>
          <h2>For roles and collaboration</h2>
          <p>Product design · interaction design · prototypes · design + implementation</p>
          <a className="contact-primary" href="mailto:madebytanishk@gmail.com">
            madebytanishk@gmail.com
          </a>
        </section>
        <section>
          <h2>For client websites</h2>
          <p>
            Fluxion Studios is the two-person studio I co-founded for small
            businesses in Bengaluru.
          </p>
          <a
            className="contact-primary"
            href="https://fluxion-studios.vercel.app/"
            target="_blank"
            rel="noreferrer"
            data-external="true"
          >
            Fluxion Studios <span aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </section>
      </div>

      <p className="contact-availability">
        Bengaluru, India · open to product, UI/UX, and interaction design roles.
      </p>

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
