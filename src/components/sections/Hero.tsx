"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { CloudStrip } from "./Clouds";

const HERO_SCENE = "/images/y5kNLcucXyFTEZUkN3LiWWQFzL8.png";

/**
 * Hero photo is a CSS background-image on the section — by spec a background is
 * ALWAYS painted behind the element's content, so it can never sit above the
 * text in any browser (no z-index / GPU-layer games possible). Parallax is done
 * by shifting background-position on scroll.
 */
export function Hero() {
  const secRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = secRef.current;
        if (!el) return;
        const y = window.scrollY > 0 ? window.scrollY : 0;
        el.style.backgroundPositionY = `calc(35% + ${y * 0.15}px)`;
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
      ref={secRef}
      id="top"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-[#4d97d4] bg-cover bg-no-repeat px-5 text-center"
      style={{ backgroundImage: `url(${HERO_SCENE})`, backgroundPosition: "center 35%" }}
    >
      {/* dark overlay (still behind the text; above the background) */}
      <div className="pointer-events-none absolute inset-0 bg-black/25" />

      {/* content — always above a CSS background */}
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="t-hero text-white">travelAURA</h1>
        <p className="mt-2 font-display text-[26px] font-semibold text-white sm:text-[32px]">
          Путешествуй, а не гугли
        </p>
        <p className="mt-5 max-w-[560px] font-stack text-[16px] leading-relaxed text-white/90 sm:text-[18px]">
          Всё, что нужно знать о стране: где дешевле, что бронировать и как не
          нарваться на дорогой проёб.
        </p>
      </div>

      {/* fade to white + clouds at the bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-[22%] bg-gradient-to-b from-transparent to-white" />
      <CloudStrip edge={-140} />
    </section>
  );
}
