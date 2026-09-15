"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignalField, type Quiet } from "./signal-field";

/**
 * The global footer is the folio resolving: the name returns in its
 * compressed notation state, the signal rule closes the page, and the
 * real destinations sit in a clear hierarchy.
 *
 * On the homepage WorkIndex renders this footer with `force`, directly
 * after Explore's narrative close: the close states the argument, the
 * footer carries every address and destination, and the page ends once.
 */

/* The footer's quiet zones: the compressed name, the note, the email
   address, the links and the record line stay crisp over the material.
   The plate is short, so the zones hug the text boxes and the signal
   lives in the open quadrants between them. */
const FOOTER_QUIET: Quiet[] = [
  { x: 0, y: 0.06, w: 0.3, h: 0.26, falloff: 0.92, feather: 0.03 },
  { x: 0.68, y: 0.08, w: 0.32, h: 0.24, falloff: 0.9, feather: 0.03 },
  { x: 0, y: 0.38, w: 0.38, h: 0.24, falloff: 0.95, feather: 0.03 },
  { x: 0, y: 0.66, w: 0.62, h: 0.16, falloff: 0.96, feather: 0.03 },
  { x: 0, y: 0.82, w: 0.55, h: 0.18, falloff: 1, feather: 0.02 },
];

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
      {/* The cover's material, returned at the other end of the site.
          The same hierarchy: sparse ultramarine pixel signal dispersing
          toward the boundaries, a faint glyph texture beneath it, and
          every real destination crisp over the quiet zones. The hero
          assembled the signal; this is it letting go. */}
      <SignalField
        className="footer-field"
        glyphs="·:+*#"
        cell={13}
        seed={77}
        ambient={0.3}
        flow={1.6}
        wavefront={0.07}
        drift={0.35}
        pointerRadius={0}
        tune={[0.48, 1.9]}
        quiet={FOOTER_QUIET}
        shape={(v, nx) => v * (0.55 + 0.7 * Math.abs(nx - 0.5) * 2)}
        color={(t) => `rgba(27, 33, 38, ${0.06 + 0.17 * t})`}
      />
      <SignalField
        className="footer-pixels"
        mode="pixel"
        cell={20}
        seed={83}
        ambient={0.66}
        flow={1.2}
        wavefront={0.09}
        drift={0.5}
        pointerRadius={9}
        tune={[0.4, 2.1]}
        quiet={FOOTER_QUIET}
        shape={(v, nx, ny, t) => {
          /* the end state of the hero's clusters: the matter drifts
             apart toward the outer margins and the gaps between the
             footer's rows */
          const edge = Math.pow(Math.abs(nx - 0.5) * 2, 1.5);
          const leave = 0.62 + 0.75 * Math.pow(ny, 1.1);
          const driftA = Math.exp(
            -Math.pow((nx - 0.5 - 0.03 * Math.sin(t * 0.12)) * 4, 2) -
              Math.pow((ny - 0.12) * 3.6, 2),
          );
          const driftB = Math.exp(
            -Math.pow((nx - 0.85) * 4.5, 2) -
              Math.pow((ny - 0.45) * 3.4, 2),
          );
          const driftC = Math.exp(
            -Math.pow((nx - 0.3) * 4.5, 2) -
              Math.pow((ny - 0.62 - 0.03 * Math.sin(t * 0.1 + 3)) * 4.5, 2),
          );
          return v *
            (0.35 + 0.7 * edge + 1.2 * driftA + 1.3 * driftB + 1.1 * driftC) *
            leave;
        }}
        color={(t) => `rgba(58, 31, 240, ${0.18 + 0.52 * t})`}
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
        <Link href="/#work">Projects</Link>
        <Link href="/about">About</Link>
      </nav>

      <p className="footer-state">
        © {year} Tanishk · designed and built in-house
      </p>
    </footer>
  );
}
