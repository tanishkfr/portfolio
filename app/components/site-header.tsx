"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { usePathname } from "next/navigation";
import { TransitionLink } from "./transition-link";

/**
 * One rail, four real destinations.
 *
 * The header never echoes the case title — the case owns its title.
 *
 * The rail carries one registration mark in two registers, the same
 * grammar the portraits use: filled means committed, hollow means
 * offered. Seated under the page you are on, the mark is filled and
 * breathes (held). Point at — or tab to — another destination and it
 * hollows and walks the rail, leaving two fading pixels of motion
 * residue behind it; leave and it walks back. On a click the mark keeps
 * its `view-transition-name`, so it rides the site's existing View
 * Transition to the new destination instead of blinking out and
 * reappearing.
 *
 * Nothing depends on hover: `aria-current` and the filled mark both
 * state where you are, the keyboard focus ring is untouched, and the
 * per-link rule and pip authored in CSS remain the whole system if
 * JavaScript never arrives. Reduced motion removes the walk, the trail,
 * and the breathing, leaving instant state changes.
 */

const navigation = [
  { key: "projects", label: "Projects", href: "/" },
  { key: "about", label: "About", href: "/about" },
  { key: "resume", label: "Résumé", href: "/resume" },
  { key: "contact", label: "Contact", href: "/contact" },
] as const;

/** Where a label sits on the rail, in the rail's own coordinates. */
type Seat = { x: number; w: number; y: number };

type Residue = { id: number; seat: Seat };

