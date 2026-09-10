import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tanishk — Interaction Designer",
    short_name: "Tanishk",
    description:
      "Interaction-design work by Tanishk, including studio, product, and independent projects.",
    start_url: "/",
    display: "browser",
    background_color: "#f2f0e8",
    theme_color: "#f2f0e8",
  };
}
