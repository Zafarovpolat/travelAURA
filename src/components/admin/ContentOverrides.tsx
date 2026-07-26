"use client";

import { useEffect } from "react";
import { assignEditIds, readStore, applyStore } from "./editable";

/**
 * Runs on both the public page and /admin. Tags editable elements with stable
 * ids (before carousels clone) and applies any saved content overrides.
 */
export function ContentOverrides() {
  useEffect(() => {
    assignEditIds();
    const store = readStore();
    if (!Object.keys(store).length) return;
    applyStore(store);
    // re-apply after carousels clone / video mounts
    const t1 = window.setTimeout(() => applyStore(store), 300);
    const t2 = window.setTimeout(() => applyStore(store), 1000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return null;
}
