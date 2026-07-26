"use client";

import { usePlayback } from "@/lib/usePlayback";
import FocusTabs from "@/components/FocusTabs";
import Spectrum from "@/components/Spectrum";
import YearScrubber from "@/components/YearScrubber";
import InfoButton from "@/components/InfoButton";

export default function SpektrumPage() {
  usePlayback(1200);
  return (
    <main className="min-h-screen px-4 sm:px-6 pt-20 pb-40 max-w-6xl mx-auto w-full">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Polarisierung ↔ Juxtaposition
          </h1>
          <p className="text-[13px] text-[var(--fg-dim)] mt-1 max-w-2xl">
            Jede Firma wandert Jahr für Jahr durch das Framing-Feld (Slawinski &amp; Bansal 2015).
            RWE schwingt weit zwischen den Polen, VW bleibt mittig, BASF hält sich im Win-Win-Eck —
            <span className="text-[var(--fg)]"> niemand wandert einsinnig zur Integration.</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <InfoButton title="Spektrum — warum sich die Punkte bewegen">
            <p>
              Jede Firma ist ein Leuchtpunkt in einem Feld mit zwei Achsen, die beide aus{" "}
              <strong>Anteilen</strong> eines Jahres berechnet werden.
            </p>
            <p>
              <strong>Waagerecht (Framing):</strong> x = (2d − 2a) ∕ (Summe HK2). Ganz links steht
              reine <span className="text-[var(--crit)]">Polarisierung</span> (nur 2a), ganz rechts
              reine <span className="text-[var(--basf)]">Juxtaposition</span> (nur 2d), die Mitte ist
              ausgeglichen.
            </p>
            <p>
              <strong>Senkrecht (Deckung):</strong> y = (3a − 3b) ∕ (Summe HK3). Oben substanziell
              (3a), unten symbolisch (3b).
            </p>
            <p>
              Für jedes Jahr wird die Position neu bestimmt — der Punkt wandert nach links, wenn
              Polarisierung zunimmt, und nach oben, wenn die Substanz steigt. Die blasse Spur ist der
              seit 2010 zurückgelegte Pfad. Jahre ohne Framing- bzw. Substanz-Codes übernehmen die
              zuletzt gültige Position, damit der Punkt nicht springt.
            </p>
          </InfoButton>
          <FocusTabs />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px] items-start">
        <Spectrum />
        <div className="glass p-4 space-y-3">
          <p className="text-[12px] uppercase tracking-[0.15em] text-[var(--fg-faint)]">Lesehilfe</p>
          <ul className="space-y-2.5 text-[12.5px] leading-relaxed text-[var(--fg-dim)]">
            <li><span className="text-[var(--crit)]">◀ links</span> = Polarisierung (Horizonte als Gegensatz).</li>
            <li><span className="text-[var(--basf)]">rechts ▶</span> = Juxtaposition (Horizonte integriert).</li>
            <li><span className="text-[var(--fg)]">▲ oben</span> = substanziell (harte Kennzahlen), <span className="text-[var(--fg)]">▼ unten</span> = symbolisch.</li>
            <li>Die Spur zeigt den Pfad seit 2010 bis zum aktuellen Jahr.</li>
          </ul>
          <p className="text-[11px] text-[var(--fg-faint)] pt-2 border-t border-[var(--border)] leading-relaxed">
            Koordinaten aus den HK2-/HK3-Anteilen des Jahres: x = (Juxtaposition − Polarisierung),
            y = (substanziell − symbolisch).
          </p>
        </div>
      </div>

      <div className="fixed bottom-4 inset-x-0 px-4 sm:px-6 z-40">
        <div className="max-w-6xl mx-auto"><YearScrubber /></div>
      </div>
    </main>
  );
}
