"use client";

import { CloseBridge } from "./close-bridge";
import { Explore } from "./explore";
import { SiteFooter } from "./site-footer";

/**
 * The projects reading is one folio: Explore's cover, index and six
 * sheets, one quiet closing note, then the global closing plate. One
 * reading, one URL.
 */
export function WorkIndex() {
  return (
    <>
      <Explore />
      <CloseBridge />
      <SiteFooter year={new Date().getFullYear()} force />
    </>
  );
}
