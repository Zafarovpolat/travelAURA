"use client";

import { useEffect } from "react";

/**
 * Wires every [data-slider] into an autoplaying carousel with working
 * pagination ([data-dots] + [data-dot]). Pauses on hover.
 */
export function CarouselInit() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    document.querySelectorAll<HTMLElement>("[data-slider]").forEach((track) => {
      const key = track.getAttribute("data-slider");
      const dotsWrap = document.querySelector<HTMLElement>(`[data-dots="${key}"]`);
      const dots = dotsWrap
        ? Array.from(dotsWrap.querySelectorAll<HTMLElement>("[data-dot]"))
        : [];
      const flex = track.firstElementChild as HTMLElement | null;
      const items = flex ? (Array.from(flex.children) as HTMLElement[]) : [];
      if (items.length === 0) return;

      let i = 0;
      const setDots = () =>
        dots.forEach((d, di) => {
          d.style.width = di === i ? "24px" : "8px";
          d.style.background = di === i ? "#1a1a17" : "rgba(26,26,23,0.3)";
        });
      const go = (n: number) => {
        i = (n + items.length) % items.length;
        const step = items[0].offsetWidth + 24;
        const max = track.scrollWidth - track.clientWidth;
        track.scrollTo({ left: Math.min(i * step, max), behavior: "smooth" });
        setDots();
      };

      dots.forEach((d, di) => d.addEventListener("click", () => go(di)));

      let timer = window.setInterval(() => go(i + 1), 3200);
      const stop = () => window.clearInterval(timer);
      const start = () => {
        stop();
        timer = window.setInterval(() => go(i + 1), 3200);
      };
      track.addEventListener("mouseenter", stop);
      track.addEventListener("mouseleave", start);
      setDots();
      cleanups.push(stop);
    });

    return () => cleanups.forEach((c) => c());
  }, []);

  return null;
}
