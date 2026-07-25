"use client";

import { useViz } from "@/lib/store";
import { METRICS } from "@/lib/data";

export default function MetricToggle() {
  const metric = useViz((s) => s.metric);
  const setMetric = useViz((s) => s.setMetric);
  return (
    <div className="glass inline-flex items-center gap-1 p-1 rounded-full text-[12px] flex-wrap justify-center">
      {METRICS.map((m) => {
        const on = metric === m.id;
        return (
          <button
            key={m.id}
            onClick={() => setMetric(m.id)}
            className="px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
            style={{
              background: on ? "rgba(255,255,255,0.14)" : "transparent",
              color: on ? "var(--fg)" : "var(--fg-dim)",
              fontWeight: on ? 600 : 400,
            }}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
