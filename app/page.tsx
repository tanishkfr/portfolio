import type { Metadata } from "next";
import { LivingIndex } from "./components/living-index";

export const metadata: Metadata = {
  title: { absolute: "Tanishk — Interaction Designer" },
  description:
    "Commercial product work and independent interaction-design investigations into money, agency, evidence, and intelligent systems.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Tanishk — Interaction Designer",
    title: "Tanishk — Interaction Designer",
    description:
      "Product work and self-directed experiments about the decisions hidden underneath an interface.",
    images: [{ url: "/og.png", alt: "Tanishk — Interaction Designer" }],
  },
};

export default function Home() {
  return <LivingIndex />;
}
