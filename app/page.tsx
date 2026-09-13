import type { Metadata } from "next";
import { WorkIndex } from "./components/work-index";
import type { Mode } from "./components/mode";

export const metadata: Metadata = {
  title: { absolute: "Tanishk — Interaction Designer" },
  description:
    "Selected work by Tanishk: Fluxion Studios, four independent interaction projects, and Daynero.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Tanishk — Interaction Designer",
    title: "Tanishk — Interaction Designer",
    description:
      "Studio work, four independent interaction projects, and a product case in progress.",
    images: [{ url: "/og.png", alt: "Tanishk — Interaction Designer" }],
  },
};

/**
 * The reading is decided by the URL before anything renders: `/` is the
 * folio, `/?mode=review` is the concise index. Passing the resolved mode
 * down as the server snapshot means each URL's own markup is what the
 * server sends — a no-JavaScript visitor gets the reading the address
 * promises, and hydration never flashes the other reading.
 */
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const params = await searchParams;
  const initialMode: Mode = params.mode === "review" ? "review" : "full";
  return <WorkIndex initialMode={initialMode} />;
}
