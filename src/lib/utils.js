import * as THREE from "three";

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export const smooth = (a, b, v) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/** Small deterministic RNG so layouts are stable between renders. */
export function seeded(seed) {
  let s = (seed >>> 0) || 1;
  return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296;
}

/**
 * Half-width of the visible world at depth z for a *reference* camera.
 * Using a stage-independent reference keeps balloons/bubbles/confetti from
 * sliding sideways while the real camera dollies, yet they still spread to
 * the true screen edges in portrait, desktop and ultrawide.
 */
export const layoutHalfWidth = (w, z) =>
  0.384 * (9 * w.fit - z) * w.aspect;

/** Soft radial alpha texture (used for fake contact shadow / glows). */
export function makeRadialTexture(inner = "rgba(255,255,255,1)", outer = "rgba(255,255,255,0)") {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, inner);
  grad.addColorStop(1, outer);
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
