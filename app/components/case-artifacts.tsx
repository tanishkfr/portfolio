"use client";

import Image from "next/image";
import { useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import type { Project } from "../data/portfolio";

function InstrumentFrame({
  project,
  status,
  children,
  caption,
  bar = "Try the interaction",
  proof = "What this shows",
}: {
  project: string;
  status: string;
  children: ReactNode;
  caption: string;
  bar?: string;
  proof?: string;
}) {
  return (
    <figure className={`signature-artifact case-instrument case-instrument--${project}`}>
      <div className="artifact-bar case-instrument-bar">
        <span>{bar}</span>
        <span aria-live="polite">{status}</span>
      </div>
      {children}
      <figcaption>
        <strong>{proof}</strong>
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

/* --------------------------------------------------------------
   Design or Disaster — evidence before authority.
   -------------------------------------------------------------- */

const disasterRegions = [
  { label: "Top bar", x: 50, y: 12 },
  { label: "Primary action", x: 64, y: 44 },
  { label: "Status area", x: 26, y: 30 },
  { label: "Lower list", x: 50, y: 80 },
] as const;

const disasterPerspectives = [
  {
    value: "hierarchy",
    label: "Hierarchy",
    x: 56,
    y: 29,
    region: "primary action",
    reading: "The motion competes with the primary decision.",
  },
  {
    value: "access",
    label: "Access",
    x: 26,
    y: 52,
    region: "status area",
    reading: "The control's meaning disappears without precise vision.",
  },
  {
    value: "task",
    label: "Task",
    x: 45,
    y: 86,
    region: "lower list",
    reading: "The interface asks for orientation before it enables action.",
  },
  {
    value: "trust",
    label: "Trust",
    x: 77,
    y: 66,
    region: "action confirmation",
    reading: "The visual certainty exceeds the evidence behind the state.",
  },
  {
    value: "feeling",
    label: "Feeling",
    x: 38,
    y: 66,
    region: "interruption",
    reading: "The interruption creates tension where reassurance was needed.",
  },
] as const;

const clamp = (value: number) => Math.min(Math.max(value, 4), 96);

function DisasterArtifact() {
  const [mark, setMark] = useState<{ x: number; y: number } | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const [lens, setLens] = useState<string | null>(null);
  const active = disasterPerspectives.find((item) => item.value === lens) ?? null;

  function place(event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const keyboard = event.clientX === 0 && event.clientY === 0;
    const x = keyboard ? 50 : ((event.clientX - rect.left) / rect.width) * 100;
    const y = keyboard ? 44 : ((event.clientY - rect.top) / rect.height) * 100;
    setRegion(null);
    setLens(null);
    setMark({ x: clamp(x), y: clamp(y) });
  }

  function chooseRegion(label: string, x: number, y: number) {
    setRegion(label);
    setLens(null);
    setMark({ x, y });
  }

  const status = !mark
    ? "Point at the evidence first"
    : active
      ? `${active.label} perspective active`
      : "Your mark placed · comparison locked";

  return (
    <InstrumentFrame
      project="disaster"
      status={status}
      caption="Place your own mark on the evidence before any other reading appears. The five perspectives are authored examples, not expert truth."
    >
      <div className="disaster-demo">
        <div className="disaster-evidence">
          <button
            type="button"
            className="demo-evidence-map"
            onClick={place}
            aria-label={
              mark
                ? "Adjust your evidence mark"
                : "Point at the evidence that shapes your reading"
            }
          >
            <Image
              unoptimized
              src="/projects/design-or-disaster/case-010.jpg"
              width={680}
              height={510}
              sizes="(max-width: 900px) 100vw, 62vw"
              alt="The shared interface evidence surface used for every reading."
              priority
            />
            {mark ? (
              <>
                {disasterPerspectives.map((perspective) => (
                  <span
                    key={perspective.value}
                    className="xp-dod-mark xp-dod-mark--other"
                    data-active={active?.value === perspective.value || undefined}
                    style={
                      { left: `${perspective.x}%`, top: `${perspective.y}%` } as CSSProperties
                    }
                    aria-hidden="true"
                  />
                ))}
                <span
                  className="xp-dod-mark xp-dod-mark--mine"
                  style={{ left: `${mark.x}%`, top: `${mark.y}%` } as CSSProperties}
                >
                  <span className="xp-dod-tag">
                    {region ? `your mark · ${region}` : "your mark"}
                  </span>
                </span>
              </>
            ) : (
              <span className="xp-dod-prompt" aria-hidden="true">
                point at the evidence
              </span>
            )}
          </button>

          <div className="disaster-regions" role="group" aria-label="Or name a region">
            {disasterRegions.map((item) => (
              <button
                key={item.label}
                type="button"
                aria-pressed={region === item.label}
                onClick={() => chooseRegion(item.label, item.x, item.y)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <p className="disaster-disclosure">
            The image, regions, and five readings are authored or reconstructed
            critique material — not participant data.
          </p>
        </div>

        <aside className="disaster-panel">
          <p className="case-label">Comparison</p>
          {mark ? (
            <>
              <ChoiceGroup
                label="Open an authored reading"
                value={lens ?? ""}
                options={disasterPerspectives}
                onChange={setLens}
              />
              <div className="juror-reading" aria-live="polite">
                {active ? (
                  <>
                    <span>
                      {active.label} reads the {active.region}
                    </span>
                    <p>{active.reading}</p>
                  </>
                ) : (
                  <p>
                    Five authored perspectives are available. Choose one to see
                    where it looked and what it concluded.
                  </p>
                )}
              </div>
            </>
          ) : (
            <p className="disaster-panel-hint">
              Your mark comes first. Comparison opens once the evidence is
              placed.
            </p>
          )}
        </aside>
      </div>
    </InstrumentFrame>
  );
}

/* --------------------------------------------------------------
   Pentimento — the correction gains authority.
   -------------------------------------------------------------- */

const pentimentoChoices = [
  { value: "stand", label: "Let it stand" },
  { value: "reframe", label: "Read it differently" },
  { value: "strike", label: "Strike it" },
] as const;

function PentimentoArtifact() {
  const [reply, setReply] = useState("stand");
  const status = {
    stand: "Reading accepted · machine prose remains",
    reframe: "Reading reframed · same evidence, different account",
    strike: "Reading withdrawn · example correction leads",
  }[reply] ?? "Reply unresolved";

  return (
    <InstrumentFrame
      project="pentimento"
      status={status}
      caption="The machine claim opens intact. A reply changes the second draft; a strike keeps the original readable above while the example correction takes the lead below."
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
          <span className="draft-owner">
            {reply === "strike" ? "System reading · withdrawn" : "System reading"}
          </span>
          <p className="draft-machine" data-withdrawn={reply === "strike" || undefined}>
            {reply === "reframe"
              ? "The archive shows a temporary period of intense curiosity."
              : "The archive shows a decisive change in taste."}
          </p>

          {reply === "strike" ? (
            <div className="pentimento-result">
              <span className="draft-owner draft-owner--human">Example correction</span>
              <p className="draft-human">
                It was not a change in taste. It was the first time I had time to
                follow my curiosity.
              </p>
            </div>
          ) : null}

          {reply === "stand" ? (
            <small>Allowed to enter the second draft · reply remains revisable</small>
          ) : null}
          {reply === "reframe" ? (
            <small>Alternative interpretation · evidence unchanged · reply remains revisable</small>
          ) : null}
          {reply === "strike" ? (
            <small>The original claim stays visible; the correction leads the document.</small>
          ) : null}
        </section>
      </div>
    </InstrumentFrame>
  );
}

/* --------------------------------------------------------------
   Invisible Interfaces — one phase at a time, receipt first.
   -------------------------------------------------------------- */

const invisiblePhases = [
  { value: "before", label: "Before leaving" },
  { value: "away", label: "While away" },
  { value: "return", label: "On return" },
] as const;

const invisibleViews = {
  before: {
    src: "/projects/invisible-interfaces/terminal.png",
    alt: "The demanded-attention terminal scene, before work is delegated.",
    frame: "Before · the work is still visible",
  },
  away: {
    src: "/projects/invisible-interfaces/morph.png",
    alt: "The scene while the visitor is away, with the work no longer watched.",
    frame: "While away · nothing is watched",
  },
  return: {
    src: "/projects/invisible-interfaces/return.png",
    alt: "The return scene with the restored result and its work receipt.",
    frame: "On return · the result and its receipt",
  },
} as const;

function InvisibleArtifact() {
  const [phase, setPhase] = useState<keyof typeof invisibleViews>("before");
  const status = {
    before: "Scope visible · no work started",
    away: "Absence is the input · local only",
    return: "Receipt available · nothing transmitted",
  }[phase];
  const view = invisibleViews[phase];

  return (
    <InstrumentFrame
      project="invisible"
      status={status}
      caption="This is a staged browser work, not a deployed restoration system. The receipt below is the artifact the project argues for."
    >
      <div className="invisible-demo" data-phase={phase}>
        <ChoiceGroup
          label="Inspect a delegation phase"
          value={phase}
          options={invisiblePhases}
          onChange={(value) => setPhase(value as keyof typeof invisibleViews)}
        />

        <figure className="invisible-stage">
          <Image
            unoptimized
            src={view.src}
            width={1440}
            height={1000}
            sizes="(max-width: 900px) 100vw, 70vw"
            alt={view.alt}
            priority={phase === "return"}
          />
          <figcaption>{view.frame}</figcaption>
        </figure>

        {phase === "before" ? (
          <p className="invisible-phase-copy">
            Repair dust and scratches. Preserve composition and the original. Do
            not infer people, place, or date. You may discard the result.
          </p>
        ) : null}

        {phase === "away" ? (
          <p className="invisible-phase-copy">
            The task advances only while the page is hidden. There is no progress
            to watch, by design — watching would be the wrong interaction.
          </p>
        ) : null}

        {phase === "return" ? (
          <div className="invisible-receipt">
            <p className="case-label">The receipt</p>
            <dl>
              <div><dt>Changed</dt><dd>Dust and scratches across the surface.</dd></div>
              <div><dt>Preserved</dt><dd>Composition, framing, and the original file.</dd></div>
              <div><dt>Not inferred</dt><dd>People, place, and date were not added.</dd></div>
              <div><dt>Discard</dt><dd>The staged copy can be removed without touching the original.</dd></div>
            </dl>
            <p className="invisible-receipt-note">
              Observed on return: time away from this page, held in memory only.
              Nothing was transmitted.
            </p>
          </div>
        ) : null}
      </div>
    </InstrumentFrame>
  );
}

/* --------------------------------------------------------------
   Atlas — revision requires an edit.
   -------------------------------------------------------------- */

const atlasCases = [
  {
    id: "lightbox",
    title: "Lightbox",
    body: "A low-consequence overlay. Dismissing by mistake costs nothing and is trivially reversible.",
  },
  {
    id: "transfer",
    title: "Financial transfer",
    body: "A stray dismissal can discard entered data and interrupt a consequential commitment.",
  },
  {
    id: "switch",
    title: "Switch access",
    body: "There is no outside tap: the input event the rule depends on does not exist.",
  },
] as const;

const START_RULE = "Outside tap may dismiss a reversible overlay.";

type Trace = { caseTitle: string; action: string; rule: string };

function AtlasArtifact() {
  const [caseIndex, setCaseIndex] = useState(0);
  const [rule, setRule] = useState(START_RULE);
  const [draft, setDraft] = useState(START_RULE);
  const [trace, setTrace] = useState<Trace[]>([
    { caseTitle: "Starting rule", action: "written", rule: START_RULE },
  ]);
  const done = caseIndex >= atlasCases.length;
  const currentCase = atlasCases[Math.min(caseIndex, atlasCases.length - 1)];
  const changed = draft.trim() !== rule.trim();
  const canRevise = changed && draft.trim().length > 0;

  function commit(action: "hold" | "refine" | "fracture") {
    const nextRule = action === "hold" ? rule : draft.trim();
    setRule(nextRule);
    setDraft(nextRule);
    setTrace((entries) => [
      ...entries,
      {
        caseTitle: currentCase.title,
        action,
        rule: nextRule,
      },
    ]);
    setCaseIndex((index) => index + 1);
  }

  function reset() {
    setCaseIndex(0);
    setRule(START_RULE);
    setDraft(START_RULE);
    setTrace([{ caseTitle: "Starting rule", action: "written", rule: START_RULE }]);
  }

  const status = done
    ? "Trace complete · every change kept"
    : `${currentCase.title} · ${caseIndex + 1} of ${atlasCases.length}`;

  return (
    <InstrumentFrame
      project="atlas"
      status={status}
      caption="Refine and fracture require revised wording before they can be committed. The trace keeps the case that caused every change."
    >
      <div className="atlas-demo">
        <aside className="atlas-case">
          <p className="case-label">
            {done ? "Trace complete" : `Pressure case ${caseIndex + 1} / ${atlasCases.length}`}
          </p>
          {done ? (
            <p>
              Three cases carried one rule. Nothing was rewritten without being
              retyped, and earlier wording is still visible below.
            </p>
          ) : (
            <>
              <h3>{currentCase.title}</h3>
              <p>{currentCase.body}</p>
            </>
          )}
        </aside>

        <section className="atlas-editor" aria-live="polite">
          <label className="case-label" htmlFor="atlas-rule">
            {done ? "Final wording" : "Your current wording"}
          </label>
          <textarea
            id="atlas-rule"
            value={draft}
            rows={3}
            onChange={(event) => setDraft(event.target.value)}
            readOnly={done}
          />
          {!done ? (
            <>
              <p className="atlas-editor-hint">
                {changed
                  ? "Wording changed — refine or fracture will commit it."
                  : "Hold keeps this wording. To refine or fracture, edit the rule first."}
              </p>
              <div className="atlas-editor-actions">
                <button type="button" onClick={() => commit("hold")}>
                  Hold
                </button>
                <button type="button" disabled={!canRevise} onClick={() => commit("refine")}>
                  Refine
                </button>
                <button type="button" disabled={!canRevise} onClick={() => commit("fracture")}>
                  Fracture
                </button>
              </div>
            </>
          ) : null}
          <button type="button" className="atlas-reset" onClick={reset}>
            Reset
          </button>
        </section>
      </div>

      <div className="atlas-trace">
        <p className="case-label">Lineage</p>
        <ol>
          {trace.map((entry, index) => (
            <li key={index}>
              <span>{entry.caseTitle}</span>
              <em>{entry.action}</em>
              <p>{entry.rule}</p>
            </li>
          ))}
        </ol>
      </div>
    </InstrumentFrame>
  );
}

/* --------------------------------------------------------------
   Fluxion Studios — the shipped site is the evidence.
   -------------------------------------------------------------- */

function FluxionArtifact() {
  return (
    <InstrumentFrame
      project="fluxion"
      bar="Live studio site"
      proof="Built in-house"
      status="Live · taking enquiries"
      caption="The live site is the evidence. Desktop, mobile, and enquiry-flow captures remain an outstanding asset dependency; until they are captured, the site itself carries the proof."
    >
      <div className="fluxion-demo">
        <div className="fluxion-brand-lockup">
          <Image
            unoptimized
            src="/projects/fluxion/wordmark-transparent.png"
            width={669}
            height={42}
            sizes="(max-width: 900px) 60vw, 22rem"
            alt="Fluxion Studios"
          />
        </div>
        <p className="fluxion-demo-role">
          Co-founder: structure, visual design, copy, motion, frontend, and the
          enquiry form, built together with my co-founder.
        </p>
        <dl className="fluxion-demo-facts">
          <div>
            <dt>Studio</dt>
            <dd>Two-person practice, in Bengaluru.</dd>
          </div>
          <div>
            <dt>Live now</dt>
            <dd>
              Navigation, process, both founders, and a working enquiry form.
            </dd>
          </div>
        </dl>
        <a
          href="https://fluxion-studios.vercel.app/"
          target="_blank"
          rel="noreferrer"
        >
          Visit the live studio site <span aria-hidden="true">↗</span>
        </a>
      </div>
    </InstrumentFrame>
  );
}

export function CaseArtifact({ project }: { project: Project }) {
  switch (project.artifact) {
    case "fluxion":
      return <FluxionArtifact />;
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
