"use client";

import { useEffect, useState, type CSSProperties } from "react";

const sections = [
  ["problem", "Problem"],
  ["shift", "Shift"],
  ["interaction", "Interaction"],
  ["decisions", "Decisions"],
  ["evidence", "Evidence"],
  ["limits", "Limits"],
] as const;

export function CaseNavigator({ title }: { title: string }) {
  const [active, setActive] = useState("problem");
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
      { rootMargin: "-20% 0px -62%", threshold: [0.08, 0.3, 0.6] },
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
          setProgress(Math.max(0, Math.min((window.scrollY - start) / (end - start), 1)));
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

  return (
    <aside
      className="case-toc case-toc--interactive"
      aria-label={title + " case study sections"}
      style={{ "--case-progress": progress } as CSSProperties}
    >
      <div className="case-progress-track" aria-hidden="true">
        <span />
      </div>
      <div>
        <p className="eyebrow">Case study · 6 parts</p>
        <nav>
          {sections.map(([id, label], index) => (
            <a
              href={"#" + id}
              key={id}
              aria-current={active === id ? "location" : undefined}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {label}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
