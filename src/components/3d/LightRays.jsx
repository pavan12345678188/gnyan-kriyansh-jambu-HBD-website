import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { seeded } from "../../lib/utils";

/** Soft god-rays falling from the upper left. Intensifies during the reveal. */
export default function LightRays({ w, count = 7 }) {
  const group = useRef();
  const rays = useMemo(() => {
    const r = seeded(11);
    return Array.from({ length: count }, (_, i) => ({
      x: -9 + i * 2.7 + r() * 1.2,
      z: -6 - r() * 6,
      width: 1.4 + r() * 2.4,
      phase: r() * 6.28,
      speed: 0.25 + r() * 0.3,
    }));
  }, [count]);

  const mats = useMemo(
    () =>
      rays.map(
        () =>
          new THREE.ShaderMaterial({
            transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false,
            uniforms: { uColor: { value: w.glow }, uOp: { value: 0 } },
            vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
            fragmentShader: /* glsl */ `
              uniform vec3 uColor; uniform float uOp; varying vec2 vUv;
              void main(){
                float side = smoothstep(0., .5, vUv.x) * smoothstep(1., .5, vUv.x);
                float fade = smoothstep(0., .25, vUv.y) * smoothstep(1.02, .35, vUv.y);
                gl_FragColor = vec4(uColor, side*side*fade*uOp);
              }`,
          })
      ),
    [rays, w]
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    mats.forEach((m, i) => {
      const r = rays[i];
      m.uniforms.uOp.value = (0.05 + 0.04 * Math.sin(t * r.speed + r.phase)) * w.rays;
    });
    if (group.current) group.current.rotation.z = -0.5 + Math.sin(t * 0.07) * 0.03;
  });

  return (
    <group ref={group} position={[0, 4, 0]}>
      {rays.map((r, i) => (
        <mesh key={i} position={[r.x, 0, r.z]} material={mats[i]} frustumCulled={false}>
          <planeGeometry args={[r.width, 30]} />
        </mesh>
      ))}
    </group>
  );
}
