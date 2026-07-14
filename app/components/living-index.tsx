"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import { projects, type Project } from "../data/portfolio";
import {
  flagshipOrder,
  projectSignals,
  type ExposurePhase,
} from "../data/project-signals";
import { ProjectProof } from "./project-proof";

type InstrumentStyle = CSSProperties & {
  "--depth-position": string;
  "--rule-reveal": string;
  "--consequence-reveal": string;
  "--consequence-opacity": number;
};

const phases: Array<{
  id: ExposurePhase;
  depth: number;
  number: string;
  label: string;
  description: string;
  shell: string;
}> = [
  {
    id: "surface",
    depth: 0,
    number: "01",
    label: "Surface",
    description: "What each interface appears to be before its governing decision is exposed.",
    shell: "Five artifacts occupy one field. The portfolio is legible, but its terms are still hidden.",
  },
  {
    id: "rule",
    depth: 50,
    number: "02",
    label: "Rule",
    description: "The hidden decision that determines memory, authority, evidence, or accountability.",
    shell: "One axis now synchronizes five unlike systems. The housing is explaining its own organizing rule.",
  },
  {
    id: "consequence",
    depth: 100,
    number: "03",
    label: "Consequence",
    description: "What a person can inspect, contest, revise, or recover once that rule becomes visible.",
    shell: "The instrument has demonstrated the practice before a case study opens: surface, rule, consequence.",
  },
];

function phaseFor(depth: number): ExposurePhase {
  if (depth < 25) return "surface";
  if (depth < 75) return "rule";
  return "consequence";
}

function orderedProjects() {
  return flagshipOrder
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is Project => Boolean(project));
}

