"use client";

import { useEffect } from "react";
import { getAssortment, ASSORTMENT_EVENT } from "../admin/assortment";

/**
 * Global discount countdown. The duration is configurable in /admin
 * (assortment.timerHours / timerMinutes, default 2h38m) and starts per new
 * visitor. Every [data-countdown] element is updated on each tick — so carousel
 * clones stay in sync too.
 */
export function TimerInit() {
  useEffect(() => {
    const END = "ta_discount_end";
    const DUR = "ta_discount_dur";
    let end = 0;

    const durationMs = () => {
      const a = getAssortment();
      const h = typeof a.timerHours === "number" ? a.timerHours : 2;
      const m = typeof a.timerMinutes === "number" ? a.timerMinutes : 38;
      return Math.max(0, h * 3600 + m * 60) * 1000;
    };

    const ensureEnd = () => {
      const dur = durationMs();
      const storedDur = Number(localStorage.getItem(DUR));
      const storedEnd = Number(localStorage.getItem(END));
      // restart when there is no countdown, it expired, or the duration changed
      if (!storedEnd || storedEnd < Date.now() || storedDur !== dur) {
        end = Date.now() + dur;
        localStorage.setItem(END, String(end));
        localStorage.setItem(DUR, String(dur));
      } else {
        end = storedEnd;
      }
    };

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

    ensureEnd();
    tick();
    const id = window.setInterval(tick, 1000);

    // duration changed in the editor → restart immediately
    const onChange = () => {
      ensureEnd();
      tick();
    };
    window.addEventListener("ta-timer-change", onChange);
    window.addEventListener(ASSORTMENT_EVENT, onChange);

    return () => {
      window.clearInterval(id);
      window.removeEventListener("ta-timer-change", onChange);
      window.removeEventListener(ASSORTMENT_EVENT, onChange);
    };
  }, []);

  return null;
}
