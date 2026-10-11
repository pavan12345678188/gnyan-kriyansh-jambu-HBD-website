import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { useQuality, budget } from "../../lib/quality";
import { createWorldState } from "../../lib/stages";
import { Env, Lights, MoodRig } from "./Atmosphere";
import CameraController from "./CameraController";
import WaterSurface, { Sky } from "./WaterSurface";
import LightRays from "./LightRays";
import ParticleField from "./ParticleField";
import BubbleField from "./BubbleField";
import BalloonField from "./BalloonField";
import { ConfettiField, GlowDots, HeartField } from "./FallingField";
import FloatingObjects from "./FloatingObjects";
import Effects from "./Effects";

/**
 * The single persistent 3D world. Scenes never create their own worlds:
 * they only change `stage`, and the world eases to that stage's mood.
 */
export default function World({ stage }) {
  const q = useQuality();
  const w = useMemo(createWorldState, []);
  const n = useMemo(() => budget(q), [q]);
  const post = !q.mobile;
  const [dpr, setDpr] = useState([1, q.mobile ? 1.5 : 2]);

  useEffect(() => {
    w.stage = stage;
    w.t0 = performance.now();
  }, [stage, w]);

  useEffect(() => setDpr([1, q.mobile ? 1.5 : 2]), [q.mobile]);

  return (
    <Canvas
      className="world-canvas"
      dpr={dpr}
      camera={{ position: [0, 0.4, 9.7], fov: 44, near: 0.1, far: 160 }}
      gl={{
        antialias: !post,
        powerPreference: "high-performance",
        toneMapping: post ? THREE.NoToneMapping : THREE.NeutralToneMapping,
      }}
    >
      <PerformanceMonitor onDecline={() => setDpr([1, 1.15])} />
      <MoodRig w={w} />
      <CameraController w={w} reduced={q.reduced} />
      <Lights w={w} />
      <Env />

      {/* background */}
      <Sky w={w} />
      <WaterSurface w={w} />
      <LightRays w={w} count={q.mobile ? 4 : 7} />

      {/* atmosphere + depth layers */}
      <ParticleField w={w} counts={n} />
      <BubbleField w={w} count={n.bubbles} />
      <BalloonField w={w} count={n.balloons} />
      <FloatingObjects w={w} />
      <GlowDots w={w} count={n.dots} />
      <ConfettiField w={w} count={n.confetti} />
      <HeartField w={w} count={n.hearts} />

      {post && <Effects />}
    </Canvas>
  );
}
