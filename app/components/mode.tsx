"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * Two ways in, because two kinds of people arrive:
 *
 *   full   — the field. Five names, no explanation, discovered by hand.
 *   review — no ceremony. Every project, compact, in ninety seconds.
 *
 * The mode is a presentation state on the root element. The server
 * always renders the full field, so no JavaScript means the field.
 * It persists for the session only — a reviewer who once chose the digest
 * should not be silently returned to it weeks later and never see the work.
 * Linkable with ?mode=review —
 * so a reviewer with four minutes can be sent straight to the goods.
 */

export type Mode = "full" | "review";

function isMode(value: unknown): value is Mode {
  return value === "full" || value === "review";
}

function current(): Mode {
  if (typeof document === "undefined") return "review";
  const value = document.documentElement.dataset.mode;
  return isMode(value) ? value : "review";
}

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setMode(mode: Mode) {
  document.documentElement.dataset.mode = mode;
  try {
    sessionStorage.setItem("mode", mode);
  } catch {
    /* private mode: the choice lasts the session */
  }
  listeners.forEach((listener) => listener());
}

export function useMode(): Mode {
  return useSyncExternalStore(subscribe, current, () => "review");
}

export function ModeSwitch() {
  const mode = useMode();
  const pathname = usePathname();
  const router = useRouter();
  const [showExploreNotice, setShowExploreNotice] = useState(false);

  useEffect(() => {
    if (!showExploreNotice) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setShowExploreNotice(false);
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [showExploreNotice]);

  function go(next: Mode) {
    if (next === mode) return;

    /* The two readings have radically different lengths. Preserving a deep
       Explore scroll offset can land Quick review at its final project, while
       the reverse can drop someone into the middle of Descent. Reset inside
       the same event so the newly mounted reading paints at its beginning. */
    if (pathname === "/") {
      const root = document.documentElement;
      const previous = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      root.style.scrollBehavior = previous;
      window.dispatchEvent(new Event("portfolio:pin"));
    }
    setMode(next);
    const query = next === "review" ? "/?mode=review" : "/?mode=full";
    if (pathname !== "/") {
      router.push(query);
      return;
    }
    const url = next === "review" ? "/?mode=review" : "/";
    window.history.replaceState(window.history.state, "", url);
  }

  return (
    <div className="mode-switch" role="group" aria-label="How do you want to read this?">
      <button
        type="button"
        aria-pressed={mode === "full"}
        onClick={() => setShowExploreNotice(true)}
      >
        Explore
      </button>
      <button
        type="button"
        aria-pressed={mode === "review"}
        aria-label="Quick review"
        onClick={() => go("review")}
      >
        <span className="mode-label-full">Quick review</span>
        <span className="mode-label-short">Review</span>
      </button>

      {showExploreNotice ? (
        <div
          className="mode-notice-backdrop"
          role="presentation"
          onClick={() => setShowExploreNotice(false)}
        >
          <section
            className="mode-notice"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mode-notice-title"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="mode-notice-kicker">Explore · in progress</p>
            <h2 id="mode-notice-title">Still being made.</h2>
            <p>
              Explore is under construction for now. Keep using Quick Review
              to see the work.
            </p>
            <button
              className="mode-notice-close"
              type="button"
              onClick={() => setShowExploreNotice(false)}
            >
              Keep browsing
            </button>
          </section>
        </div>
      ) : null}
    </div>
  );
}
