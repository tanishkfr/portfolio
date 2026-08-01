import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main id="main-content" className="not-found-shell">
      <p className="eyebrow">404 · No record at this address</p>
      <h1>This address carries no record.</h1>
      <p>
        Nothing was ever filed here, or the file has moved. The five systems
        under examination are still exactly where they were.
      </p>
      <div className="not-found-actions">
        <Link href="/#work">Return to the examination →</Link>
        <Link href="/contact">Contact Tanishk →</Link>
      </div>
    </main>
  );
}
