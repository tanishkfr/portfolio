import Image from "next/image";

export function FluxionMark() {
  return (
    <figure className="xp-room-shot xp-flux">
      <div className="xp-flux-brand">
        <Image
          unoptimized
          src="/projects/fluxion/wordmark-transparent.png"
          width={669}
          height={42}
          sizes="(max-width: 960px) 88vw, 52vw"
          alt=""
        />
      </div>
      <figcaption>Studio website · designed and built in-house</figcaption>
    </figure>
  );
}
