/**
 * ACT 3 — the hinge.
 *
 * Arrival said what I do. Descent showed interfaces asking less.
 * This is the turn: behaviour still has to be designed. The Fluxion
 * pigment sits beside the sentence — the work is already in the room.
 */

export function Rift() {
  return (
    <section
      className="xp-rift"
      data-stage
      data-room="fluxion-studios"
      aria-label="The behaviour still has to be designed"
    >
      <div className="xp-rift-pin">
        <div className="xp-rift-copy">
          <p className="xp-rift-kicker">So what do I actually design?</p>
          <p className="xp-rift-note">
            The interesting part is usually the behaviour, not the skin.
          </p>
          <p className="xp-rift-next">So I built these.</p>
        </div>
        <div className="xp-rift-world" aria-hidden="true">
          <span className="xp-rift-ghost">
            Fluxion
            <i />
          </span>
          <span className="xp-rift-ghost-cap">the studio, live</span>
        </div>
      </div>
    </section>
  );
}