export function LivingIndex() {
  const [depth, setDepth] = useState(0);
  const phase = phaseFor(depth);
  const activePhase = phases.find((item) => item.id === phase) ?? phases[0];
  const ordered = useMemo(() => orderedProjects(), []);
  const ruleReveal = Math.min(depth * 2, 100);
  const consequenceReveal = Math.max((depth - 50) * 2, 0);
  const consequenceOpacity = consequenceReveal / 100;
  const style: InstrumentStyle = {
    "--depth-position": `${depth}%`,
    "--rule-reveal": `${ruleReveal}%`,
    "--consequence-reveal": `${consequenceReveal}%`,
    "--consequence-opacity": consequenceOpacity,
  };

  function moveTo(nextDepth: number) {
    setDepth(Math.max(0, Math.min(nextDepth, 100)));
  }

  return (
    <main id="main-content" className="instrument-shell">
      <section
        className="exposure-stage"
        id="work"
        aria-labelledby="instrument-title"
        data-phase={phase}
        data-pass={depth > 50 ? "consequence" : "rule"}
        style={style}
      >
        <header className="instrument-intro">
          <div>
            <p className="eyebrow">Portfolio instrument 01 · System exposure</p>
            <h1 id="instrument-title">Make the hidden rule visible.</h1>
          </div>
          <div className="instrument-intro-copy">
            <p>
              Drag one control through five live systems. At the same depth, each one exposes
              what each interface remembers, permits, contests, or must account for.
            </p>
            <dl aria-label="Practice summary">
              <div>
                <dt>Designer</dt>
                <dd>Tanishk · Bangalore</dd>
              </div>
              <div>
                <dt>Ownership</dt>
                <dd>Concept · design · writing · code</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd><span className="availability-dot" aria-hidden="true" />Available for work</dd>
              </div>
            </dl>
          </div>
        </header>

        <div className="instrument-console">
          <div className="console-readout">
            <span>Active layer · {activePhase.number}</span>
            <strong>{activePhase.label}</strong>
            <p>{activePhase.description}</p>
          </div>

          <div className="console-control">
            <div className="phase-controls" aria-label="Exposure presets">
              {phases.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  aria-pressed={phase === item.id}
                  onClick={() => moveTo(item.depth)}
                >
                  <span>{item.number}</span>
                  {item.label}
                </button>
              ))}
            </div>
            <label className="exposure-range">
              <span className="sr-only">Expose the systems from surface to consequence</span>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={depth}
                onChange={(event) => moveTo(Number(event.currentTarget.value))}
                aria-valuetext={`${activePhase.label}: ${activePhase.description}`}
              />
              <span className="range-track" aria-hidden="true"><i /></span>
              <span className="range-instruction" aria-hidden="true">
                {depth === 0 ? "Drag the plane →" : `${depth}% exposed`}
              </span>
            </label>
          </div>

          <div className="shell-readout">
            <span>The housing is exposing itself</span>
            <p>{activePhase.shell}</p>
          </div>
        </div>

        <div className="instrument-field" aria-label="Five projects viewed through one exposure control">
          <div className="exposure-plane exposure-plane--rule" aria-hidden="true">
            <span>Pass 01 · expose rule</span>
          </div>
          <div className="exposure-plane exposure-plane--consequence" aria-hidden="true">
            <span>Pass 02 · expose consequence</span>
          </div>

          {ordered.map((project, index) => {
            const signal = projectSignals[project.artifact];
            const projectHref = `/work/${project.slug}?from=all`;

            return (
              <a
                className={`instrument-panel instrument-panel--${project.artifact}`}
                href={projectHref}
                key={project.id}
                aria-label={`Open ${project.title}: ${signal.exposure[phase]}`}
                style={
                  {
                    "--project-accent": project.accent,
                    viewTransitionName: `project-${project.id}`,
                  } as CSSProperties
                }
              >
                <div className="instrument-panel-head">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{signal.status}</span>
                </div>

                <div className="instrument-panel-body">
                  <div className="panel-layer panel-layer--surface">
                    <span>Visible surface</span>
                    <strong>{signal.exposure.surface}</strong>
                    <small>{project.form}</small>
                  </div>
                  <div className="panel-layer panel-layer--rule">
                    <span>Governing rule</span>
                    <strong>{signal.exposure.rule}</strong>
                    <small>{signal.focus}</small>
                  </div>
                  <div className="panel-layer panel-layer--consequence">
                    <ProjectProof project={project} />
                    <p>{signal.exposure.consequence}</p>
                  </div>
                </div>

                <div className="instrument-panel-foot">
                  <div>
                    <span>{project.form}</span>
                    <strong>{project.title}</strong>
                  </div>
                  <span className="panel-open">Open case ↗</span>
                </div>
              </a>
            );
          })}
        </div>

        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {activePhase.label} layer. {activePhase.description}
        </p>
      </section>

      <section className="practice-record" aria-labelledby="record-title">
        <div>
          <p className="eyebrow">Practice record · 2026</p>
          <h2 id="record-title">
            Five independently built systems. One recurring decision: who gets
            to see, contest, and revise what the system does.
          </h2>
        </div>
        <dl>
          <div>
            <dt>Proof</dt>
            <dd>05 live interactive artifacts</dd>
          </div>
          <div>
            <dt>Practice</dt>
            <dd>Products · research · systems</dd>
          </div>
          <div>
            <dt>Authorship</dt>
            <dd>Independent · end to end</dd>
          </div>
          <div>
            <dt>Position</dt>
            <dd>Interaction Designer · Bangalore</dd>
          </div>
        </dl>
        <Link href="/about">Read the practice record →</Link>
      </section>

      <section className="commission" aria-labelledby="commission-title">
        <p className="eyebrow">Next system · Available for work</p>
        <h2 id="commission-title">If behavior is the hard part, that is the brief.</h2>
        <div>
          <a href="mailto:madebytanishk@gmail.com">madebytanishk@gmail.com ↗</a>
          <Link href="/contact">Contact details →</Link>
        </div>
      </section>
    </main>
  );
}
