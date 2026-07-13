import type { Metadata } from "next";
import { LivingIndex } from "./components/living-index";
import { isLensId } from "./data/portfolio";

export const metadata: Metadata = {
  title: { absolute: "Tanishk — Interaction Designer" },
  description:
    "Five interaction design projects about evidence, authority, memory, and accountable system behavior.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Tanishk — Interaction Designer",
    title: "Tanishk — Interaction Designer",
    description:
      "Five interaction design projects about evidence, authority, memory, and accountable system behavior.",
    images: [{ url: "/og.png", alt: "Tanishk — Interaction Designer" }],
  },
};

type HomeProps = {
  searchParams: Promise<{ lens?: string | string[] }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const value = Array.isArray(params.lens) ? params.lens[0] : params.lens;
  const initialLens = isLensId(value) ? value : "all";
  return <LivingIndex initialLens={initialLens} />;
}
