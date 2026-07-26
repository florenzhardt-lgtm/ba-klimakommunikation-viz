"use client";

import { useViz } from "@/lib/store";
import type { View } from "@/lib/store";

const OPTIONS: { id: View; label: string }[] = [
  { id: "3d", label: "3D" },
  { id: "2d", label: "2D" },
];

export default function DimensionToggle() {
  const view = useViz((s) => s.view);
  const setView = useViz((s) => s.setView);
  return (
    <div className="glass inline-flex items-center gap-1 p-1 rounded-full text-[12px]">
      {OPTIONS.map((o) => {
        const on = view === o.id;
        return (
          <button
            key={o.id}
            onClick={() => setView(o.id)}
            className="px-3 py-1.5 rounded-full transition-colors font-medium"
            style={{
              background: on ? "rgba(255,255,255,0.14)" : "transparent",
              color: on ? "var(--fg)" : "var(--fg-dim)",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
