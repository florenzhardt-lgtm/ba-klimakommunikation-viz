"use client";

import { useMemo } from "react";
import { useViz } from "@/lib/store";
import {
  COMPANIES, YEARS, YEAR_MIN, YEAR_MAX, color, data, crisisFor, METRICS,
} from "@/lib/data";

const W = 1000;
const H = 520;
const PADL = 46;
const PADR = 24;
const PADT = 28;
const PADB = 34;
const PLOT_W = W - PADL - PADR;
const PLOT_H = H - PADT - PADB;

const xFor = (y: number) => PADL + ((y - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * PLOT_W;

function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

// Flache 2D-Entsprechung der 3D-Trajektorien: alle drei Firmen als Linien in
// EINEM Koordinatensystem, Y = gewählte Metrik (globale Skala wie in der 3D-Szene).
export default function Scene2D() {
  const metric = useViz((s) => s.metric);
  const focus = useViz((s) => s.focus);
  const year = useViz((s) => s.year);
  const setYear = useViz((s) => s.setYear);
  const setPlaying = useViz((s) => s.setPlaying);

  const active = METRICS.find((m) => m.id === metric)!;

  // Globales Maximum der aktiven Metrik über alle Firmen (dynamische Y-Skala)
  const maxVal = useMemo(() => {
    let max = 0;
    for (const c of COMPANIES)
      for (const p of data.companies[c].trajectory)
        max = Math.max(max, p.metrics[metric]);
    return max || 1;
  }, [metric]);

  const yFor = (v: number) => PADT + PLOT_H - (v / maxVal) * (PLOT_H - 10);
  const px = xFor(year);

  return (
    <div className="w-full h-full grid place-items-center p-2 sm:p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none" style={{ maxHeight: "100%" }}>
        {/* Y-Gitter */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const gy = PADT + PLOT_H - t * (PLOT_H - 10);
          return (
            <g key={t}>
              <line x1={PADL} y1={gy} x2={W - PADR} y2={gy} stroke="var(--border)" strokeWidth={1} opacity={t === 0 ? 1 : 0.4} />
              <text x={PADL - 8} y={gy + 3} textAnchor="end" fontSize={9} className="mono" fill="var(--fg-faint)">
                {Math.round(t * maxVal)}
              </text>
            </g>
          );
        })}

        {/* Krisenjahr-Bänder */}
        {YEARS.filter((y) => crisisFor(y)).map((y) => (
          <rect key={`cr-${y}`} x={xFor(y) - 9} y={PADT} width={18} height={PLOT_H}
            fill="var(--crit)" opacity={y === year ? 0.16 : 0.07} rx={4} />
        ))}

        {/* Klick-Fläche: x -> Jahr */}
        <rect x={0} y={0} width={W} height={H} fill="transparent"
          onClick={(e) => {
            const svg = (e.target as SVGRectElement).ownerSVGElement!;
            const pt = svg.createSVGPoint();
            pt.x = e.clientX; pt.y = e.clientY;
            const loc = pt.matrixTransform(svg.getScreenCTM()!.inverse());
            const yr = Math.round(YEAR_MIN + ((loc.x - PADL) / PLOT_W) * (YEAR_MAX - YEAR_MIN));
            setPlaying(false);
            setYear(yr);
          }}
          style={{ cursor: "crosshair" }}
        />

        {/* Linien je Firma — bei Fokus fallen die übrigen komplett weg */}
        {COMPANIES.map((c) => {
          if (focus && focus !== c) return null;
          const traj = data.companies[c].trajectory;
          const pts = traj.map((p) => ({ x: xFor(p.year), y: yFor(p.metrics[metric]) }));
          const line = smoothPath(pts);
          const cur = traj.find((p) => p.year === year)!;
          const col = color(c);
          const lastPt = pts[pts.length - 1];
          return (
            <g key={c}>
              <path d={line} fill="none" stroke={col} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />

              {/* Bruch-Marker (RWE 2016 = Zielstreichung) */}
              {traj.filter((p) => p.break).map((p) => (
                <g key={`b-${p.year}`}>
                  <circle cx={xFor(p.year)} cy={yFor(p.metrics[metric])} r={5} fill="var(--crit)" stroke="var(--bg)" strokeWidth={1.5} />
                  <text x={xFor(p.year)} y={yFor(p.metrics[metric]) - 10} fill="var(--crit)" fontSize={11} textAnchor="middle" fontWeight={700}>×</text>
                </g>
              ))}

              {/* aktueller Knoten */}
              <circle cx={px} cy={yFor(cur.metrics[metric])} r={7} fill="none" stroke={col} strokeWidth={1.5} opacity={0.5}>
                <animate attributeName="r" values="7;11;7" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle cx={px} cy={yFor(cur.metrics[metric])} r={4.5} fill={col} stroke="var(--bg)" strokeWidth={1.5} />

              {/* Firmen-Label am Kurvenende */}
              <text x={Math.min(lastPt.x + 8, W - 4)} y={lastPt.y + 4} fill={col} fontSize={13} fontWeight={600} textAnchor="end" className="mono">
                {c}
              </text>
            </g>
          );
        })}

        {/* Playhead */}
        <line x1={px} y1={PADT} x2={px} y2={PADT + PLOT_H} stroke="var(--fg)" strokeWidth={1.4} opacity={0.55} />
        <polygon points={`${px - 5},${PADT} ${px + 5},${PADT} ${px},${PADT + 7}`} fill="var(--fg)" />

        {/* Y-Achsentitel */}
        <text x={PADL} y={PADT - 12} fontSize={10.5} className="mono" fill="var(--fg-faint)">
          {active.label} ({active.short})
        </text>

        {/* Jahr-Achse */}
        {YEARS.map((y) => {
          const isCrisis = !!crisisFor(y);
          const show = y % 2 === 0 || isCrisis || y === YEAR_MAX;
          if (!show) return null;
          return (
            <text key={`ax-${y}`} x={xFor(y)} y={H - 10} textAnchor="middle" fontSize={10} className="mono"
              fill={y === year ? "var(--fg)" : isCrisis ? "var(--crit)" : "var(--fg-faint)"}
              fontWeight={y === year ? 700 : 400}>
              {y}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
