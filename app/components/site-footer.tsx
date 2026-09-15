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
      {/* The folio's closing material: the signal settles back into the
          system across the whole plate — denser and broader than any page
          surface, with ultramarine peaks where the field is densest — and
          every real destination stays crisp over its quiet zones. */}
      <SignalField
        className="footer-field"
        glyphs="·:+*#"
        cell={11}
        seed={77}
        ambient={0.7}
        flow={2.4}
        wavefront={0.15}
        drift={0.55}
        pointerRadius={9}
        tune={[0.34, 2.2]}
        quiet={[
          /* the compressed name and the note keep their air */
          { x: 0, y: 0, w: 0.56, h: 0.3, falloff: 0.93, feather: 0.04 },
          { x: 0.62, y: 0.02, w: 0.38, h: 0.24, falloff: 0.9, feather: 0.03 },
          /* the address, the links and the record line stay clean */
          { x: 0, y: 0.32, w: 1, h: 0.17, falloff: 0.95, feather: 0.03 },
          { x: 0, y: 0.55, w: 0.85, h: 0.22, falloff: 0.96, feather: 0.03 },
          { x: 0, y: 0.87, w: 1, h: 0.13, falloff: 1, feather: 0.02 },
        ]}
        shape={(v, nx, ny) =>
          /* arriving from the top edge — the page's matter pools where
             the folio ends, then thins as it approaches the record line */
          v * (0.45 + 1.3 * Math.pow(1 - ny, 1.2))
        }
        color={(t) =>
          t >= 0.92
            ? "rgba(58, 31, 240, 0.4)"
            : `rgba(27, 33, 38, ${0.09 + 0.3 * t})`
        }
      />
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
