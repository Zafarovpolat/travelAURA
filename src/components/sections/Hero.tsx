"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { CloudStrip } from "./Clouds";

const HERO_SCENE = "/images/y5kNLcucXyFTEZUkN3LiWWQFzL8.png";

/**
 * Hero with a real moving-image parallax that still stays behind the text:
 *  - the photo <img> lives inside a background wrapper that is its OWN stacking
 *    context pinned at z-index:-10 (overflow-hidden) → its composited/transform
 *    layer is bounded inside that wrapper and cannot rise above siblings.
 *  - all content sits in one promoted layer (translateZ(0)) at z-index:10.
 *  - section is isolated (isolation:isolate).
 * The <img> is editable from /admin (tagged as an image).
 */
export function Hero() {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = imgRef.current;
        if (!el) return;
        const y = window.scrollY > 0 ? window.scrollY : 0;
        el.style.transform = `translate3d(0, ${y * 0.12}px, 0)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="top"
      className="relative isolate min-h-[100svh] w-full overflow-hidden bg-[#4d97d4]"
    >
      {/* background layer — own stacking context pinned below content */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <img
          ref={imgRef}
          data-parallax="hero"
          src={HERO_SCENE}
          alt="Путешественница на земном шаре среди облаков"
          className="absolute inset-x-0 top-[-35%] h-[155%] w-full select-none object-cover object-[center_28%] will-change-transform"
          draggable={false}
        />
      </div>

      {/* dark overlay */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/25" />

      {/* content — one promoted layer, always above the photo */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-[100svh] flex-col items-center justify-center px-5 text-center"
        style={{ transform: "translateZ(0)" }}
      >
        <h1 className="pointer-events-auto t-hero text-white">travelAURA</h1>
        <p className="pointer-events-auto mt-2 font-display text-[26px] font-semibold text-white sm:text-[32px]">
          Путешествуй, а не гугли
        </p>
        <p className="pointer-events-auto mt-5 max-w-[560px] font-stack text-[16px] leading-relaxed text-white/90 sm:text-[18px]">
          Всё, что нужно знать о стране: где дешевле, что бронировать и как не
          нарваться на дорогой проёб.
        </p>
      </div>

      {/* fade to white + clouds at the bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-[16%] bg-gradient-to-b from-transparent to-white" />
      <CloudStrip edge={-140} />
    </section>
  );
}
