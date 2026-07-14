"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import type { Project } from "../data/portfolio";

function InstrumentFrame({
  project,
  status,
  children,
  caption,
}: {
  project: string;
  status: string;
  children: ReactNode;
  caption: string;
}) {
  return (
    <figure className={`signature-artifact case-instrument case-instrument--${project}`}>
      <div className="artifact-bar case-instrument-bar">
        <span>Try the core interaction</span>
        <span aria-live="polite">{status}</span>
      </div>
      {children}
      <figcaption>
        <strong>What this proves</strong>
        {caption}
      </figcaption>
    </figure>
  );
}

function ChoiceGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="case-choice-group" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          type="button"
          key={option.value}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

const jurorLenses = [
  { value: "hierarchy", label: "Hierarchy", note: "The motion competes with the primary decision." },
  { value: "access", label: "Access", note: "The control's meaning disappears without precise vision." },
  { value: "task", label: "Task", note: "The interface asks for orientation before it enables action." },
  { value: "trust", label: "Trust", note: "The visual certainty exceeds the evidence behind the state." },
  { value: "feeling", label: "Feeling", note: "The interruption creates tension where reassurance was needed." },
] as const;

function DisasterArtifact() {
  const [lens, setLens] = useState("hierarchy");
  const active = jurorLenses.find((item) => item.value === lens) ?? jurorLenses[0];

  return (
    <InstrumentFrame
      project="disaster"
      status={`${active.label} perspective active`}
      caption="Each juror changes the interpretation while the underlying interface and coordinate system stay fixed."
    >
      <div className="disaster-demo">
        <aside>
          <p className="case-label">Five fallible readings</p>
          <ChoiceGroup
            label="Choose a juror perspective"
            value={lens}
            options={jurorLenses}
            onChange={setLens}
          />
          <div className="juror-reading" aria-live="polite">
            <span>{active.label} sees</span>
            <p>{active.note}</p>
          </div>
        </aside>
        <div className="demo-evidence-map" data-lens={lens}>
          <Image
            unoptimized
            src="/projects/design-or-disaster/case-010.jpg"
            width={680}
            height={510}
            sizes="(max-width: 900px) 100vw, 68vw"
            alt="The shared interface evidence surface for five critical perspectives."
            priority
          />
          <span className="active-evidence-point">
            <i aria-hidden="true" />
            {active.label}
          </span>
          <div className="visitor-evidence">
            <span>Your mark</span>
          </div>
        </div>
      </div>
    </InstrumentFrame>
  );
}

const pentimentoChoices = [
  { value: "stand", label: "Let it stand" },
  { value: "reframe", label: "Read it differently" },
  { value: "strike", label: "Strike it" },
] as const;

function PentimentoArtifact() {
  const [reply, setReply] = useState("strike");
  const status = {
    stand: "Reading accepted · machine prose remains",
    reframe: "Reading reframed · same evidence, different account",
    strike: "Reading withdrawn · human correction leads",
  }[reply] ?? "Reply unresolved";

  return (
    <InstrumentFrame
      project="pentimento"
      status={status}
      caption="Every reply changes the document. A strike transfers page authority without deleting the system's earlier claim."
    >
      <div className="pentimento-demo" data-reply={reply}>
        <aside className="pentimento-demo-evidence">
          <p className="case-label">Evidence 02 / 03</p>
          <dl>
            <div><dt>Pattern</dt><dd>8 films in 6 weeks</dd></div>
            <div><dt>Rate</dt><dd>4.5× the earlier period</dd></div>
            <div><dt>Confidence</dt><dd>Interpretive, not certain</dd></div>
          </dl>
          <ChoiceGroup
            label="Reply to the machine reading"
            value={reply}
            options={pentimentoChoices}
            onChange={setReply}
          />
        </aside>
        <section className="pentimento-demo-draft" aria-live="polite">
          <span className="draft-owner">System reading</span>
          <p className="draft-machine">
            {reply === "reframe"
              ? "The archive shows a temporary period of intense curiosity."
              : "The archive shows a decisive change in taste."}
          </p>
          {reply === "strike" ? <span className="demo-strike" aria-hidden="true" /> : null}
          {reply === "strike" ? (
            <>
              <span className="draft-owner draft-owner--human">Correction · sovereign ink</span>
              <p className="draft-human">It was not a change in taste. It was the first time I had time to follow my curiosity.</p>
            </>
          ) : null}
          {reply === "stand" ? <small>Allowed to enter the second draft · reply remains revisable</small> : null}
          {reply === "reframe" ? <small>Alternative interpretation · evidence unchanged · reply remains revisable</small> : null}
        </section>
      </div>
    </InstrumentFrame>
  );
}

