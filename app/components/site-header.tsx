"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { modeHref, setMode, useMode, type Mode } from "./mode";

/**
 * One rail, four real destinations: Projects, About, Résumé, Contact.
 *
 * Projects is one destination, not two: the same six projects read in two
 * ways — Explore, the authored folio (the default reading), and Quick view,
 * the concise index for a fast pass. While the projects are on screen the
 * two readings sit as an explicit control beside the Projects link, so a
 * first-time visitor can see they are modes of one place rather than two
 * pages that happen to repeat each other. Off the projects the control
 * steps aside.
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
  const mode = useMode();
  const onHome = pathname === "/";
  const inWork = pathname.startsWith("/work");
  const inProjects = onHome || inWork;

  function handleMode(event: MouseEvent<HTMLAnchorElement>, next: Mode) {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }
    /* The control only renders on the homepage, where there is no route
       change to make: set the reading in place and settle the scroll at
       the top. The hrefs stay real URLs for reloads and direct visits. */
    event.preventDefault();
    if (mode !== next) setMode(next);
    window.history.replaceState(window.history.state, "", modeHref(next));
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    window.dispatchEvent(new Event("portfolio:pin"));
  }

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
        {onHome ? (
          <span className="nav-modes" aria-label="Two ways to read the projects">
            <Link
              href="/"
              data-active={mode === "full" || undefined}
              aria-label="Explore — the projects as one authored folio"
              onClick={(event) => handleMode(event, "full")}
            >
              Explore
            </Link>
            <Link
              href="/?mode=review"
              data-active={mode === "review" || undefined}
              aria-label="Quick view — the projects as a plain list"
              onClick={(event) => handleMode(event, "review")}
            >
              Quick view
            </Link>
          </span>
        ) : null}
      </nav>
    </header>
  );
}
