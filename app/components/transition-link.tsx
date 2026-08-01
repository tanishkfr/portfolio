"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ComponentProps, type MouseEvent } from "react";

/**
 * Shared-element navigation. An exhibit row's title morphs into the
 * case title (and back) through the View Transitions API — the index
 * line literally becomes the record it opens. Browsers without
 * support, reduced-motion readers, modified clicks, and same-path
 * hash jumps all fall through to ordinary navigation.
 */

type StartViewTransition = (callback: () => Promise<void>) => unknown;

const settlers: Array<() => void> = [];

function pathnameOf(href: string) {
  return href.split("#")[0].split("?")[0] || "/";
}

export function TransitionLink({
  onClick,
  ...props
}: ComponentProps<typeof Link>) {
  const router = useRouter();
  const pathname = usePathname();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    const href = typeof props.href === "string" ? props.href : null;
    if (!href || !href.startsWith("/")) return;
    if (pathnameOf(href) === pathname) return;

    const start = (
      document as Document & { startViewTransition?: StartViewTransition }
    ).startViewTransition?.bind(document);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!start || reduced) return;

    event.preventDefault();
    start(() => {
      router.push(href);
      return new Promise<void>((resolve) => {
        settlers.push(resolve);
        // never hold the old frame hostage to a slow route
        setTimeout(resolve, 1200);
      });
    });
  }

  return <Link {...props} onClick={handleClick} />;
}

/** Resolves pending view transitions once the new route has rendered. */
export function RouteSettler() {
  const pathname = usePathname();
  useEffect(() => {
    while (settlers.length > 0) settlers.shift()?.();
  }, [pathname]);
  return null;
}
