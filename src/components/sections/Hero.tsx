"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { CloudStrip } from "./Clouds";

const HERO_SCENE = "/images/y5kNLcucXyFTEZUkN3LiWWQFzL8.png";

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
    <section id="top" className="relative h-[100svh] max-h-[900px] min-h-[600px] w-full overflow-hidden bg-[#4d97d4]">
      <img
        ref={imgRef}
        data-parallax="hero"
        src={HERO_SCENE}
        alt="Путешественница на земном шаре среди облаков"
        className="absolute inset-0 h-full w-full select-none object-cover object-[50%_32%] will-change-transform"
        draggable={false}
      />

      {/* subtle dark overlay (helps title/subtitle readability over clouds) */}
      <div className="pointer-events-none absolute inset-0 z-[3] bg-black/25" />

      {/* Title */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center">
        <h1 className="t-hero text-white">travelAURA</h1>
        <p className="mt-2 font-display text-[26px] font-semibold text-white sm:text-[32px]">
          Путешествуй, а не гугли
        </p>
        <p className="mt-5 max-w-[560px] font-stack text-[16px] leading-relaxed text-white/90 sm:text-[18px]">
          Всё, что нужно знать о стране: где дешевле, что бронировать и как не
          нарваться на дорогой проёб.
        </p>
      </div>

      {/* fade to white + clouds dropped low (absolute — no height impact) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-[22%] bg-gradient-to-b from-transparent to-white" />
      <CloudStrip edge={-140} />
    </section>
  );
}
