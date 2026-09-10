import type { Metadata } from "next";
import { WorkIndex } from "./components/work-index";

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

export default function Home() {
  return <WorkIndex />;
}
