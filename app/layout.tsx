import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { MotionDirector } from "./components/motion-director";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { PointerMark } from "./components/pointer-cursor";
import { SplashGate } from "./components/splash";
import { RouteSettler } from "./components/transition-link";
import "./styles/system.css";
import "./styles/explore.css";
import "./styles/case.css";
import "./styles/pages.css";

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
      default: "Tanishk — Product & Interaction Designer",
      template: "%s — Tanishk",
    },
    description:
      "Work by Tanishk, a product and interaction designer in Bengaluru who also builds.",
    authors: [{ name: "Tanishk" }],
    creator: "Tanishk",
    category: "Product & Interaction Design",
    formatDetection: { email: false, address: false, telephone: false },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: "/",
      siteName: "Tanishk — Product & Interaction Designer",
      title: "Tanishk — Product & Interaction Designer",
      description:
        "Fluxion Studios, four independent interaction projects, and Daynero, by Tanishk.",
      images: [{ url: "/og.png", alt: "Tanishk — Product & Interaction Designer" }],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#e8eae4",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/instrument-sans-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/instrument-serif-400italic-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
      <SplashGate />
        <PointerMark />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <MotionDirector />
        <RouteSettler />
        <SiteHeader />
        {children}
        <SiteFooter year={new Date().getFullYear()} />
      </body>
    </html>
  );
}
