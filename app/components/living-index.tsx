"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import { projects, type Project } from "../data/portfolio";
import {
  flagshipOrder,
  projectSignals,
  type ExposurePhase,
} from "../data/project-signals";

type ScoreStyle = CSSProperties & {
  "--score-position": string;
  "--score-ratio": number;
};

type VoiceStyle = CSSProperties & {
  "--project-accent": string;
  "--voice-index": number;
};

const movements: Array<{
  id: ExposurePhase;
  value: number;
  number: string;
  label: string;
  prompt: string;
}> = [
  {
    id: "surface",
    value: 0,
    number: "I",
    label: "Encounter",
    prompt: "What a person first meets.",
  },
  {
    id: "rule",
    value: 50,
    number: "II",
    label: "Rule",
    prompt: "The decision governing the behavior.",
  },
  {
    id: "consequence",
    value: 100,
    number: "III",
    label: "Consequence",
    prompt: "What changes for the person.",
  },
];

function movementFor(value: number): ExposurePhase {
  if (value < 34) return "surface";
  if (value < 67) return "rule";
  return "consequence";
}

function orderedProjects() {
  return flagshipOrder
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is Project => Boolean(project));
}

function VoiceNotation({ artifact }: { artifact: Project["artifact"] }) {
  return (
    <span className={`voice-notation voice-notation--${artifact}`} aria-hidden="true">
      <i className="notation-axis" />
      <i className="notation-mark notation-mark--a" />
      <i className="notation-mark notation-mark--b" />
      <i className="notation-mark notation-mark--c" />
      <i className="notation-mark notation-mark--d" />
      <i className="notation-mark notation-mark--e" />
      <b className="notation-result" />
    </span>
  );
}

export function LivingIndex() {
  const [position, setPosition] = useState(0);
  const phase = movementFor(position);
  const activeMovement =
    movements.find((movement) => movement.id === phase) ?? movements[0];
  const ordered = useMemo(() => orderedProjects(), []);
  const style: ScoreStyle = {
    "--score-position": `${position}%`,
    "--score-ratio": position / 100,
  };

  function moveTo(value: number) {
    setPosition(Math.max(0, Math.min(value, 100)));
  }

  return (
    <main id="main-content" className="score-home">
      <section className="score-prologue" aria-labelledby="home-title">
        <div className="score-prologue-copy" data-score-reveal>
          <p className="eyebrow">Tanishk · Interaction designer · Bangalore</p>
          <h1 id="home-title">
            I design the moment a system becomes <em>understandable.</em>
          </h1>
          <p className="score-deck">
            I build products and experiments that let people see what a system
            decided—and what they can do next.
          </p>
        </div>

        <aside className="score-practice-record" aria-label="Practice record" data-score-reveal>
          <div className="score-practice-stave" aria-hidden="true">
            {ordered.map((project, index) => (
              <i
                key={project.id}
                style={
                  {
                    "--project-accent": project.accent,
                    "--voice-index": index,
                  } as VoiceStyle
                }
              />
            ))}
            <span />
          </div>
          <dl>
            <div>
              <dt>Current</dt>
              <dd>Daynero · AI-native finance</dd>
            </div>
            <div>
              <dt>Independent</dt>
              <dd>Four working investigations</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd><span className="availability-dot" aria-hidden="true" />Available for work</dd>
            </div>
          </dl>
          <a href="#work">Operate the score <span aria-hidden="true">↓</span></a>
        </aside>
      </section>

      <section
        className="interaction-score"
        id="work"
        aria-labelledby="score-title"
        data-phase={phase}
        style={style}
      >
        <header className="score-introduction" data-score-reveal>
          <div>
            <p className="eyebrow">Selected work · Interaction score 01</p>
            <h2 id="score-title">Five systems. One reading head.</h2>
          </div>
          <p>
            Move the score from the thing a person encounters, to the rule
            underneath it, to the consequence that rule creates.
          </p>
        </header>

        <div className="score-console" data-score-reveal>
          <div className="score-movements" role="group" aria-label="Choose a movement of the score">
            {movements.map((movement) => (
              <button
                type="button"
                key={movement.id}
                aria-pressed={phase === movement.id}
                onClick={() => moveTo(movement.value)}
              >
                <span>{movement.number}</span>
                <strong>{movement.label}</strong>
                <small>{movement.prompt}</small>
              </button>
            ))}
          </div>

          <label className="score-range">
            <span className="sr-only">Move between encounter, rule, and consequence</span>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={position}
              onChange={(event) => moveTo(Number(event.currentTarget.value))}
              aria-valuetext={`${activeMovement.label}: ${activeMovement.prompt}`}
            />
            <span className="score-range-track" aria-hidden="true">
              <i />
            </span>
          </label>

          <div className="score-live-readout" aria-live="polite" aria-atomic="true">
            <span>Movement {activeMovement.number}</span>
            <strong>{activeMovement.label}</strong>
            <p>{activeMovement.prompt}</p>
          </div>
        </div>

        <div className="score-field" aria-label="Five project voices" data-score-reveal>
          <div className="score-scale" aria-hidden="true">
            <span>Encounter</span>
            <span>Rule</span>
            <span>Consequence</span>
          </div>
          <div className="score-reading-head" aria-hidden="true"><i /></div>

          {ordered.map((project, index) => {
            const signal = projectSignals[project.artifact];
            const isPreview = project.availability === "preview";

            return (
              <Link
                className={`score-voice score-voice--${project.artifact}`}
                href={`/work/${project.slug}?from=all`}
                key={project.id}
                data-artifact={project.artifact}
                style={
                  {
                    "--project-accent": project.accent,
                    "--voice-index": index,
                    viewTransitionName: `project-${project.id}`,
                  } as VoiceStyle
                }
                aria-label={`Open ${project.title}: ${signal.exposure[phase]}`}
              >
                <span className="voice-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="voice-identity">
                  <small>{project.form}</small>
                  <strong>{project.title}</strong>
                </span>
                <span className="voice-statement" key={`${project.id}-${phase}`}>
                  <small>{activeMovement.label}</small>
                  <span>{signal.exposure[phase]}</span>
                </span>
                <VoiceNotation artifact={project.artifact} />
                <span className="voice-open">
                  {isPreview ? "Preview" : "Case"} <i aria-hidden="true">↗</i>
                </span>
              </Link>
            );
          })}
        </div>

        <p className="score-instruction">
          The same control reveals five different obligations. Select any voice
          to enter its full interaction world.
        </p>
      </section>

      <section className="score-coda" aria-labelledby="coda-title" data-score-reveal>
        <header>
          <p className="eyebrow">The obligation beneath the work</p>
          <h2 id="coda-title">The work changes. The obligation stays.</h2>
        </header>
        <ol>
          <li><span>01</span><strong>Make the hidden decision visible.</strong></li>
          <li><span>02</span><strong>Design a meaningful way to respond.</strong></li>
          <li><span>03</span><strong>Prove only what the evidence supports.</strong></li>
        </ol>
        <div className="score-invitation">
          <p>Available for interaction-design roles and collaborations.</p>
          <a href="mailto:madebytanishk@gmail.com">madebytanishk@gmail.com <span aria-hidden="true">↗</span></a>
        </div>
      </section>
    </main>
  );
}
