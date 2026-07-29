"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from "react";
import { assignEditIds, readStore, STORE_KEY } from "./editable";
import { saveAssortment, resetAssortment } from "./assortment";

/**
 * Inline visual editor mounted only on /admin. Turns the live landing into a
 * click-to-edit surface: text becomes contentEditable, images/videos/links open
 * a small modal. A floating toolbar saves to localStorage, exports/imports JSON
 * and resets.
 */
export function AdminEditor() {
  useEffect(() => {
    assignEditIds();
    const store: Record<string, any> = readStore();

    const esc = (s: string) => s.replace(/"/g, "&quot;");

    // ---------- styles ----------
    const style = document.createElement("style");
    style.textContent = `
      html[data-admin] .exp-full{ display:block !important; }
      html[data-admin] .exp-short{ display:block !important; }
      /* in admin, keep all reveal content visible (never hidden by scroll animation) */
      html[data-admin] [data-reveal]{ opacity:1 !important; transform:none !important; }
      /* in admin, unfreeze sliders so every slide is visible & editable */
      html[data-admin] [data-slider]{ overflow:visible !important; }
      html[data-admin] [data-slider] > *{ flex-wrap:wrap !important; justify-content:center; row-gap:1.5rem; }
      /* make every editable clickable in admin even inside pointer-events:none layers */
      html[data-admin] [data-edit]{ pointer-events:auto !important; }
      html[data-admin] .pill-hover:hover, html[data-admin] .dot:hover, html[data-admin] [class*="hover:scale"]:hover, html[data-admin] .group:hover [class*="group-hover"]{ transform:none !important; }
      [data-edit]{ box-shadow: inset 0 0 0 1px rgba(0,153,255,.4); }
      [data-edit-kind="image"],[data-edit-kind="video"],[data-edit-kind="link"],[data-edit-kind="bg"]{ cursor:pointer; }
      [data-edit-kind="text"]{ cursor:text; }
      [data-edit]:hover{ box-shadow: inset 0 0 0 2px #0099ff; }
      [data-edit][contenteditable]:focus{ box-shadow: inset 0 0 0 2px #0099ff; }
      .ta-adminbar{ position:fixed; bottom:16px; right:16px; transform:scale(.9); transform-origin:bottom right;
        z-index:2147483000; display:flex; gap:8px; align-items:center; opacity:.4;
        background:#111; color:#fff; padding:9px 12px; border-radius:14px;
        font:600 13px/1.1 Inter,system-ui,sans-serif; box-shadow:0 10px 34px rgba(0,0,0,.4);
        transition:opacity .3s ease, transform .3s ease; }
      .ta-adminbar:hover{ opacity:1; transform:scale(1); }
      .ta-adminbar .dot{ width:9px; height:9px; border-radius:50%; background:#3ad07a; }
      .ta-adminbar button{ background:#0099ff; color:#fff; border:0; border-radius:8px; padding:8px 12px; cursor:pointer; font:inherit; }
      .ta-adminbar button.ghost{ background:#333; }
      .ta-modal-bg{ position:fixed; inset:0; z-index:2147483001; background:rgba(0,0,0,.55);
        display:flex; align-items:center; justify-content:center; }
      .ta-modal{ background:#fff; color:#111; border-radius:14px; padding:22px; width:min(460px,92vw);
        font:14px Inter,system-ui,sans-serif; box-shadow:0 20px 60px rgba(0,0,0,.4); }
      .ta-modal h3{ margin:0 0 14px; font-size:16px; }
      .ta-modal label{ display:block; font-weight:600; margin:12px 0 5px; font-size:13px; color:#333; }
      .ta-modal input[type=text]{ width:100%; padding:9px 10px; border:1px solid #ccc; border-radius:8px; font:inherit; }
      .ta-modal input[type=file]{ font:13px Inter; }
      .ta-modal .prev{ margin-top:10px; max-height:150px; max-width:100%; border-radius:8px; display:block; }
      .ta-modal .row{ display:flex; gap:8px; justify-content:flex-end; margin-top:18px; }
      .ta-modal .row button{ border:0; border-radius:8px; padding:9px 15px; cursor:pointer; font:600 13px Inter; }
      .ta-modal .ok{ background:#0099ff; color:#fff; } .ta-modal .cancel{ background:#eee; color:#111; }
      .ta-toast{ position:fixed; bottom:22px; left:50%; transform:translateX(-50%); z-index:2147483002;
        background:#111; color:#fff; padding:11px 18px; border-radius:10px; font:600 13px Inter; opacity:0; transition:opacity .25s; }
      .ta-toast.show{ opacity:1; }
      /* inline assortment editing (blocks 2/3/4) */
      html[data-admin] [data-ta-inline]{ pointer-events:auto !important; }
      .ta-inl-bar{ position:absolute; top:8px; right:8px; z-index:60; display:flex; gap:4px; background:rgba(17,17,17,.85); padding:4px; border-radius:9px; }
      .ta-inl-bar>button{ width:26px; height:26px; border:0; border-radius:6px; background:#333; color:#fff; cursor:pointer; font:600 14px Inter; display:flex; align-items:center; justify-content:center; padding:0; line-height:1; }
      .ta-inl-bar>button:disabled{ opacity:.35; cursor:default; }
      .ta-inl-bar .ta-inl-fotobtn{ width:auto; padding:0 9px; font-size:11px; }
      .ta-inl-bar .ta-inl-del{ background:#c0392b; }
      .ta-inl-pop{ position:absolute; top:36px; right:0; z-index:70; width:230px; background:#fff; border-radius:10px; box-shadow:0 16px 44px rgba(0,0,0,.4); padding:10px; display:flex; flex-direction:column; gap:7px; text-align:left; }
      .ta-inl-pop input[type=text]{ width:100%; padding:7px 8px; border:1px solid #ccc; border-radius:7px; font:13px Inter; color:#111; }
      .ta-inl-up{ display:block; text-align:center; background:#eef6ff; color:#0077cc; border:1px solid #cfe6fb; border-radius:7px; padding:6px; font:600 12px Inter; cursor:pointer; }
      .ta-inl-poprow{ display:flex; gap:6px; justify-content:flex-end; }
      .ta-inl-poprow button{ border:0; border-radius:7px; padding:6px 11px; font:600 12px Inter; cursor:pointer; background:#eee; color:#111; }
      .ta-inl-poprow .ta-inl-ok{ background:#0099ff; color:#fff; }
      .ta-inl-text{ outline:none; cursor:text; border-radius:4px; }
      .ta-inl-text:hover{ box-shadow:inset 0 0 0 1px rgba(0,153,255,.4); }
      .ta-inl-text:focus{ box-shadow:inset 0 0 0 2px #0099ff; background:rgba(0,153,255,.06); }
      .ta-inl-badges{ display:flex; gap:6px; flex-wrap:wrap; margin-bottom:8px; }
      .ta-inl-badge{ border:1px solid #bbb; background:#fff; color:#555; border-radius:999px; padding:3px 10px; font:600 11px Inter; cursor:pointer; }
      .ta-inl-badge.on{ background:#1a1a17; color:#fff; border-color:#1a1a17; }
      .ta-inl-add{ display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; min-height:220px; width:300px; max-width:80vw; flex:0 0 auto; border:2px dashed #9ac7f0; background:#f5faff; color:#0077cc; border-radius:18px; font:700 14px Inter; cursor:pointer; }
      .ta-inl-add>span{ font-size:30px; line-height:1; }
    `;
    document.head.appendChild(style);
    document.documentElement.setAttribute("data-admin", "1");

    // ---------- toolbar ----------
    const bar = document.createElement("div");
    bar.className = "ta-adminbar";
    bar.innerHTML =
      '<span class="dot"></span><span style="margin-right:4px">Редактирование</span>' +
      '<button data-a="save">Сохранить</button>' +
      '<button class="ghost" data-a="reset">Сбросить</button>';
    document.body.appendChild(bar);
    const dot = bar.querySelector(".dot") as HTMLElement;
    const setDirty = (d: boolean) => {
      dot.style.background = d ? "#ffb020" : "#3ad07a";
    };

    const toast = (msg: string) => {
      const t = document.createElement("div");
      t.className = "ta-toast";
      t.textContent = msg;
      document.body.appendChild(t);
      requestAnimationFrame(() => t.classList.add("show"));
      window.setTimeout(() => {
        t.classList.remove("show");
        window.setTimeout(() => t.remove(), 300);
      }, 1600);
    };

    // ---------- inline text editing ----------
    const texts = Array.from(
      document.querySelectorAll<HTMLElement>('[data-edit-kind="text"]'),
    );
    const onTextInput = (el: HTMLElement) => () => {
      const id = el.getAttribute("data-edit");
      if (!id) return;
      store[id] = { html: el.innerHTML };
      setDirty(true);
    };
    const inputHandlers: Array<[HTMLElement, () => void]> = [];
    texts.forEach((el) => {
      el.setAttribute("contenteditable", "true");
      el.setAttribute("spellcheck", "false");
      const h = onTextInput(el);
      el.addEventListener("input", h);
      inputHandlers.push([el, h]);
    });

    // ---------- modal helpers ----------
    const makeModal = (inner: string) => {
      const bg = document.createElement("div");
      bg.className = "ta-modal-bg";
      bg.innerHTML = `<div class="ta-modal">${inner}</div>`;
      document.body.appendChild(bg);
      const close = () => bg.remove();
      bg.addEventListener("click", (e) => {
        if (e.target === bg) close();
      });
      return { bg, close };
    };

    const openMedia = (el: HTMLElement, mode: "image" | "video" | "bg") => {
      const isImg = mode === "image";
      const isBg = mode === "bg";
      const cur = isBg
        ? getComputedStyle(el).backgroundImage.match(/url\(["']?([^"')]+)["']?\)/)?.[1] || ""
        : el.getAttribute("src") || "";
      const { bg, close } = makeModal(
        `<h3>${isImg ? "Изображение" : isBg ? "Фоновое фото" : "Видео"}</h3>` +
          `<label>Ссылка (URL)</label>` +
          `<input type="text" class="url" value="${esc(cur)}" placeholder="https://… или /images/…">` +
          (mode === "video"
            ? `<label>или загрузить файл (mp4 / webm)</label><input type="file" class="file" accept="video/*">`
            : `<label>или загрузить файл с устройства</label><input type="file" class="file" accept="image/*">`) +
          `<div class="row"><button class="cancel">Отмена</button><button class="ok">Применить</button></div>`,
      );
      const urlI = bg.querySelector(".url") as HTMLInputElement;
      const fileI = bg.querySelector(".file") as HTMLInputElement | null;
      fileI?.addEventListener("change", () => {
        const f = fileI.files && fileI.files[0];
        if (!f) return;
        const r = new FileReader();
        r.onload = () => {
          urlI.value = String(r.result);
        };
        r.readAsDataURL(f);
      });
      (bg.querySelector(".ok") as HTMLElement).addEventListener("click", () => {
        const src = urlI.value.trim();
        if (!src) return;
        const id = el.getAttribute("data-edit");
        if (isBg) {
          el.style.backgroundImage = `url(${src})`;
          if (id) store[id] = { bg: src };
        } else if (isImg) {
          (el as HTMLImageElement).src = src;
          if (id) store[id] = { src };
        } else {
          (el as HTMLVideoElement).src = src;
          try {
            (el as HTMLVideoElement).load();
          } catch {
            /* noop */
          }
          if (id) store[id] = { src };
        }
        setDirty(true);
        close();
      });
      (bg.querySelector(".cancel") as HTMLElement).addEventListener("click", close);
    };

    const openLink = (el: HTMLAnchorElement) => {
      const curHref = el.getAttribute("href") || "";
      const curText = (el.textContent || "").trim();
      const hasText = curText.length > 0;
      const { bg, close } = makeModal(
        `<h3>Ссылка</h3>` +
          (hasText
            ? `<label>Текст</label><input type="text" class="txt" value="${esc(curText)}">`
            : "") +
          `<label>Куда ведёт (URL)</label>` +
          `<input type="text" class="href" value="${esc(curHref)}" placeholder="https://…">` +
          `<div class="row"><button class="cancel">Отмена</button><button class="ok">Применить</button></div>`,
      );
      const txtI = bg.querySelector(".txt") as HTMLInputElement | null;
      const hrefI = bg.querySelector(".href") as HTMLInputElement;
      (bg.querySelector(".ok") as HTMLElement).addEventListener("click", () => {
        const id = el.getAttribute("data-edit");
        if (txtI) el.textContent = txtI.value;
        el.setAttribute("href", hrefI.value.trim());
        if (id) store[id] = { html: el.innerHTML, href: hrefI.value.trim() };
        setDirty(true);
        close();
      });
      (bg.querySelector(".cancel") as HTMLElement).addEventListener("click", close);
    };

    // ---------- click routing (capture): media/link modals, block expand/nav ----------
    const onClickCapture = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (bar.contains(t) || t.closest(".ta-modal-bg")) return;
      // inline assortment controls handle their own clicks (React)
      if (t.closest("[data-ta-inline]")) return;
      const el = t.closest("[data-edit]") as HTMLElement | null;
      if (el) {
        const kind = el.getAttribute("data-edit-kind");
        if (kind === "image" || kind === "video" || kind === "bg") {
          e.preventDefault();
          e.stopPropagation();
          openMedia(el, kind as "image" | "video" | "bg");
          return;
        }
        if (kind === "link") {
          e.preventDefault();
          e.stopPropagation();
          openLink(el as HTMLAnchorElement);
          return;
        }
        e.stopPropagation(); // text: keep caret, block card-expand toggle
        return;
      }
      if (t.closest("[data-expand]") || t.closest("a")) e.stopPropagation();
    };
    document.addEventListener("click", onClickCapture, true);

    // ---------- toolbar actions ----------
    const onBar = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).getAttribute("data-a");
      if (!a) return;
      if (a === "save") {
        localStorage.setItem(STORE_KEY, JSON.stringify(store));
        saveAssortment();
        setDirty(false);
        toast("Сохранено ✓");
      } else if (a === "export") {
        const blob = new Blob([JSON.stringify(store, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "travelaura-content.json";
        link.click();
        URL.revokeObjectURL(url);
      } else if (a === "import") {
        const inp = document.createElement("input");
        inp.type = "file";
        inp.accept = "application/json";
        inp.addEventListener("change", () => {
          const f = inp.files && inp.files[0];
          if (!f) return;
          const r = new FileReader();
          r.onload = () => {
            try {
              JSON.parse(String(r.result));
              localStorage.setItem(STORE_KEY, String(r.result));
              location.reload();
            } catch {
              toast("Неверный файл");
            }
          };
          r.readAsText(f);
        });
        inp.click();
      } else if (a === "reset") {
        if (confirm("Сбросить все изменения к исходным?")) {
          localStorage.removeItem(STORE_KEY);
          resetAssortment();
          location.reload();
        }
      } else if (a === "exit") {
        window.location.href = "/";
      }
    };
    bar.addEventListener("click", onBar);

    // ---------- cleanup ----------
    return () => {
      style.remove();
      bar.remove();
      document.documentElement.removeAttribute("data-admin");
      document.removeEventListener("click", onClickCapture, true);
      inputHandlers.forEach(([el, h]) => {
        el.removeEventListener("input", h);
        el.removeAttribute("contenteditable");
        el.removeAttribute("spellcheck");
      });
    };
  }, []);

  return null;
}
