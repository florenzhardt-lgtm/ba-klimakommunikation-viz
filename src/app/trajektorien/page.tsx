"use client";

import dynamic from "next/dynamic";
import { usePlayback } from "@/lib/usePlayback";
import { useViz } from "@/lib/store";
import { METRICS } from "@/lib/data";
import FocusTabs from "@/components/FocusTabs";
import MetricToggle from "@/components/MetricToggle";
import YearScrubber from "@/components/YearScrubber";

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
  const metric = useViz((s) => s.metric);
  const active = METRICS.find((m) => m.id === metric)!;

  return (
    <main className="h-[100dvh] flex flex-col pt-16 pb-28 sm:pb-32 px-3 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-3 py-2 sm:py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-lg sm:text-2xl font-semibold tracking-tight">3D-Trajektorien</h1>
          <div className="flex flex-wrap items-center gap-2">
            <MetricToggle />
            <FocusTabs />
          </div>
        </div>
        {/* Legende: erklärt die aktuelle Metrik */}
        <div className="glass px-3.5 py-2.5">
          <p className="text-[12.5px] leading-relaxed text-[var(--fg-dim)]">
            <span className="font-semibold text-[var(--fg)]">{active.label} </span>
            <span className="mono text-[10px] text-[var(--fg-faint)]">({active.short})</span>
            {" — "}
            {active.desc}
          </p>
        </div>
      </div>

      <div className="glass flex-1 min-h-0 overflow-hidden rounded-2xl">
        <Scene3D />
      </div>

      <div className="fixed bottom-3 sm:bottom-4 inset-x-0 px-3 sm:px-6 z-40">
        <div className="max-w-7xl mx-auto">
          <YearScrubber />
        </div>
      </div>
    </main>
  );
}
