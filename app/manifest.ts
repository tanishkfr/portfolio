import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tanishk — Interaction Designer",
    short_name: "Tanishk",
    description:
      "Independent interaction design work about evidence, authority, memory, and accountable system behavior.",
    start_url: "/",
    display: "browser",
    background_color: "#f2f0e8",
    theme_color: "#f2f0e8",
  };
}
