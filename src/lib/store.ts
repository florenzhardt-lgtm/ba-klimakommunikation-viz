"use client";

import { create } from "zustand";
import { YEAR_MIN, YEAR_MAX, type CompanyId } from "./data";

interface VizState {
  year: number;
  playing: boolean;
  focus: CompanyId | null; // null = alle
  setYear: (y: number) => void;
  step: (d: number) => void;
  togglePlay: () => void;
  setPlaying: (p: boolean) => void;
  setFocus: (c: CompanyId | null) => void;
}

export const useViz = create<VizState>((set) => ({
  year: YEAR_MIN,
  playing: false,
  focus: null,
  setYear: (y) => set({ year: Math.max(YEAR_MIN, Math.min(YEAR_MAX, y)) }),
  step: (d) =>
    set((s) => {
      const next = s.year + d;
      if (next > YEAR_MAX) return { year: YEAR_MIN };
      if (next < YEAR_MIN) return { year: YEAR_MAX };
      return { year: next };
    }),
  togglePlay: () => set((s) => ({ playing: !s.playing })),
  setPlaying: (p) => set({ playing: p }),
  setFocus: (c) => set({ focus: c }),
}));
