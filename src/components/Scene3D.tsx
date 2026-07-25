"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Line, Grid } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { useViz } from "@/lib/store";
import { COMPANIES, YEAR_MIN, YEAR_MAX, color, data, crisisFor, type CompanyId } from "@/lib/data";

const xFor = (year: number) => (year - (YEAR_MIN + YEAR_MAX) / 2) * 1.25;
const zFor = (i: number) => (i - 1) * 3.4;
const yScale = 0.34;

function Bars({ c, i }: { c: CompanyId; i: number }) {
  const year = useViz((s) => s.year);
  const focus = useViz((s) => s.focus);
  const traj = data.companies[c].trajectory;
  const col = color(c);
  const dim = focus && focus !== c;

  const linePts = useMemo(
    () => traj.map((p) => new THREE.Vector3(xFor(p.year), p.height * yScale, zFor(i))),
    [traj, i]
  );

  return (
    <group>
      <Line points={linePts} color={col} lineWidth={dim ? 1 : 2.4} transparent opacity={dim ? 0.2 : 0.9} />
      {traj.map((p) => {
        const h = Math.max(0.05, p.height * yScale);
        const active = p.year === year;
        const isCrisis = !!crisisFor(p.year);
        return (
          <mesh key={p.year} position={[xFor(p.year), h / 2, zFor(i)]}>
            <boxGeometry args={[0.5, h, 1.7]} />
            <meshStandardMaterial
              color={p.break ? "#ef4444" : col}
              emissive={p.break ? "#ef4444" : col}
              emissiveIntensity={dim ? 0.05 : active ? 1.1 : isCrisis ? 0.5 : 0.28}
              transparent
              opacity={dim ? 0.15 : 1}
              roughness={0.35}
              metalness={0.1}
            />
          </mesh>
        );
      })}
      {/* Firmen-Label */}
      {!dim && (
        <Html position={[xFor(YEAR_MIN) - 1.4, 0.2, zFor(i)]} center distanceFactor={16}>
          <div style={{ color: col, fontWeight: 600, fontSize: 13, whiteSpace: "nowrap" }} className="mono">
            {c}
          </div>
        </Html>
      )}
    </group>
  );
}

function Playhead() {
  const year = useViz((s) => s.year);
  return (
    <mesh position={[xFor(year), 2.6, 0]}>
      <boxGeometry args={[0.04, 5.6, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.16} />
    </mesh>
  );
}

function YearMarkers() {
  const year = useViz((s) => s.year);
  return (
    <>
      {[YEAR_MIN, 2016, year, YEAR_MAX].map((y, idx) => (
        <Html key={`${y}-${idx}`} position={[xFor(y), -0.5, zFor(2) + 2.4]} center distanceFactor={18}>
          <div
            className="mono"
            style={{
              color: y === year ? "#fff" : crisisFor(y) ? "#ef4444" : "rgba(255,255,255,0.4)",
              fontSize: 11, fontWeight: y === year ? 700 : 400,
            }}
          >
            {y}
          </div>
        </Html>
      ))}
    </>
  );
}

export default function Scene3D() {
  return (
    <Canvas camera={{ position: [11, 9, 15], fov: 42 }} dpr={[1, 2]}>
      <color attach="background" args={["#080b11"]} />
      <fog attach="fog" args={["#080b11", 22, 46]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 14, 8]} intensity={0.8} />
      <pointLight position={[-8, 6, -6]} intensity={30} color="#a78bfa" />

      <Grid
        position={[0, 0, 0]}
        args={[40, 24]}
        cellSize={1.25}
        cellColor="#1b2430"
        sectionColor="#26303d"
        sectionSize={5}
        fadeDistance={38}
        infiniteGrid
      />

      {COMPANIES.map((c, i) => (
        <Bars key={c} c={c} i={i} />
      ))}
      <Playhead />
      <YearMarkers />

      <OrbitControls
        target={[0, 2, 0]}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={0.4}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={12}
        maxDistance={30}
      />
    </Canvas>
  );
}
