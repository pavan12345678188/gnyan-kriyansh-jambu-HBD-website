import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { COLOR_KEYS, MOODS, STAGES } from "../../lib/stages";

/**
 * Eases the shared world state (colours, light levels, cake spring) toward
 * the mood of the active stage. Runs once per frame, no React re-renders.
 */
export function MoodRig({ w }) {
  useFrame(({ scene }, dtRaw) => {
    const dt = Math.min(dtRaw, 0.1);
    const m = MOODS[w.stage];
    w.since = (performance.now() - w.t0) / 1000;

    const k = 1 - Math.exp(-dt * m.rate);
    COLOR_KEYS.forEach((key) => w[key].lerp(m.c[key], k));
    w.ambient += (m.ambient - w.ambient) * k;
    w.key += (m.key - w.key) * k;
    w.rays += (m.rays - w.rays) * k;
    w.energy += (m.energy - w.energy) * k;
    w.warm += (m.warm - w.warm) * k;

    // Cake: appears ~0.55s into the reveal, springs in with a soft overshoot.
    const show =
      w.stage === STAGES.INTRO || (w.stage === STAGES.REVEAL && w.since < 0.55) ? 0 : 1;
    const acc = 46 * (show - w.cakeS) - 8 * w.cakeV;
    w.cakeV += acc * dt;
    w.cakeS += w.cakeV * dt;
    if (w.cakeS < 0) { w.cakeS = 0; w.cakeV = 0; }

    if (!scene.fog) scene.fog = new THREE.Fog(w.horizon.clone(), 14, 46);
    scene.fog.color.copy(w.horizon);
  });
  return null;
}

export function Lights({ w }) {
  const hemi = useRef();
  const key = useRef();
  const pink = useRef();
  const blue = useRef();

  useFrame(() => {
    hemi.current.color.copy(w.ambientC);
    hemi.current.groundColor.copy(w.water1);
    hemi.current.intensity = w.ambient * 1.1;
    key.current.color.copy(w.keyC);
    key.current.intensity = w.key;
    pink.current.intensity = 6 + w.warm * 12;
    blue.current.intensity = 9;
  });

  return (
    <>
      <hemisphereLight ref={hemi} />
      <directionalLight ref={key} position={[-4, 7, 5]} />
      {/* cool rim from behind-right: separates objects from the bright sky */}
      <directionalLight position={[5, 3, -6]} intensity={1.4} color="#9fd8ff" />
      <pointLight ref={pink} position={[-4.5, 0.5, 3]} distance={14} color="#ffb6c8" />
      <pointLight ref={blue} position={[4.5, 0.5, 3]} distance={14} color="#a6dcff" />
    </>
  );
}

/** Procedural studio environment: no network fetch, works offline in a hall. */
export function Env() {
  return (
    <Environment resolution={128} frames={1} background={false}>
      <Lightformer form="rect" intensity={2.4} color="#fff3dc" position={[-4, 5, 3]} scale={[8, 5, 1]} />
      <Lightformer form="rect" intensity={1.5} color="#9fd2ff" position={[6, 2, -4]} scale={[6, 6, 1]} />
      <Lightformer form="ring" intensity={1.3} color="#ffd6e0" position={[0, 6, -5]} scale={4} />
      <Lightformer form="rect" intensity={0.9} color="#ffffff" position={[0, -4, 3]} scale={[12, 2, 1]} />
      <Lightformer form="rect" intensity={1.2} color="#ffe2a8" position={[3, 3, 5]} scale={[4, 3, 1]} />
    </Environment>
  );
}
