import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { MotionDirector } from "./components/motion-director";
import { SiteHeader } from "./components/site-header";
import "./globals.css";
import "./polish.css";
import "./experience.css";
import "./hiring.css";

async function requestOrigin() {
  const headerList = await headers();
  const forwardedHost = headerList.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost ?? headerList.get("host") ?? "localhost:3000";
  const forwardedProtocol = headerList
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  const protocol =
    forwardedProtocol ??
    (host.startsWith("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https");
  return new URL(`${protocol}://${host}`);
}

export async function generateMetadata(): Promise<Metadata> {
  const metadataBase = await requestOrigin();
  return {
    metadataBase,
    title: {
      default: "Tanishk — Interaction Designer",
      template: "%s — Tanishk",
    },
    description:
      "Independent interaction design work about evidence, authority, memory, and accountable system behavior.",
    authors: [{ name: "Tanishk" }],
    creator: "Tanishk",
    category: "Interaction Design",
    formatDetection: { email: false, address: false, telephone: false },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: "/",
      siteName: "Tanishk — Interaction Designer",
      title: "Tanishk — Interaction Designer",
      description:
        "Five live interaction-design artifacts that make hidden system behavior visible enough to challenge.",
      images: [{ url: "/og.png", alt: "Tanishk — Interaction Designer" }],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@madebytanishk",
      title: "Tanishk — Interaction Designer",
      description:
        "Products and research instruments about evidence, authority, memory, and accountability.",
      images: ["/og.png"],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f2f0e8",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <MotionDirector />
        <SiteHeader />
        {children}
        <footer className="site-footer">
          <div className="footer-identity">
            <strong>Tanishk</strong>
            <span>Interaction Designer · Bangalore</span>
          </div>
          <div className="footer-links">
            <a href="mailto:madebytanishk@gmail.com">Email</a>
            <a
              href="https://twitter.com/madebytanishk"
              target="_blank"
              rel="noreferrer"
            >
              X / Twitter <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <Link href="/">Work</Link>
          </div>
          <p>© {new Date().getFullYear()} Tanishk</p>
        </footer>
      </body>
    </html>
  );
}
