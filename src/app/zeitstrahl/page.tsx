"use client";

import { useEffect, useState } from "react";
import { useViz } from "@/lib/store";
import { usePlayback } from "@/lib/usePlayback";
import { crisisFor } from "@/lib/data";
import FocusTabs from "@/components/FocusTabs";
import LaneChart from "@/components/LaneChart";
import EventCards from "@/components/EventCards";
import LiveStats from "@/components/LiveStats";
import YearScrubber from "@/components/YearScrubber";

export default function ZeitstrahlPage() {
  usePlayback(1600);
  const year = useViz((s) => s.year);
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    if (crisisFor(year)) {
      setShaking(true);
      const t = setTimeout(() => setShaking(false), 500);
      return () => clearTimeout(t);
    }
  }, [year]);

  return (
    <main className="min-h-screen px-4 sm:px-6 pt-20 pb-40 max-w-7xl mx-auto w-full">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Zeitstrahl der drei Architekturen</h1>
          <p className="text-[13px] text-[var(--fg-dim)] mt-1 max-w-xl">
            Substanzielle Klimakommunikation je Jahr. RWE bricht ein und erholt sich (U-Form),
            VW läuft flach weiter, BASF steigt als Treppe. Bahn anklicken zum Fokussieren.
          </p>
        </div>
        <FocusTabs />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <div className={shaking ? "shake" : ""}>
          <LaneChart />
        </div>
        <div className="space-y-4">
          <EventCards />
          <LiveStats />
        </div>
      </div>

      {/* Steuerung */}
      <div className="fixed bottom-4 inset-x-0 px-4 sm:px-6 z-40">
        <div className="max-w-7xl mx-auto">
          <YearScrubber />
        </div>
      </div>
    </main>
  );
}
