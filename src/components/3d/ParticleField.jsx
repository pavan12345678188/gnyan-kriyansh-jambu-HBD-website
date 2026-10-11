import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";

/** Layers 1-3: atmospheric dust, tiny glowing motes, birthday sparkles. */
export default function ParticleField({ w, counts }) {
  const sparkle = useRef();
  useFrame(() => {
    if (sparkle.current) sparkle.current.visible = w.warm > 0.35;
  });
  return (
    <>
      <Sparkles count={counts.dust} scale={[22, 11, 14]} size={1.6} speed={0.08} opacity={0.55} color="#ffffff" noise={1} />
      <Sparkles count={counts.glow} scale={[18, 9, 10]} size={3.2} speed={0.14} opacity={0.8} color="#ffe2a0" noise={0.8} />
      <group ref={sparkle}>
        <Sparkles count={counts.sparkle} scale={[14, 7, 6]} position={[0, 0.5, 1]} size={6} speed={0.35} opacity={0.9} color="#ffc6d8" noise={1.2} />
      </group>
    </>
  );
}
