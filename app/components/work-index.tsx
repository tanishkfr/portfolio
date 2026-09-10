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
    /* A direct homepage visit is the digest. The Work anchor remains an
       explicit request for the field. */
    if (window.location.hash === "#work") {
      setMode("full");
    }
  }, []);

  if (mode === "review") return <ReviewIndex />;
  return <Explore />;
}
