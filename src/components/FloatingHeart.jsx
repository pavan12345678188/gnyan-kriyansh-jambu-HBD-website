import * as THREE from "three";

/** Shared heart geometry, centred and unit-sized (used by falling hearts + toppers). */
export function makeHeartGeometry(depth = 0.28) {
  const s = new THREE.Shape();
  s.moveTo(0, -0.5);
  s.bezierCurveTo(-0.15, -0.35, -0.55, -0.1, -0.55, 0.18);
  s.bezierCurveTo(-0.55, 0.45, -0.2, 0.55, 0, 0.3);
  s.bezierCurveTo(0.2, 0.55, 0.55, 0.45, 0.55, 0.18);
  s.bezierCurveTo(0.55, -0.1, 0.15, -0.35, 0, -0.5);
  const g = new THREE.ExtrudeGeometry(s, {
    depth, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.08, bevelSegments: 3, curveSegments: 16,
  });
  g.center();
  return g;
}
