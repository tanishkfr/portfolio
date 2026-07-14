"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/#work", label: "Work", match: "/" },
  { href: "/about", label: "About", match: "/about" },
  { href: "/contact", label: "Contact", match: "/contact" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header site-header--instrument">
      <Link className="site-identity" href="/" aria-label="Tanishk, interaction designer">
        <span className="identity-mark" aria-hidden="true">T</span>
        <span>
          Tanishk
          <small>Interaction Designer</small>
        </span>
      </Link>

      <p className="site-mode" aria-hidden="true">
        <span>Selected work</span>
        Bangalore · 2026
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
