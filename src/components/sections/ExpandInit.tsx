"use client";

import { useEffect } from "react";

/**
 * Expandable catalog cards. Click a [data-expand] card (or its
 * [data-expand-btn]) to toggle data-open, revealing the full description.
 */
export function ExpandInit() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const card = target.closest<HTMLElement>("[data-expand]");
      if (!card) return;
      const open = card.getAttribute("data-open") === "1";
      card.setAttribute("data-open", open ? "0" : "1");
      const btn = card.querySelector<HTMLElement>("[data-expand-btn]");
      if (btn) btn.textContent = open ? "Подробнее" : "Свернуть";
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
