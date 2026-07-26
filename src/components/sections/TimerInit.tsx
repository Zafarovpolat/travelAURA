"use client";

import { useEffect } from "react";

/**
 * Global 50%-discount countdown. Starts at 2h38m per new visitor (persisted in
 * localStorage) and updates every [data-countdown] element on each tick — so
 * carousel clones stay in sync too.
 */
export function TimerInit() {
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
      const v = fmt(end - Date.now());
      document.querySelectorAll("[data-countdown]").forEach((el) => {
        el.textContent = v;
      });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return null;
}
