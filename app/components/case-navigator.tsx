"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { Project } from "../data/portfolio";

const sections = [
  ["context", "Context"],
  ["pivot", "Pivot"],
  ["interaction", "Interaction"],
  ["system", "System"],
  ["proof", "Evidence"],
] as const;

export function CaseNavigator({
  title,
  chapterTitles,
}: {
  title: string;
  chapterTitles: Project["chapterTitles"];
}) {
  const [active, setActive] = useState("context");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const elements = sections
      .map(([id]) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-18% 0px -64%", threshold: [0.08, 0.28, 0.55] },
    );

    elements.forEach((element) => observer.observe(element));

    let frame = 0;
    const updateProgress = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (first && last) {
          const start = first.offsetTop;
          const end = last.offsetTop + last.offsetHeight - window.innerHeight;
          const distance = Math.max(end - start, 1);
          setProgress(
            Math.max(0, Math.min((window.scrollY - start) / distance, 1)),
          );
        }
        frame = 0;
      });
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateProgress);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const activeIndex = Math.max(
    0,
    sections.findIndex(([id]) => id === active),
  );

  return (
    <nav
      className="chapter-rail"
      aria-label={`${title} case study sections`}
      style={{ "--case-progress": progress } as CSSProperties}
    >
      <span className="chapter-rail-progress" aria-hidden="true" />
      <ol>
        {sections.map(([id, label], index) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={active === id ? "location" : undefined}
              data-passed={index <= activeIndex ? "true" : undefined}
              title={chapterTitles[id]}
            >
              <span className="chapter-rail-no">{String(index + 1).padStart(2, "0")}</span>
              <span className="chapter-rail-label">{label}</span>
            </a>
          </li>
        ))}
      </ol>
      <p className="chapter-rail-note" key={active}>
        {chapterTitles[active as keyof typeof chapterTitles]}
      </p>
    </nav>
  );
}
