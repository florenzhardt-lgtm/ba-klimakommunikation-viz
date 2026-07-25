"use client";

import { motion } from "framer-motion";
import { useViz } from "@/lib/store";
import { COMPANIES, CODE_LABELS, color, data, yearCounts, type CompanyId } from "@/lib/data";
import AnimatedNumber from "./AnimatedNumber";

function Split({ c, year }: { c: CompanyId; year: number }) {
  const cc = yearCounts(c, year);
  const total = cc["1a"] + cc["1b"] || 1;
  const longPct = (cc["1b"] / total) * 100;
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] text-[var(--fg-dim)] mb-1">
        <span className="mono">{cc["1a"]} kurzfristig</span>
        <span className="mono">langfristig {cc["1b"]}</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden flex" style={{ background: "rgba(239,68,68,0.35)" }}>
        <motion.div
          className="h-full"
          style={{ background: color(c) }}
          animate={{ width: `${longPct}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 26 }}
        />
      </div>
    </div>
  );
}

function FramingBars({ c, year }: { c: CompanyId; year: number }) {
  const cc = yearCounts(c, year);
  const codes: ("2a" | "2b" | "2c" | "2d")[] = ["2a", "2b", "2c", "2d"];
  const max = Math.max(1, ...codes.map((k) => cc[k]));
  return (
    <div className="grid grid-cols-4 gap-2">
      {codes.map((k) => (
        <div key={k} className="flex flex-col items-center gap-1">
          <div className="h-16 w-full flex items-end justify-center">
            <motion.div
              className="w-4 rounded-t-sm"
              style={{ background: k === "2a" ? "var(--crit)" : k === "2d" ? color(c) : "var(--fg-dim)" }}
              animate={{ height: `${(cc[k] / max) * 100}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 24 }}
            />
          </div>
          <span className="mono text-[11px]">{cc[k]}</span>
          <span className="text-[8.5px] text-center leading-tight text-[var(--fg-faint)]">
            {CODE_LABELS[k]}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function LiveStats() {
  const year = useViz((s) => s.year);
  const focus = useViz((s) => s.focus);

  if (focus) {
    const cc = yearCounts(focus, year);
    return (
      <div className="glass p-4 space-y-4">
        <div className="flex items-baseline justify-between">
          <span className="text-[12px] uppercase tracking-[0.15em] text-[var(--fg-faint)]">
            {focus} · {year}
          </span>
          <span className="mono text-[11px] text-[var(--fg-dim)]">
            <AnimatedNumber value={Object.values(cc).reduce((a, b) => a + b, 0)} /> Codes
          </span>
        </div>
        <Split c={focus} year={year} />
        <div>
          <p className="text-[11px] text-[var(--fg-faint)] mb-2">Framing (HK2)</p>
          <FramingBars c={focus} year={year} />
        </div>
        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[var(--border)]">
          <span className="text-[var(--fg-dim)]">Substanz vs. Symbolik</span>
          <span className="mono">
            <span style={{ color: color(focus) }}>{cc["3a"]}</span>
            <span className="text-[var(--fg-faint)]"> : </span>
            <span className="text-[var(--crit)]">{cc["3b"]}</span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass p-4 space-y-3">
      <span className="text-[12px] uppercase tracking-[0.15em] text-[var(--fg-faint)]">
        Zeithorizont · {year}
      </span>
      {COMPANIES.map((c) => (
        <div key={c} className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium w-10" style={{ color: color(c) }}>{c}</span>
            <div className="flex-1"><Split c={c} year={year} /></div>
          </div>
        </div>
      ))}
      <p className="text-[10.5px] text-[var(--fg-faint)] pt-1 leading-relaxed">
        Farbe = Langfrist-Anteil (1b), rot = Kurzfrist (1a). Die Langfrist überwiegt fast
        durchgängig — <span className="italic">das Ob ist entschieden</span>.
      </p>
    </div>
  );
}
