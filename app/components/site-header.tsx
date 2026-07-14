"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/#work", label: "Score", match: "/" },
  { href: "/about", label: "About", match: "/about" },
  { href: "/contact", label: "Contact", match: "/contact" },
];

const caseNames: Record<string, string> = {
  daynero: "Daynero",
  "design-or-disaster": "Design or Disaster",
  pentimento: "Pentimento",
  "invisible-interfaces": "Invisible Interfaces",
  atlas: "Atlas",
};

export function SiteHeader() {
  const pathname = usePathname();
  const caseSlug = pathname.startsWith("/work/") ? pathname.split("/").filter(Boolean).at(-1) : null;
  const caseName = caseSlug ? caseNames[caseSlug] : null;

  return (
    <header className="site-header site-header--instrument score-site-header">
      <Link className="site-identity" href="/" aria-label="Tanishk, interaction designer">
        <span className="identity-score" aria-hidden="true">
          <i /><i /><i /><b />
        </span>
        <span>
          Tanishk
          <small>Interaction Designer</small>
        </span>
      </Link>

      <p className="site-mode" aria-hidden="true">
        <span>{caseName ? "Case record" : "Interaction score"}</span>
        {caseName ?? "Five voices · one control"}
      </p>

      <nav aria-label="Primary navigation">
        {navigation.map((item) => {
          const active =
            item.match === "/"
              ? pathname === "/" || pathname.startsWith("/work/")
              : pathname.startsWith(item.match);
          return (
            <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
