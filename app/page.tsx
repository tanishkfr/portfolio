import type { Metadata } from "next";
import { WorkIndex } from "./components/work-index";

export const metadata: Metadata = {
  title: { absolute: "Tanishk — Product & Interaction Designer" },
  description:
    "Selected work by Tanishk: Fluxion Studios, Athena, Daynero, and independent interaction projects.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Tanishk — Product & Interaction Designer",
    title: "Tanishk — Product & Interaction Designer",
    description:
      "Studio work, a learning product, a finance product, and independent interaction research.",
    images: [{ url: "/og.png", alt: "Tanishk — Product & Interaction Designer" }],
  },
};

export default function Home() {
  return <WorkIndex />;
}
