"use client";

import { useState, type ReactNode } from "react";
import { Info, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Kleiner „?/i"-Button im Seitenkopf. Klick öffnet ein Panel mit einer knappen,
 * verständlichen Erklärung, wie die jeweilige Ansicht berechnet wird.
 */
export default function InfoButton({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Erklärung anzeigen"
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-hi)] px-3 py-1.5 text-[12px] text-[var(--fg-dim)] hover:text-[var(--fg)] hover:border-white/40 transition-colors"
      >
        <Info size={14} />
        <span className="hidden sm:inline">Wie wird das berechnet?</span>
        <span className="sm:hidden">Info</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-start justify-center sm:items-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="glass relative mt-16 sm:mt-0 w-full max-w-lg rounded-2xl p-5 sm:p-6 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-[15px] font-semibold tracking-tight text-[var(--fg)]">{title}</h2>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Schließen"
                  className="shrink-0 grid place-items-center h-7 w-7 rounded-full border border-[var(--border-hi)] text-[var(--fg-dim)] hover:text-[var(--fg)]"
                >
                  <X size={15} />
                </button>
              </div>
              <div className="space-y-3 text-[13px] leading-relaxed text-[var(--fg-dim)] info-body">
                {children}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
