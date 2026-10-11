import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { makeHeartGeometry } from "../FloatingHeart";
import { layoutHalfWidth, seeded, smooth } from "../../lib/utils";

const dummy = new THREE.Object3D();
const col = new THREE.Color();
const TOP = 8;
const BOTTOM = -2.5;

const KINDS = {
  confetti: {
    palette: ["#7cc4f2", "#f6b6ca", "#e8c36c", "#c9b8ec", "#fbf8f2", "#f3dcb4"],
    size: [0.07, 0.16], speed: [0.35, 0.8], spin: 3.2, appear: 0.35,
  },
  hearts: {
    palette: ["#f6a6bf", "#ffd0dc", "#fbf0e8", "#f3dcb4"],
    size: [0.07, 0.15], speed: [0.22, 0.5], spin: 1.1, appear: 0.7,
  },
  dots: {
    palette: ["#ffe2a0", "#fff4d8", "#ffd1e0"],
    size: [0.014, 0.04], speed: [0.1, 0.4], spin: 0, appear: 0.1,
  },
};

/**
 * Cinematic falling layer drawn with one InstancedMesh. Every instance has its
 * own speed, depth, size, drift and tumble, so nothing falls in sync.
 */
function FallingField({ w, kind, count, seed }) {
  const cfg = KINDS[kind];
  const mesh = useRef();

  const geometry = useMemo(() => {
    if (kind === "hearts") return makeHeartGeometry();
    if (kind === "dots") return new THREE.SphereGeometry(1, 8, 6);
    return new THREE.PlaneGeometry(1, 0.55);
  }, [kind]);

  const material = useMemo(() => {
    if (kind === "dots") return new THREE.MeshBasicMaterial({ toneMapped: false });
    if (kind === "hearts")
      return new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.05, emissive: "#ff9ab8", emissiveIntensity: 0.18 });
    return new THREE.MeshStandardMaterial({ roughness: 0.55, side: THREE.DoubleSide });
  }, [kind]);

  const data = useMemo(() => {
    const r = seeded(seed);
    return Array.from({ length: count }, () => ({
      nx: r() * 2 - 1,
      z: -6 + r() * 10.5,
      off: r(),
      speed: cfg.speed[0] + r() * (cfg.speed[1] - cfg.speed[0]),
      size: cfg.size[0] + Math.pow(r(), 1.6) * (cfg.size[1] - cfg.size[0]),
      drift: 0.1 + r() * 0.4,
      fq: 0.3 + r() * 0.6,
      ph: r() * 6.28,
      rs: [(r() - 0.5) * cfg.spin, (r() - 0.5) * cfg.spin, (r() - 0.5) * cfg.spin],
    }));
  }, [count, cfg, seed]);

  useLayoutEffect(() => {
    const m = mesh.current;
    data.forEach((d, i) => {
      const c = cfg.palette[i % cfg.palette.length];
      col.set(c);
      if (kind === "dots") col.multiplyScalar(2.4); // >1 so bloom picks them up
      else col.multiplyScalar(0.8 + (d.z + 6) / 10.5 * 0.35); // farther = a touch dimmer
      m.setColorAt(i, col);
    });
    m.instanceColor.needsUpdate = true;
  }, [data, cfg, kind]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const m = mesh.current;
    const gate = smooth(cfg.appear - 0.25, cfg.appear + 0.2, w.energy * Math.min(1, 0.4 + w.warm));
    const active = Math.floor(count * gate);
    m.count = active;
    for (let i = 0; i < active; i++) {
      const d = data[i];
      const u = (d.off + (t * d.speed) / (TOP - BOTTOM)) % 1;
      const s = d.size * smooth(0, 0.06, u) * smooth(1, 0.93, u);
      dummy.position.set(
        d.nx * layoutHalfWidth(w, d.z) + Math.sin(t * d.fq + d.ph) * d.drift,
        TOP - u * (TOP - BOTTOM),
        d.z
      );
      dummy.rotation.set(t * d.rs[0] + d.ph, t * d.rs[1], t * d.rs[2]);
      dummy.scale.setScalar(s + 0.00001);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={mesh} args={[geometry, material, count]} frustumCulled={false} />;
}

export const ConfettiField = (p) => <FallingField kind="confetti" seed={31} {...p} />;
export const HeartField = (p) => <FallingField kind="hearts" seed={41} {...p} />;
export const GlowDots = (p) => <FallingField kind="dots" seed={51} {...p} />;
