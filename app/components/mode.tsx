"use client";

import { useSyncExternalStore } from "react";

/**
 * Two ways in, because two kinds of people arrive:
 *
 *   full   — Explore. The authored folio. Six working sheets, entered
 *            through a cover that names the designer and opens straight
 *            into the work. This is the primary portfolio and the
 *            default route.
 *   review — Work. The concise visual index. Every project, scannable,
 *            each row carrying a working piece of the project.
 *
 * The mode is a presentation state on the root element, mirrored into
 * the URL so it is deterministic: `/` is Explore, and `/?mode=review` is
 * Work. Both remain real URLs, so a reload always keeps the reading you
 * chose. The mode persists for the session only — a reviewer who once
 * chose the index should not be silently returned to it weeks later and
 * never see the folio again.
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

export function useMode(serverMode: Mode = "full"): Mode {
  return useSyncExternalStore(subscribe, current, () => serverMode);
}

export function modeHref(mode: Mode, hash = "") {
  return mode === "review" ? `/?mode=review${hash}` : `/${hash}`;
}
