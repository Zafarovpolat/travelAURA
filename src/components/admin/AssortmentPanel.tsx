"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import {
  getAssortment,
  setAssortment,
  saveAssortment,
  resetAssortment,
  fileToDataURL,
  newId,
  type Assortment,
} from "./assortment";

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="#e6e6e3"/><text x="50%" y="50%" font-family="sans-serif" font-size="26" fill="#9a9a97" text-anchor="middle" dominant-baseline="middle">Фото</text></svg>',
  );

const clone = (a: Assortment): Assortment => JSON.parse(JSON.stringify(a));

function moveIn<T extends { id: string }>(arr: T[], id: string, dir: number): T[] {
  const i = arr.findIndex((x) => x.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= arr.length) return arr;
  const c = arr.slice();
  const [it] = c.splice(i, 1);
  c.splice(j, 0, it);
  return c;
}

function ImgField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="ta-as-img">
      <img src={value || PLACEHOLDER} alt="" />
      <div className="ta-as-imgctl">
        <input
          type="text"
          value={value}
          placeholder="URL или /images/…"
          onChange={(e) => onChange(e.target.value)}
        />
        <label className="ta-as-upload">
          Загрузить фото
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={async (e) => {
              const f = e.target.files && e.target.files[0];
              if (f) onChange(await fileToDataURL(f));
              e.currentTarget.value = "";
            }}
          />
        </label>
      </div>
    </div>
  );
}

