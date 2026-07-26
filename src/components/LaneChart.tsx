"use client";

import { useMemo } from "react";
import { useViz } from "@/lib/store";
import {
  COMPANIES, YEARS, YEAR_MIN, YEAR_MAX, color, data, crisisFor, METRICS, type CompanyId,
} from "@/lib/data";
import type { Metric } from "@/lib/store";

const W = 1000;
const PADL = 46;
const PADR = 24;
const PLOT_W = W - PADL - PADR;
const LANE_H = 104;
const LANE_GAP = 6;
const AXIS_H = 30;

// Ehrliche Kurzform der real gemessenen Substanz-Kurve (3a) je Firma
const SHAPE: Record<string, string> = {
  RWE: "Wanne / U",
  VW: "schwankend",
  BASF: "hohes Plateau",
};
const TOTAL_H = COMPANIES.length * LANE_H + (COMPANIES.length - 1) * LANE_GAP + AXIS_H;

const xFor = (y: number) => PADL + ((y - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * PLOT_W;
const laneTop = (i: number) => i * (LANE_H + LANE_GAP);
const yForMax = (i: number, h: number, max: number) =>
  laneTop(i) + LANE_H - 16 - (h / max) * (LANE_H - 30);

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

export default function LaneChart() {
  const year = useViz((s) => s.year);
  const focus = useViz((s) => s.focus);
  const metric = useViz((s) => s.metric);
  const setYear = useViz((s) => s.setYear);
  const setPlaying = useViz((s) => s.setPlaying);
  const setFocus = useViz((s) => s.setFocus);

  const active = METRICS.find((m) => m.id === metric)!;
  const val = (p: { metrics: Record<Metric, number> }) => p.metrics[metric];

  // Globales Maximum der aktiven Metrik (dynamische Y-Skala pro Lesart)
  const maxH = useMemo(() => {
    let max = 0;
    for (const c of COMPANIES)
      for (const p of data.companies[c].trajectory)
        max = Math.max(max, p.metrics[metric]);
    return max || 1;
  }, [metric]);
  const yFor = (i: number, h: number) => yForMax(i, h, maxH);

  const px = xFor(year);

  return (
    <div className="glass p-2 sm:p-3 w-full">
      <svg
        viewBox={`0 0 ${W} ${TOTAL_H}`}
        className="w-full h-auto select-none"
        style={{ maxHeight: "58vh" }}
      >
        <defs>
          {COMPANIES.map((c) => (
            <linearGradient key={c} id={`fill-${c}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color(c)} stopOpacity="0.28" />
              <stop offset="100%" stopColor={color(c)} stopOpacity="0.02" />
            </linearGradient>
          ))}
        </defs>

        {/* Krisenjahr-Bänder */}
        {YEARS.filter((y) => crisisFor(y)).map((y) => (
          <rect
            key={`cr-${y}`}
            x={xFor(y) - 9}
            y={0}
            width={18}
            height={TOTAL_H - AXIS_H}
            fill="var(--crit)"
            opacity={y === year ? 0.16 : 0.07}
            rx={4}
          />
        ))}

        {/* Klick-Fläche: x -> Jahr */}
        <rect
          x={0} y={0} width={W} height={TOTAL_H - AXIS_H}
          fill="transparent"
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

        {/* Lanes */}
        {COMPANIES.map((c, i) => {
          const traj = data.companies[c].trajectory;
          const pts = traj.map((p) => ({ x: xFor(p.year), y: yFor(i, val(p)) }));
          const line = smoothPath(pts);
          const area = `${line} L ${pts[pts.length - 1].x} ${yFor(i, 0)} L ${pts[0].x} ${yFor(i, 0)} Z`;
          const dim = focus && focus !== c;
          const evYears = new Set(data.companies[c].events.map((e) => e.year));
          const cur = traj.find((p) => p.year === year)!;
          return (
            <g
              key={c}
              opacity={dim ? 0.18 : 1}
              onClick={() => setFocus(focus === c ? null : c)}
              style={{ cursor: "pointer", transition: "opacity 0.4s" }}
            >
              {/* baseline */}
              <line x1={PADL} y1={yFor(i, 0)} x2={W - PADR} y2={yFor(i, 0)} stroke="var(--border)" strokeWidth={1} />
              {/* Firmenname */}
              <text x={6} y={laneTop(i) + 20} fill={color(c)} fontSize={14} fontWeight={600} className="mono">
                {c}
              </text>
              <text x={6} y={laneTop(i) + 33} fill="var(--fg-faint)" fontSize={8.5}>
                {active.label}
              </text>
              {metric === "substanz" && (
                <text x={6} y={laneTop(i) + 44} fill={color(c)} fontSize={8.5} opacity={0.75} className="mono">
                  {SHAPE[c]}
                </text>
              )}

              <path d={area} fill={`url(#fill-${c})`} />
              <path d={line} fill="none" stroke={color(c)} strokeWidth={2.4} strokeLinecap="round" />

              {/* Event-Knoten */}
              {traj.map((p) =>
                evYears.has(p.year) ? (
                  <circle
                    key={p.year}
                    cx={xFor(p.year)} cy={yFor(i, val(p))} r={p.break ? 5 : 3.4}
                    fill={p.break ? "var(--crit)" : color(c)}
                    stroke="var(--bg)" strokeWidth={1.5}
                  />
                ) : null
              )}
              {/* Bruch-Marker (RWE 2016 = Zielstreichung) */}
              {traj.filter((p) => p.break).map((p) => (
                <text key={`b-${p.year}`} x={xFor(p.year)} y={yFor(i, val(p)) - 9}
                  fill="var(--crit)" fontSize={11} textAnchor="middle" fontWeight={700}>×</text>
              ))}

              {/* aktueller Knoten */}
              <circle cx={px} cy={yFor(i, val(cur))} r={7} fill="none" stroke={color(c)} strokeWidth={1.5} opacity={0.5}>
                <animate attributeName="r" values="7;11;7" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle cx={px} cy={yFor(i, val(cur))} r={4.5} fill={color(c)} stroke="var(--bg)" strokeWidth={1.5} />
            </g>
          );
        })}

        {/* Playhead */}
        <line x1={px} y1={0} x2={px} y2={TOTAL_H - AXIS_H} stroke="var(--fg)" strokeWidth={1.4} opacity={0.55} />
        <polygon points={`${px - 5},0 ${px + 5},0 ${px},7`} fill="var(--fg)" />

        {/* Jahr-Achse */}
        {YEARS.map((y) => {
          const isCrisis = !!crisisFor(y);
          const show = y % 2 === 0 || isCrisis || y === YEAR_MAX;
          if (!show) return null;
          return (
            <text
              key={`ax-${y}`}
              x={xFor(y)} y={TOTAL_H - 8}
              textAnchor="middle" fontSize={10}
              className="mono"
              fill={y === year ? "var(--fg)" : isCrisis ? "var(--crit)" : "var(--fg-faint)"}
              fontWeight={y === year ? 700 : 400}
            >
              {y}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
