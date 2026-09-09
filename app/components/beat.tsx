import type { CSSProperties, ReactNode } from "react";

/**
 * A BEAT.
 *
 * One held line, one viewport of scroll. Nothing to do and nothing to read but
 * the sentence, and then it releases you.
 *
 * These are the rhythm. Long developed scenes back to back flatten into one
 * long scene; a single short beat between them resets the ear, the way a rest
 * does in music. It fades up and back down across its own budget so it is
 * never a section you scroll past — it is a moment that happens and ends.
 */

export function Beat({
  children,
  len = 1.4,
}: {
  children: ReactNode;
  len?: number;
}) {
  return (
    <section
      className="xp-beat"
      data-stage
      style={{ "--len": len } as CSSProperties}
    >
      <div className="xp-beat-pin">
        <p className="xp-beat-line">{children}</p>
      </div>
    </section>
  );
}
