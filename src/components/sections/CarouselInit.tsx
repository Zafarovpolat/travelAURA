"use client";

import { useEffect } from "react";

/**
 * Transform-based carousels with optional seamless infinite loop.
 *  [data-slider="key"] — viewport; first child is the flex track.
 *  [data-center] keep active centred · [data-fade] inactive 0.6 opacity
 *  [data-loop] seamless infinite · [data-noauto] no autoplay
 *  [data-dots="key"]>[data-dot] pagination · [data-arrow="prev|next"][data-ref="key"] arrows
 */
export function CarouselInit() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    document.querySelectorAll<HTMLElement>("[data-slider]").forEach((wrap) => {
      const key = wrap.getAttribute("data-slider");
      const flex = wrap.firstElementChild as HTMLElement | null;
      if (!flex) return;
      let items = Array.from(flex.children) as HTMLElement[];
      const real = items.length;
      if (real === 0) return;

      const loop = wrap.hasAttribute("data-loop") && real > 1;
      const center = wrap.hasAttribute("data-center");
      const fade = wrap.hasAttribute("data-fade");
      const auto = !wrap.hasAttribute("data-noauto");
      const gap = 24;

      if (loop) {
        const head = document.createDocumentFragment();
        const tail = document.createDocumentFragment();
        items.forEach((it) => {
          const c = it.cloneNode(true) as HTMLElement;
          c.setAttribute("data-clone", "");
          head.appendChild(c);
        });
        items.forEach((it) => {
          const c = it.cloneNode(true) as HTMLElement;
          c.setAttribute("data-clone", "");
          tail.appendChild(c);
        });
        flex.insertBefore(head, flex.firstChild);
        flex.appendChild(tail);
        items = Array.from(flex.children) as HTMLElement[];
      }

      const dotsWrap = document.querySelector<HTMLElement>(`[data-dots="${key}"]`);
      const dots = dotsWrap
        ? Array.from(dotsWrap.querySelectorAll<HTMLElement>("[data-dot]"))
        : [];

      let i = loop ? real : center && real > 1 ? 1 : 0;
      const iw = () => items[0].getBoundingClientRect().width + gap;
      const baseX = () =>
        center ? (wrap.clientWidth - items[0].getBoundingClientRect().width) / 2 : 0;
      const offsetFor = (idx: number) => {
        if (loop || center) return baseX() - idx * iw();
        const min = Math.min(0, -(flex.scrollWidth - wrap.clientWidth));
        return Math.max(min, -idx * iw());
      };
      const rIdx = () => ((i % real) + real) % real;
      const paint = () => {
        if (fade) items.forEach((it, ii) => (it.style.opacity = ii === i ? "1" : "0.6"));
        dots.forEach((d, di) => {
          d.style.width = di === rIdx() ? "24px" : "8px";
          d.style.background = di === rIdx() ? "#1a1a17" : "rgba(26,26,23,0.3)";
        });
      };
      const apply = (anim: boolean) => {
        flex.style.transition = anim ? "transform 0.65s cubic-bezier(0.4,0,0.2,1)" : "none";
        flex.style.transform = `translateX(${offsetFor(i)}px)`;
      };
      let settleT = 0;
      const settle = () => {
        if (!loop) return;
        if (i >= real * 2) i -= real;
        else if (i < real) i += real;
        apply(false);
      };
      const go = (n: number) => {
        i = loop ? n : (n + items.length) % items.length;
        apply(true);
        paint();
        if (loop) {
          clearTimeout(settleT);
          settleT = window.setTimeout(settle, 700);
        }
      };

      dots.forEach((d, di) => d.addEventListener("click", () => go(loop ? real + di : di)));
      document
        .querySelectorAll<HTMLElement>(`[data-arrow][data-ref="${key}"]`)
        .forEach((btn) =>
          btn.addEventListener("click", () =>
            go(i + (btn.getAttribute("data-arrow") === "next" ? 1 : -1)),
          ),
        );

      let timer = 0;
      const stop = () => window.clearInterval(timer);
      const start = () => {
        if (!auto) return;
        stop();
        timer = window.setInterval(() => go(i + 1), 4200);
      };
      wrap.addEventListener("mouseenter", stop);
      wrap.addEventListener("mouseleave", start);

      // drag / swipe (+ subtle image parallax on non-centred sliders)
      let down = false;
      let sx = 0;
      let base = 0;
      let moved = false;
      const imgs = () => (center ? [] : Array.from(flex.querySelectorAll<HTMLElement>("img")));
      wrap.addEventListener("pointerdown", (e) => {
        down = true;
        moved = false;
        sx = e.clientX;
        base = offsetFor(i);
        stop();
        flex.style.transition = "none";
        imgs().forEach((im) => (im.style.transition = "none"));
      });
      const onMove = (e: PointerEvent) => {
        if (!down) return;
        const dx = e.clientX - sx;
        if (Math.abs(dx) > 4) moved = true;
        flex.style.transform = `translateX(${base + dx}px)`;
        imgs().forEach((im) => (im.style.transform = `translateX(${dx * 0.1}px) scale(1.06)`));
      };
      const onUp = (e: PointerEvent) => {
        if (!down) return;
        down = false;
        const dx = e.clientX - sx;
        const steps = Math.round(-dx / iw());
        i = loop ? i + steps : Math.max(0, Math.min(items.length - 1, i + steps));
        apply(true);
        imgs().forEach((im) => {
          im.style.transition = "transform 0.5s ease";
          im.style.transform = "";
        });
        paint();
        start();
        if (loop) {
          clearTimeout(settleT);
          settleT = window.setTimeout(settle, 700);
        }
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
      start();

      cleanups.push(() => {
        stop();
        clearTimeout(settleT);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("resize", onResize);
      });
    });

    return () => cleanups.forEach((c) => c());
  }, []);

  return null;
}
