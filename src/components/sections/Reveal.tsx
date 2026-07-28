"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

/**
 * Framer-style "appear" effect — fades + slides content up when it enters view.
 *
 * Detection is a requestAnimationFrame poll of the element's real bounding rect.
 * This is completely independent of scroll events (which Lenis can swallow on
 * touch devices) and of IntersectionObserver quirks, so it fires reliably on
 * every device. A safety timeout guarantees content is never left invisible,
 * and reduced-motion users get it immediately.
 */
export function Reveal({ children, className, delay = 0, y = 40 }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }

    let done = false;
    let raf = 0;
    let timer = 0;

    const finish = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      setShown(true);
    };

    const vh = () => window.innerHeight || document.documentElement.clientHeight;

    const tick = () => {
      if (done || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      if (r.top < vh() * 0.9 && r.bottom > 0) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // absolute safety net — content is never allowed to stay invisible
    const coarse =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches;
    timer = window.setTimeout(finish, coarse ? 2200 : 6000);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-reveal=""
      data-reveal-delay={delay}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity 0.8s cubic-bezier(0.44,0,0.13,1) ${delay}ms, transform 0.8s cubic-bezier(0.44,0,0.13,1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
