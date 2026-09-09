"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeSwitch, setMode, useMode } from "./mode";

/**
 * Instrument rail. Recedes on the field, but never leaves — Explore,
 * Quick Review, Work, About, and Contact stay reachable through the
 * whole descent.
 */

const navigation = [
  { href: "/#work", label: "Work", match: "/" },
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
  const mode = useMode();
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
            const isWork = item.label === "Work";
            const active = isWork
              ? pathname.startsWith("/work/") ||
                (pathname === "/" && mode === "full")
              : pathname.startsWith(item.match);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={
                  isWork
                    ? (event) => {
                        setMode("full");
                        if (pathname !== "/") return;
                        event.preventDefault();
                        window.history.replaceState(
                          window.history.state,
                          "",
                          "/#work",
                        );
                        requestAnimationFrame(() => {
                          requestAnimationFrame(() => {
                            const work = document.getElementById("work");
                            if (!work) return;
                            const top =
                              work.getBoundingClientRect().top + window.scrollY;
                            window.scrollTo(0, Math.max(0, top - 8));
                            window.dispatchEvent(new Event("portfolio:pin"));
                          });
                        });
                      }
                    : undefined
                }
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
