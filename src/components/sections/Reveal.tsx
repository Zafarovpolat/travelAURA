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
 * Uses a real bounding-rect check on native scroll/resize (plus an
 * IntersectionObserver and an on-mount check). This fires reliably on mobile
 * touch scroll and with Lenis smooth scroll, so content is never left invisible.
 */
export function Reveal({ children, className, delay = 0, y = 40 }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let done = false;
    let io: IntersectionObserver | null = null;

    const check = () => {
      if (done || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.top < vh * 0.92 && r.bottom > 0) {
        done = true;
        setShown(true);
        io?.disconnect();
        window.removeEventListener("scroll", check);
        window.removeEventListener("resize", check);
      }
    };

    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(() => check(), {
        threshold: 0,
        rootMargin: "0px 0px -8% 0px",
      });
      io.observe(el);
    }
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    check();

    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
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
