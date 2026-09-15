"use client";

import { Explore } from "./explore";
import { SiteFooter } from "./site-footer";

/**
 * The projects reading is one folio: Explore's cover, index and six
 * sheets, then the global closing plate. One reading, one URL.
 */
export function WorkIndex() {
  return (
    <>
      <Explore />
      <SiteFooter year={new Date().getFullYear()} force />
    </>
  );
}
