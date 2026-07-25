"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { COMPANIES, data, color } from "@/lib/data";

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Hintergrund-Glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 55% at 20% 0%, rgba(56,189,248,0.10), transparent 60%)," +
            "radial-gradient(55% 50% at 85% 15%, rgba(167,139,250,0.10), transparent 60%)," +
            "radial-gradient(60% 60% at 60% 100%, rgba(52,211,153,0.08), transparent 60%)",
        }}
      />

      <section className="mx-auto max-w-6xl px-5 sm:px-6 pt-28 sm:pt-36 pb-16">
        <motion.p
          variants={fade} custom={0} initial="hidden" animate="show"
          className="text-[12px] uppercase tracking-[0.25em] text-[var(--fg-faint)]"
        >
          Bachelorarbeit · Short-Termism &amp; Klimakommunikation
        </motion.p>

        <motion.h1
          variants={fade} custom={1} initial="hidden" animate="show"
          className="mt-5 text-4xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.03em] leading-[1.02]"
        >
          Das <span className="italic text-[var(--fg-dim)]">Ob</span> ist entschieden.
          <br />
          Getrennt wird im <span className="italic" style={{ color: color("RWE") }}>Wie</span>.
        </motion.h1>

        <motion.p
          variants={fade} custom={2} initial="hidden" animate="show"
          className="mt-6 max-w-2xl text-[15px] sm:text-[17px] leading-relaxed text-[var(--fg-dim)]"
        >
          RWE, Volkswagen und BASF kommunizieren langfristige Klimaziele durchgängig —
          aber sie handhaben die Spannung zwischen kurz- und langfristiger Orientierung in
          drei grundverschiedenen Architekturen. Diese Anwendung macht{" "}
          <span className="text-[var(--fg)] mono">1.509</span> Kodierungen aus{" "}
          <span className="text-[var(--fg)] mono">45</span> Geschäftsberichten
          (2010–2024) erlebbar.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fade} custom={3} initial="hidden" animate="show"
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <Link
            href="/zeitstrahl"
            className="group inline-flex items-center gap-2 rounded-full bg-white text-[var(--bg)] px-5 py-3 text-sm font-medium hover:scale-[1.03] active:scale-95 transition-transform"
          >
            Zeitstrahl starten
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link href="/trajektorien" className="rounded-full glass px-5 py-3 text-sm text-[var(--fg-dim)] hover:text-[var(--fg)] transition-colors">
            3D-Trajektorien
          </Link>
          <Link href="/spektrum" className="rounded-full glass px-5 py-3 text-sm text-[var(--fg-dim)] hover:text-[var(--fg)] transition-colors">
            Spektrum
          </Link>
        </motion.div>

        {/* Die drei Architekturen */}
        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {COMPANIES.map((c, i) => {
            const co = data.companies[c];
            return (
              <motion.div
                key={c}
                variants={fade} custom={4 + i} initial="hidden" animate="show"
                className="glass p-5 relative overflow-hidden"
              >
                <div
                  className="absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl opacity-25"
                  style={{ background: color(c) }}
                />
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold" style={{ color: color(c) }}>{c}</span>
                  <span className="mono text-[11px] text-[var(--fg-faint)]">
                    {co.total} Kodierungen
                  </span>
                </div>
                <p className="mt-2 text-[13px] font-medium leading-snug">{co.label}</p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--fg-dim)]">{co.tagline}</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-[var(--border-hi)] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${Math.min(100, (co.ratio / 2) * 100)}%`, background: color(c) }}
                    />
                  </div>
                  <span className="mono text-[11px] text-[var(--fg-dim)] whitespace-nowrap">
                    lang:kurz {co.ratio.toLocaleString("de-DE")}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          variants={fade} custom={7} initial="hidden" animate="show"
          className="mt-14 text-[12px] text-[var(--fg-faint)]"
        >
          Anhang zur Bachelorarbeit · Datengrundlage: eigene qualitative Inhaltsanalyse (Kuckartz).
          Alle Zahlen und Zitate stammen aus der Kodierung der Originalberichte.
        </motion.p>
      </section>
    </main>
  );
}
