"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useViz } from "@/lib/store";
import {
  COMPANIES, CODE_LABELS, color, crisisFor, eventsAt, type CompanyId,
} from "@/lib/data";

function Card({ c, year }: { c: CompanyId; year: number }) {
  const evs = eventsAt(c, year);
  if (evs.length === 0) return null;
  return (
    <>
      {evs.map((e, idx) => (
        <motion.div
          key={`${c}-${year}-${idx}`}
          layout
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="glass p-4 relative overflow-hidden"
          style={{ borderColor: `${color(c)}44` }}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-1"
            style={{ background: color(c) }}
          />
          <div className="flex items-center justify-between mb-2 pl-1.5">
            <span className="text-[13px] font-semibold" style={{ color: color(c) }}>{c}</span>
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{ background: `${color(c)}22`, color: color(c) }}
              >
                {e.type} · {CODE_LABELS[e.type]}
              </span>
              <span className="mono text-[10px] text-[var(--fg-faint)]">{e.page}</span>
            </div>
          </div>
          <p className="pl-1.5 text-[14px] leading-snug italic text-[var(--fg)]">
            „{e.quote}“
          </p>
          <p className="pl-1.5 mt-2 text-[12px] leading-relaxed text-[var(--fg-dim)]">
            {e.note}
          </p>
        </motion.div>
      ))}
    </>
  );
}

export default function EventCards() {
  const year = useViz((s) => s.year);
  const focus = useViz((s) => s.focus);
  const crisis = crisisFor(year);
  const list = focus ? [focus] : COMPANIES;
  const anyEvent = list.some((c) => eventsAt(c, year).length > 0);

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {crisis && (
          <motion.div
            key={`crisis-${year}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl p-3.5 pulse-crit"
            style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.4)" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-[var(--crit)]" />
              <span className="text-[12px] font-semibold text-[var(--crit)]">
                {crisis.label} {year}
              </span>
            </div>
            <p className="text-[12.5px] leading-relaxed text-[var(--fg-dim)]">{crisis.note}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {list.map((c) => (
          <Card key={c} c={c} year={year} />
        ))}
      </AnimatePresence>

      {!anyEvent && !crisis && (
        <div className="glass p-4 text-center">
          <p className="text-[12.5px] text-[var(--fg-dim)]">
            {year} · kein dokumentiertes Ziel-Ereignis
          </p>
          <p className="text-[11px] text-[var(--fg-faint)] mt-1">
            Zwischenjahr — die Trajektorie läuft weiter. Zahlen links unten.
          </p>
        </div>
      )}
    </div>
  );
}
