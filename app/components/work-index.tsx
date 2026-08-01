"use client";

import { useMode } from "./mode";
import { ReviewIndex } from "./review-index";
import { Explore } from "./explore";

/**
 * Two ways in. The server renders the full field, so no JavaScript still
 * lands on Explore; ?mode=review (or the switch) recuts to the fast digest.
 */
export function WorkIndex() {
  const mode = useMode();
  if (mode === "review") return <ReviewIndex />;
  return <Explore />;
}
