"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

/**
 * Framer-style scroll-reveal, done as progressive enhancement.
 *
 * - Content is visible by default (see globals.css) — if JS never runs it is
 *   NEVER stuck invisible.
 * - When JS is active (html.js, set before paint) the element starts hidden and
 *   this effect adds [data-shown] once it enters the viewport → CSS animates it
 *   in. An IntersectionObserver drives it (reliable on mobile — Lenis is off on
 *   touch), with an on-mount check and a safety timeout as backstops.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let done = false;
    let io: IntersectionObserver | null = null;
    let t = 0;
    const show = () => {
      if (done) return;
      done = true;
      setShown(true);
      io?.disconnect();
      window.clearTimeout(t);
    };

    // already in view on mount → reveal immediately
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (r.top < vh * 0.95 && r.bottom > 0) {
      show();
      return;
    }

    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) if (e.isIntersecting) show();
        },
        { threshold: 0, rootMargin: "0px 0px -8% 0px" },
      );
      io.observe(el);
    } else {
      show();
      return;
    }

    // safety net — never leave content hidden if the observer never fires
    t = window.setTimeout(show, 2600);

    return () => {
      io?.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-reveal=""
      {...(shown ? { "data-shown": "" } : {})}
      className={className}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
