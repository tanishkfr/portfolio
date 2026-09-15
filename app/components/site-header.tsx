"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * One rail, four real destinations: Projects, About, Résumé, Contact.
 *
 * The header never echoes the case title — the case owns its title.
 */

const navigation = [
  { key: "projects", label: "Projects", href: "/" },
  { key: "about", label: "About", href: "/about" },
  { key: "resume", label: "Résumé", href: "/resume" },
  { key: "contact", label: "Contact", href: "/contact" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const inWork = pathname.startsWith("/work");
  const inProjects = onHome || inWork;

  function active(key: string) {
    if (key === "projects") return inProjects;
    return pathname.startsWith(`/${key}`);
  }

  return (
    <header className="site-header" data-bare={onHome}>
      <Link
        className="site-identity"
        href="/"
        aria-label="Tanishk, product and interaction designer"
      >
        {/* the state rule carries the name — the favicon's T mark, the
            same compressed bar-and-stem the splash and footer resolve
            from, held at carrying size */}
        <svg
          className="identity-mark"
          viewBox="0 0 64 64"
          aria-hidden="true"
          focusable="false"
        >
          <rect width="64" height="64" rx="14" fill="#3a1ff0" />
          <rect x="13" y="15" width="38" height="11" fill="#e8eae4" />
          <rect x="27" y="15" width="10" height="34" fill="#e8eae4" />
        </svg>
        <span className="identity-name">Tanishk</span>
        <small>Product &amp; Interaction Designer</small>
      </Link>

      <nav aria-label="Primary navigation">
        {navigation.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            aria-current={active(item.key) ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
