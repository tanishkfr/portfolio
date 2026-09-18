import { redirect } from "next/navigation";

/**
 * RETIRED ROUTE.
 *
 * Quick review was a second reading mode that duplicated the five selected
 * projects. It is gone from the portfolio: the homepage index is the one
 * place to scan the work and jump to a project. This route is kept only so
 * that old links, bookmarks and shared URLs do not 404 — it forwards to the
 * homepage's existing work anchor.
 */
export default function QuickReviewRetired() {
  redirect("/#work");
}
