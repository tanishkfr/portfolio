import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep project imagery provider-agnostic. Vinext's optimizer requires
  // Cloudflare bindings that are intentionally absent in local and Vercel builds.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
