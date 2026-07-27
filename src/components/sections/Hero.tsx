/* eslint-disable @next/next/no-img-element */
import { CloudStrip } from "./Clouds";

const HERO_SCENE = "/images/y5kNLcucXyFTEZUkN3LiWWQFzL8.png";

/**
 * Tall hero. Photo is a CSS background-image on the section (spec-guaranteed
 * behind content — can never sit above the text) with background-attachment:
 * fixed for a parallax feel. The whole photo can be re-uploaded from /admin
 * (the section is tagged as an editable background).
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[180svh] w-full overflow-hidden bg-[#4d97d4] bg-cover bg-fixed bg-no-repeat"
      style={{ backgroundImage: `url(${HERO_SCENE})`, backgroundPosition: "center 30%" }}
    >
      {/* dark overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/25" />

      {/* title — centered in the first screen (content always above a CSS bg) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-[100svh] flex-col items-center justify-center px-5 text-center">
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
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-[16%] bg-gradient-to-b from-transparent to-white" />
      <CloudStrip edge={-140} />
    </section>
  );
}
