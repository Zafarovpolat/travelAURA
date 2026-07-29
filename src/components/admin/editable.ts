/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Shared editable-content helpers for the inline /admin editor.
 *
 * Every editable element on the landing is auto-tagged at runtime with a
 * stable `data-edit="ed-<n>"` id (assigned in DOM order, clones excluded) plus
 * a `data-edit-kind` (text | image | video | link). Overrides are keyed by that
 * id and persisted in localStorage, so the public page and the editor stay in
 * sync inside the same browser.
 */

export const STORE_KEY = "ta_admin_content";

export function assignEditIds(): void {
  if (typeof document === "undefined") return;
  if (document.querySelector("[data-edit]")) return; // idempotent

  const nodes = Array.from(
    document.querySelectorAll("h1,h2,h3,h4,p,li,a,img,video"),
  );
  let i = 0;
  for (const el of nodes) {
    if (el.closest("[data-clone]")) continue;
    // carousel slides + country ribbon are managed inline by the assortment editor
    if (el.closest("[data-slider]") || el.closest("[data-noedit]")) continue;
    if (el.closest(".ta-adminbar") || el.closest(".ta-modal-bg")) continue;
    if (el.hasAttribute("data-countdown") || el.querySelector("[data-countdown]"))
      continue;

    const tag = el.tagName;
    const isMedia = tag === "IMG" || tag === "VIDEO";
    const isLink = tag === "A";

    if (!isMedia && !isLink) {
      const txt = el.textContent ? el.textContent.trim() : "";
      if (!txt) continue;
      // only tag leaf text blocks (avoid tagging containers that hold other taggables)
      if (el.querySelector("h1,h2,h3,h4,p,li,a,img,video")) continue;
    }

    el.setAttribute("data-edit", "ed-" + i);
    el.setAttribute(
      "data-edit-kind",
      tag === "IMG" ? "image" : tag === "VIDEO" ? "video" : isLink ? "link" : "text",
    );
    i++;
  }

  // second pass: leaf <span> text (e.g. "Подробнее", "50%", "Скоро", labels)
  document.querySelectorAll("span").forEach((el) => {
    if (el.closest("[data-edit]")) return;
    if (el.closest("[data-clone]") || el.closest(".ta-adminbar")) return;
    if (el.closest("[data-slider]") || el.closest("[data-noedit]")) return;
    if (el.hasAttribute("data-countdown") || el.querySelector("[data-countdown]")) return;
    if (el.querySelector("*")) return; // leaf only
    const txt = el.textContent ? el.textContent.trim() : "";
    if (!txt) return;
    el.setAttribute("data-edit", "ed-" + i);
    el.setAttribute("data-edit-kind", "text");
    i++;
  });

  // hero photo is a CSS background — tag the section so it can be re-uploaded
  const heroSec = document.querySelector("#top");
  if (heroSec && !heroSec.hasAttribute("data-edit")) {
    const bi = getComputedStyle(heroSec).backgroundImage;
    if (bi && bi !== "none") {
      heroSec.setAttribute("data-edit", "ed-hero-bg");
      heroSec.setAttribute("data-edit-kind", "bg");
    }
  }
}

export function readStore(): Record<string, any> {
  if (typeof localStorage === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function applyStore(store: Record<string, any>): void {
  if (typeof document === "undefined") return;
  for (const [id, val] of Object.entries(store)) {
    if (!val) continue;
    const sel = `[data-edit="${id}"]`;
    document.querySelectorAll(sel).forEach((el) => {
      if (val.bg) {
        (el as HTMLElement).style.backgroundImage = `url(${val.bg})`;
        return;
      }
      const tag = el.tagName;
      if (tag === "IMG") {
        if (val.src) (el as HTMLImageElement).src = val.src;
      } else if (tag === "VIDEO") {
        if (val.src) {
          (el as HTMLVideoElement).src = val.src;
          try {
            (el as HTMLVideoElement).load();
          } catch {
            /* noop */
          }
        }
      } else if (tag === "A") {
        if (val.html != null) el.innerHTML = val.html;
        if (val.href != null) (el as HTMLAnchorElement).setAttribute("href", val.href);
      } else {
        if (val.html != null) el.innerHTML = val.html;
      }
    });
  }
}
