"use client";

import { useEffect } from "react";

/**
 * Transform-based carousels.
 *  [data-slider="key"]  — the overflow-hidden viewport; its first child is the flex track.
 *  [data-center]        — keep the active slide centred (others move with it).
 *  [data-fade]          — inactive slides at 0.6 opacity.
 *  [data-dots="key"] > [data-dot]         — clickable pagination.
 *  [data-arrow="prev|next"][data-ref="key"] — prev/next buttons.
 * Autoplay + pointer drag (swipe) supported.
 */
export function CarouselInit() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    document.querySelectorAll<HTMLElement>("[data-slider]").forEach((wrap) => {
      const key = wrap.getAttribute("data-slider");
      const flex = wrap.firstElementChild as HTMLElement | null;
      if (!flex) return;
      const items = Array.from(flex.children) as HTMLElement[];
      if (items.length === 0) return;

      const dotsWrap = document.querySelector<HTMLElement>(`[data-dots="${key}"]`);
      const dots = dotsWrap
        ? Array.from(dotsWrap.querySelectorAll<HTMLElement>("[data-dot]"))
        : [];
      const center = wrap.hasAttribute("data-center");
      const fade = wrap.hasAttribute("data-fade");
      const gap = 24;

      let i = center && items.length > 1 ? 1 : 0;

      const iw = () => items[0].getBoundingClientRect().width + gap;
      const offsetFor = (idx: number) => {
        if (center) {
          return (
            (wrap.clientWidth - items[0].getBoundingClientRect().width) / 2 -
            idx * iw()
          );
        }
        const min = Math.min(0, -(flex.scrollWidth - wrap.clientWidth));
        return Math.max(min, -idx * iw());
      };
      const paint = () => {
        if (fade)
          items.forEach((it, ii) => (it.style.opacity = ii === i ? "1" : "0.6"));
        dots.forEach((d, di) => {
          d.style.width = di === i ? "24px" : "8px";
          d.style.background = di === i ? "#1a1a17" : "rgba(26,26,23,0.3)";
        });
      };
      const apply = (animate: boolean) => {
        flex.style.transition = animate
          ? "transform 0.6s cubic-bezier(0.4,0,0.2,1)"
          : "none";
        flex.style.transform = `translateX(${offsetFor(i)}px)`;
      };
      const go = (n: number) => {
        i = (n + items.length) % items.length;
        apply(true);
        paint();
      };

      dots.forEach((d, di) => d.addEventListener("click", () => go(di)));
      document
        .querySelectorAll<HTMLElement>(`[data-arrow][data-ref="${key}"]`)
        .forEach((btn) =>
          btn.addEventListener("click", () =>
            go(btn.getAttribute("data-arrow") === "next" ? i + 1 : i - 1),
          ),
        );

      let timer = window.setInterval(() => go(i + 1), 3800);
      const stop = () => window.clearInterval(timer);
      const start = () => {
        stop();
        timer = window.setInterval(() => go(i + 1), 3800);
      };
      wrap.addEventListener("mouseenter", stop);
      wrap.addEventListener("mouseleave", start);

      // pointer drag / swipe
      let down = false;
      let startX = 0;
      let base = 0;
      let moved = false;
      wrap.addEventListener("pointerdown", (e) => {
        down = true;
        moved = false;
        startX = e.clientX;
        base = offsetFor(i);
        stop();
        flex.style.transition = "none";
      });
      const onMove = (e: PointerEvent) => {
        if (!down) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 4) moved = true;
        flex.style.transform = `translateX(${base + dx}px)`;
      };
      const onUp = (e: PointerEvent) => {
        if (!down) return;
        down = false;
        const dx = e.clientX - startX;
        const steps = Math.round(-dx / iw());
        i = Math.max(0, Math.min(items.length - 1, i + steps));
        apply(true);
        paint();
        start();
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      wrap.addEventListener(
        "click",
        (e) => {
          if (moved) {
            e.preventDefault();
            e.stopPropagation();
          }
        },
        true,
      );

      const onResize = () => apply(false);
      window.addEventListener("resize", onResize);
      apply(false);
      paint();

      cleanups.push(() => {
        stop();
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("resize", onResize);
      });
    });

    return () => cleanups.forEach((c) => c());
  }, []);

  return null;
}
