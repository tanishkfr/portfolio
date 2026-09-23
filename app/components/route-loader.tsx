"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * The route plate.
 *
 * A page change on this site is usually instant — the routes are small and
 * the client has them — so a loading screen that appeared on every click
 * would be a 40ms flash, which reads as a glitch rather than as feedback.
 * This one waits: it arms on the click and only draws if the destination
 * has not landed shortly after, then holds long enough that it cannot
 * strobe. On a warm navigation it never appears at all; on a cold route, a
 * slow connection or a back/forward into an unloaded page it appears and
 * says where the reader asked to go.
 *
 * It also stands down for the View Transition. `TransitionLink` morphs a
 * shared element between routes, and its snapshot is painted in the top
 * layer, above anything this component can draw — so while a transition is
 * in flight the motion *is* the feedback, and the plate waits it out
 * rather than flickering underneath it.
 *
 * The plate speaks the folio's own language: paper, the pixel wordmark, a
 * mono note naming the destination, and the same hairline rule the splash
 * opens with — filled in stepped eighths, the field's quantisation, one
 * pass, no loop.
 */
type Phase = "idle" | "loading" | "leaving";

/** How long a navigation may take before the plate is worth drawing. Warm
    navigations on this build measure 18–102ms, so 95 is set to catch the
    ones a reader would actually feel without marking the ones they would
    not: a plate that appears for a 20ms change is a flash, not feedback. */
const SHOW_AFTER = 95;
/** once drawn, how long it stays even if the route lands immediately after */
const MIN_VISIBLE = 220;
/** a failed navigation must not leave a full-screen plate over the page */
const MAX_WAIT = 5000;
/** must match the exit transition in the stylesheet */
const EXIT_MS = 240;

/** the path a link points at, without its query or hash */
function destination(href: string): string {
  return href.split("#")[0].split("?")[0] || "/";
}

/** what to call the destination, in the reader's own words */
function labelOf(link: HTMLAnchorElement): string {
  const aria = link.getAttribute("aria-label");
  if (aria) return aria.slice(0, 40);
  const clone = link.cloneNode(true) as HTMLElement;
  clone.querySelectorAll(".sr-only").forEach((node) => node.remove());
  return (clone.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 40);
}

/**
 * Is a shared-element transition mid-flight? Its pseudo-elements are
 * animating entries in `document.getAnimations()`, which is the only
 * honest way to ask — a flag set by `TransitionLink` would miss the
 * forward/back path, where the browser starts the transition itself.
 */
function viewTransitionRunning(): boolean {
  if (typeof document.getAnimations !== "function") return false;
  return document.getAnimations().some((animation) => {
    const effect = animation.effect as KeyframeEffect | null;
    return Boolean(
      effect &&
        typeof effect.pseudoElement === "string" &&
        effect.pseudoElement.startsWith("::view-transition"),
    );
  });
}

export function RouteLoader() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [label, setLabel] = useState("");

  const phaseRef = useRef<Phase>("idle");
  const pending = useRef(false);
  const routePath = useRef(pathname);
  const shownAt = useRef(0);
  const showTimer = useRef(0);
  const maxTimer = useRef(0);
  const leaveTimer = useRef(0);
  const hideTimer = useRef(0);

  const enter = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  /* Arm on the click, draw only if the destination is slow. Everything is
     bound once: the listeners read the live URL rather than a captured
     pathname, so they never need rebinding and cannot go stale. */
  useEffect(() => {
    const arm = (name: string) => {
      if (pending.current) return;
      pending.current = true;
      setLabel(name);
      window.clearTimeout(showTimer.current);
      window.clearTimeout(leaveTimer.current);
      window.clearTimeout(hideTimer.current);
      maxTimer.current = window.setTimeout(() => {
        pending.current = false;
        window.clearTimeout(showTimer.current);
        if (phaseRef.current === "loading") {
          enter("leaving");
          hideTimer.current = window.setTimeout(() => enter("idle"), EXIT_MS);
        }
      }, MAX_WAIT);
      const attempt = () => {
        if (!pending.current) return;
        if (viewTransitionRunning()) {
          showTimer.current = window.setTimeout(attempt, 90);
          return;
        }
        shownAt.current = performance.now();
        enter("loading");
      };
      showTimer.current = window.setTimeout(attempt, SHOW_AFTER);
    };

    const onClick = (event: MouseEvent) => {
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const target = event.target as Element | null;
      const link = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      if (link.target && link.target !== "_self") return;
      if (link.hasAttribute("download")) return;
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      /* a hash jump on the page you are already reading is not a page load */
      if (destination(href) === window.location.pathname) return;
      arm(labelOf(link));
    };

    /* A hash jump may also emit popstate. Only a changed page needs a plate. */
    const onPop = () => {
      if (window.location.pathname !== routePath.current) arm("");
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
      window.clearTimeout(showTimer.current);
      window.clearTimeout(maxTimer.current);
      window.clearTimeout(leaveTimer.current);
      window.clearTimeout(hideTimer.current);
    };
  }, []);

  /* The route landed. If the plate never drew, nothing happens at all. If
     it did, it holds to its minimum and then leaves — and the exit is a
     state, not an unmount, so the plate can finish its own fade. */
  useEffect(() => {
    pending.current = false;
    routePath.current = pathname;
    window.clearTimeout(showTimer.current);
    window.clearTimeout(maxTimer.current);
    if (phaseRef.current === "idle") return;
    const held = performance.now() - shownAt.current;
    const wait =
      phaseRef.current === "loading" ? Math.max(0, MIN_VISIBLE - held) : 0;
    leaveTimer.current = window.setTimeout(() => {
      enter("leaving");
      hideTimer.current = window.setTimeout(() => enter("idle"), EXIT_MS);
    }, wait);
    return () => {
      window.clearTimeout(leaveTimer.current);
      window.clearTimeout(hideTimer.current);
    };
  }, [pathname]);

  if (phase === "idle") return null;

  return (
    <div className="route-loader" data-phase={phase} data-testid="route-loader">
      <span className="route-loader-mark" aria-hidden="true">
        Tanishk
      </span>
      <span className="route-loader-rule" aria-hidden="true">
        <i />
      </span>
      <p className="route-loader-note" role="status">
        {label ? `Loading ${label}` : "Loading"}
      </p>
    </div>
  );
}


