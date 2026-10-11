import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { layoutHalfWidth, seeded } from "../../lib/utils";

const dummy = new THREE.Object3D();

/** Layer 6: translucent, iridescent bubbles rising at several depths. */
export default function BubbleField({ w, count }) {
  const mesh = useRef();
  const data = useMemo(() => {
    const r = seeded(21);
    return Array.from({ length: count }, () => {
      const near = r() > 0.82;
      return {
        nx: r() * 2 - 1,
        z: near ? 3 + r() * 2.5 : -7 + r() * 9,
        y0: r() * 15,
        speed: 0.18 + r() * 0.3,
        size: near ? 0.28 + r() * 0.22 : 0.06 + r() * 0.2,
        ph: r() * 6.28,
        wob: 0.1 + r() * 0.3,
      };
    });
  }, [count]);

  useLayoutEffect(() => { mesh.current.count = count; }, [count]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const active = Math.min(count, Math.round(count * Math.min(1, 0.55 + w.energy * 0.3)));
    mesh.current.count = active;
    for (let i = 0; i < active; i++) {
      const d = data[i];
      const u = ((d.y0 + t * d.speed) % 15) / 15;
      const y = -2.5 + u * 14;
      const fade = Math.min(1, u * 14) * Math.min(1, (1 - u) * 8);
      dummy.position.set(
        d.nx * layoutHalfWidth(w, d.z) + Math.sin(t * 0.6 + d.ph) * d.wob,
        y, d.z
      );
      dummy.scale.setScalar(d.size * fade * (1 + Math.sin(t * 2 + d.ph) * 0.04));
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 20, 16]} />
      <meshPhysicalMaterial
        color="#ffffff" transparent opacity={0.28} roughness={0} metalness={0}
        clearcoat={1} iridescence={1} iridescenceIOR={1.35} envMapIntensity={2.2}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
