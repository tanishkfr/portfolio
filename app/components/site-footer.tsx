"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

/* The footer's quiet zones, measured against the plate at width: the
   compressed name, the note, the email row, the links row and the
   record line stay crisp; the signal holds the open top band, the
   centre gap and the lower-right corner. */
const FOOTER_QUIET: Quiet[] = [
  { x: 0.02, y: 0.16, w: 0.24, h: 0.26, falloff: 0.95, feather: 0.035 },
  { x: 0.76, y: 0.28, w: 0.24, h: 0.18, falloff: 0.95, feather: 0.03 },
  /* the email, links and record text all sit left; their boxes' right
     halves stay open for the signal */
  { x: 0, y: 0.44, w: 0.56, h: 0.22, falloff: 0.96, feather: 0.03 },
  { x: 0, y: 0.7, w: 0.56, h: 0.28, falloff: 0.97, feather: 0.03 },
];

/* Stacked, the footer's text owns nearly the full width — the signal
   keeps only the quiet band above the name. */
const FOOTER_QUIET_NARROW: Quiet[] = [
  { x: 0, y: 0.2, w: 1, h: 0.8, falloff: 1, feather: 0.03 },
  { x: 0.5, y: 0, w: 0.5, h: 0.2, falloff: 0.95, feather: 0.05 },
];

export function SiteFooter({
  year,
  force = false,
}: {
  year: number;
  force?: boolean;
}) {
  const pathname = usePathname();
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 52rem)");
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!force && pathname === "/") return null;

  const quiet = narrow ? FOOTER_QUIET_NARROW : FOOTER_QUIET;

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
        ambient={0.22}
        flow={0.6}
        wavefront={0.03}
        drift={0.15}
        pointerRadius={0}
        tune={[0.48, 1.9]}
        quiet={quiet}
        shape={(v, nx) => v * (0.55 + 0.7 * Math.abs(nx - 0.5) * 2)}
        color={(t) => `rgba(27, 33, 38, ${0.06 + 0.15 * t})`}
      />
      <SignalField
        className="footer-pixels"
        mode="pixel"
        cell={20}
        seed={83}
        ambient={0.42}
        flow={0.35}
        wavefront={0}
        drift={0.15}
        pointerRadius={0}
        tune={[0.4, 2.1]}
        quiet={quiet}
        /* The close settles rather than performs: the same clusters as the
           hero, held still. Only the shared ambient breath moves, so the
           motion arc ends quiet instead of running a second animation. */
        shape={(v, nx, ny) => {
          const hash = Math.sin(nx * 619.7 + ny * 311.3) * 43758.5453;
          const grain = 0.7 + 0.55 * (hash - Math.floor(hash));
          const clusterTC = Math.exp(
            -Math.pow((nx - 0.5) * 4, 2) - Math.pow((ny - 0.12) * 3.6, 2),
          );
          const clusterBR = Math.exp(
            -Math.pow((nx - 0.85) * 4, 2) - Math.pow((ny - 0.56) * 3.2, 2),
          );
          const leave = Math.exp(
            -Math.pow((ny - 0.94) * 8, 2) - Math.pow((nx - 0.78) * 3, 2),
          );
          const texture = v * 0.8;
          return Math.max(
            texture,
            clusterTC * 0.75 * grain,
            clusterBR * 0.8 * grain,
            leave * 0.7 * grain,
          );
        }}
        color={(t) => `rgba(58, 31, 240, ${0.16 + 0.46 * t})`}
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
        <a
          href="https://github.com/tanishkfr/ariadne"
          target="_blank"
          rel="noreferrer"
        >
          Ariadne <span aria-hidden="true">↗</span>
        </a>
        <a href="https://github.com/tanishkfr" target="_blank" rel="noreferrer">
          GitHub <span aria-hidden="true">↗</span>
        </a>
        <Link href="/#work">Projects</Link>
        <Link href="/quick-review">Quick review</Link>
        <Link href="/about">About</Link>
      </nav>

      <p className="footer-state">
        © {year} Tanishk · designed and built in-house
      </p>
    </footer>
  );
}
