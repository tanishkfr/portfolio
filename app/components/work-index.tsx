"use client";

import { useEffect } from "react";
import { Explore } from "./explore";
import { setMode, useMode, type Mode } from "./mode";
import { ReviewIndex } from "./review-index";
import { SiteFooter } from "./site-footer";

/**
 * The homepage has two readings of the same work.
 *
 *   `/`              → Explore, the authored folio. The primary entrance.
 *   `/?mode=review`  → Work, the concise visual index.
 *
 * The mode is derived from the URL, never from scroll or a session guess:
 * reloading Explore keeps Explore, reloading Work keeps Work, and a direct
 * case URL is unaffected. The inline script in layout.tsx applies the mode
 * before first paint; this effect only reconciles state after a client
 * navigation that changed the query without remounting the route.
 *
 * Both readings resolve onto the same global footer: Explore's narrative
 * close hands off to it, and the review index renders it directly.
 */
export function WorkIndex({ initialMode }: { initialMode: Mode }) {
  const mode = useMode(initialMode);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get("mode");
    if (query === "review" || query === "full") {
      if (query !== mode) setMode(query);
      return;
    }
    /* No mode query means the folio. Landing on `/#work` from a case return
       or the close section is still Explore, just at the anchor. */
    if (mode !== "full") setMode("full");
  }, [mode]);

  if (mode === "full") {
    return (
      <>
        <Explore />
        <SiteFooter year={new Date().getFullYear()} force />
      </>
    );
  }
  return <ReviewIndex />;
}
