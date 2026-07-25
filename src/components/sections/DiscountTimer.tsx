"use client";

import { useEffect, useRef } from "react";

/**
 * 50% discount countdown — starts at 2h38m for each new visitor (persisted in
 * localStorage so it keeps counting down across reloads).
 */
export function DiscountTimer() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const KEY = "ta_discount_end";
    let end = Number(localStorage.getItem(KEY));
    if (!end || end < Date.now()) {
      end = Date.now() + (2 * 3600 + 38 * 60) * 1000;
      localStorage.setItem(KEY, String(end));
    }
    const p = (n: number) => String(n).padStart(2, "0");
    const fmt = (ms: number) => {
      if (ms < 0) ms = 0;
      const s = Math.floor(ms / 1000);
      return `${p(Math.floor(s / 3600))}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`;
    };
    const tick = () => {
      if (ref.current) ref.current.textContent = fmt(end - Date.now());
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span ref={ref} data-countdown className="tabular-nums">
      02:38:00
    </span>
  );
}
