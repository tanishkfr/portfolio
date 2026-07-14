import Image from "next/image";
import type { Project } from "../data/portfolio";

function RemainderProof() {
  return (
    <div className="proof-visual proof-remainder" aria-hidden="true">
      <div className="proof-window-bar">
        <span />
        <small>Capture review</small>
        <em>03 pending</em>
      </div>
      <div className="proof-remainder-grid">
        <div className="proof-chat">
          <span>Conversation</span>
          <p>Keep the reasoning visible.</p>
          <p>Preserve decisions, not volume.</p>
        </div>
        <div className="proof-candidate">
          <span>Candidate memory</span>
          <strong>Reviewed consequences become durable context.</strong>
          <i>Keep alongside</i>
        </div>
        <div className="proof-lineage">
          <b>Current</b>
          <span />
          <b>Earlier direction retained</b>
        </div>
      </div>
    </div>
  );
}

function DisasterProof() {
  return (
    <div className="proof-visual proof-disaster" aria-hidden="true">
      <Image
        src="/projects/design-or-disaster/case-010.jpg"
        alt=""
        width={680}
        height={510}
        sizes="(max-width: 800px) 90vw, 36vw"
      />
      <span className="proof-marker marker-a">Hierarchy</span>
      <span className="proof-marker marker-b">Trust</span>
      <span className="proof-marker marker-c">Access</span>
      <div className="proof-verdict">Evidence before verdict</div>
    </div>
  );
}

function PentimentoProof() {
  return (
    <div className="proof-visual proof-pentimento" aria-hidden="true">
      <span className="proof-overline">Second draft · subject revision</span>
      <p className="proof-machine">The archive shows a decisive change in taste.</p>
      <span className="proof-strike" />
      <p className="proof-human">
        It was the first time I had time to follow my curiosity.
      </p>
      <small>Sovereign ink · history retained</small>
    </div>
  );
}

function InvisibleProof() {
  return (
    <div className="proof-visual proof-invisible" aria-hidden="true">
      <div className="proof-invisible-frame frame-before">
        <Image
          src="/projects/invisible-interfaces/terminal.png"
          alt=""
          width={1440}
          height={1000}
          sizes="(max-width: 800px) 80vw, 30vw"
        />
        <span>Attention demanded</span>
      </div>
      <div className="proof-invisible-frame frame-after">
        <Image
          src="/projects/invisible-interfaces/return.png"
          alt=""
          width={1440}
          height={1000}
          sizes="(max-width: 800px) 80vw, 30vw"
        />
        <span>Accountability on return</span>
      </div>
    </div>
  );
}

function AtlasProof() {
  return (
    <div className="proof-visual proof-atlas" aria-hidden="true">
      <Image
        src="/projects/atlas/atlas.png"
        alt=""
        width={1200}
        height={630}
        sizes="(max-width: 800px) 90vw, 36vw"
      />
      <div className="proof-trace">
        <span>Hold</span>
        <span>Refine</span>
        <span>Fracture</span>
      </div>
    </div>
  );
}

export function ProjectProof({ project }: { project: Project }) {
  switch (project.artifact) {
    case "remainder":
      return <RemainderProof />;
    case "disaster":
      return <DisasterProof />;
    case "pentimento":
      return <PentimentoProof />;
    case "invisible":
      return <InvisibleProof />;
    case "atlas":
      return <AtlasProof />;
  }
}