export function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const inWork = pathname.startsWith("/work");
  const inProjects = onHome || inWork;

  function active(key: string) {
    if (key === "projects") return inProjects;
    return pathname.startsWith(`/${key}`);
  }

  const activeIndex = Math.max(
    0,
    navigation.findIndex((item) => active(item.key)),
  );

  const navRef = useRef<HTMLElement | null>(null);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const seats = useRef<Seat[]>([]);
  const markAt = useRef<Seat | null>(null);
  const activeRef = useRef(activeIndex);
  const offeredRef = useRef<number | null>(null);
  const reducedRef = useRef(false);
  const seq = useRef(0);
  const timers = useRef<number[]>([]);

  const [live, setLive] = useState(false);
  const [shelfY, setShelfY] = useState(0);
  const [mark, setMark] = useState<Seat>({ x: 0, w: 0, y: 0 });
  const [offered, setOffered] = useState<number | null>(null);
  const [residue, setResidue] = useState<Residue[]>([]);

  /* Measure the rail: each label's horizontal seat (so centred phone
     labels are handled by the same numbers) and the shelf the rule sits
     on, taken from the link's own hit-area box. */
  const measure = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;
    const navBox = nav.getBoundingClientRect();
    seats.current = linkRefs.current.map((link) => {
      if (!link) return { x: 0, w: 0, y: 0 };
      const range = document.createRange();
      range.selectNodeContents(link);
      const label = range.getBoundingClientRect();
      return {
        x: Math.round(label.left - navBox.left),
        w: Math.round(label.width),
        y: Math.round(link.getBoundingClientRect().bottom - navBox.top),
      };
    });
    const first = seats.current[0];
    if (first) setShelfY(first.y);
  }, []);

  const place = useCallback((index: number, trail: boolean) => {
    const seat = seats.current[index];
    if (!seat) return;
    const previous = markAt.current;
    if (previous && previous.x === seat.x && previous.w === seat.w) return;
    markAt.current = seat;
    setMark(seat);
    if (!trail || reducedRef.current || !previous) return;
    const id = (seq.current += 1);
    setResidue((rest) => [...rest.slice(-2), { id, seat: previous }]);
    timers.current.push(
      window.setTimeout(() => {
        setResidue((rest) => rest.filter((item) => item.id !== id));
      }, 520),
    );
  }, []);

  useEffect(() => {
    activeRef.current = activeIndex;
  }, [activeIndex]);

  /* Measure once, then whenever the rail resizes, the viewport changes,
     or the webfont settles. The mark is revealed only once it has a
     position, so it never flashes at the rail's origin. */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const sync = () => {
      measure();
      const seat =
        seats.current[offeredRef.current ?? activeRef.current] ??
        seats.current[activeRef.current];
      if (seat) {
        markAt.current = seat;
        setMark(seat);
      }
      setLive(true);
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(nav);
    window.addEventListener("resize", sync);
    document.fonts?.ready.then(sync).catch(() => {});
    const pending = timers.current;
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sync);
      pending.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };
  }, [measure]);

  /* A route change places the mark at the new destination with no walk:
     the View Transition already carries it, and without that support the
     page simply appears with the mark where it belongs. */
  useEffect(() => {
    const seat = seats.current[activeIndex];
    if (!seat) return;
    markAt.current = seat;
    setMark(seat);
  }, [activeIndex]);

  function offer(index: number) {
    if (offeredRef.current === index) return;
    offeredRef.current = index;
    setOffered(index);
    place(index, true);
  }

  function release() {
    if (offeredRef.current === null) return;
    offeredRef.current = null;
    setOffered(null);
    place(activeRef.current, true);
  }

  /* A click commits the destination before the route lands: the mark is
     already seated there, so nothing pulls it back to the page being
     left while the View Transition is in flight. */
  function commit(index: number) {
    activeRef.current = index;
    offeredRef.current = null;
    setOffered(null);
    const seat = seats.current[index];
    if (!seat) return;
    markAt.current = seat;
    setMark(seat);
  }

  function onClickLink(event: MouseEvent<HTMLAnchorElement>, index: number) {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }
    commit(index);
  }

  function onPointerOver(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType === "touch") return;
    const link = (event.target as HTMLElement).closest("a");
    const index = link ? linkRefs.current.indexOf(link as HTMLAnchorElement) : -1;
    if (index >= 0) offer(index);
  }

  function onFocus(event: FocusEvent<HTMLElement>) {
    const link = (event.target as HTMLElement).closest(
      "a",
    ) as HTMLAnchorElement | null;
    if (!link) return;
    let visible = true;
    try {
      visible = link.matches(":focus-visible");
    } catch {
      /* engines without :focus-visible keep the mark as the cue */
    }
    if (!visible) return;
    const index = linkRefs.current.indexOf(link);
    if (index >= 0) offer(index);
  }

  /* Pointing at the page you are already on does not unseat the mark:
     offered-but-already-here is still held. */
  const held = offered === null || offered === activeIndex;

  return (
    <header className="site-header" data-bare={onHome}>
      <TransitionLink
        className="site-identity"
        href="/"
        onClick={(event) => onClickLink(event, 0)}
        aria-label="Tanishk, product and interaction designer"
      >
        {/* the state rule carries the name — the favicon's T mark, the
            wordmark's pixel T, held at carrying size */}
        <svg
          className="identity-mark"
          viewBox="0 0 64 64"
          aria-hidden="true"
          focusable="false"
        >
          <path fill="var(--registrar, #3a1ff0)" d="M8 10h48v12H40v32H24V22H8z" />
        </svg>
        <span className="identity-name">Tanishk</span>
        <small>Product &amp; Interaction Designer</small>
      </TransitionLink>

      <nav
        aria-label="Primary navigation"
        ref={navRef}
        data-nav={live ? "live" : undefined}
        style={{ "--nav-y": `${shelfY}px` } as CSSProperties}
        onPointerOver={onPointerOver}
        onPointerLeave={release}
        onFocus={onFocus}
        onBlur={release}
      >
        {navigation.map((item, index) => (
          <TransitionLink
            key={item.key}
            href={item.href}
            ref={(node: HTMLAnchorElement | null) => {
              linkRefs.current[index] = node;
            }}
            onClick={(event) => onClickLink(event, index)}
            aria-current={active(item.key) ? "page" : undefined}
          >
            {item.label}
          </TransitionLink>
        ))}

        {residue.map((item) => (
          <span
            key={item.id}
            className="nav-residue"
            aria-hidden="true"
            style={
              {
                "--nav-x": `${item.seat.x}px`,
                "--nav-w": `${item.seat.w}px`,
                "--nav-y": `${item.seat.y}px`,
              } as CSSProperties
            }
          />
        ))}

        <span
          className="nav-mark"
          aria-hidden="true"
          data-live={live ? "true" : undefined}
          data-hold={held ? "true" : undefined}
          data-hollow={held ? undefined : "true"}
          style={
            {
              "--nav-x": `${mark.x}px`,
              "--nav-w": `${mark.w}px`,
              "--nav-y": `${mark.y}px`,
            } as CSSProperties
          }
        />
      </nav>
    </header>
  );
}
