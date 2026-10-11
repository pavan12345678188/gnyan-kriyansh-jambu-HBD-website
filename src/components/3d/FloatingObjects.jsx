import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import BirthdayCake, { GiftBox } from "../BirthdayCake";
import { makeRadialTexture, clamp } from "../../lib/utils";

const GIFTS = [
  { p: [-2.15, 0, 0.9], s: 0.95, c: "#a9d6f5", r: "#fbf6ec", ry: 0.35 },
  { p: [2.05, 0, 1.0], s: 0.8, c: "#f6b6ca", r: "#f3dcb4", ry: -0.3 },
  { p: [1.55, 0, -1.3], s: 0.6, c: "#e8c36c", r: "#ffffff", ry: 0.6 },
  { p: [-1.6, 0, -1.2], s: 0.7, c: "#c9b8ec", r: "#fbf6ec", ry: -0.5 },
];

/** Pearl stage on the water, the cake and gifts. They spring in during the reveal. */
export default function FloatingObjects({ w }) {
  const stage = useRef();
  const cake = useRef();
  const gifts = useRef([]);
  const shadowTex = useMemo(() => makeRadialTexture("rgba(60,40,70,0.5)", "rgba(60,40,70,0)"), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const s = Math.max(0.0001, w.cakeS);
    stage.current.scale.setScalar(clamp(s, 0.0001, 1.08));
    cake.current.scale.setScalar(s);
    cake.current.position.y = Math.sin(t * 0.8) * 0.02;
    gifts.current.forEach((g, i) => {
      if (!g) return;
      const gs = Math.max(0.0001, w.cakeS - 0.12 - i * 0.07);
      g.scale.setScalar(gs);
      g.position.y = Math.sin(t * 0.7 + i * 1.3) * 0.015;
    });
  });

  return (
    <group position={[0, -2.5, 0]}>
      <group ref={stage}>
        <mesh position={[0, -0.12, 0]}>
          <cylinderGeometry args={[2.95, 3.05, 0.24, 80]} />
          <meshPhysicalMaterial color="#f6f1ea" roughness={0.3} clearcoat={1} envMapIntensity={1.1} />
        </mesh>
        <mesh position={[0, 0.002, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[2.92, 0.035, 8, 100]} />
          <meshStandardMaterial color="#e8c06a" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.003, 0]} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[2.25, 2.3, 100]} />
          <meshBasicMaterial color="#9fd2f2" transparent opacity={0.55} />
        </mesh>
        <mesh position={[0, 0.006, 0]} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[2.1, 48]} />
          <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
        </mesh>
      </group>
      <group ref={cake}><BirthdayCake w={w} /></group>
      {GIFTS.map((g, i) => (
        <group key={i} ref={(el) => (gifts.current[i] = el)} position={g.p}>
          <GiftBox scale={g.s} color={g.c} ribbon={g.r} rotation={g.ry} />
        </group>
      ))}
    </group>
  );
}
