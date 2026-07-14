import type { Project } from "../data/portfolio";

export function ProjectSignature({
  artifact,
  focus,
}: {
  artifact: Project["artifact"];
  focus: string;
}) {
  return (
    <figure
      className={`project-signature project-signature--${artifact}`}
      aria-label={`${focus} visual signature`}
      data-score-reveal
    >
      {artifact === "daynero" ? (
        <div className="signature-daynero" aria-hidden="true">
          <span className="daynero-orbit daynero-orbit--outer" />
          <span className="daynero-orbit daynero-orbit--inner" />
          <i className="daynero-now" />
          <strong>Today</strong>
          <small>behavior → guidance → next choice</small>
        </div>
      ) : null}

      {artifact === "disaster" ? (
        <div className="signature-disaster" aria-hidden="true">
          <span className="evidence-grid" />
          <i className="evidence-pin evidence-pin--one" />
          <i className="evidence-pin evidence-pin--two" />
          <i className="evidence-pin evidence-pin--three" />
          <strong>Point before verdict.</strong>
          <small>evidence filed · judgment inspectable</small>
        </div>
      ) : null}

      {artifact === "pentimento" ? (
        <div className="signature-pentimento" aria-hidden="true">
          <span>Machine account</span>
          <p>She drifted from the path that had been expected.</p>
          <i />
          <span>Subject reply</span>
          <strong>I chose another path.</strong>
          <small>withdrawn claim preserved beneath revision</small>
        </div>
      ) : null}

      {artifact === "invisible" ? (
        <div className="signature-invisible" aria-hidden="true">
          <span>Before</span>
          <i />
          <span>Away</span>
          <i />
          <span>Return</span>
          <strong>Work leaves the screen. Accountability returns.</strong>
          <small>result + boundary + receipt</small>
        </div>
      ) : null}

      {artifact === "atlas" ? (
        <div className="signature-atlas" aria-hidden="true">
          <span className="atlas-origin">Rule</span>
          <i className="atlas-line atlas-line--one" />
          <span className="atlas-node atlas-node--hold">Hold</span>
          <i className="atlas-line atlas-line--two" />
          <span className="atlas-node atlas-node--refine">Refine</span>
          <i className="atlas-line atlas-line--three" />
          <span className="atlas-node atlas-node--fracture">Fracture</span>
          <strong>Authority follows the lineage.</strong>
        </div>
      ) : null}

      <figcaption>
        <span>Interaction signature</span>
        <strong>{focus}</strong>
      </figcaption>
    </figure>
  );
}
