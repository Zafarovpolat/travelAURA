"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { Reveal } from "./Reveal";

const VIDEO = "/videos/footer.webm";

const DESTS = [
  { label: "Япония", flag: "/images/uecbId5oKZ2rjlROouIcuGPtQ.svg" },
  { label: "Италия", flag: "/images/LSjPcu2bVLOoMazLpkIyd64CGo.png" },
  { label: "Таиланд", flag: "/images/CBjPfi1BPLS1kbNisJuio7zLQY.png" },
];

const NAV = ["Главная", "О себе", "Продукты", "Контакты"];
const CONTACTS = [
  { label: "Telegram", href: "https://t.me/victoria_kaylin" },
  { label: "Instagram", href: "https://www.instagram.com/victoria__kaylin" },
  { label: "YouTube", href: "https://youtube.com/@victoria_kaylin" },
];

function DestPill({ label, flag }: { label: string; flag: string }) {
  return (
    <a
      href="#"
      className="pill-hover flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-white/10 py-2 pl-2 pr-4 backdrop-blur-sm ring-1 ring-white/15 hover:bg-white/25"
    >
      <img src={flag} alt="" className="h-6 w-6 rounded-full object-cover" />
      <span className="t-label text-white">{label}</span>
    </a>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="#1a1a17" aria-hidden="true">
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71l-4.1-3.02-1.97 1.91c-.22.22-.4.4-.81.4z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="#1a1a17" strokeWidth={2} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="#1a1a17" stroke="none" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="#1a1a17" aria-hidden="true">
      <path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.8-1.8C19.3 5 12 5 12 5s-7.3 0-8.8.5A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.8 1.8C4.7 19 12 19 12 19s7.3 0 8.8-.5a2.5 2.5 0 0 0 1.8-1.8C23 15.2 23 12 23 12zM9.8 15.3V8.7l6 3.3-6 3.3z" />
    </svg>
  );
}

function Social({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-white/40 transition-transform hover:scale-105"
    >
      {children}
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
      <h4 className="font-serif italic text-[19px] font-semibold text-white">{title}</h4>
      <div className="mt-3 border-t border-white/25" />
      <ul className="mt-4 space-y-3">{children}</ul>
    </div>
  );
}

export function SiteFooter() {
  const rootRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLVideoElement>(null);

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
      {/* background video (parallax) */}
      <video
        ref={bgRef}
        data-parallax="footer"
        src={VIDEO}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-x-0 top-[-15%] h-[130%] w-full select-none object-cover will-change-transform"
      />
      {/* dark overlay over the video */}
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/70" />
      <div className="relative z-10 flex flex-1 flex-col">
        {/* CTA headline — centered in the block */}
        <div className="container-page flex flex-1 items-center justify-center pb-28 pt-64 text-center">
          <Reveal>
            <h2 className="t-hero text-white">
              Всё для поездки —
              <br />
              <span className="t-hero-i">в одном месте</span>
            </h2>
          </Reveal>
        </div>

        {/* footer content */}
        <div className="container-page pb-6">
          <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
            {/* destinations */}
            <div>
              <div className="flex flex-nowrap gap-3 overflow-x-auto md:overflow-visible">
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
                      className="link-underline inline-block font-serif italic text-[16px] text-white/85 transition-colors hover:text-white"
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
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline inline-block font-serif italic text-[16px] text-white/85 transition-colors hover:text-white"
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
                <Social href="https://t.me/victoria_kaylin">
                  <TelegramIcon />
                </Social>
                <Social href="https://www.instagram.com/victoria__kaylin">
                  <InstagramIcon />
                </Social>
                <Social href="https://youtube.com/@victoria_kaylin">
                  <YouTubeIcon />
                </Social>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
