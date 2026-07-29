"use client";

/**
 * Assortment (products / slides) data layer for the editable blocks.
 *
 * The carousels render from this store instead of hard-coded arrays, so the
 * /admin surface can add / delete / edit slides inline. Data is persisted
 * per-browser in localStorage (key `ta_admin_assortment`). Publishing to all
 * visitors is a later backend step.
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
  showSoon: boolean; // show the "Скоро" tag
  showTimer: boolean; // show the "−50% + countdown" badge
  soonLabel: string; // editable text of the "Скоро" tag
  badgeText: string; // editable text of the discount badge ("−50%")
  discount: string; // editable percent in the card footer ("50%")
  discountWord: string; // editable word after the percent ("скидка")
};
export type SeasonSlide = { id: string; img: string; title: string; desc: string };
/** Country in the black marquee ribbon. */
export type Country = { id: string; label: string; img: string };

export type Assortment = {
  photos: Photo[];
  guides: Guide[];
  season: SeasonSlide[];
  countries: Country[];
  timerHours: number; // discount countdown duration
  timerMinutes: number;
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

/** Default badge/discount texts for a card. */
const GUIDE_LABELS = {
  soonLabel: "Скоро",
  badgeText: "−50%",
  discount: "50%",
  discountWord: "скидка",
};

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
      ...GUIDE_LABELS,
    },
    {
      id: "g-japan",
      img: "/images/prod-general.jpg",
      title: "Япония: Токио / Осака / Киото / Нара / Окинава",
      teaser: "Токио, Осака, Киото, Нара и Окинава.",
      full: "Скоро — материалы готовятся.",
      showSoon: true,
      showTimer: true,
      ...GUIDE_LABELS,
    },
    {
      id: "g-thailand",
      img: "/images/prod-thailand.jpg",
      title: "Таиланд: Бангкок / Пхукет / Панган",
      teaser: "Бангкок, Пхукет и Панган.",
      full: "Скоро — материалы готовятся.",
      showSoon: true,
      showTimer: true,
      ...GUIDE_LABELS,
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
  countries: [
    { id: "c-italy", label: "Италия", img: "/images/cujjMXLnRh0ubB7Y9PHKkqUqHng.png" },
    { id: "c-thailand", label: "Таиланд", img: "/images/MRnUANnt1GkkM6MXqkEUxrts.png" },
  ],
  timerHours: 2,
  timerMinutes: 38,
};

function clone(a: Assortment): Assortment {
  return JSON.parse(JSON.stringify(a));
}

/** Fill in fields added after a visitor already saved data. */
function normGuide(g: Partial<Guide>, i: number): Guide {
  return {
    id: g.id || newId("g"),
    img: g.img || PLACEHOLDER,
    title: g.title ?? "",
    teaser: g.teaser ?? "",
    full: g.full ?? "",
    showSoon: !!g.showSoon,
    showTimer: g.showTimer !== false,
    soonLabel: g.soonLabel || GUIDE_LABELS.soonLabel,
    badgeText: g.badgeText || GUIDE_LABELS.badgeText,
    discount: g.discount || GUIDE_LABELS.discount,
    discountWord: g.discountWord || GUIDE_LABELS.discountWord,
  };
}

/** Merge a parsed value with defaults so missing keys never break rendering. */
function normalize(raw: unknown): Assortment {
  const d = clone(DEFAULT_ASSORTMENT);
  if (!raw || typeof raw !== "object") return d;
  const r = raw as Partial<Assortment>;
  return {
    photos: Array.isArray(r.photos) ? (r.photos as Photo[]) : d.photos,
    guides: Array.isArray(r.guides) ? r.guides.map(normGuide) : d.guides,
    season: Array.isArray(r.season) ? (r.season as SeasonSlide[]) : d.season,
    countries: Array.isArray(r.countries) ? (r.countries as Country[]) : d.countries,
    timerHours: typeof r.timerHours === "number" ? r.timerHours : d.timerHours,
    timerMinutes: typeof r.timerMinutes === "number" ? r.timerMinutes : d.timerMinutes,
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
  localStorage.setItem(ASSORTMENT_KEY, JSON.stringify(getAssortment()));
}

/** Drop overrides and go back to the default assortment. */
export function resetAssortment(): void {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(ASSORTMENT_KEY);
    localStorage.removeItem("ta_discount_end");
    localStorage.removeItem("ta_discount_dur");
  }
  current = clone(DEFAULT_ASSORTMENT);
  if (typeof window !== "undefined")
    window.dispatchEvent(new Event(ASSORTMENT_EVENT));
}

