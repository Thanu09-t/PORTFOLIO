"use client";

import { useEffect } from "react";
import { SECTION_IDS, type SectionId } from "@/lib/sections";
import { scrollStore } from "@/lib/scrollStore";

export const SECTION_CHANGE_EVENT = "section-change";

/**
 * Watches each top-level section and keeps scrollStore.activeSection (read
 * by the 3D scene every frame) plus a DOM event (read by the nav for its
 * own re-render) in sync. No visual output.
 */
export default function SectionTracker() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id as SectionId;
            scrollStore.activeSection = id;
            window.dispatchEvent(
              new CustomEvent(SECTION_CHANGE_EVENT, { detail: id })
            );
          }
        });
      },
      { threshold: 0.4 }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
