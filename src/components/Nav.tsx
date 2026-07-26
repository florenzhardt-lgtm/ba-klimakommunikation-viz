"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const TABS = [
  { href: "/", label: "Übersicht", short: "Start" },
  { href: "/zeitstrahl", label: "Zeitstrahl", short: "Zeit" },
  { href: "/trajektorien", label: "Trajektorien", short: "3D/2D" },
  { href: "/spektrum", label: "Spektrum", short: "Spektr." },
];

export default function Nav() {
  const path = usePathname();
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <nav className="mx-auto max-w-7xl px-3 sm:px-6 h-14 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--rwe)] opacity-60 animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--rwe)]" />
          </span>
          <span className="hidden sm:inline text-[13px] font-medium tracking-tight text-[var(--fg)]">
            Getrennt wird im <span className="italic">Wie</span>
          </span>
        </Link>

        <div className="glass flex items-center gap-0.5 p-1 rounded-full">
          {TABS.map((t) => {
            const active = path === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className="relative px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-[12px] rounded-full transition-colors"
                style={{ color: active ? "var(--bg)" : "var(--fg-dim)" }}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10 whitespace-nowrap">
                  <span className="sm:hidden">{t.short}</span>
                  <span className="hidden sm:inline">{t.label}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
