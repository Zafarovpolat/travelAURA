"use client";

import { useEffect } from "react";

/**
 * Autoplaying carousels with active-slide highlight, draggable scrubbing,
 * and clickable pagination. Targets [data-slider] + [data-dots]/[data-dot].
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
      const paint = () => {
        items.forEach((it, ii) => (it.style.opacity = ii === i ? "1" : "0.8"));
        dots.forEach((d, di) => {
          d.style.width = di === i ? "24px" : "8px";
          d.style.background = di === i ? "#1a1a17" : "rgba(26,26,23,0.3)";
        });
      };
      const step = () => items[0].offsetWidth + 24;
      const go = (n: number) => {
        i = (n + items.length) % items.length;
        const max = track.scrollWidth - track.clientWidth;
        track.scrollTo({ left: Math.min(i * step(), max), behavior: "smooth" });
        paint();
      };

      dots.forEach((d, di) => d.addEventListener("click", () => go(di)));

      let timer = window.setInterval(() => go(i + 1), 3600);
      const stop = () => window.clearInterval(timer);
      const start = () => {
        stop();
        timer = window.setInterval(() => go(i + 1), 3600);
      };
      track.addEventListener("mouseenter", stop);
      track.addEventListener("mouseleave", start);

      // drag to scrub
      let down = false;
      let startX = 0;
      let startLeft = 0;
      let moved = false;
      track.addEventListener("pointerdown", (e) => {
        down = true;
        moved = false;
        startX = e.clientX;
        startLeft = track.scrollLeft;
        stop();
      });
      track.addEventListener("pointermove", (e) => {
        if (!down) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 4) moved = true;
        track.scrollLeft = startLeft - dx;
      });
      const end = () => {
        if (!down) return;
        down = false;
        i = Math.max(0, Math.round(track.scrollLeft / step()));
        if (i >= items.length) i = items.length - 1;
        paint();
        start();
      };
      track.addEventListener("pointerup", end);
      track.addEventListener("pointerleave", end);
      track.addEventListener(
        "click",
        (e) => {
          if (moved) {
            e.preventDefault();
            e.stopPropagation();
          }
        },
        true,
      );

      paint();
      cleanups.push(stop);
    });

    return () => cleanups.forEach((c) => c());
  }, []);

  return null;
}
