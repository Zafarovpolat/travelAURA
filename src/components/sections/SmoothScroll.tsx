"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Page-wide smooth scrolling (Lenis) — desktop only.
 * On touch devices we keep native scrolling: Lenis adds no smoothing there
 * (smoothTouch is off) and can interfere with scroll-driven reveals, so we
 * skip it entirely on coarse-pointer / touch devices.
 */
export function SmoothScroll() {
  useEffect(() => {
    const coarse =
      (typeof window.matchMedia === "function" &&
        window.matchMedia("(pointer: coarse)").matches) ||
      "ontouchstart" in window;
    if (coarse) return;

    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
