"use client";

import { useEffect } from "react";
import { Explore } from "./explore";
import { setMode, useMode } from "./mode";
import { ReviewIndex } from "./review-index";

export function WorkIndex() {
  const mode = useMode();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get("mode");
    if (query === "review" || query === "full") {
      setMode(query);
      return;
    }
    /* Work is the field, not the digest. A stale session choice must not
       win when the visitor asked for #work. */
    if (window.location.hash === "#work") {
      setMode("full");
    }
  }, []);

  if (mode === "review") return <ReviewIndex />;
  return <Explore />;
}
