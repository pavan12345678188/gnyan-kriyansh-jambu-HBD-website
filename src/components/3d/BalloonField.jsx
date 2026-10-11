import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import Balloon, { BALLOON_COLORS, disposeBalloonAssets, makeBalloonAssets } from "../Balloon";
import { layoutHalfWidth, seeded, smooth } from "../../lib/utils";

const SPAN = 15; // world-space rise range, wide enough for any aspect

/** Foreground / midground / background balloons with organic independent motion. */
export default function BalloonField({ w, count }) {
  const assets = useMemo(makeBalloonAssets, []);
  useEffect(() => () => disposeBalloonAssets(assets), [assets]);

  const refs = useRef([]);
  const data = useMemo(() => {
    const r = seeded(7);
    return Array.from({ length: count }, (_, i) => {
      const layer = i % 6 === 0 ? "fg" : i % 3 === 0 ? "bg" : "mid";
      const side = r() > 0.5 ? 1 : -1;
      const nx =
        layer === "fg" ? side * (0.62 + r() * 0.34)
        : layer === "mid" ? side * (0.45 + r() * 0.5)
        : (r() * 2 - 1) * 0.95;
      return {
        layer, nx,
        z: layer === "fg" ? 2.4 + r() * 1.8 : layer === "mid" ? -1.5 + r() * 3 : -9 + r() * 5,
        y0: r() * SPAN,
        speed: 0.16 + r() * 0.2,
        scale: layer === "fg" ? 1.15 + r() * 0.55 : layer === "mid" ? 0.8 + r() * 0.45 : 0.55 + r() * 0.35,
        color: i % BALLOON_COLORS.length,
        ph: r() * 6.28,
        spin: (r() - 0.5) * 0.5,
        sway: 0.15 + r() * 0.3,
      };
    });
  }, [count]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    data.forEach((d, i) => {
      const g = refs.current[i];
      if (!g) return;
      const u = ((d.y0 + t * d.speed * (0.7 + w.energy * 0.3)) % SPAN) / SPAN;
      const fade = smooth(0, 0.05, u) * smooth(1, 0.93, u);
      g.position.set(
        d.nx * layoutHalfWidth(w, d.z) + Math.sin(t * 0.35 + d.ph) * d.sway,
        -3.2 + u * SPAN,
        d.z + Math.sin(t * 0.18 + d.ph) * 0.9 // drifts toward / away from camera
      );
      g.rotation.set(0, t * d.spin + d.ph, Math.sin(t * 0.5 + d.ph) * 0.09);
      g.scale.setScalar(d.scale * fade + 0.0001);
      const str = g.getObjectByName("string");
      if (str) str.rotation.z = Math.sin(t * 0.8 + d.ph) * 0.12;
    });
  });

  return (
    <group>
      {data.map((d, i) => (
        <Balloon key={i} assets={assets} color={d.color} setRef={(el) => (refs.current[i] = el)} />
      ))}
    </group>
  );
}
