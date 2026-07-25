"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Line, MeshReflectorMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useMemo } from "react";
import * as THREE from "three";
import { useViz } from "@/lib/store";
import {
  COMPANIES, YEAR_MIN, YEAR_MAX, color, data, crisisFor, type CompanyId,
} from "@/lib/data";

const xFor = (year: number) => (year - (YEAR_MIN + YEAR_MAX) / 2) * 1.25;
const zFor = (i: number) => (i - 1) * 3.6;
const MAXH = 5; // Welt-Höhe des Maximums

function useScale(metric: string) {
  return useMemo(() => {
    let max = 0;
    for (const c of COMPANIES)
      for (const p of data.companies[c].trajectory)
        max = Math.max(max, p.metrics[metric as keyof typeof p.metrics]);
    return MAXH / (max || 1);
  }, [metric]);
}

function buildRibbon(points: THREE.Vector3[], top: THREE.Color) {
  const geom = new THREE.BufferGeometry();
  const pos: number[] = [];
  const col: number[] = [];
  const bot = top.clone().multiplyScalar(0.05);
  const push = (v: THREE.Vector3, c: THREE.Color) => {
    pos.push(v.x, v.y, v.z);
    col.push(c.r, c.g, c.b);
  };
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i], b = points[i + 1];
    const aB = new THREE.Vector3(a.x, 0, a.z);
    const bB = new THREE.Vector3(b.x, 0, b.z);
    push(a, top); push(aB, bot); push(b, top);
    push(aB, bot); push(bB, bot); push(b, top);
  }
  geom.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geom.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  geom.computeVertexNormals();
  return geom;
}

function Ribbon({ c, i }: { c: CompanyId; i: number }) {
  const metric = useViz((s) => s.metric);
  const focus = useViz((s) => s.focus);
  const year = useViz((s) => s.year);
  const scale = useScale(metric);
  const traj = data.companies[c].trajectory;
  const col = color(c);
  const dim = focus && focus !== c;
  const z = zFor(i);

  const { geom, dense, knots } = useMemo(() => {
    const knotPts = traj.map(
      (p) => new THREE.Vector3(xFor(p.year), p.metrics[metric as "substanz"] * scale, z)
    );
    const curve = new THREE.CatmullRomCurve3(knotPts, false, "catmullrom", 0.5);
    const dense = curve.getPoints(120);
    return { geom: buildRibbon(dense, new THREE.Color(col)), dense, knots: knotPts };
  }, [metric, scale, traj, col, z]);

  const curY = knots.find((_, idx) => traj[idx].year === year)!;

  return (
    <group>
      <mesh geometry={geom}>
        <meshBasicMaterial
          vertexColors
          transparent
          opacity={dim ? 0.1 : 0.5}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <Line points={dense} color={col} lineWidth={dim ? 1 : 3} transparent opacity={dim ? 0.25 : 1} />

      {/* Jahres-Sphären */}
      {traj.map((p, idx) => {
        const active = p.year === year;
        const isCrisis = !!crisisFor(p.year);
        const pos = knots[idx];
        return (
          <mesh key={p.year} position={[pos.x, pos.y, pos.z]}>
            <sphereGeometry args={[active ? 0.22 : p.break ? 0.18 : isCrisis ? 0.14 : 0.09, 20, 20]} />
            <meshBasicMaterial
              color={p.break ? "#ef4444" : active ? "#ffffff" : col}
              transparent
              opacity={dim ? 0.15 : 1}
            />
          </mesh>
        );
      })}

      {/* aktueller Punkt: Halo */}
      {!dim && (
        <mesh position={[curY.x, curY.y, curY.z]}>
          <sphereGeometry args={[0.4, 20, 20]} />
          <meshBasicMaterial color={col} transparent opacity={0.18} />
        </mesh>
      )}

      {!dim && (
        <Html position={[xFor(YEAR_MIN) - 1.5, 0.25, z]} center distanceFactor={17}>
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
      <boxGeometry args={[0.03, 5.6, 9]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
    </mesh>
  );
}

function YearMarkers() {
  const year = useViz((s) => s.year);
  const yset = Array.from(new Set([YEAR_MIN, 2016, year, YEAR_MAX]));
  return (
    <>
      {yset.map((y) => (
        <Html key={y} position={[xFor(y), -0.55, zFor(2) + 2.6]} center distanceFactor={19}>
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
    <Canvas camera={{ position: [11, 8.5, 15], fov: 42 }} dpr={[1, 2]} gl={{ antialias: true }}>
      <color attach="background" args={["#080b11"]} />
      <fog attach="fog" args={["#080b11", 26, 52]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[8, 14, 8]} intensity={0.7} />
      <pointLight position={[-8, 6, -6]} intensity={26} color="#a78bfa" />

      {/* Spiegelboden */}
      <mesh rotation-x={-Math.PI / 2} position-y={0}>
        <planeGeometry args={[70, 46]} />
        <MeshReflectorMaterial
          blur={[300, 90]}
          resolution={1024}
          mixBlur={1}
          mixStrength={22}
          roughness={0.9}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.3}
          color="#070a0f"
          metalness={0.55}
        />
      </mesh>

      {COMPANIES.map((c, i) => (
        <Ribbon key={c} c={c} i={i} />
      ))}
      <Playhead />
      <YearMarkers />

      <OrbitControls
        target={[0, 2, 0]}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.45}
        minPolarAngle={0.5}
        maxPolarAngle={Math.PI / 2.15}
        minDistance={12}
        maxDistance={32}
      />

      <EffectComposer>
        <Bloom intensity={1.15} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
