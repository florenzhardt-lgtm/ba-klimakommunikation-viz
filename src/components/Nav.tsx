"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const TABS = [
  { href: "/", label: "Übersicht" },
  { href: "/zeitstrahl", label: "Zeitstrahl" },
  { href: "/trajektorien", label: "3D-Trajektorien" },
  { href: "/spektrum", label: "Spektrum" },
];

export default function Nav() {
  const path = usePathname();
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--rwe)] opacity-60 animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--rwe)]" />
          </span>
          <span className="text-[13px] font-medium tracking-tight text-[var(--fg)]">
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
                className="relative px-3 py-1.5 text-[12px] rounded-full transition-colors"
                style={{ color: active ? "var(--bg)" : "var(--fg-dim)" }}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10 whitespace-nowrap">{t.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
