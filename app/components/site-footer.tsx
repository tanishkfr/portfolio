"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { modeHref } from "./mode";
import { SignalField } from "./signal-field";

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
        {/* The playful corner of the material system: a sparse field
            that drifts around the compressed name and answers the
            pointer. It never carries information and only runs while
            the footer is on screen. */}
        <SignalField
          className="footer-field"
          glyphs="·:+*#"
          cell={13}
          seed={77}
          ambient={0.5}
          flow={2}
          wavefront={0.12}
          pointerRadius={7}
          quiet={[{ x: 0.68, y: 0.12, w: 0.32, h: 0.66, falloff: 0.9, feather: 0.02 }]}
          color={(t) =>
            t >= 0.94
              ? "rgba(58, 31, 240, 0.32)"
              : `rgba(27, 33, 38, ${0.07 + 0.22 * t})`
          }
        />
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
        <Link href={modeHref("full")}>Projects</Link>
        <Link href={modeHref("review")}>Quick view</Link>
        <Link href="/about">About</Link>
      </nav>

      <p className="footer-state">
        © {year} Tanishk · designed and built in-house
      </p>
    </footer>
  );
}
