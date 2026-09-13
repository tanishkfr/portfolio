"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * The global footer is the folio resolving: the name returns in its
 * compressed notation state, the signal rule closes the page, and the
 * real destinations sit in a clear hierarchy.
 *
 * On the homepage WorkIndex renders this footer with `force`, directly
 * after Explore's narrative close: the close states the argument, the
 * footer carries every address and destination, and the page ends once.
 */
export function SiteFooter({
  year,
  force = false,
}: {
  year: number;
  force?: boolean;
}) {
  const pathname = usePathname();

  if (!force && pathname === "/") return null;

  return (
    <footer className="site-footer">
      <div className="footer-mast">
        <span className="footer-name" aria-hidden="true">
          Tanishk
        </span>
        <p className="footer-note">
          Product / Interaction Designer
          <br />
          Bengaluru · portfolio {year}
        </p>
      </div>

      <p className="footer-invite">
        <a href="mailto:madebytanishk@gmail.com">madebytanishk@gmail.com</a>
      </p>

      <nav className="footer-links" aria-label="Contact and navigation">
        <a
          href="/Tanishk_Salagame_Resume.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Résumé · PDF <span aria-hidden="true">↗</span>
        </a>
        <a
          href="https://www.linkedin.com/in/tanishksalagame/"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn <span aria-hidden="true">↗</span>
        </a>
        <a href="https://github.com/tanishkfr" target="_blank" rel="noreferrer">
          GitHub <span aria-hidden="true">↗</span>
        </a>
        <Link href="/">Explore</Link>
        <Link href="/?mode=review">Work</Link>
        <Link href="/about">About</Link>
      </nav>

      <p className="footer-state">
        © {year} Tanishk · designed and built in-house
      </p>
    </footer>
  );
}
