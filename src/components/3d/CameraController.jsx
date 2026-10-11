import { useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MOODS, STAGES } from "../../lib/stages";

const look = new THREE.Vector3();
const target = new THREE.Vector3();
const pos = new THREE.Vector3();
const { damp } = THREE.MathUtils;

/**
 * Reusable cinematic camera.
 * - eases between stage presets (dolly + target + fov)
 * - extra forward push during BIRTHDAY_REVEAL
 * - subtle mouse parallax and a slow breathing float
 * - re-frames for portrait / ultrawide so nothing is ever clipped
 */
export default function CameraController({ w, reduced }) {
  useEffect(() => {
    const move = (e) => {
      w.px = (e.clientX / window.innerWidth) * 2 - 1;
      w.py = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [w]);

  useFrame(({ camera, size, clock }, dtRaw) => {
    const dt = Math.min(dtRaw, 0.1);
    const aspect = size.width / size.height;
    w.aspect = aspect;
    // Portrait / narrow screens pull back so the cake and balloons still fit.
    w.fit = aspect < 1.6 ? 1 + (1.6 / aspect - 1) * 0.5 : 1;

    const m = MOODS[w.stage].cam;
    const fov = m.fov + (aspect < 1 ? 5 : 0);
    const dist = m.dist * w.fit;
    const halfH = Math.tan(THREE.MathUtils.degToRad(fov / 2)) * dist;

    // The reveal pushes the camera forward in a smooth arc, then it settles.
    let push = 0;
    if (w.stage === STAGES.REVEAL) push = Math.sin(Math.PI * Math.min(w.since / 2.2, 1)) * 1.1;

    pos.set(m.focus[0], m.focus[1] + m.height, m.focus[2] + dist - push);
    target.set(m.focus[0], m.focus[1] - m.ndcY * halfH, m.focus[2]);

    const lam = w.stage === STAGES.REVEAL ? 2.4 : 1.5;
    const t = clock.elapsedTime;
    const amp = reduced ? 0.15 : 1;

    w.cx = damp(w.cx ?? pos.x, pos.x, lam, dt);
    w.cy = damp(w.cy ?? pos.y, pos.y, lam, dt);
    w.cz = damp(w.cz ?? pos.z, pos.z, lam, dt);
    w.lx = damp(w.lx ?? target.x, target.x, lam, dt);
    w.ly = damp(w.ly ?? target.y, target.y, lam, dt);
    w.lz = damp(w.lz ?? target.z, target.z, lam, dt);
    w.mx = damp(w.mx ?? 0, w.px, 2.2, dt);
    w.my = damp(w.my ?? 0, w.py, 2.2, dt);

    camera.position.set(
      w.cx + w.mx * 0.55 * amp + Math.sin(t * 0.23) * 0.1 * amp,
      w.cy + w.my * 0.28 * amp + Math.sin(t * 0.31) * 0.06 * amp,
      w.cz
    );
    look.set(w.lx + w.mx * 0.12 * amp, w.ly, w.lz);
    camera.lookAt(look);

    const f = damp(camera.fov, fov, lam, dt);
    if (Math.abs(f - camera.fov) > 0.001) {
      camera.fov = f;
      camera.updateProjectionMatrix();
    }
  });
  return null;
}
