export function ComingSoonMark({
  title,
  note,
}: {
  title: string;
  note: string;
}) {
  return (
    <figure className="xp-room-shot xp-soon">
      <p className="xp-soon-kicker">Coming soon</p>
      <p className="xp-soon-title">{title}</p>
      <figcaption>{note}</figcaption>
    </figure>
  );
}
