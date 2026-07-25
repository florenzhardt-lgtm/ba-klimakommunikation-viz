"use client";

import { useEffect } from "react";
import { useViz } from "./store";

/** Spult das Jahr automatisch vor, solange `playing` aktiv ist. */
export function usePlayback(intervalMs = 1500) {
  const playing = useViz((s) => s.playing);
  const step = useViz((s) => s.step);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => step(1), intervalMs);
    return () => clearInterval(id);
  }, [playing, step, intervalMs]);
}
