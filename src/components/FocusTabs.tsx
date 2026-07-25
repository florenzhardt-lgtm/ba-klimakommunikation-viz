"use client";

import { useViz } from "@/lib/store";
import { COMPANIES, color } from "@/lib/data";

export default function FocusTabs() {
  const focus = useViz((s) => s.focus);
  const setFocus = useViz((s) => s.setFocus);
  return (
    <div className="glass inline-flex items-center gap-1 p-1 rounded-full text-[12px]">
      <button
        onClick={() => setFocus(null)}
        className="px-3 py-1.5 rounded-full transition-colors"
        style={{
          background: focus === null ? "rgba(255,255,255,0.12)" : "transparent",
          color: focus === null ? "var(--fg)" : "var(--fg-dim)",
        }}
      >
        Alle
      </button>
      {COMPANIES.map((c) => {
        const on = focus === c;
        return (
          <button
            key={c}
            onClick={() => setFocus(on ? null : c)}
            className="px-3 py-1.5 rounded-full transition-colors font-medium"
            style={{
              background: on ? color(c) : "transparent",
              color: on ? "#0a0e14" : "var(--fg-dim)",
            }}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}
