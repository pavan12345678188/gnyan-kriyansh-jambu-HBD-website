import * as THREE from "three";

export const BALLOON_COLORS = [
  "#7cc4f2", // sky blue
  "#b9dcf7", // baby blue
  "#fbf8f2", // pearl white
  "#f3dcb4", // champagne
  "#f6b6ca", // soft pink
  "#c9b8ec", // lavender
  "#f2d98f", // subtle gold
];

/** Egg-shaped balloon body: rounder on top, gently tapered toward the knot. */
function makeBodyGeometry() {
  const g = new THREE.SphereGeometry(0.5, 32, 24);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    if (y < 0) {
      const t = -y / 0.5;
      const k = 1 - 0.2 * t * t;
      x *= k; z *= k;
    }
    p.setXYZ(i, x, y * 1.18, z);
  }
  g.computeVertexNormals();
  return g;
}

const stringGeo = new THREE.CylinderGeometry(0.004, 0.004, 1.7, 4).translate(0, -0.85, 0);

export function makeBalloonAssets() {
  return {
    body: makeBodyGeometry(),
    knot: new THREE.ConeGeometry(0.05, 0.11, 12),
    string: stringGeo,
    stringMat: new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.7 }),
    mats: BALLOON_COLORS.map(
      (c) =>
        new THREE.MeshPhysicalMaterial({
          color: c, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.06,
          envMapIntensity: 1.3, emissive: c, emissiveIntensity: 0.07,
        })
    ),
  };
}

export function disposeBalloonAssets(a) {
  a.body.dispose(); a.knot.dispose(); a.stringMat.dispose();
  a.mats.forEach((m) => m.dispose());
}

/** One glossy balloon with knot and a string that lags behind the sway. */
export default function Balloon({ assets, color, setRef }) {
  return (
    <group ref={setRef}>
      <mesh geometry={assets.body} material={assets.mats[color]} />
      <mesh geometry={assets.knot} material={assets.mats[color]} position={[0, -0.64, 0]} />
      <group position={[0, -0.69, 0]} name="string">
        <mesh geometry={assets.string} material={assets.stringMat} />
      </group>
    </group>
  );
}
