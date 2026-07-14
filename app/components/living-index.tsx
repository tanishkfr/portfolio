"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import { projects, type Project } from "../data/portfolio";
import {
  flagshipOrder,
  projectSignals,
  type ExposurePhase,
} from "../data/project-signals";

type HomeStyle = CSSProperties & { "--control-position": string };

const phases: Array<{
  id: ExposurePhase;
  value: number;
  number: string;
  label: string;
  cardLabel: string;
  description: string;
}> = [
  {
    id: "surface",
    value: 0,
    number: "01",
    label: "Interface",
    cardLabel: "What you meet",
    description: "The product as a person first encounters it.",
  },
  {
    id: "rule",
    value: 50,
    number: "02",
    label: "Logic",
    cardLabel: "What governs it",
    description: "The decision shaping the behavior underneath.",
  },
  {
    id: "consequence",
    value: 100,
    number: "03",
    label: "Consequence",
    cardLabel: "What it changes",
    description: "The agency, evidence, or understanding that follows.",
  },
];

function phaseFor(value: number): ExposurePhase {
  if (value < 34) return "surface";
  if (value < 67) return "rule";
  return "consequence";
}

function orderedProjects() {
  return flagshipOrder
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is Project => Boolean(project));
}

export function LivingIndex() {
  const [position, setPosition] = useState(0);
  const phase = phaseFor(position);
  const activePhase = phases.find((item) => item.id === phase) ?? phases[0];
  const ordered = useMemo(() => orderedProjects(), []);
  const style: HomeStyle = { "--control-position": `${position}%` };

  function moveTo(value: number) {
    setPosition(Math.max(0, Math.min(value, 100)));
  }

  return (
    <main id="main-content" className="portfolio-home">
      <section className="home-opening" aria-labelledby="home-title" data-scroll-reveal>
        <div className="home-opening-copy">
          <p className="eyebrow">Interaction designer · Bangalore</p>
          <h1 id="home-title">I design how intelligent systems explain themselves.</h1>
          <p className="home-deck">
            Product work and self-directed experiments about money, agency,
            evidence, and the decisions hidden underneath an interface.
          </p>
        </div>

        <div className="home-opening-meta">
          <dl aria-label="Portfolio summary">
            <div>
              <dt>Current work</dt>
              <dd>Daynero · AI-native finance</dd>
            </div>
            <div>
              <dt>Independent work</dt>
              <dd>04 working investigations</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd><span className="availability-dot" aria-hidden="true" />Available for work</dd>
            </div>
          </dl>
          <a className="home-jump" href="#work">
            Explore the work <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section
        className="work-lens"
        id="work"
        aria-labelledby="work-title"
        data-phase={phase}
        style={style}
      >
        <header className="work-lens-heading" data-scroll-reveal>
          <div>
            <p className="eyebrow">Selected work · One shared lens</p>
            <h2 id="work-title">See the interface. Then see the decision.</h2>
          </div>
          <p>
            Use one control to move every project from its visible surface to
            the rule underneath and the consequence that rule creates.
          </p>
        </header>

        <div className="work-lens-control" data-scroll-reveal>
          <div className="lens-phase-buttons" role="group" aria-label="Choose what to inspect">
            {phases.map((item) => (
              <button
                type="button"
                key={item.id}
                aria-pressed={phase === item.id}
                onClick={() => moveTo(item.value)}
              >
                <span>{item.number}</span>
                {item.label}
              </button>
            ))}
          </div>

          <label className="lens-range">
            <span className="sr-only">Move between interface, logic, and consequence</span>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={position}
              onChange={(event) => moveTo(Number(event.currentTarget.value))}
              aria-valuetext={`${activePhase.label}: ${activePhase.description}`}
            />
            <span className="lens-track" aria-hidden="true"><i /></span>
          </label>

          <div className="lens-readout" aria-live="polite" aria-atomic="true">
            <span>{activePhase.number} · {activePhase.label}</span>
            <p>{activePhase.description}</p>
          </div>
        </div>

        <div className="work-grid" aria-label="Five selected projects">
          {ordered.map((project, index) => {
            const signal = projectSignals[project.artifact];
            const isPreview = project.availability === "preview";

            return (
              <Link
                className={`work-card work-card--${project.artifact}`}
                href={`/work/${project.slug}?from=all`}
                key={project.id}
                data-scroll-reveal
                style={
                  {
                    "--project-accent": project.accent,
                    "--reveal-order": index,
                    viewTransitionName: `project-${project.id}`,
                  } as CSSProperties
                }
              >
                <div className="work-card-topline">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{isPreview ? "Case study soon" : signal.status}</span>
                </div>

                <div className="work-card-signal" key={`${project.id}-${phase}`}>
                  <span>{activePhase.cardLabel}</span>
                  <p>{signal.exposure[phase]}</p>
                </div>

                <div className="work-card-footer">
                  <div>
                    <span>{project.form}</span>
                    <h3>{project.title}</h3>
                  </div>
                  <span className="work-card-open">
                    {isPreview ? "Open preview" : "Open case"} <i aria-hidden="true">↗</i>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="home-method" aria-labelledby="method-title" data-scroll-reveal>
        <header>
          <p className="eyebrow">How I work</p>
          <h2 id="method-title">The interaction carries the argument.</h2>
          <p>
            I work from behavior outward: define the rule, build the state
            changes, and make the edge cases part of the experience.
          </p>
        </header>

        <ol className="method-list">
          <li>
            <span>01</span>
            <strong>Make the hidden decision visible.</strong>
          </li>
          <li>
            <span>02</span>
            <strong>Give people a meaningful way to respond.</strong>
          </li>
          <li>
            <span>03</span>
            <strong>Keep the claim inside the evidence.</strong>
          </li>
        </ol>

        <div className="home-invitation">
          <span>Available for interaction-design roles and collaborations.</span>
          <a href="mailto:madebytanishk@gmail.com">Start a conversation <i aria-hidden="true">↗</i></a>
        </div>
      </section>
    </main>
  );
}
