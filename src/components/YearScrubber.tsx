"use client";

import { Pause, Play } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useViz } from "@/lib/store";
import { YEAR_MIN, YEAR_MAX, YEARS, crisisFor } from "@/lib/data";

export default function YearScrubber({ compact = false }: { compact?: boolean }) {
  const year = useViz((s) => s.year);
  const playing = useViz((s) => s.playing);
  const togglePlay = useViz((s) => s.togglePlay);
  const setYear = useViz((s) => s.setYear);
  const setPlaying = useViz((s) => s.setPlaying);
  const crisis = crisisFor(year);

  return (
    <div className={`glass px-4 py-3 ${compact ? "rounded-2xl" : "rounded-2xl"}`}>
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Abspielen"}
          className="shrink-0 grid place-items-center h-10 w-10 rounded-full bg-white text-[var(--bg)] hover:scale-105 active:scale-95 transition-transform"
        >
          {playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" className="ml-0.5" />}
        </button>

        <div className="flex flex-col leading-none">
          <span className="mono text-2xl sm:text-3xl font-semibold tabular-nums tracking-tight">
            {year}
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--fg-faint)] mt-1">
            Berichtsjahr
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <input
            type="range"
            min={YEAR_MIN}
            max={YEAR_MAX}
            step={1}
            value={year}
            onChange={(e) => {
              setPlaying(false);
              setYear(parseInt(e.target.value, 10));
            }}
          />
          <div className="flex justify-between mt-1.5 px-0.5">
            {YEARS.map((y) => {
              const isCrisis = !!crisisFor(y);
              return (
                <button
                  key={y}
                  onClick={() => {
                    setPlaying(false);
                    setYear(y);
                  }}
                  className="group relative flex-1 flex justify-center"
                  aria-label={`Jahr ${y}`}
                >
                  <span
                    className="h-1 w-1 rounded-full transition-all"
                    style={{
                      background: isCrisis ? "var(--crit)" : "var(--border-hi)",
                      transform: y === year ? "scale(1.9)" : "scale(1)",
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {crisis ? (
            <motion.div
              key={year}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="shrink-0 hidden sm:flex items-center gap-2 rounded-full pl-2.5 pr-3 py-1.5 pulse-crit"
              style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.4)" }}
            >
              <span className="h-2 w-2 rounded-full bg-[var(--crit)]" />
              <span className="text-[11px] font-medium text-[var(--crit)]">
                Krisenjahr · {crisis.label}
              </span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
