import Image from "next/image";
import type { ReactNode } from "react";

/**
 * CASE EVIDENCE — real interface captures from the deployed artifacts
 * and shipped sites, presented as editorial figures inside the case
 * they belong to. Every image is a genuine capture of the live
 * artifact, taken for this portfolio; nothing here is decorative.
 */

export function CaseFigure({
  src,
  alt,
  width,
  height,
  label,
  caption,
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  label: string;
  caption: string;
  priority?: boolean;
}) {
  return (
    <figure className="case-media">
      <div className="case-media-frame">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 64rem) 62rem, 100vw"
          className="case-media-image"
          priority={priority}
        />
      </div>
      <figcaption className="case-media-caption">
        <strong>{label}</strong>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}

/** A desktop capture with its mobile companion in one reading row. */
export function CaseMediaPair({
  desktop,
  mobile,
  label,
  caption,
  priority = false,
}: {
  desktop: { src: string; alt: string };
  mobile: { src: string; alt: string };
  label: string;
  caption: string;
  priority?: boolean;
}) {
  return (
    <figure className="case-media case-media--pair">
      <div className="case-media-row">
        <div className="case-media-frame case-media-frame--wide">
          <Image
            src={desktop.src}
            alt={desktop.alt}
            width={1440}
            height={900}
            sizes="(min-width: 64rem) 52rem, 100vw"
            className="case-media-image"
            priority={priority}
          />
        </div>
        <div className="case-media-frame case-media-frame--tall">
          <Image
            src={mobile.src}
            alt={mobile.alt}
            width={390}
            height={844}
            sizes="13rem"
            className="case-media-image"
            priority={priority}
          />
        </div>
      </div>
      <figcaption className="case-media-caption">
        <strong>{label}</strong>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}

/** A numbered progression: each step proves one beat of the flow. */
export function CaseEvidenceSequence({
  label,
  intro,
  steps,
  note,
}: {
  label: string;
  intro: string;
  steps: {
    src: string;
    alt: string;
    width: number;
    height: number;
    step: string;
    caption: string;
  }[];
  note?: string;
}) {
  return (
    <section className="case-evidence" aria-label={label}>
      <header className="record-head">
        <p className="case-label">{label}</p>
        <h2>{intro}</h2>
      </header>
      <div className="case-evidence-sequence">
        {steps.map((step, index) => (
          <figure className="case-media case-media--step" key={step.src}>
            <span className="case-media-step" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="case-media-frame">
              <Image
                src={step.src}
                alt={step.alt}
                width={step.width}
                height={step.height}
                sizes="(min-width: 64rem) 30rem, 100vw"
                className="case-media-image"
              />
            </div>
            <figcaption className="case-media-caption">
              <strong>{step.step}</strong>
              <span>{step.caption}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="case-evidence-note">
        {note ??
          `Captured from the live artifact, ${new Date().getFullYear()}. The embedded demonstration above remains the primary way to inspect it.`}
      </p>
    </section>
  );
}

export function EvidenceWrap({ children }: { children: ReactNode }) {
  return <div className="case-evidence-wrap">{children}</div>;
}
