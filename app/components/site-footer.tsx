"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Quick Review carries its own ending. Every other route gets this footer.
 */
export function SiteFooter({ year }: { year: number }) {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <footer className="site-footer">
      <div className="footer-identity">
        <strong>Tanishk</strong>
        <span>Interaction Designer · Bangalore</span>
      </div>
      <div className="footer-links">
        <a href="mailto:madebytanishk@gmail.com">Email</a>
        <a
          href="https://twitter.com/madebytanishk"
          target="_blank"
          rel="noreferrer"
        >
          X / Twitter <span aria-hidden="true">↗</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <Link href="/">Work</Link>
      </div>
      <p>© {year} Tanishk</p>
    </footer>
  );
}
