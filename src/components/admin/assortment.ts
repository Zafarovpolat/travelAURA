"use client";

/**
 * Assortment (products / slides) data layer for blocks 2, 3 and 4.
 *
 * The three carousels render from this store instead of hard-coded arrays, so
 * the /admin panel can add / delete / edit slides. Data is persisted per-browser
 * in localStorage (key `ta_admin_assortment`) — the same model as the inline
 * content editor. Publishing to all visitors is a later backend step.
 *
 * SSR + first client render always use DEFAULTS (so hydration matches); the
 * saved assortment is loaded in an effect right after mount.
 */

import { useEffect, useState } from "react";

export const ASSORTMENT_KEY = "ta_admin_assortment";
export const ASSORTMENT_EVENT = "ta-assortment-change";

export type Photo = { id: string; img: string };
export type Guide = {
  id: string;
  img: string;
  title: string;
  teaser: string; // short description on the card
  full: string; // full description (multiline); shown when expanded
  showSoon: boolean; // "Скоро" tag
  showTimer: boolean; // "−50%" + countdown badge
};
export type SeasonSlide = { id: string; img: string; title: string; desc: string };

export type Assortment = {
  photos: Photo[];
  guides: Guide[];
  season: SeasonSlide[];
};

const ITALY_FULL = `База перед поездкой:
Виза
Города, обязательные для посещения
Куда сходить
Контакты
Транспорт: такси, метро, поезда дальнего следования, автобусы
Когда ехать
Бюджет
Готовые маршруты

Про быт на месте:
Еда
Язык: основные итальянские слова
Лайфхаки — билеты без очередей, музейные карты, обходные пути
Шоппинг и что привезти
Полезные приложения
Безопасность и типичные разводы туристов`;

export const DEFAULT_ASSORTMENT: Assortment = {
  photos: [
    { id: "p1", img: "/images/me-1.jpg" },
    { id: "p2", img: "/images/me-2.jpg" },
    { id: "p3", img: "/images/me-3.jpg" },
    { id: "p4", img: "/images/me-4.jpg" },
    { id: "p5", img: "/images/me-5.jpg" },
    { id: "p6", img: "/images/me-6.jpg" },
    { id: "p7", img: "/images/me-7.jpg" },
  ],
  guides: [
    {
      id: "g-italy",
      img: "/images/prod-italy.jpg",
      title: "Италия: Рим / Флоренция / Милан / Комо / Венеция",
      teaser:
        "Полный гид по Италии — от визы и маршрутов до еды, языка и лайфхаков на месте.",
      full: ITALY_FULL,
      showSoon: false,
      showTimer: true,
    },
    {
      id: "g-japan",
      img: "/images/prod-general.jpg",
      title: "Япония: Токио / Осака / Киото / Нара / Окинава",
      teaser: "Токио, Осака, Киото, Нара и Окинава.",
      full: "Скоро — материалы готовятся.",
      showSoon: true,
      showTimer: true,
    },
    {
      id: "g-thailand",
      img: "/images/prod-thailand.jpg",
      title: "Таиланд: Бангкок / Пхукет / Панган",
      teaser: "Бангкок, Пхукет и Панган.",
      full: "Скоро — материалы готовятся.",
      showSoon: true,
      showTimer: true,
    },
  ],
  season: [
    {
      id: "s-italy",
      img: "/images/prod-italy.jpg",
      title: "Италия: Рим, Флоренция и Венеция",
      desc: "Практичный гид по Италии: города, маршруты, транспорт, бюджет, язык и идеи для насыщенной поездки",
    },
    {
      id: "s-thailand",
      img: "/images/prod-thailand.jpg",
      title: "Таиланд: Бангкок, Пхукет и Панган",
      desc: "Пляжи, острова, маршруты, транспорт и бюджет для комфортного путешествия по Таиланду",
    },
  ],
};

function clone(a: Assortment): Assortment {
  return JSON.parse(JSON.stringify(a));
}

/** Merge a parsed value with defaults so missing keys never break rendering. */
function normalize(raw: unknown): Assortment {
  const d = clone(DEFAULT_ASSORTMENT);
  if (!raw || typeof raw !== "object") return d;
  const r = raw as Partial<Assortment>;
  return {
    photos: Array.isArray(r.photos) ? (r.photos as Photo[]) : d.photos,
    guides: Array.isArray(r.guides) ? (r.guides as Guide[]) : d.guides,
    season: Array.isArray(r.season) ? (r.season as SeasonSlide[]) : d.season,
  };
}

let current: Assortment | null = null;

function loadFromStorage(): Assortment {
  if (typeof localStorage === "undefined") return clone(DEFAULT_ASSORTMENT);
  try {
    const raw = localStorage.getItem(ASSORTMENT_KEY);
    if (!raw) return clone(DEFAULT_ASSORTMENT);
    return normalize(JSON.parse(raw));
  } catch {
    return clone(DEFAULT_ASSORTMENT);
  }
}

/** Current in-memory assortment (lazy-initialised from localStorage). */
export function getAssortment(): Assortment {
  if (current === null) current = loadFromStorage();
  return current;
}

/** Replace the working assortment and notify subscribers (live preview). */
export function setAssortment(next: Assortment): void {
  current = clone(next);
  if (typeof window !== "undefined")
    window.dispatchEvent(new Event(ASSORTMENT_EVENT));
}

/** Persist the working assortment to localStorage. */
export function saveAssortment(): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(ASSORTMENT_KEY, JSON.stringify(getAssortment()));
  } catch (e) {
    // Most likely the quota was exceeded by large image data URLs.
    throw e;
  }
}

/** Drop overrides and go back to the default assortment. */
export function resetAssortment(): void {
  if (typeof localStorage !== "undefined") localStorage.removeItem(ASSORTMENT_KEY);
  current = clone(DEFAULT_ASSORTMENT);
  if (typeof window !== "undefined")
    window.dispatchEvent(new Event(ASSORTMENT_EVENT));
}

export function newId(prefix: string): string {
  return prefix + "-" + Math.random().toString(36).slice(2, 9);
}

/**
 * Downscale an uploaded image file to a compact data URL so it fits in
 * localStorage. Returns a JPEG/WEBP data URL (max ~1000px on the long edge).
 */
export function fileToDataURL(file: File, max = 1000): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("decode failed"));
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        const ctx = c.getContext("2d");
        if (!ctx) return resolve(String(reader.result));
        ctx.drawImage(img, 0, 0, w, h);
        try {
          resolve(c.toDataURL("image/webp", 0.82));
        } catch {
          resolve(c.toDataURL("image/jpeg", 0.82));
        }
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

/** React hook: returns the current assortment and re-renders on changes.
 *  First render returns DEFAULTS (to match SSR), then loads localStorage. */
export function useAssortment(): Assortment {
  const [data, setData] = useState<Assortment>(DEFAULT_ASSORTMENT);
  useEffect(() => {
    setData(getAssortment());
    const onChange = () => setData(clone(getAssortment()));
    window.addEventListener(ASSORTMENT_EVENT, onChange);
    return () => window.removeEventListener(ASSORTMENT_EVENT, onChange);
  }, []);
  return data;
}
