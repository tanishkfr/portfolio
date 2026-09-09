"use client";

import { useEffect, useRef } from "react";

/**
 * STAGE 2 — THE DESCENT (the "asks less / shows me less" beat).
 *
 * A pinned scene. As you scroll through it, one interface control sheds its
 * complexity era by era — you had to speak its language, then find a button,
 * then touch, then just ask, then nothing at all. His real observation frames
 * it, and the end lands on a blank that sends you back to looking under.
 *
 * Scroll drives a discrete `data-era` (crossfaded in CSS) plus a continuous
 * `--shed` for finer motion. The statements are real text; the control
 * sequence is decorative enhancement, so screen readers get the argument
 * either way.
 */

const ERAS: { control: React.ReactNode; said: string }[] = [
  {
    control: (
      <span className="xp-era-cmd">
        retrieve beach.jpg
        <i className="xp-caret" aria-hidden="true" />
      </span>
    ),
    said: "You had to speak its language.",
  },
  {
    control: <span className="xp-era-btn">Open</span>,
    said: "Then you just had to find the button.",
  },
  {
    control: <span className="xp-era-tap" />,
    said: "Then you reached out and touched it.",
  },
  {
    control: (
      <span className="xp-era-ask">
        find my photo
        <i className="xp-caret" aria-hidden="true" />
      </span>
    ),
    said: "Then you only had to ask.",
  },
  {
    control: <span className="xp-era-none" />,
    said: "Now it acts before you ask.",
  },
];

export function Descent() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;

    const measure = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      const p = total > 0 ? scrolled / total : 0;
      el.style.setProperty("--shed", p.toFixed(4));

      /* Each era owns a band of the scroll, so the control erodes continuously
         instead of cutting between five slides.

         Two things keep it legible. The weight plateaus at full opacity across
         most of its band and crosses over quickly, rather than fading linearly
         the whole way. And the offset is *signed* — eras already passed drift
         up and out, eras still coming wait below — so at the crossover the
         outgoing and incoming statements are never on the same line. Without
         that sign the two texts print on top of each other. */
      /* Centres span the whole range (0 … 1) rather than sitting inset inside
         five equal bands. Inset centres leave the first statement half-faded
         the moment you arrive, and the last one half-faded as you leave. */
      const band = 1 / (ERAS.length - 1);
      for (let i = 0; i < ERAS.length; i += 1) {
        const centre = i * band;
        const offset = (p - centre) / band;
        const weight = Math.min(1, Math.max(0, (1 - Math.abs(offset)) * 2.6 - 0.85));
        el.style.setProperty(`--e${i}`, weight.toFixed(4));
        el.style.setProperty(
          `--s${i}`,
          Math.min(1.5, Math.max(-1.5, offset)).toFixed(4),
        );
      }

      el.dataset.era = String(Math.min(ERAS.length - 1, Math.floor(p * ERAS.length)));
    };

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      className="xp-shed"
      ref={ref}
      data-stage
      data-era="0"
      aria-label="Every year, software asks less of us — and shows me less."
    >
      <div className="xp-shed-stage">
        <p className="xp-shed-lead">Every year, software asks less of us.</p>

        {/* The five statements are the argument, so they stay readable; only
            the control glyphs are decorative. The wrapper takes no box, so
            hiding the glyphs costs the layout nothing. */}
        <ol className="xp-shed-control">
          {ERAS.map((era, index) => (
            <li className={`xp-era xp-era-${index}`} key={index}>
              <span className="xp-era-glyph" aria-hidden="true">
                {era.control}
              </span>
              <p className="xp-era-said">{era.said}</p>
            </li>
          ))}
        </ol>

        <p className="xp-shed-turn">
          And every year, it shows me <em>less</em>.
        </p>
        <p className="xp-shed-look" aria-hidden="true">
          so the behaviour still has to be designed
        </p>
      </div>
    </section>
  );
}
