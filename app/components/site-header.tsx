"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { modeHref, setMode, useMode, type Mode } from "./mode";

/**
 * One rail, four real destinations: Explore, Work, About, Contact.
 *
 * Explore — the authored folio — is the primary portfolio and the default
 * route, so it reads first. Work is the concise visual index, the recruiter
 * fast path; it stays one click away. They are two readings of the same
 * homepage, distinguished in the URL rather than by a hidden session state,
 * so a reload always keeps the reading you chose. The header never echoes
 * the case title — the case owns its title.
 */

type NavItem = {
  key: string;
  label: string;
  href: string;
  mode?: Mode;
};

const navigation: NavItem[] = [
  { key: "explore", label: "Explore", href: "/", mode: "full" },
  { key: "work", label: "Work", href: "/?mode=review", mode: "review" },
  { key: "about", label: "About", href: "/about" },
  { key: "contact", label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const mode = useMode();
  const onHome = pathname === "/";
  const inWork = pathname.startsWith("/work");

  function active(key: string) {
    if (key === "work") return inWork || (onHome && mode === "review");
    if (key === "explore") return onHome && mode === "full";
    return pathname.startsWith(`/${key}`);
  }

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
    /* Off the homepage the link navigates normally and the query picks the
       reading on arrival. On the homepage there is no route change to make,
       so set the mode in place and settle the scroll at the top. */
    if (!onHome) {
      setMode(next);
      return;
    }
    event.preventDefault();
    if (mode !== next) setMode(next);
    window.history.replaceState(window.history.state, "", modeHref(next));
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    window.dispatchEvent(new Event("portfolio:pin"));
  }

  return (
    <header className="site-header" data-bare={onHome}>
      <Link
        className="site-identity"
        href="/"
        aria-label="Tanishk, interaction designer"
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
        <small>Interaction Designer</small>
      </Link>

      <nav aria-label="Primary navigation">
        {navigation.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            aria-current={active(item.key) ? "page" : undefined}
            onClick={
              item.mode
                ? (event) => handleMode(event, item.mode as Mode)
                : undefined
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
