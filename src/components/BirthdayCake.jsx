import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const dummy = new THREE.Object3D();

/** Static ring of identical small meshes (icing scallops, gold pearls). */
function Ring({ radius, y, n, size, geometry, material, squash = 1 }) {
  const ref = useRef();
  useLayoutEffect(() => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      dummy.position.set(Math.cos(a) * radius, y, Math.sin(a) * radius);
      dummy.scale.set(size, size * squash, size);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, [n, radius, y, size, squash]);
  return <instancedMesh ref={ref} args={[geometry, material, n]} />;
}

const TIERS = [
  { r: 1.3, h: 0.7, y: 0.07, c: "#a9d6f5" },
  { r: 0.95, h: 0.62, y: 0.77, c: "#fff1e2" },
  { r: 0.62, h: 0.52, y: 1.39, c: "#f4b8cc" },
];
const TOP = 1.91;
const CANDLES = 5;

/** Procedural stylised three-tier cake: matte icing, gold details, glowing candles. */
export default function BirthdayCake({ w }) {
  const root = useRef();
  const flames = useRef([]);
  const light = useRef();

  const m = useMemo(
    () => ({
      icing: new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.62 }),
      gold: new THREE.MeshStandardMaterial({ color: "#e8c06a", metalness: 0.9, roughness: 0.24 }),
      plate: new THREE.MeshPhysicalMaterial({ color: "#fbf6ee", roughness: 0.3, clearcoat: 1 }),
      flame: new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffc766").multiplyScalar(3), toneMapped: false }),
      wick: new THREE.MeshBasicMaterial({ color: "#3a2a22" }),
      tiers: TIERS.map((t) => new THREE.MeshStandardMaterial({ color: t.c, roughness: 0.88 })),
      candle: [new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.5 }), new THREE.MeshStandardMaterial({ color: "#f6a6bf", roughness: 0.5 })],
    }),
    []
  );
  const geo = useMemo(
    () => ({
      ball: new THREE.SphereGeometry(1, 14, 10),
      cyl: (r, h) => new THREE.CylinderGeometry(r, r, h, 48),
    }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    root.current.rotation.y = t * 0.16;
    flames.current.forEach((f, i) => {
      if (!f) return;
      f.scale.set(1, 1 + Math.sin(t * 9 + i * 1.7) * 0.14 + Math.sin(t * 13.3 + i) * 0.07, 1);
    });
    light.current.intensity = Math.max(0, w.warm) * (16 + Math.sin(t * 11) * 1.8 + Math.sin(t * 7.3) * 1.2);
  });

  return (
    <group ref={root}>
      {/* plate */}
      <mesh position={[0, 0.035, 0]} material={m.plate}><cylinderGeometry args={[1.6, 1.6, 0.07, 64]} /></mesh>
      <mesh position={[0, 0.07, 0]} rotation-x={Math.PI / 2} material={m.gold}><torusGeometry args={[1.6, 0.025, 8, 80]} /></mesh>

      {TIERS.map((t, i) => (
        <group key={i}>
          <mesh position={[0, t.y + t.h / 2, 0]} material={m.tiers[i]}>
            <cylinderGeometry args={[t.r, t.r, t.h, 64]} />
          </mesh>
          {/* icing cap + scalloped rim */}
          <mesh position={[0, t.y + t.h, 0]} rotation-x={Math.PI / 2} material={m.icing}>
            <torusGeometry args={[t.r - 0.02, 0.06, 12, 80]} />
          </mesh>
          <Ring radius={t.r - 0.02} y={t.y + t.h - 0.04} n={Math.round(t.r * 18)} size={0.085} squash={1.5} geometry={geo.ball} material={m.icing} />
          {/* gold pearls near the base of every tier */}
          <Ring radius={t.r + 0.02} y={t.y + 0.07} n={Math.round(t.r * 20)} size={0.045} geometry={geo.ball} material={m.gold} />
        </group>
      ))}

      {/* gold "1" topper */}
      <group position={[0, TOP + 0.02, 0]}>
        <mesh position={[0, 0.23, 0]} material={m.gold}><boxGeometry args={[0.1, 0.46, 0.06]} /></mesh>
        <mesh position={[-0.07, 0.4, 0]} rotation-z={0.7} material={m.gold}><boxGeometry args={[0.1, 0.2, 0.06]} /></mesh>
        <mesh position={[0, 0.015, 0]} material={m.gold}><boxGeometry args={[0.24, 0.04, 0.06]} /></mesh>
      </group>

      {/* candles */}
      {Array.from({ length: CANDLES }, (_, i) => {
        const a = (i / CANDLES) * Math.PI * 2 + 0.3;
        return (
          <group key={i} position={[Math.cos(a) * 0.4, TOP, Math.sin(a) * 0.4]}>
            <mesh position={[0, 0.17, 0]} material={m.candle[i % 2]}><cylinderGeometry args={[0.024, 0.024, 0.34, 12]} /></mesh>
            <mesh position={[0, 0.355, 0]} material={m.wick}><cylinderGeometry args={[0.004, 0.004, 0.04, 4]} /></mesh>
            <mesh ref={(el) => (flames.current[i] = el)} position={[0, 0.42, 0]} scale={[1, 1, 1]} material={m.flame}>
              <sphereGeometry args={[0.032, 10, 10]} />
            </mesh>
          </group>
        );
      })}
      <pointLight ref={light} position={[0, TOP + 0.55, 0]} distance={7} color="#ffbf66" />
    </group>
  );
}

/** A reflective-wrapped gift box with crossed ribbon and bow. */
export function GiftBox({ position, scale = 1, color, ribbon = "#f6f0e6", rotation = 0 }) {
  return (
    <group position={position} scale={scale} rotation-y={rotation}>
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[0.64, 0.64, 0.64]} />
        <meshPhysicalMaterial color={color} roughness={0.28} metalness={0.1} clearcoat={0.7} envMapIntensity={1.2} />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[0.67, 0.67, 0.12]} />
        <meshStandardMaterial color={ribbon} roughness={0.35} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[0.12, 0.67, 0.67]} />
        <meshStandardMaterial color={ribbon} roughness={0.35} metalness={0.15} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.1, 0.72, 0]} rotation={[0, 0, s * 0.6]} scale={[1, 0.6, 0.5]}>
          <torusGeometry args={[0.1, 0.035, 10, 24]} />
          <meshStandardMaterial color={ribbon} roughness={0.35} metalness={0.15} />
        </mesh>
      ))}
      <mesh position={[0, 0.69, 0]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color={ribbon} roughness={0.35} metalness={0.15} />
      </mesh>
    </group>
  );
}
