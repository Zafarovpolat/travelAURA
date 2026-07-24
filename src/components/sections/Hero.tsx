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
        if (el) el.style.transform = `translate3d(0, ${y * 0.28}px, 0) scale(1.1)`;
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
    <section id="top" className="relative w-full overflow-hidden bg-[#4d97d4]">
      <img
        ref={imgRef}
        data-parallax="hero"
        src={HERO_SCENE}
        alt="Путешественница на земном шаре среди облаков"
        className="block w-full origin-top select-none will-change-transform"
        style={{ transform: "scale(1.1)" }}
        draggable={false}
      />

      {/* Title — vertically centered in the viewport */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-[88svh] items-center justify-center px-5">
        <h1 className="t-hero max-w-[760px] text-center text-white">
          Путешествие без границ <span className="t-hero-i">Бюджета</span>
        </h1>
      </div>

      {/* Fade to white + three clouds stuck to the bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-[22%] bg-gradient-to-b from-transparent to-white" />
      <CloudStrip />
    </section>
  );
}
