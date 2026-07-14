import type { Metadata } from "next";
import { LivingIndex } from "./components/living-index";

export const metadata: Metadata = {
  title: { absolute: "Tanishk — Interaction Designer" },
  description:
    "Operate one exposure instrument across five live systems and reveal the rule beneath each interface.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Tanishk — Interaction Designer",
    title: "Tanishk — Interaction Designer",
    description:
      "One gesture exposes memory, authority, evidence, delegation, and reasoning across five live interaction-design systems.",
    images: [{ url: "/og.png", alt: "Tanishk — System Exposure" }],
  },
};

export default function Home() {
  return <LivingIndex />;
}
