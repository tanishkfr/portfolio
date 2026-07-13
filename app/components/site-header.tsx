"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <Link className="site-identity" href="/" aria-label="Tanishk, work index">
        <span className="identity-mark" aria-hidden="true">
          T
        </span>
        <span>
          Tanishk
          <small>Interaction Designer</small>
        </span>
      </Link>

      <nav aria-label="Primary navigation">
        {navigation.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/" || pathname.startsWith("/work/")
              : pathname.startsWith(item.href);
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

      <Link
        className="availability-link"
        href="/contact"
        aria-label="Available for interaction design work — contact Tanishk"
      >
        <span className="availability-dot" aria-hidden="true" />
        Available for work
      </Link>
    </header>
  );
}
