import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main id="main-content" className="not-found-shell">
      <p className="eyebrow">404 · Outside the index</p>
      <h1>This address does not lead to a project.</h1>
      <p>
        The work is still here. Return to the complete index or get in touch.
      </p>
      <div className="not-found-actions">
        <Link href="/">Return to all work →</Link>
        <Link href="/contact">Contact Tanishk →</Link>
      </div>
    </main>
  );
}
