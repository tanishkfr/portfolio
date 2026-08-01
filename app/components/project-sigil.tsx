import type { CSSProperties } from "react";
import type { Project } from "../data/portfolio";
import type { ExposurePhase } from "../data/project-signals";

/**
 * Five living sigils — one per project, each the project's argument
 * in miniature. Every sigil has three states matching the reading
 * phases (surface, rule, consequence). Elements carry ph-s / ph-r /
 * ph-c classes declaring the phases in which they exist; the CSS
 * system transitions between states.
 *
 * daynero    — a ring of day-ticks; guidance thickens around the day.
 * invisible  — two frames; the work happens in the gap between them.
 * disaster   — a screen on a grid; a pin lands, five readings gather.
 * pentimento — machine lines; one is struck; a sovereign line leads.
 * atlas      — one rule-line that bends and forks under its cases.
 */

type SigilStyle = CSSProperties & { "--sig-accent": string };

function DayneroSigil() {
  // fixed precision keeps server and client markup identical
  const r = (value: number) => Math.round(value * 100) / 100;
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const x1 = r(60 + Math.cos(angle) * 22);
    const y1 = r(34 + Math.sin(angle) * 22);
    const x2 = r(60 + Math.cos(angle) * 26);
    const y2 = r(34 + Math.sin(angle) * 26);
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
  });
  return (
    <>
      <g className="base" stroke="currentColor" strokeWidth="1.4" opacity="0.55">
        {ticks}
      </g>
      {/* surface: today, a single held moment */}
      <circle className="ph ph-s ph-r ph-c acc" cx="60" cy="8" r="3.4" fill="currentColor" />
      {/* rule: guidance bends around behavior — an arc thickens */}
      <path
        className="ph ph-r ph-c acc"
        d="M 78.4 15.6 A 26 26 0 0 1 86 34"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      {/* consequence: the next choice, already reachable */}
      <circle
        className="ph ph-c acc"
        cx="86"
        cy="34"
        r="5.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </>
  );
}

function InvisibleSigil() {
  return (
    <>
      {/* the screen you leave */}
      <rect
        className="base"
        x="6"
        y="16"
        width="34"
        height="36"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      {/* surface: attention held inside the first frame */}
      <circle className="ph ph-s" cx="23" cy="34" r="4" fill="currentColor" />
      {/* rule: progress exists only in the gap between frames */}
      <g className="ph ph-r ph-c acc" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        <line x1="48" y1="34" x2="54" y2="34" />
        <line x1="60" y1="34" x2="66" y2="34" />
      </g>
      {/* the screen you return to */}
      <rect
        className="base"
        x="80"
        y="16"
        width="34"
        height="36"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      {/* consequence: the receipt inside the returned frame */}
      <g className="ph ph-c acc" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="87" y1="28" x2="107" y2="28" />
        <line x1="87" y1="35" x2="101" y2="35" />
        <line x1="87" y1="42" x2="104" y2="42" />
      </g>
    </>
  );
}

function DisasterSigil() {
  return (
    <>
      {/* the interface under critique */}
      <g className="base" stroke="currentColor" strokeWidth="1.2" opacity="0.5">
        <line x1="10" y1="22" x2="110" y2="22" />
        <line x1="10" y1="34" x2="110" y2="34" />
        <line x1="10" y1="46" x2="110" y2="46" />
        <line x1="40" y1="12" x2="40" y2="56" />
        <line x1="75" y1="12" x2="75" y2="56" />
      </g>
      <rect
        className="base"
        x="10"
        y="12"
        width="100"
        height="44"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      {/* rule: the mark lands before any verdict */}
      <g className="ph ph-r ph-c acc" stroke="currentColor" strokeWidth="1.8">
        <circle cx="57" cy="34" r="6.5" fill="none" />
        <line x1="57" y1="24" x2="57" y2="29" />
        <line x1="57" y1="39" x2="57" y2="44" />
        <line x1="47" y1="34" x2="52" y2="34" />
        <line x1="62" y1="34" x2="67" y2="34" />
      </g>
      {/* consequence: five incompatible readings, no winner */}
      <g className="ph ph-c" fill="currentColor">
        <circle cx="24" cy="26" r="2.4" />
        <circle cx="90" cy="18" r="2.4" />
        <circle cx="100" cy="42" r="2.4" />
        <circle cx="30" cy="50" r="2.4" />
        <circle cx="70" cy="50" r="2.4" />
      </g>
    </>
  );
}

function PentimentoSigil() {
  return (
    <>
      {/* the machine's account */}
      <g className="base" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.8">
        <line x1="12" y1="26" x2="96" y2="26" />
        <line x1="12" y1="38" x2="108" y2="38" />
        <line x1="12" y1="50" x2="84" y2="50" />
      </g>
      {/* rule: the strike — drawn, not deleted */}
      <line
        className="ph ph-r ph-c draw acc"
        x1="8"
        y1="42"
        x2="112"
        y2="34"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* consequence: the sovereign line takes the lead */}
      <line
        className="ph ph-c acc"
        x1="12"
        y1="12"
        x2="102"
        y2="12"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
    </>
  );
}

function AtlasSigil() {
  return (
    <>
      {/* surface: the finished sentence — one straight rule */}
      <line
        className="base"
        x1="8"
        y1="34"
        x2="46"
        y2="34"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle className="base" cx="8" cy="34" r="3" fill="currentColor" />
      {/* rule: the case that bends it */}
      <circle
        className="ph ph-r ph-c acc"
        cx="46"
        cy="34"
        r="4.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        className="ph ph-r ph-c draw"
        d="M 46 34 L 76 22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* consequence: the fork is kept; the old path stays legible */}
      <path
        className="ph ph-c draw"
        d="M 46 34 L 76 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="3 5"
        strokeLinecap="round"
      />
      <path
        className="ph ph-c draw acc"
        d="M 76 22 L 108 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle className="ph ph-c acc" cx="108" cy="16" r="3.2" fill="currentColor" />
    </>
  );
}

const marks: Record<Project["artifact"], () => React.ReactNode> = {
  daynero: DayneroSigil,
  invisible: InvisibleSigil,
  disaster: DisasterSigil,
  pentimento: PentimentoSigil,
  atlas: AtlasSigil,
};

const accents: Record<Project["artifact"], string> = {
  daynero: "var(--accent-daynero-ink)",
  invisible: "var(--accent-invisible-ink)",
  disaster: "var(--accent-disaster)",
  pentimento: "var(--accent-pentimento)",
  atlas: "var(--accent-atlas)",
};

export function ProjectSigil({
  artifact,
  phase = "consequence",
}: {
  artifact: Project["artifact"];
  phase?: ExposurePhase;
}) {
  const Mark = marks[artifact];
  return (
    <svg
      className={`sigil sigil-${artifact}`}
      viewBox="0 0 120 68"
      xmlns="http://www.w3.org/2000/svg"
      data-phase={phase}
      aria-hidden="true"
      focusable="false"
      style={{ "--sig-accent": accents[artifact] } as SigilStyle}
    >
      <Mark />
    </svg>
  );
}

/**
 * The case-page plate: the project's sigil in its complete
 * (consequence) state, captioned as the record it is.
 */
export function SignaturePlate({
  artifact,
  focus,
}: {
  artifact: Project["artifact"];
  focus: string;
}) {
  return (
    <figure className={`signature-plate signature-${artifact}`} aria-label={`${focus} sigil`}>
      <ProjectSigil artifact={artifact} phase="consequence" />
      <figcaption>
        <span>Interaction signature</span>
        <strong>{focus}</strong>
      </figcaption>
    </figure>
  );
}
