"use client";
/* eslint-disable @next/next/no-img-element, @typescript-eslint/no-explicit-any */

import { useState, type CSSProperties, type ElementType } from "react";
import { fileToDataURL } from "./assortment";

/** Click-to-edit plain text. Commits to the store on blur, so React never
 *  fights the caret while typing. */
export function EditableText({
  value,
  onCommit,
  as,
  className,
  style,
}: {
  value: string;
  onCommit: (v: string) => void;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}) {
  const Tag: any = as || "div";
  return (
    <Tag
      {...({ contentEditable: "plaintext-only", suppressContentEditableWarning: true } as any)}
      spellCheck={false}
      data-ta-inline
      className={"ta-inl-text " + (className || "")}
      style={style}
      onBlur={(e: any) => {
        const t = (e.currentTarget.textContent || "").trim();
        if (t !== value) onCommit(t);
      }}
    >
      {value}
    </Tag>
  );
}

/** Renders editable text in admin, plain text on the public site (identical markup). */
export function T({
  admin,
  as,
  className,
  style,
  value,
  onCommit,
}: {
  admin: boolean;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  value: string;
  onCommit: (v: string) => void;
}) {
  if (admin) return <EditableText as={as} className={className} style={style} value={value} onCommit={onCommit} />;
  const Tag: any = as || "div";
  return (
    <Tag className={className} style={style}>
      {value}
    </Tag>
  );
}

/** Per-slide control overlay: reorder, replace photo (small popover), delete. */
export function SlideBar({
  img,
  onImg,
  onUp,
  onDown,
  onDelete,
  canUp,
  canDown,
}: {
  img: string;
  onImg: (v: string) => void;
  onUp: () => void;
  onDown: () => void;
  onDelete: () => void;
  canUp: boolean;
  canDown: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(img);
  const stop = (e: any) => e.stopPropagation();
  return (
    <span className="ta-inl-bar" data-ta-inline onClick={stop}>
      <button type="button" disabled={!canUp} title="Левее / выше" onClick={(e) => { stop(e); onUp(); }}>
        ↑
      </button>
      <button type="button" disabled={!canDown} title="Правее / ниже" onClick={(e) => { stop(e); onDown(); }}>
        ↓
      </button>
      <button type="button" className="ta-inl-fotobtn" title="Заменить фото" onClick={(e) => { stop(e); setUrl(img); setOpen(true); }}>
        Фото
      </button>
      <button
        type="button"
        className="ta-inl-del"
        title="Удалить слайд"
        onClick={(e) => {
          stop(e);
          if (confirm("Удалить этот слайд?")) onDelete();
        }}
      >
        ✕
      </button>
      {open && (
        <span className="ta-inl-pop" onClick={stop}>
          <input type="text" value={url} placeholder="URL или /images/…" onChange={(e) => setUrl(e.target.value)} />
          <label className="ta-inl-up">
            Загрузить с устройства
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (f) setUrl(await fileToDataURL(f));
              }}
            />
          </label>
          <span className="ta-inl-poprow">
            <button type="button" onClick={(e) => { stop(e); setOpen(false); }}>
              Отмена
            </button>
            <button type="button" className="ta-inl-ok" onClick={(e) => { stop(e); onImg(url.trim() || img); setOpen(false); }}>
              Применить
            </button>
          </span>
        </span>
      )}
    </span>
  );
}

export function BadgeToggle({ active, label, onToggle }: { active: boolean; label: string; onToggle: () => void }) {
  return (
    <button
      type="button"
      data-ta-inline
      className={"ta-inl-badge" + (active ? " on" : "")}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      {active ? "✓ " : ""}
      {label}
    </button>
  );
}

export function AddSlide({ label, onAdd }: { label: string; onAdd: () => void }) {
  return (
    <button type="button" className="ta-inl-add" data-ta-inline onClick={(e) => { e.stopPropagation(); onAdd(); }}>
      <span>＋</span>
      {label}
    </button>
  );
}
