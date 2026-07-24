"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { Reveal } from "./Reveal";
import { CloudStrip } from "./Clouds";

const BEACH = "/images/yKl7tryOAzg41OLEu5kcZlSYNEE.png";
const LOGO = "/images/LILzm3rkYRV49194JCrUDbwS5c.svg";
const IG = "/images/70eRGKptiD5CD9gSJodYVqJchL0.svg";
const X = "/images/Or88UMlQlmwZxGih5WX3ZguFzA.svg";

const DESTS = [
  { label: "Япония", flag: "/images/uecbId5oKZ2rjlROouIcuGPtQ.svg" },
  { label: "Италия", flag: "/images/LSjPcu2bVLOoMazLpkIyd64CGo.png" },
  { label: "Тайланд", flag: "/images/CBjPfi1BPLS1kbNisJuio7zLQY.png" },
];

const NAV = ["Главная", "О себе", "Продукты", "Контакты"];
const CONTACTS = [
  { label: "+1 (303) 555 0198", href: "tel:+13035550198" },
  { label: "Telegram: @username", href: "#" },
  { label: "support@yourbrand.com", href: "mailto:support@yourbrand.com" },
];

function DestPill({ label, flag }: { label: string; flag: string }) {
  return (
    <a
      href="#"
      className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-white/10 py-2 pl-2 pr-4 backdrop-blur-sm ring-1 ring-white/15 transition-colors hover:bg-white/20"
    >
      <img src={flag} alt="" className="h-6 w-6 rounded-full object-cover" />
      <span className="t-label text-white">{label}</span>
    </a>
  );
}

function Social({ icon }: { icon: string }) {
  return (
    <a
      href="#"
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-white/40 transition-transform hover:scale-105"
    >
      <img src={icon} alt="" className="h-4 w-4" />
    </a>
  );
}

function Column({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-[150px]">
      <h4 className="font-serif text-[19px] font-semibold text-white">{title}</h4>
      <div className="mt-3 border-t border-white/25" />
      <ul className="mt-4 space-y-3">{children}</ul>
    </div>
  );
}

export function SiteFooter() {
  const rootRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const root = rootRef.current;
        const img = bgRef.current;
        if (!root || !img) return;
        const rect = root.getBoundingClientRect();
        const offset = window.innerHeight - rect.top;
        img.style.transform = `translate3d(0, ${offset * -0.06}px, 0)`;
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
    <footer
      id="contact"
      ref={rootRef}
      className="relative flex min-h-screen flex-col overflow-hidden"
    >
      {/* beach background (parallax) */}
      <img
        ref={bgRef}
        data-parallax="footer"
        src={BEACH}
        alt=""
        className="absolute inset-x-0 top-[-15%] h-[130%] w-full select-none object-cover will-change-transform"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/55" />

      {/* three clouds stuck to the top (flipped 180°) */}
      <CloudStrip flip />

      <div className="relative z-10 flex flex-1 flex-col">
        {/* CTA headline — centered in the block */}
        <div className="container-page flex flex-1 items-center justify-center py-32 text-center">
          <Reveal>
            <h2 className="t-hero text-white">
              Твоё <span className="t-hero-i">Пуиешествие</span>
              <br />
              начинается Здесь
            </h2>
          </Reveal>
        </div>

        {/* footer content */}
        <div className="container-page pb-10">
          <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
            {/* brand + destinations */}
            <div>
              <img src={LOGO} alt="travelAURA" className="h-9 w-auto" />
              <div className="mt-6 flex flex-nowrap gap-3 overflow-x-auto md:overflow-visible">
                {DESTS.map((d) => (
                  <DestPill key={d.label} {...d} />
                ))}
              </div>
            </div>

            {/* nav + contacts pushed to the right (Source Serif 4) */}
            <div className="flex gap-14 md:justify-end">
              <Column title="Навигация">
                {NAV.map((n) => (
                  <li key={n}>
                    <a
                      href="#"
                      className="font-serif text-[16px] text-white/85 transition-colors hover:text-white"
                    >
                      {n}
                    </a>
                  </li>
                ))}
              </Column>
              <Column title="Контакты">
                {CONTACTS.map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      className="font-serif text-[16px] text-white/85 transition-colors hover:text-white"
                    >
                      {c.label}
                    </a>
                  </li>
                ))}
              </Column>
            </div>
          </div>

          {/* bottom bar */}
          <div className="mt-14 border-t border-white/25 pt-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <p className="t-body text-white/80">
                2026 travelAURA. Все права защищены.
              </p>
              <div className="flex items-center gap-3">
                <Social icon={IG} />
                <Social icon={X} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