export function AssortmentPanel() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Assortment | null>(null);
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const onOpen = () => {
      setDraft(clone(getAssortment()));
      setOpen(true);
    };
    window.addEventListener("ta-open-assortment", onOpen);
    return () => window.removeEventListener("ta-open-assortment", onOpen);
  }, []);

  if (!open || !draft) return null;

  // apply a new draft: update local state AND the live store (preview)
  const apply = (next: Assortment) => {
    setDraft(next);
    setAssortment(next);
    setDirty(true);
  };
  const flash = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(""), 1800);
  };
  const save = () => {
    try {
      saveAssortment();
      setDirty(false);
      flash("Сохранено ✓");
    } catch {
      flash("Не удалось сохранить — уменьшите размер/число фото");
    }
  };
  const reset = () => {
    if (!confirm("Сбросить ассортимент к исходному?")) return;
    resetAssortment();
    setDraft(clone(getAssortment()));
    setDirty(false);
    flash("Сброшено");
  };

  return (
    <div className="ta-as-root">
      <style>{CSS}</style>
      <div className="ta-as-bg" onClick={() => setOpen(false)} />
      <div className="ta-as-panel">
        <div className="ta-as-head">
          <b>Ассортимент</b>
          <span className="ta-as-hint">Изменения видны сразу. «Сохранить» — чтобы запомнить.</span>
          <button className="ta-as-x" onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        <div className="ta-as-body">
          {/* ---------- Block 2 — photos ---------- */}
          <section>
            <h4>Блок «О себе» — фотографии</h4>
            {draft.photos.map((p, i) => (
              <div className="ta-as-card" key={p.id}>
                <div className="ta-as-order">
                  <button disabled={i === 0} onClick={() => apply({ ...draft, photos: moveIn(draft.photos, p.id, -1) })}>
                    ↑
                  </button>
                  <button
                    disabled={i === draft.photos.length - 1}
                    onClick={() => apply({ ...draft, photos: moveIn(draft.photos, p.id, 1) })}
                  >
                    ↓
                  </button>
                </div>
                <ImgField
                  value={p.img}
                  onChange={(img) =>
                    apply({ ...draft, photos: draft.photos.map((x) => (x.id === p.id ? { ...x, img } : x)) })
                  }
                />
                <button className="ta-as-del" onClick={() => apply({ ...draft, photos: draft.photos.filter((x) => x.id !== p.id) })}>
                  Удалить
                </button>
              </div>
            ))}
            <button className="ta-as-add" onClick={() => apply({ ...draft, photos: [...draft.photos, { id: newId("p"), img: PLACEHOLDER }] })}>
              + Добавить фото
            </button>
          </section>

          {/* ---------- Block 3 — catalog cards ---------- */}
          <section>
            <h4>Блок «База Знаний» — карточки товаров</h4>
            {draft.guides.map((g, i) => (
              <div className="ta-as-card ta-as-col" key={g.id}>
                <div className="ta-as-row1">
                  <div className="ta-as-order">
                    <button disabled={i === 0} onClick={() => apply({ ...draft, guides: moveIn(draft.guides, g.id, -1) })}>
                      ↑
                    </button>
                    <button
                      disabled={i === draft.guides.length - 1}
                      onClick={() => apply({ ...draft, guides: moveIn(draft.guides, g.id, 1) })}
                    >
                      ↓
                    </button>
                  </div>
                  <ImgField
                    value={g.img}
                    onChange={(img) => apply({ ...draft, guides: draft.guides.map((x) => (x.id === g.id ? { ...x, img } : x)) })}
                  />
                  <button className="ta-as-del" onClick={() => apply({ ...draft, guides: draft.guides.filter((x) => x.id !== g.id) })}>
                    Удалить
                  </button>
                </div>
                <label>Название</label>
                <input
                  type="text"
                  value={g.title}
                  onChange={(e) => apply({ ...draft, guides: draft.guides.map((x) => (x.id === g.id ? { ...x, title: e.target.value } : x)) })}
                />
                <label>Краткое описание (на карточке)</label>
                <textarea
                  rows={2}
                  value={g.teaser}
                  onChange={(e) => apply({ ...draft, guides: draft.guides.map((x) => (x.id === g.id ? { ...x, teaser: e.target.value } : x)) })}
                />
                <label>Полное описание (по кнопке «Подробнее»)</label>
                <textarea
                  rows={6}
                  value={g.full}
                  onChange={(e) => apply({ ...draft, guides: draft.guides.map((x) => (x.id === g.id ? { ...x, full: e.target.value } : x)) })}
                />
                <div className="ta-as-checks">
                  <label className="ta-as-chk">
                    <input
                      type="checkbox"
                      checked={g.showSoon}
                      onChange={(e) => apply({ ...draft, guides: draft.guides.map((x) => (x.id === g.id ? { ...x, showSoon: e.target.checked } : x)) })}
                    />
                    Тег «Скоро»
                  </label>
                  <label className="ta-as-chk">
                    <input
                      type="checkbox"
                      checked={g.showTimer}
                      onChange={(e) => apply({ ...draft, guides: draft.guides.map((x) => (x.id === g.id ? { ...x, showTimer: e.target.checked } : x)) })}
                    />
                    Бейдж «−50% + таймер»
                  </label>
                </div>
              </div>
            ))}
            <button
              className="ta-as-add"
              onClick={() =>
                apply({
                  ...draft,
                  guides: [
                    ...draft.guides,
                    { id: newId("g"), img: PLACEHOLDER, title: "Новый товар", teaser: "", full: "", showSoon: false, showTimer: true },
                  ],
                })
              }
            >
              + Добавить товар
            </button>
          </section>

          {/* ---------- Block 4 — season slides ---------- */}
          <section>
            <h4>Блок «Топ Баз-Знаний» — слайды</h4>
            {draft.season.map((s, i) => (
              <div className="ta-as-card ta-as-col" key={s.id}>
                <div className="ta-as-row1">
                  <div className="ta-as-order">
                    <button disabled={i === 0} onClick={() => apply({ ...draft, season: moveIn(draft.season, s.id, -1) })}>
                      ↑
                    </button>
                    <button
                      disabled={i === draft.season.length - 1}
                      onClick={() => apply({ ...draft, season: moveIn(draft.season, s.id, 1) })}
                    >
                      ↓
                    </button>
                  </div>
                  <ImgField
                    value={s.img}
                    onChange={(img) => apply({ ...draft, season: draft.season.map((x) => (x.id === s.id ? { ...x, img } : x)) })}
                  />
                  <button className="ta-as-del" onClick={() => apply({ ...draft, season: draft.season.filter((x) => x.id !== s.id) })}>
                    Удалить
                  </button>
                </div>
                <label>Название</label>
                <input
                  type="text"
                  value={s.title}
                  onChange={(e) => apply({ ...draft, season: draft.season.map((x) => (x.id === s.id ? { ...x, title: e.target.value } : x)) })}
                />
                <label>Описание</label>
                <textarea
                  rows={3}
                  value={s.desc}
                  onChange={(e) => apply({ ...draft, season: draft.season.map((x) => (x.id === s.id ? { ...x, desc: e.target.value } : x)) })}
                />
              </div>
            ))}
            <button
              className="ta-as-add"
              onClick={() => apply({ ...draft, season: [...draft.season, { id: newId("s"), img: PLACEHOLDER, title: "Новый слайд", desc: "" }] })}
            >
              + Добавить слайд
            </button>
          </section>
        </div>

        <div className="ta-as-foot">
          <button className="ta-as-reset" onClick={reset}>
            Сбросить
          </button>
          <span style={{ flex: 1 }} />
          <span className="ta-as-dot" style={{ background: dirty ? "#ffb020" : "#3ad07a" }} />
          <button className="ta-as-save" onClick={save}>
            Сохранить
          </button>
        </div>
        {toast && <div className="ta-as-toast">{toast}</div>}
      </div>
    </div>
  );
}

