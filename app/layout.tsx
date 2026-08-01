import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { MotionDirector } from "./components/motion-director";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { RouteSettler } from "./components/transition-link";
import "./styles/system.css";
import "./styles/home.css";
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
      default: "Tanishk — Interaction Designer",
      template: "%s — Tanishk",
    },
    description:
      "Interaction-design work by Tanishk: a commercial AI-native finance product and four working investigations into agency, evidence, and intelligent systems.",
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
        "Five interaction systems examined with one question at a time: what each shows, what it decides, and what that changes.",
      images: [{ url: "/og.png", alt: "Tanishk — Interaction Designer" }],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@madebytanishk",
      title: "Tanishk — Interaction Designer",
      description:
        "Five interaction systems about money, evidence, authority, memory, and accountability.",
      images: ["/og.png"],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8f3e4",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-mode="full" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/fraunces-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* The chosen mode applies before first paint. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var q=new URLSearchParams(location.search).get('mode');var m=q||sessionStorage.getItem('mode');if(m==='review'||m==='full'){document.documentElement.dataset.mode=m;if(q)sessionStorage.setItem('mode',m);}}catch(t){}})();",
          }}
        />
      </head>
      <body>
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
