"use client";

import { useSyncExternalStore } from "react";

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
  if (typeof document === "undefined") return "full";
  const value = document.documentElement.dataset.mode;
  return isMode(value) ? value : "full";
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
  return useSyncExternalStore(subscribe, current, () => "full");
}

export function ModeSwitch() {
  const mode = useMode();

  return (
    <div className="mode-switch" role="group" aria-label="How do you want to read this?">
      <button
        type="button"
        aria-pressed={mode === "full"}
        onClick={() => setMode("full")}
      >
        Explore
      </button>
      <button
        type="button"
        aria-pressed={mode === "review"}
        onClick={() => setMode("review")}
      >
        Quick review
      </button>
    </div>
  );
}
