"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { CloudStrip } from "./Clouds";

const HERO_SCENE = "/images/y5kNLcucXyFTEZUkN3LiWWQFzL8.png";

/**
 * Hero with parallax that can NEVER paint over the text:
 *  - photo is its own composited layer at z-index:-10 (parallax)
 *  - ALL content sits in one promoted layer (translateZ(0)) at z-index:10
 *  - both inside an isolated stacking context (isolation:isolate)
 * Two composited siblings + explicit z-index inside an isolated context ->
 * strict paint order in every browser: content always above the photo.
 */
export function Hero() {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY > 0 ? window.scrollY : 0;
        const el = imgRef.current;
        if (el) el.style.transform = `translate3d(0, ${y * 0.28}px, 0)`;
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
    <section id="top" className="relative isolate w-full overflow-hidden bg-[#4d97d4]">
      {/* photo — drives height, parallax, bottom composited layer */}
      <img
        ref={imgRef}
        data-parallax="hero"
        src={HERO_SCENE}
        alt="Путешественница на земном шаре среди облаков"
        className="relative z-[-10] block w-full origin-top select-none will-change-transform"
        draggable={false}
      />

      {/* everything above the photo, in ONE promoted layer so it can never
          fall under the photo's parallax layer */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{ transform: "translateZ(0)" }}
      >
        {/* dark overlay */}
        <div className="absolute inset-0 bg-black/25" />

        {/* title */}
        <div className="absolute inset-x-0 top-0 flex h-[88svh] flex-col items-center justify-center px-5 text-center">
          <h1 className="t-hero text-white">travelAURA</h1>
          <p className="mt-2 font-display text-[26px] font-semibold text-white sm:text-[32px]">
            Путешествуй, а не гугли
          </p>
          <p className="mt-5 max-w-[560px] font-stack text-[16px] leading-relaxed text-white/90 sm:text-[18px]">
            Всё, что нужно знать о стране: где дешевле, что бронировать и как не
            нарваться на дорогой проёб.
          </p>
        </div>

        {/* fade to white + clouds */}
        <div className="absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-b from-transparent to-white" />
        <CloudStrip edge={-140} />
      </div>
    </section>
  );
}