const invisiblePhases = [
  { value: "before", label: "Before leaving" },
  { value: "away", label: "While away" },
  { value: "return", label: "On return" },
] as const;

function InvisibleArtifact() {
  const [phase, setPhase] = useState("return");
  const status = {
    before: "Authority boundary visible · no work started",
    away: "Hidden interval · bounded movement 2 of 3",
    return: "Work paused or complete · receipt available",
  }[phase] ?? "Delegation phase ready";

  return (
    <InstrumentFrame
      project="invisible"
      status={status}
      caption="The live exhibition uses actual page visibility. This explanatory model shows the contract that exists before, during, and after absence."
    >
      <div className="invisible-demo" data-phase={phase}>
        <aside>
          <p className="case-label">Delegation contract</p>
          <ChoiceGroup
            label="Inspect a delegation phase"
            value={phase}
            options={invisiblePhases}
            onChange={setPhase}
          />
          <p className="invisible-phase-copy" aria-live="polite">
            {phase === "before" && "Repair dust and scratches. Preserve composition and the original. Do not infer people, place, or date."}
            {phase === "away" && "The visible page does not perform progress. Hidden time is the causal input in the live work."}
            {phase === "return" && "Located source · repaired surface · compared result · staged private copy. Original untouched. Nothing transmitted."}
          </p>
        </aside>
        <div className="invisible-demo-visual">
          <div className="invisible-frame invisible-frame--before">
            <Image
              unoptimized
              src="/projects/invisible-interfaces/terminal.png"
              width={1440}
              height={1000}
              sizes="(max-width: 900px) 100vw, 45vw"
              alt="The demanded-attention terminal scene."
            />
            <span>Original · attention demanded</span>
          </div>
          <div className="invisible-away-state">
            <span>Attention elsewhere</span>
            <i aria-hidden="true" />
            <small>Bounded movement recorded</small>
          </div>
          <div className="invisible-frame invisible-frame--return">
            <Image
              unoptimized
              src="/projects/invisible-interfaces/return.png"
              width={1440}
              height={1000}
              sizes="(max-width: 900px) 100vw, 45vw"
              alt="The accountable return scene with comparison and work receipt."
              priority
            />
            <span>Return · result and receipt</span>
          </div>
        </div>
      </div>
    </InstrumentFrame>
  );
}

const atlasChoices = [
  { value: "hold", label: "Hold" },
  { value: "refine", label: "Refine" },
  { value: "fracture", label: "Fracture" },
] as const;

function AtlasArtifact() {
  const [judgment, setJudgment] = useState("refine");
  const currentRule = {
    hold: "Outside tap may dismiss a reversible overlay.",
    refine: "Outside tap may dismiss a reversible overlay only when dismissal cannot lose work or create consequence.",
    fracture: "Dismissal must be defined by intent and consequence—not by an outside-tap event that some input models do not have.",
  }[judgment];

  return (
    <InstrumentFrame
      project="atlas"
      status={`${judgment[0].toUpperCase()}${judgment.slice(1)} selected · lineage preserved`}
      caption="Hold, refine, and fracture create visibly different reasoning states. A changed verdict requires changed language."
    >
      <div className="atlas-demo" data-judgment={judgment}>
        <aside>
          <p className="case-label">Pressure case 02 / 03</p>
          <h3>Financial transfer</h3>
          <p>A stray dismissal can discard entered data and interrupt a consequential commitment.</p>
          <ChoiceGroup
            label="Judge the provisional rule"
            value={judgment}
            options={atlasChoices}
            onChange={setJudgment}
          />
        </aside>
        <section className="atlas-trace" aria-live="polite">
          <div className="atlas-rule atlas-rule--first">
            <span>Starting rule</span>
            <p>Outside tap may dismiss a reversible overlay.</p>
          </div>
          <div className="atlas-pressure-rail" aria-hidden="true">
            <span>01 · Lightbox</span>
            <i />
            <span>02 · Transfer</span>
            <i />
            <span>03 · Switch access</span>
          </div>
          <div className="atlas-rule atlas-rule--current">
            <span>Current rule · {judgment}</span>
            <p>{currentRule}</p>
          </div>
        </section>
      </div>
    </InstrumentFrame>
  );
}

export function CaseArtifact({ project }: { project: Project }) {
  switch (project.artifact) {
    case "daynero":
      return null;
    case "disaster":
      return <DisasterArtifact />;
    case "pentimento":
      return <PentimentoArtifact />;
    case "invisible":
      return <InvisibleArtifact />;
    case "atlas":
      return <AtlasArtifact />;
  }
}
