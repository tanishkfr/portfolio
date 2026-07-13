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
    <main id="main-content" className="contact-shell">
      <header className="contact-intro">
        <p className="eyebrow">Contact · Available for work</p>
        <h1>Have a difficult interaction problem?</h1>
        <p>
          I am based in Bangalore and open to interaction design, product
          design, research-through-design, and prototyping opportunities.
        </p>
      </header>

      <section className="contact-options" aria-label="Contact options">
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
          aria-label="Open @madebytanishk on Twitter in a new tab"
        >
          <span className="contact-label">Twitter</span>
          <strong>@madebytanishk</strong>
          <span className="contact-action" aria-hidden="true">
            Open profile ↗
          </span>
        </a>
      </section>

      <div className="contact-return">
        <Link href="/#work">← Return to selected work</Link>
      </div>
    </main>
  );
}
