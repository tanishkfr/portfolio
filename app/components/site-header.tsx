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
 * offered. Seated under the page you are on, the mark is filled. Point
 * at — or tab to — another destination and it hollows and moves to that
 * seat; leave and it returns. On a click the mark keeps its
 * `view-transition-name`, so it rides the site's existing View
 * Transition to the new destination instead of blinking out and
 * reappearing.
 *
 * The rail stays quiet: one simple transition, no trail, no breathing,
 * no continuous motion. Nothing depends on hover: `aria-current` and the
 * filled mark both state where you are, the keyboard focus ring is
 * untouched, and the per-link rule and pip authored in CSS remain the
 * whole system if JavaScript never arrives. Reduced motion removes the
 * move, leaving instant state changes.
 */

const navigation = [
  { key: "projects", label: "Projects", href: "/" },
  { key: "about", label: "About", href: "/about" },
  { key: "resume", label: "Résumé", href: "/resume" },
  { key: "contact", label: "Contact", href: "/contact" },
] as const;

/** Where a label sits on the rail, in the rail's own coordinates. */
type Seat = { x: number; w: number; y: number };

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
  const headerRef = useRef<HTMLElement | null>(null);
  const nameRef = useRef<HTMLSpanElement | null>(null);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const seats = useRef<Seat[]>([]);
  const markAt = useRef<Seat | null>(null);
  const activeRef = useRef(activeIndex);
  const offeredRef = useRef<number | null>(null);

  const [live, setLive] = useState(false);
  /* The wordmark lives in the hero while the cover holds it: the dock
     effect below owns this flag on the cover, and every other route
     renders docked. Derived rather than set from the effect body, so no
     state is written during render-adjacent work. */
  const [docked, setDocked] = useState(false);
  const dockedNow = !onHome || docked;
  const [shelfY, setShelfY] = useState(0);
  const [mark, setMark] = useState<Seat>({ x: 0, w: 0, y: 0 });
  const [offered, setOffered] = useState<number | null>(null);

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

  const place = useCallback((index: number) => {
    const seat = seats.current[index];
    if (!seat) return;
    const previous = markAt.current;
    if (previous && previous.x === seat.x && previous.w === seat.w) return;
    markAt.current = seat;
    setMark(seat);
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
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sync);
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

  /* The hero wordmark docks into the navbar.
     --------------------------------------------------------------
     On the cover the header carries no wordmark at all: the hero's TANISHK
     is the identity, and a second one in the corner would say it twice.
     Late in the cover, ONE object travels — the hero wordmark itself,
     scaled and translated, its ink arriving at the navbar's ultramarine.

     Two things decide how it feels. WHEN it starts: the handoff begins
     only once the wordmark's own bottom has climbed to the navbar, so the
     name scrolls with the cover the way any large type would, and docks
     over the last stretch rather than twitching from the first pixel of
     scroll. HOW it moves: the scroll-derived target is followed through a
     short damped filter, so discrete wheel steps arrive as motion instead
     of a jump. The filter converges within about a fifth of a second and
     the loop then stops — no idle animation, no run-on.

     The header name takes over on the exact frame the wordmark lands, one
     threshold, so there is never a readable duplicate. */
  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const heroEl = document.querySelector<HTMLElement>(".xp-cover-name");
    const nameEl = nameRef.current;
    /* Nothing to fly: the header simply carries the identity. Deferred to
       a frame so no state is written synchronously from the effect body. */
    if (!heroEl || !nameEl) {
      const settleIn = requestAnimationFrame(() => setDocked(true));
      return () => cancelAnimationFrame(settleIn);
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    /* The single switch point: below it the hero wordmark is on top and the
       header name is hidden; at or above it the header name is the only one
       drawn. One threshold means no frame shows both. */
    const LANDED = 0.985;

    /* Text boxes, not element boxes: the wordmark is a centred block, and
       the box that must travel is the glyph run itself. Layout boxes come
       from offset geometry, which sticky positioning and transforms cannot
       distort. */
    const textBox = (el: HTMLElement) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return range.getBoundingClientRect();
    };
    const layoutBox = (el: HTMLElement) => {
      const parent = el.offsetParent;
      const base =
        parent instanceof HTMLElement
          ? parent.getBoundingClientRect()
          : { left: 0, top: 0 };
      return {
        left: base.left + el.offsetLeft,
        top: base.top + el.offsetTop,
        width: el.offsetWidth,
        height: el.offsetHeight,
      };
    };
    const rgb = (value: string) => {
      const found = value.match(/\d+(\.\d+)?/g);
      return found && found.length >= 3
        ? found.slice(0, 3).map(Number)
        : [27, 33, 38];
    };

    let heroText = textBox(heroEl);
    let heroBox = layoutBox(heroEl);
    let originX = heroText.left - heroBox.left;
    let originY = heroText.top - heroBox.top;
    let textW = heroText.width;
    let textH = heroText.height;
    let nav = textBox(nameEl);
    const ink = rgb(getComputedStyle(heroEl).color);
    const registrar = rgb(getComputedStyle(nameEl).color);

    if (!textW || !textH || !nav.width) {
      const settleIn = requestAnimationFrame(() => setDocked(true));
      return () => cancelAnimationFrame(settleIn);
    }

    const firstBottom = heroBox.top + originY + textH;
    /* Travel distance: the wordmark docks over this much scroll. A longer
       span is a slower, smoother handoff; a short one reads as a snap. */
    const TRAVEL = 380;
    let docked = false;
    let frame = 0;
    /* The damped value actually painted, and the scroll-derived target it
       is chasing. The smoothing is what makes discrete wheel steps glide
       instead of stepping; it converges and stops within ~0.2s. */
    let shown = -1;
    let target = 0;
    let last = 0;

    const ease = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    /* The dock begins when the wordmark's own bottom reaches this line —
       a little above the navbar — not when the page first moves. Until
       then the name simply scrolls with the cover, where it belongs. */
    let startBottom = firstBottom;
    const sync = () => {
      heroText = textBox(heroEl);
      heroBox = layoutBox(heroEl);
      originX = heroText.left - heroBox.left;
      originY = heroText.top - heroBox.top;
      textW = heroText.width;
      textH = heroText.height;
      nav = textBox(nameEl);
      startBottom = nav.top + nav.height + TRAVEL;
      heroEl.style.transformOrigin = `${(originX + textW / 2).toFixed(2)}px ${(originY + textH / 2).toFixed(2)}px`;
    };

    const paint = (value: number, box: { left: number; top: number }) => {
      /* Past the switch point the hero wordmark is not drawn, so it needs
         no further transform or colour work — only the header state. */
      if (value >= LANDED) {
        heroEl.style.pointerEvents = "none";
        if (!docked) {
          docked = true;
          setDocked(true);
        }
        heroEl.style.opacity = "0";
        return;
      }
      const scale = 1 + (nav.width / textW - 1) * value;
      const lx = box.left + originX + textW / 2;
      const ly = box.top + originY + textH / 2;
      const dx = (nav.left + nav.width / 2 - lx) * value;
      const dy = (nav.top + nav.height / 2 - ly) * value;
      const mix = (a: number, b: number) => Math.round(a + (b - a) * value);
      heroEl.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) scale(${scale.toFixed(4)})`;
      heroEl.style.color = `rgb(${mix(ink[0], registrar[0])}, ${mix(ink[1], registrar[1])}, ${mix(ink[2], registrar[2])})`;
      /* Below the switch point the hero wordmark is the only one drawn. */
      if (docked) {
        docked = false;
        setDocked(false);
      }
      heroEl.style.opacity = "1";
      heroEl.style.pointerEvents = value > 0 ? "none" : "";
    };

    const tick = (now: number) => {
      frame = 0;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      /* One layout read per frame, shared by the measurement and the
         paint. The wordmark moves with the page, so its current box is
         what the transform must be measured against. */
      const box = layoutBox(heroEl);
      const bottom = box.top + originY + textH;
      const raw = Math.min(1, Math.max(0, (startBottom - bottom) / TRAVEL));
      target = reduced ? (raw > 0.5 ? 1 : 0) : ease(raw);
      if (shown < 0) shown = target; /* no fly-in on load or deep link */
      /* reduced motion is a clean two-state change; everyone else gets a
         short damped follow, so wheel steps arrive as motion rather than
         as a jump. It converges and stops — no idle animation. */
      if (reduced) {
        shown = target;
        paint(shown, box);
        return;
      }
      shown += (target - shown) * (1 - Math.exp(-dt * 16));
      if (Math.abs(target - shown) < 0.0015) {
        shown = target;
        paint(shown, box);
        return;
      }
      paint(shown, box);
      frame = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      if (!frame) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    };

    const onResize = () => {
      sync();
      if (!frame) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    };

    sync();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(onResize).catch(() => {});

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (frame) cancelAnimationFrame(frame);
      heroEl.style.transform = "";
      heroEl.style.opacity = "";
      heroEl.style.color = "";
      heroEl.style.pointerEvents = "";
      heroEl.style.transformOrigin = "";
    };
  }, [pathname]);

  function offer(index: number) {
    if (offeredRef.current === index) return;
    offeredRef.current = index;
    setOffered(index);
    place(index);
  }

  function release() {
    if (offeredRef.current === null) return;
    offeredRef.current = null;
    setOffered(null);
    place(activeRef.current);
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
    <header
      className="site-header"
      data-bare={onHome}
      data-dock={dockedNow ? "nav" : "hero"}
      ref={headerRef}
    >
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
        <span className="identity-name" ref={nameRef}>
          Tanishk
        </span>
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
