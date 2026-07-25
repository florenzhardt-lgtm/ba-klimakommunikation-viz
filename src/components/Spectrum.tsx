"use client";

import { motion } from "framer-motion";
import { useViz } from "@/lib/store";
import { COMPANIES, color, data, type CompanyId } from "@/lib/data";

const S = 600;
const PAD = 64;
const MID = S / 2;
const HALF = (S - 2 * PAD) / 2;

const px = (x: number) => MID + x * HALF;
const py = (y: number) => MID - y * HALF;

export default function Spectrum() {
  const year = useViz((s) => s.year);
  const focus = useViz((s) => s.focus);
  const setFocus = useViz((s) => s.setFocus);

  return (
    <div className="glass p-3 w-full">
      <svg viewBox={`0 0 ${S} ${S}`} className="w-full h-auto" style={{ maxHeight: "70vh" }}>
        {/* Quadranten-Tönung */}
        <rect x={PAD} y={PAD} width={HALF} height={HALF} fill="var(--crit)" opacity={0.04} />
        <rect x={MID} y={MID} width={HALF} height={HALF} fill="var(--basf)" opacity={0.04} />

        {/* Achsenkreuz */}
        <line x1={PAD} y1={MID} x2={S - PAD} y2={MID} stroke="var(--border)" strokeWidth={1} />
        <line x1={MID} y1={PAD} x2={MID} y2={S - PAD} stroke="var(--border)" strokeWidth={1} />
        <rect x={PAD} y={PAD} width={2 * HALF} height={2 * HALF} fill="none" stroke="var(--border)" strokeWidth={1} rx={10} />

        {/* Achsenbeschriftung */}
        <text x={PAD - 6} y={MID - 8} fill="var(--crit)" fontSize={12} textAnchor="start">◀ Polarisierung</text>
        <text x={S - PAD + 6} y={MID - 8} fill="var(--basf)" fontSize={12} textAnchor="end">Juxtaposition ▶</text>
        <text x={MID + 8} y={PAD + 14} fill="var(--fg-dim)" fontSize={12}>▲ substanziell</text>
        <text x={MID + 8} y={S - PAD - 6} fill="var(--fg-dim)" fontSize={12}>▼ symbolisch</text>

        {COMPANIES.map((c) => {
          const dim = focus && focus !== c;
          const sp = data.companies[c].spectrum.filter((p) => p.year <= year);
          if (sp.length === 0) return null;
          const trail = sp.map((p) => `${px(p.x)},${py(p.y)}`).join(" ");
          const head = sp[sp.length - 1];
          return (
            <g key={c} opacity={dim ? 0.15 : 1} style={{ transition: "opacity 0.4s", cursor: "pointer" }}
               onClick={() => setFocus(focus === c ? null : c)}>
              <polyline points={trail} fill="none" stroke={color(c)} strokeWidth={2} strokeOpacity={0.4}
                strokeLinejoin="round" strokeLinecap="round" />
              {/* Zwischenpunkte */}
              {sp.map((p) => (
                <circle key={p.year} cx={px(p.x)} cy={py(p.y)} r={2} fill={color(c)} opacity={0.4} />
              ))}
              {/* Orb */}
              <motion.circle
                animate={{ cx: px(head.x), cy: py(head.y) }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                r={9} fill={color(c)}
                style={{ filter: `drop-shadow(0 0 10px ${color(c)})` }}
              />
              <motion.text
                animate={{ x: px(head.x) + 13, y: py(head.y) + 4 }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                fill={color(c)} fontSize={13} fontWeight={600} className="mono"
              >
                {c}
              </motion.text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
