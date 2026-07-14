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
    <main id="main-content" className="contact-shell contact-shell--alive">
      <header className="contact-intro" data-reveal>
        <p className="eyebrow">Contact · Available for work</p>
        <h1>Bring me the interaction nobody has made clear yet.</h1>
        <p>
          I am based in Bangalore and open to interaction design, product
          design, research-through-design, and prototyping opportunities.
        </p>
      </header>

      <section className="contact-brief" aria-labelledby="contact-brief-title" data-reveal>
        <p className="eyebrow">Useful reasons to reach out</p>
        <h2 id="contact-brief-title">I am most useful when the behavior is the hard part.</h2>
        <div>
          <span>Complex state and recovery</span>
          <span>AI authority and transparency</span>
          <span>Research questions that need a working artifact</span>
        </div>
      </section>

      <section className="contact-options" aria-label="Contact options" data-reveal>
        <a href="mailto:madebytanishk@gmail.com">
          <span className="contact-label">Email</span>
          <strong>madebytanishk@gmail.com</strong>
          <span className="contact-action" aria-hidden="true">
            Write to me ↗
          </span>
        </a>
        <a
          href="https://twitter.com/madebytanishk"
          target="_blank"
          rel="noreferrer"
          aria-label="Open @madebytanishk on X in a new tab"
        >
          <span className="contact-label">X / Twitter</span>
          <strong>@madebytanishk</strong>
          <span className="contact-action" aria-hidden="true">
            Open profile ↗
          </span>
        </a>
      </section>

      <div className="contact-return" data-reveal>
        <Link href="/#work">← Return to selected work</Link>
      </div>
    </main>
  );
}
