"use client";

import { CloseBridge } from "./close-bridge";
import { Explore } from "./explore";
import { MoreWork } from "./more-work";
import { SiteFooter } from "./site-footer";

/**
 * The projects reading is one folio: Explore's cover, index and five
 * selected sheets, a compact More Work shelf, one quiet closing note,
 * then the global closing plate. One reading, one URL.
 */
export function WorkIndex() {
  return (
    <>
      <Explore />
      <MoreWork />
      <CloseBridge />
      <SiteFooter year={new Date().getFullYear()} force />
    </>
  );
}