export function newId(prefix: string): string {
  return prefix + "-" + Math.random().toString(36).slice(2, 9);
}

/** Neutral grey "add your photo" placeholder used for new slides. */
export const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="#e6e6e3"/><text x="50%" y="50%" font-family="sans-serif" font-size="26" fill="#9a9a97" text-anchor="middle" dominant-baseline="middle">Фото</text></svg>',
  );

function reorder<T extends { id: string }>(arr: T[], id: string, dir: number): T[] {
  const i = arr.findIndex((x) => x.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= arr.length) return arr;
  const c = arr.slice();
  const [it] = c.splice(i, 1);
  c.splice(j, 0, it);
  return c;
}

// ---- photos (block "О себе") ----
export function updatePhoto(id: string, img: string) {
  const a = getAssortment();
  setAssortment({ ...a, photos: a.photos.map((p) => (p.id === id ? { ...p, img } : p)) });
}
export function addPhoto() {
  const a = getAssortment();
  setAssortment({ ...a, photos: [...a.photos, { id: newId("p"), img: PLACEHOLDER }] });
}
export function deletePhoto(id: string) {
  const a = getAssortment();
  setAssortment({ ...a, photos: a.photos.filter((p) => p.id !== id) });
}
export function movePhoto(id: string, dir: number) {
  const a = getAssortment();
  setAssortment({ ...a, photos: reorder(a.photos, id, dir) });
}

// ---- guides (catalog cards) ----
export function updateGuide(id: string, patch: Partial<Guide>) {
  const a = getAssortment();
  setAssortment({ ...a, guides: a.guides.map((g) => (g.id === id ? { ...g, ...patch } : g)) });
}
export function addGuide() {
  const a = getAssortment();
  setAssortment({
    ...a,
    guides: [
      ...a.guides,
      {
        id: newId("g"),
        img: PLACEHOLDER,
        title: "Новый товар",
        teaser: "Краткое описание",
        full: "Полное описание",
        showSoon: false,
        showTimer: true,
        ...GUIDE_LABELS,
      },
    ],
  });
}
export function deleteGuide(id: string) {
  const a = getAssortment();
  setAssortment({ ...a, guides: a.guides.filter((g) => g.id !== id) });
}
export function moveGuide(id: string, dir: number) {
  const a = getAssortment();
  setAssortment({ ...a, guides: reorder(a.guides, id, dir) });
}

// ---- season slides ----
export function updateSeason(id: string, patch: Partial<SeasonSlide>) {
  const a = getAssortment();
  setAssortment({ ...a, season: a.season.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
}
export function addSeason() {
  const a = getAssortment();
  setAssortment({ ...a, season: [...a.season, { id: newId("s"), img: PLACEHOLDER, title: "Новый слайд", desc: "Описание" }] });
}
export function deleteSeason(id: string) {
  const a = getAssortment();
  setAssortment({ ...a, season: a.season.filter((s) => s.id !== id) });
}
export function moveSeason(id: string, dir: number) {
  const a = getAssortment();
  setAssortment({ ...a, season: reorder(a.season, id, dir) });
}

// ---- countries (black ribbon) ----
export function updateCountry(id: string, patch: Partial<Country>) {
  const a = getAssortment();
  setAssortment({ ...a, countries: a.countries.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
}
export function addCountry() {
  const a = getAssortment();
  setAssortment({ ...a, countries: [...a.countries, { id: newId("c"), label: "Страна", img: PLACEHOLDER }] });
}
export function deleteCountry(id: string) {
  const a = getAssortment();
  setAssortment({ ...a, countries: a.countries.filter((c) => c.id !== id) });
}
export function moveCountry(id: string, dir: number) {
  const a = getAssortment();
  setAssortment({ ...a, countries: reorder(a.countries, id, dir) });
}

// ---- discount timer duration ----
export function setTimer(hours: number, minutes: number) {
  const a = getAssortment();
  const h = Math.max(0, Math.min(99, Math.floor(hours || 0)));
  const m = Math.max(0, Math.min(59, Math.floor(minutes || 0)));
  setAssortment({ ...a, timerHours: h, timerMinutes: m });
  // restart the countdown so the new duration takes effect immediately
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem("ta_discount_end");
    localStorage.removeItem("ta_discount_dur");
  }
  if (typeof window !== "undefined") window.dispatchEvent(new Event("ta-timer-change"));
}

/**
 * Downscale an uploaded image file to a compact data URL so it fits in
 * localStorage. Returns a WEBP/JPEG data URL (max ~1000px on the long edge).
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
