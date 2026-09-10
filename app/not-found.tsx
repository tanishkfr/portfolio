import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main id="main-content" className="not-found-shell">
      <p className="eyebrow">404 · Nothing here</p>
      <h1>This page does not exist.</h1>
      <p>
        The address is wrong, or the page has moved. The work is still on the
        home page.
      </p>
      <div className="not-found-actions">
        <Link href="/">See selected work →</Link>
        <Link href="/contact">Contact Tanishk →</Link>
      </div>
    </main>
  );
}
