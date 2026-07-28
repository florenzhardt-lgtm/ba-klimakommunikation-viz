"use client";

import dynamic from "next/dynamic";
import { usePlayback } from "@/lib/usePlayback";
import { useViz } from "@/lib/store";
import { METRICS } from "@/lib/data";
import FocusTabs from "@/components/FocusTabs";
import MetricToggle from "@/components/MetricToggle";
import DimensionToggle from "@/components/DimensionToggle";
import Scene2D from "@/components/Scene2D";
import YearScrubber from "@/components/YearScrubber";
import InfoButton from "@/components/InfoButton";

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
  const view = useViz((s) => s.view);
  const active = METRICS.find((m) => m.id === metric)!;

  return (
    <main className="h-[100dvh] flex flex-col pt-16 pb-28 sm:pb-32 px-3 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-3 py-2 sm:py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-lg sm:text-2xl font-semibold tracking-tight">Trajektorien</h1>
          <div className="flex flex-wrap items-center gap-2">
            <DimensionToggle />
            <MetricToggle />
            <InfoButton title="Trajektorien — wie die Höhen entstehen">
              <p>
                Dieselben Jahresverläufe als Höhenrelief — wahlweise räumlich (3D) oder als flaches
                Liniendiagramm (2D, Umschalter oben). Die <strong>Höhenachse</strong> ist je nach
                gewählter Lesart anders definiert — daraus ergibt sich, wann ein Band steigt oder
                fällt:
              </p>
              <ul className="space-y-2 list-disc pl-4">
                <li>
                  <strong>Substanz:</strong> Höhe = Anzahl substanziell gedeckter Segmente (3a) je
                  Jahr — wie beim Zeitstrahl. RWE als Tal, VW schwankend, BASF durchgehend hoch.
                </li>
                <li>
                  <strong>Langfrist-Dominanz:</strong> Höhe = Anzahl langfristiger Zeitbezüge (1b) je
                  Jahr — je höher, desto präsenter der lange Horizont.
                </li>
                <li>
                  <strong>Ziel-Ambition:</strong> Höhe = fortlaufend aufsummierte Zielbewegung, ab
                  2010: <strong>+1</strong> je Präzisierung (4a), <strong>−1</strong> je Abschwächung
                  (4c), <strong>−2</strong> je Streichung (4d). Steigt, solange Ziele geschärft
                  werden, knickt bei Rücknahme ein. Hier zeigt sich VWs steigende{" "}
                  <em>Kaskade</em> (10→18) und RWEs Einbruch 2016. Zur Vergleichbarkeit ist die
                  Kurvenschar auf einen gemeinsamen Nullpunkt verschoben.
                </li>
              </ul>
              <p>
                Ein <span className="text-[var(--crit)]">roter Punkt</span> markiert ein Jahr mit
                vollständiger Zielstreichung (4d): RWE 2016 — die einzige Streichung eines
                Klimaziels im Korpus — und BASF 2015, wo ein Finanzziel entfiel.
              </p>
            </InfoButton>
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
        {view === "3d" ? <Scene3D /> : <Scene2D />}
      </div>

      <div className="fixed bottom-3 sm:bottom-4 inset-x-0 px-3 sm:px-6 z-40">
        <div className="max-w-7xl mx-auto">
          <YearScrubber />
        </div>
      </div>
    </main>
  );
}
