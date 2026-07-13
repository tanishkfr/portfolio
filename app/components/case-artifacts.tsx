import Image from "next/image";
import type { Project } from "../data/portfolio";

function RemainderArtifact() {
  return (
    <figure className="signature-artifact remainder-artifact">
      <div className="artifact-bar">
        <span>Remainder · Capture review</span>
        <span>3 candidates pending</span>
      </div>
      <div className="remainder-flow">
        <section className="remainder-conversation" aria-label="Conversation excerpt">
          <p className="artifact-label">Conversation</p>
          <div className="message message-user">
            The project should feel calm, but the reasoning cannot disappear.
          </div>
          <div className="message message-system">
            Then memory should preserve decisions, not every sentence.
          </div>
        </section>
        <section className="remainder-candidate" aria-label="Candidate project memory">
          <p className="artifact-label">Candidate memory</p>
          <strong>Preserve reviewed decisions, not transcript volume.</strong>
          <p>From 2 source messages · High confidence</p>
          <div className="candidate-actions" aria-hidden="true">
            <span>Dismiss</span>
            <span>Keep alongside</span>
            <span className="candidate-primary">Change direction</span>
          </div>
        </section>
        <section className="remainder-lineage" aria-label="Memory lineage">
          <p className="artifact-label">Project memory</p>
          <div>
            <span className="lineage-state">Current</span>
            <strong>Reviewed consequences become the durable context.</strong>
          </div>
          <div className="lineage-connector" aria-hidden="true" />
          <div>
            <span className="lineage-state">Earlier direction retained</span>
            <p>Automatic summaries should become project context.</p>
          </div>
        </section>
      </div>
      <figcaption>
        The signature handoff separates extraction from consent and current
        direction from retained history.
      </figcaption>
    </figure>
  );
}

function DisasterArtifact() {
  return (
    <figure className="signature-artifact disaster-artifact">
      <div className="artifact-bar">
        <span>Case 010 · Perspective comparison</span>
        <span>Five fallible jurors · One coordinate system</span>
      </div>
      <div className="evidence-map">
        <Image
          src="/projects/design-or-disaster/case-010.jpg"
          width={680}
          height={510}
          sizes="(max-width: 900px) 100vw, 70vw"
          alt="A contested interface case used as the shared evidence surface for five critical perspectives."
          priority
        />
        <span className="evidence-point point-one">Hierarchy</span>
        <span className="evidence-point point-two">Access</span>
        <span className="evidence-point point-three">Trust</span>
        <span className="evidence-point point-four">Task</span>
        <span className="evidence-point point-five">Feeling</span>
      </div>
      <figcaption>
        Changing perspectives changes what counts as evidence while every mark
        remains anchored to the same interface.
      </figcaption>
    </figure>
  );
}

function PentimentoArtifact() {
  return (
    <figure className="signature-artifact pentimento-artifact">
      <div className="artifact-bar">
        <span>Pentimento · Second draft</span>
        <span>Evidence retained · Authority transferred</span>
      </div>
      <div className="pentimento-page">
        <div className="pentimento-evidence">
          <p className="artifact-label">Evidence 02 / 03</p>
          <p>8 films in 6 weeks · 4.5× the earlier viewing rate</p>
          <p>Confidence: interpretive, not certain</p>
        </div>
        <div className="pentimento-draft">
          <p className="machine-voice">The archive shows a decisive change in taste.</p>
          <span className="strike-line" aria-hidden="true" />
          <p className="human-voice">
            It was not a change in taste. It was the first time I had time to
            follow my curiosity.
          </p>
          <p className="revision-note">Sovereign ink · revised by the subject</p>
        </div>
      </div>
      <figcaption>
        The machine claim remains as an underpainting while the subject&apos;s reply
        becomes the leading text.
      </figcaption>
    </figure>
  );
}

function InvisibleArtifact() {
  return (
    <figure className="signature-artifact invisible-artifact">
      <div className="artifact-bar">
        <span>Invisible Interfaces · Entrust and return</span>
        <span>Attention ledger stays local</span>
      </div>
      <div className="invisible-gallery">
        <div>
          <Image
            src="/projects/invisible-interfaces/terminal.png"
            width={1440}
            height={1000}
            sizes="(max-width: 900px) 100vw, 48vw"
            alt="The opening terminal scene, where locating one photograph demands syntax and continuous attention."
          />
          <span>Attention demanded</span>
        </div>
        <div>
          <Image
            src="/projects/invisible-interfaces/return.png"
            width={1440}
            height={1000}
            sizes="(max-width: 900px) 100vw, 48vw"
            alt="The return scene showing the restored photograph, comparison control, and bounded work receipt."
            priority
          />
          <span>Accountability on return</span>
        </div>
      </div>
      <figcaption>
        The same task moves from continuous supervision to delegated work with
        an explicit authority boundary and receipt.
      </figcaption>
    </figure>
  );
}

function AtlasArtifact() {
  return (
    <figure className="signature-artifact atlas-artifact">
      <div className="artifact-bar">
        <span>Atlas · Stress Trace 01</span>
        <span>Claim under pressure</span>
      </div>
      <div className="atlas-visual">
        <Image
          src="/projects/atlas/atlas.png"
          width={1200}
          height={630}
          sizes="(max-width: 900px) 100vw, 72vw"
          alt="Atlas, a reasoning instrument for carrying a provisional interaction principle through distant pressure cases."
          priority
        />
        <div className="stress-trace" aria-label="Example principle revision lineage">
          <div>
            <span>Claim</span>
            <strong>Outside tap may dismiss a reversible overlay.</strong>
          </div>
          <div className="trace-node trace-hold"><span>01</span> Hold</div>
          <div className="trace-node trace-refine"><span>02</span> Refine</div>
          <div className="trace-node trace-fracture"><span>03</span> Fracture</div>
        </div>
      </div>
      <figcaption>
        The output is not an answer. It is the visible lineage of a rule that
        changed shape under pressure.
      </figcaption>
    </figure>
  );
}

export function CaseArtifact({ project }: { project: Project }) {
  switch (project.artifact) {
    case "remainder":
      return <RemainderArtifact />;
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
