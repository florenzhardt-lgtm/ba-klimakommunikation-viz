"use client";

import dynamic from "next/dynamic";
import { usePlayback } from "@/lib/usePlayback";
import FocusTabs from "@/components/FocusTabs";
import YearScrubber from "@/components/YearScrubber";

// R3F nur im Client rendern (kein SSR)
const Scene3D = dynamic(() => import("@/components/Scene3D"), {
  ssr: false,
  loading: () => (
    <div className="grid place-items-center h-full text-[13px] text-[var(--fg-faint)]">
      3D-Szene wird geladen …
    </div>
  ),
});

export default function TrajektorienPage() {
  usePlayback(1600);
  return (
    <main className="h-screen flex flex-col pt-16 pb-32 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-wrap items-end justify-between gap-4 py-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">3D-Trajektorien</h1>
          <p className="text-[13px] text-[var(--fg-dim)] mt-1 max-w-2xl">
            Substanzielle Klimakommunikation als Relief. RWE bildet ein <span className="text-[var(--rwe)]">Tal</span> (Bruch 2016 rot),
            VW eine flache <span className="text-[var(--vw)]">Kaskade</span>, BASF eine steigende <span className="text-[var(--basf)]">Treppe</span>.
            Ziehen zum Drehen.
          </p>
        </div>
        <FocusTabs />
      </div>

      <div className="glass flex-1 min-h-0 overflow-hidden rounded-2xl">
        <Scene3D />
      </div>

      <div className="fixed bottom-4 inset-x-0 px-4 sm:px-6 z-40">
        <div className="max-w-7xl mx-auto"><YearScrubber /></div>
      </div>
    </main>
  );
}
