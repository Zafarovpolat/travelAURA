"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { CloudStrip } from "./Clouds";

const HERO_SCENE = "/images/y5kNLcucXyFTEZUkN3LiWWQFzL8.png";

/**
 * Tall hero. Photo is a CSS background-image on the section (spec-guaranteed
 * behind content). The background is sized a bit larger than the section
 * (auto 125%) so there is vertical room, and background-position moves on scroll
 * for a real parallax — while staying a background (never above the text).
 * Editable from /admin (the section is tagged as an editable background).
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
        el.style.backgroundPositionY = `calc(30% + ${y * 0.1}px)`;
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
      className="relative min-h-[180svh] w-full overflow-hidden bg-[#4d97d4] bg-no-repeat"
      style={{
        backgroundImage: `url(${HERO_SCENE})`,
        backgroundSize: "auto 125%",
        backgroundPosition: "center 30%",
      }}
    >
      {/* dark overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/25" />

      {/* title — centered in the first screen; text is clickable (editable in admin) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-[100svh] flex-col items-center justify-center px-5 text-center">
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
