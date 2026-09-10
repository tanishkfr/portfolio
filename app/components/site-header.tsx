"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeSwitch } from "./mode";

/**
 * Site rail. Quick Review is the published work index; Explore is represented
 * only by its construction notice.
 */

const navigation = [
  { href: "/", label: "Work", match: "/" },
  { href: "/about", label: "About", match: "/about" },
  { href: "/contact", label: "Contact", match: "/contact" },
];

const caseNames: Record<string, string> = {
  daynero: "Daynero",
  "fluxion-studios": "Fluxion Studios",
  "design-or-disaster": "Design or Disaster",
  pentimento: "Pentimento",
  "invisible-interfaces": "Invisible Interfaces",
  atlas: "Atlas",
};

export function SiteHeader() {
  const pathname = usePathname();
  const onField = pathname === "/";
  const caseSlug = pathname.startsWith("/work/")
    ? pathname.split("/").filter(Boolean).at(-1)
    : null;
  const caseName = caseSlug ? caseNames[caseSlug] : null;

  return (
    <header className="site-header" data-bare={onField}>
      <Link
        className="site-identity"
        href="/"
        aria-label="Tanishk, interaction designer"
      >
        Tanishk
        <small>Interaction Designer</small>
      </Link>

      {caseName ? (
        <p className="site-mode" aria-hidden="true">
          Case — <strong>{caseName}</strong>
        </p>
      ) : null}

      <div className="site-header-tools">
        <ModeSwitch />
        <nav aria-label="Primary navigation">
          {navigation.map((item) => {
            const active = item.label === "Work"
              ? pathname.startsWith("/work/")
              : pathname.startsWith(item.match);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
