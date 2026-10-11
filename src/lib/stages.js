import * as THREE from "three";

export const STAGES = {
  INTRO: "INTRO",
  REVEAL: "BIRTHDAY_REVEAL",
  WORLD: "BIRTHDAY_WORLD",
  MEMORIES: "MEMORIES",
  CONNECTION: "CONNECTION",
  FAMILY: "FAMILY",
  FINAL: "FINAL_CELEBRATION",
};

const cam = (focus, dist, height, ndcY, fov) => ({ focus, dist, height, ndcY, fov });

/**
 * One mood per scene state. The single persistent 3D world eases toward the
 * active mood: colours, light, particle energy, rays, camera.
 * ndcY = where the focus point should sit on screen (-1 bottom … 1 top).
 */
const RAW = {
  [STAGES.INTRO]: {
    top: "#62b3e8", mid: "#a4d9f4", horizon: "#f5fbff",
    water1: "#8fd6ee", water2: "#4aa6d6", glow: "#fff0c8",
    ambientC: "#e6f5ff", keyC: "#ffffff",
    ambient: 1.0, key: 1.6, rays: 0.55, energy: 0.55, warm: 0, rate: 1.3,
    cam: cam([0, 0.2, 0], 9.5, 0.2, 0, 44),
  },
  [STAGES.REVEAL]: {
    top: "#8fc3ee", mid: "#d6d2f0", horizon: "#ffe6c4",
    water1: "#9ad8ec", water2: "#58aedb", glow: "#ffdf9a",
    ambientC: "#fff1e0", keyC: "#ffe6c0",
    ambient: 1.0, key: 2.4, rays: 1.5, energy: 1.5, warm: 0.8, rate: 1.7,
    cam: cam([0, -1.1, 0], 9.6, 0.4, 0.0, 42),
  },
  [STAGES.WORLD]: {
    top: "#9ec4f0", mid: "#dcc9f2", horizon: "#ffdcd2",
    water1: "#a6dcee", water2: "#62b4dd", glow: "#ffd88f",
    ambientC: "#fff0e4", keyC: "#ffe8c9",
    ambient: 1.0, key: 2.4, rays: 0.85, energy: 1.0, warm: 1.0, rate: 1.1,
    cam: cam([0, -1.1, 0], 9.6, 0.4, 0.0, 40),
  },
  [STAGES.MEMORIES]: {
    top: "#3b7cbf", mid: "#78afdc", horizon: "#d6eaf7",
    water1: "#7cc4e4", water2: "#3f95c9", glow: "#f6e6bd",
    ambientC: "#e3f1ff", keyC: "#fff3dc",
    ambient: 0.9, key: 1.8, rays: 0.6, energy: 0.6, warm: 0.5, rate: 1.0,
    cam: cam([2.6, -0.6, -2], 11.5, 0.3, 0, 44),
  },  [STAGES.CONNECTION]: {
    top: "#0b1630", mid: "#162c52", horizon: "#3f6388",
    water1: "#244e78", water2: "#102a4b", glow: "#ffd98a",
    ambientC: "#d9eaff", keyC: "#ffe7c4",
    ambient: 0.55, key: 1.45, rays: 0.25, energy: 0.95, warm: 0.9, rate: 1.1,
    cam: cam([0, -0.25, 0], 10.5, 0.25, 0, 43),
  },
  [STAGES.FAMILY]: {
    top: "#6a8fd0", mid: "#dcb0c8", horizon: "#ffe0c0",
    water1: "#8fcfe6", water2: "#5aa6d2", glow: "#ffd9a0",
    ambientC: "#fff0e8", keyC: "#ffe4c8",
    ambient: 0.95, key: 2.0, rays: 0.7, energy: 0.75, warm: 0.8, rate: 1.0,
    cam: cam([-2.6, -0.6, -2], 11.5, 0.3, 0, 44),
  },
  [STAGES.FINAL]: {
    top: "#2c4f94", mid: "#d79a8e", horizon: "#ffd08a",
    water1: "#7fc2e2", water2: "#3b86c0", glow: "#ffd27a",
    ambientC: "#ffe9d2", keyC: "#ffdfae",
    ambient: 0.95, key: 2.6, rays: 1.1, energy: 1.6, warm: 1.7, rate: 1.1,
    cam: cam([0, -1.1, 0], 9.8, 0.5, 0.0, 42),
  },
};

export const COLOR_KEYS = ["top", "mid", "horizon", "water1", "water2", "glow", "ambientC", "keyC"];

export const MOODS = Object.fromEntries(
  Object.entries(RAW).map(([id, m]) => {
    const c = {};
    COLOR_KEYS.forEach((k) => (c[k] = new THREE.Color(m[k])));
    return [id, { ...m, c }];
  })
);

/** Mutable, non-React state shared by every 3D component (read in useFrame). */
export function createWorldState() {
  const base = MOODS[STAGES.INTRO];
  const w = {
    stage: STAGES.INTRO,
    t0: performance.now(),
    since: 0,
    ambient: base.ambient, key: base.key, rays: base.rays,
    energy: base.energy, warm: base.warm,
    cakeS: 0, cakeV: 0,
    fit: 1, aspect: 16 / 9,
    px: 0, py: 0,
  };
  COLOR_KEYS.forEach((k) => (w[k] = base.c[k].clone()));
  return w;
}
