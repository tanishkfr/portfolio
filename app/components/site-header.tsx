"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/", label: "Instrument" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header site-header--instrument">
      <Link className="site-identity" href="/" aria-label="Tanishk, portfolio instrument">
        <span className="identity-mark" aria-hidden="true">T</span>
        <span>
          Tanishk
          <small>Interaction Designer</small>
        </span>
      </Link>

      <p className="site-mode" aria-hidden="true">
        <span>Instrument 01</span>
        System exposure
      </p>

      <nav aria-label="Primary navigation">
        {navigation.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/" || pathname.startsWith("/work/")
              : pathname.startsWith(item.href);
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