const CSS = `
.ta-as-root{position:fixed;inset:0;z-index:2147483010;font:14px Inter,system-ui,sans-serif;color:#111;}
.ta-as-bg{position:absolute;inset:0;background:rgba(0,0,0,.5);}
.ta-as-panel{position:absolute;top:0;right:0;height:100%;width:min(560px,100vw);background:#fff;display:flex;flex-direction:column;box-shadow:-14px 0 50px rgba(0,0,0,.35);}
.ta-as-head{display:flex;align-items:center;gap:10px;padding:16px 18px;border-bottom:1px solid #eee;}
.ta-as-head b{font-size:16px;}
.ta-as-hint{font-size:11px;color:#888;flex:1;}
.ta-as-x{border:0;background:#f0f0f0;border-radius:8px;width:30px;height:30px;cursor:pointer;font-size:15px;}
.ta-as-body{flex:1;overflow:auto;padding:14px 18px 30px;}
.ta-as-body h4{margin:20px 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:#666;}
.ta-as-body section:first-child h4{margin-top:4px;}
.ta-as-card{display:flex;align-items:flex-start;gap:12px;border:1px solid #e7e7e7;border-radius:12px;padding:12px;margin-bottom:12px;background:#fafafa;}
.ta-as-card.ta-as-col{flex-direction:column;gap:6px;}
.ta-as-row1{display:flex;align-items:flex-start;gap:12px;width:100%;}
.ta-as-order{display:flex;flex-direction:column;gap:4px;}
.ta-as-order button{width:28px;height:24px;border:1px solid #ddd;background:#fff;border-radius:6px;cursor:pointer;}
.ta-as-order button:disabled{opacity:.35;cursor:default;}
.ta-as-img{display:flex;gap:10px;flex:1;align-items:flex-start;}
.ta-as-img>img{width:70px;height:70px;object-fit:cover;border-radius:8px;background:#eee;flex:none;}
.ta-as-imgctl{display:flex;flex-direction:column;gap:6px;flex:1;min-width:0;}
.ta-as-imgctl input[type=text]{width:100%;padding:7px 9px;border:1px solid #ccc;border-radius:7px;font:inherit;}
.ta-as-upload{display:inline-block;background:#eef6ff;color:#0077cc;border:1px solid #cfe6fb;border-radius:7px;padding:6px 10px;font-size:12px;font-weight:600;cursor:pointer;text-align:center;}
.ta-as-col label{font-weight:600;font-size:12px;color:#444;margin-top:6px;}
.ta-as-col input[type=text],.ta-as-col textarea{width:100%;padding:8px 9px;border:1px solid #ccc;border-radius:7px;font:inherit;resize:vertical;}
.ta-as-checks{display:flex;gap:18px;margin-top:10px;flex-wrap:wrap;}
.ta-as-chk{display:flex;align-items:center;gap:6px;font-weight:500;font-size:13px;}
.ta-as-del{border:0;background:#ffe9e9;color:#d33;border-radius:7px;padding:7px 11px;font:600 12px Inter;cursor:pointer;flex:none;}
.ta-as-add{width:100%;border:1px dashed #9ac7f0;background:#f5faff;color:#0077cc;border-radius:10px;padding:11px;font:600 13px Inter;cursor:pointer;}
.ta-as-foot{display:flex;align-items:center;gap:10px;padding:13px 18px;border-top:1px solid #eee;}
.ta-as-dot{width:9px;height:9px;border-radius:50%;}
.ta-as-reset{border:0;background:#f0f0f0;border-radius:8px;padding:9px 14px;font:600 13px Inter;cursor:pointer;}
.ta-as-save{border:0;background:#0099ff;color:#fff;border-radius:8px;padding:9px 18px;font:600 13px Inter;cursor:pointer;}
.ta-as-toast{position:absolute;bottom:64px;left:50%;transform:translateX(-50%);background:#111;color:#fff;padding:10px 16px;border-radius:9px;font:600 13px Inter;}
`;
