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
import InfoButton from "@/components/InfoButton";

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
            Höhe = substanziell gedeckte Klimaaussagen je Jahr (Code 3a). RWE bricht in der
            Streichungsphase ein und erholt sich (Wanne/U-Form), VW schwankt auf mittlerem Niveau,
            BASF bleibt durchgehend am dichtesten gedeckt. Bahn anklicken zum Fokussieren.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <InfoButton title="Zeitstrahl — wie die Kurven entstehen">
            <p>
              Die <strong>Höhe jeder Kurve</strong> ist die Anzahl der in diesem Jahr{" "}
              <strong>substanziell gedeckten</strong> Klimaaussagen (Code&nbsp;3a): Aussagen, die
              mit harten Belegen hinterlegt sind — Kennzahlen, Investitionssummen, Scope-Zielen,
              Governance. Die Kurve steigt, wenn mehr solcher belegten Aussagen vorkommen, und fällt,
              wenn die Deckung dünner wird.
            </p>
            <p>
              So zeigt sich der Kernbefund: <em>Framing und Substanz bewegen sich gemeinsam.</em>{" "}
              <strong>RWE</strong> bildet eine Wanne (Einbruch 2012–2017, dann Erholung),{" "}
              <strong>VW</strong> schwankt auf mittlerem Niveau, <strong>BASF</strong> liegt
              durchgehend hoch (am dichtesten gedeckt). Die berühmte <em>Kaskade</em> (VW) und{" "}
              <em>Treppe</em> (BASF) betreffen dagegen die <strong>Ziele selbst</strong> — die zeigt
              die 3D-Ansicht in der Lesart „Ziel-Ambition".
            </p>
            <p>
              Der zweifarbige Balken rechts unten teilt die <strong>Zeitbezüge</strong> eines Jahres
              auf: der farbige Teil ist der <strong>Langfrist-Anteil</strong> 1b∕(1a+1b), der rote
              Rest der Kurzfrist-Anteil (1a). Die Zahlen an den Enden sind die absoluten
              Häufigkeiten — die Farbe kennzeichnet den Horizont, nicht die Seite. Rot markierte
              Jahre sind dokumentierte Krisenjahre.
            </p>
          </InfoButton>
          <FocusTabs />
        </div>
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
