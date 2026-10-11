import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree} from "@react-three/fiber";
import { Image as DreiImage, Text, Float } from "@react-three/drei";
import * as THREE from "three";

import "../styles/same-birthday.css";
/* =========================================================
   SAME BIRTHDAY — CINEMATIC "US" SCENE
   Pavan + Jambu
   ========================================================= */

/* ---------------------------------------------------------
   Floating photo
--------------------------------------------------------- */

function MemoryPhoto({
  url,
  position,
  rotation = [0, 0, 0],
  scale = [1.2, 1.5, 1],
  caption,
  mirror = false,
}) {
  const group = useRef();
  const image = useRef();

  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    if (!group.current) return;

    const t = state.clock.elapsedTime;

    group.current.position.y =
      position[1] + Math.sin(t * 0.7 + position[0]) * 0.045;

    group.current.rotation.z =
      rotation[2] + Math.sin(t * 0.45 + position[0]) * 0.012;

    group.current.rotation.y =
      rotation[1] + Math.sin(t * 0.35 + position[0]) * 0.018;

    /* subtle mouse/parallax movement */
    target.set(
      state.pointer.x * 0.045,
      state.pointer.y * 0.025,
      0
    );

    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      position[0] + target.x,
      0.025
    );

    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      position[1] + target.y +
        Math.sin(t * 0.7 + position[0]) * 0.045,
      0.025
    );
  });

  return (
    <group
      ref={group}
      position={position}
      rotation={rotation}
    >
      {/* outer glow */}
      <mesh position={[0, 0, -0.035]}>
        <planeGeometry args={[scale[0] * 1.12, scale[1] * 1.12]} />
        <meshBasicMaterial
          color="#78bfff"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* cinematic frame */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[scale[0] * 1.10, scale[1] * 1.10]} />
        <meshStandardMaterial
          color="#d9b56d"
          roughness={0.28}
          metalness={0.72}
        />
      </mesh>

      {/* dark backing */}
      <mesh position={[0, 0, -0.015]}>
        <planeGeometry args={[scale[0] * 1.045, scale[1] * 1.045]} />
        <meshBasicMaterial
          color="#071322"
        />
      </mesh>

      {/* actual photograph */}
      <DreiImage
        ref={image}
        url={url}
        scale={scale}
        transparent
        toneMapped={false}
        color="white"
        side={THREE.DoubleSide}
        raycast={() => null}
      />

      {/* glass highlight */}
      <mesh position={[0, 0, 0.025]}>
        <planeGeometry args={[scale[0], scale[1]]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.035}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* name */}
      <Text
        position={[0, -(scale[1] / 2 + 0.22), 0.04]}
        fontSize={0.16}
        letterSpacing={0.18}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
      >
        {caption}
      </Text>
    </group>
  );
}

/* ---------------------------------------------------------
   Central birthday number
--------------------------------------------------------- */

function BirthdayNumber() {
  const ref = useRef();
  const { size } = useThree();

  const isMobile = size.width <= 640;

  useFrame((state) => {
    if (!ref.current) return;

    ref.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.35) * 0.08;

    ref.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.55) * 0.035;
  });

  return (
    <group
      ref={ref}
      scale={isMobile ? 0.62 : 1}
    >
      <Float
        speed={0.8}
        rotationIntensity={0.08}
        floatIntensity={0.12}
      >
        <Text
          fontSize={2.25}
          letterSpacing={-0.05}
          color="#f6d889"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.012}
          outlineColor="#ffffff"
        >
          12
        </Text>

        <Text
          position={[0, -1.18, 0]}
          fontSize={0.14}
          letterSpacing={0.28}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          OCTOBER
        </Text>
      </Float>
    </group>
  );
}
/* ---------------------------------------------------------
   Orbit rings
--------------------------------------------------------- */

function OrbitRing({ radius = 2.1, rotation = [0, 0, 0], opacity = 0.12 }) {
  const ref = useRef();

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.z += delta * 0.035;
  });

  return (
    <mesh ref={ref} rotation={rotation}>
      <torusGeometry args={[radius, 0.006, 8, 128]} />
      <meshBasicMaterial
        color="#9bcfff"
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ---------------------------------------------------------
   Connection light
--------------------------------------------------------- */

function ConnectionLine() {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;

    const material = ref.current.material;

    material.opacity =
      0.12 +
      Math.sin(state.clock.elapsedTime * 1.4) * 0.055;
  });

  return (
    <mesh ref={ref} position={[0, 1.05, -0.5]}>
      <planeGeometry args={[5.0, 0.012]} />
      <meshBasicMaterial
        color="#f2d58a"
        transparent
        opacity={0.14}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ---------------------------------------------------------
   Background particles
--------------------------------------------------------- */

function CosmicParticles({ count = 90 }) {
  const points = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 13;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 7;
      arr[i * 3 + 2] = -2 - Math.random() * 6;
    }

    return arr;
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;

    points.current.rotation.y =
      state.clock.elapsedTime * 0.008;

    points.current.rotation.z =
      Math.sin(state.clock.elapsedTime * 0.08) * 0.015;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        color="#d9ecff"
        size={0.035}
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ---------------------------------------------------------
   Central glow
--------------------------------------------------------- */

function BirthdayOrb() {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;

    const s =
      1 +
      Math.sin(state.clock.elapsedTime * 0.8) * 0.05;

    ref.current.scale.setScalar(s);
  });

  return (
    <mesh ref={ref} position={[0, 0, -0.65]}>
      <circleGeometry args={[1.55, 64]} />

      <meshBasicMaterial
        color="#6dafff"
        transparent
        opacity={0.055}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ---------------------------------------------------------
   Main 3D content
--------------------------------------------------------- */

function SameBirthdayWorld({ photos }) {
  const { size } = useThree();

  const isMobile = size.width <= 640;

  const safePhotos = Array.isArray(photos)
    ? photos.filter(Boolean).slice(0, 8)
    : [];

  /*
   * Desktop:
   * Larger cinematic composition around the center.
   *
   * Mobile:
   * Compact 2-column gallery so ALL 8 photos remain
   * inside the phone camera frame.
   */
  const desktopLayout = [
    {
      position: [-2.65, 1.05, -0.8],
      rotation: [0, 0.12, -0.07],
      scale: [1.25, 1.55, 1],
      caption: "PAVAN",
    },
    {
      position: [2.65, 1.05, -0.8],
      rotation: [0, -0.12, 0.07],
      scale: [1.25, 1.55, 1],
      caption: "JAMBU",
    },
    {
      position: [-4.15, -1.15, -0.2],
      rotation: [0, 0.08, -0.12],
      scale: [0.95, 1.18, 1],
      caption: "OUR JOURNEY STARTED",
    },
    {
      position: [-1.45, -2.05, -0.1],
      rotation: [0, -0.05, 0.08],
      scale: [0.9, 1.12, 1],
      caption: "WE TOGETHER",
    },
    {
      position: [1.45, -2.05, -0.1],
      rotation: [0, 0.05, -0.08],
      scale: [0.9, 1.12, 1],
      caption: "MEMORY",
    },
    {
      position: [4.15, -1.15, -0.2],
      rotation: [0, -0.08, 0.12],
      scale: [0.95, 1.18, 1],
      caption: "AFFECTION",
    },
    {
      position: [-4.05, 2.65, -1.1],
      rotation: [0, 0.08, -0.1],
      scale: [0.8, 1.0, 1],
      caption: "US",
    },
    {
      position: [4.05, 2.65, -1.1],
      rotation: [0, -0.08, 0.1],
      scale: [0.8, 1.0, 1],
      caption: "LOVE",
    },
  ];

  /*
   * MOBILE LAYOUT
   *
   * 8 photos are arranged as:
   *
   *   01       02
   *   03       04
   *   05       06
   *   07       08
   *
   * Small enough to fit a phone while keeping
   * the central birthday composition visible.
   */
const mobileLayout = [
  {
    position: [-0.88, 2.35, 0.15],
    rotation: [0, 0.015, -0.035],
    scale: [0.62, 0.95, 1],
    caption: "PAVAN",
  },
  {
    position: [0.88, 2.35, 0.15],
    rotation: [0, -0.015, 0.035],
    scale: [0.62, 0.78, 1],
    caption: "JAMBU",
  },
  {
    position: [-0.88, 1.15, 0.2],
    rotation: [0, 0.015, 0.025],
    scale: [0.62, 0.78, 1],
    caption: "OUR JOURNEY",
  },
  {
    position: [0.88, 1.15, 0.2],
    rotation: [0, -0.015, -0.025],
    scale: [0.62, 0.78, 1],
    caption: "WE TOGETHER",
  },
  {
    position: [-0.88, -1.15, 0.2],
    rotation: [0, 0.015, -0.025],
    scale: [0.62, 0.78, 1],
    caption: "AFFECTION",
  },
  {
    position: [0.88, -1.15, 0.2],
    rotation: [0, -0.015, 0.025],
    scale: [0.62, 0.78, 1],
    caption: "MEMORY",
  },
  {
    position: [-0.88, -2.3, 0.15],
    rotation: [0, 0.015, 0.035],
    scale: [0.62, 0.78, 1],
    caption: "US",
  },
  {
    position: [0.88, -2.3, 0.15],
    rotation: [0, -0.015, -0.035],
    scale: [0.62, 0.78, 1],
    caption: "LOVE",
  },
];

  const layout = isMobile ? mobileLayout : desktopLayout;

  return (
    <>
      <ambientLight intensity={0.55} />

      <directionalLight
        position={[-4, 5, 6]}
        intensity={2}
        color="#d9ecff"
      />

      <pointLight
        position={[-3, 1.5, 2]}
        intensity={14}
        distance={9}
        color="#6eb5ff"
      />

      <pointLight
        position={[3, 1.5, 2]}
        intensity={12}
        distance={9}
        color="#f5d486"
      />

      <CosmicParticles count={isMobile ? 45 : 90} />

      <BirthdayOrb />

      <OrbitRing
        radius={2.35}
        rotation={[Math.PI / 2.7, 0.1, 0]}
        opacity={0.14}
      />

      <OrbitRing
        radius={3}
        rotation={[Math.PI / 2.1, -0.2, 0]}
        opacity={0.06}
      />

      <ConnectionLine />

      <BirthdayNumber />

      {safePhotos.map((url, index) => {
        const item = layout[index];

        if (!item) return null;

        return (
          <Suspense key={`${url}-${index}`} fallback={null}>
            <MemoryPhoto
              url={url}
              position={item.position}
              rotation={item.rotation}
              scale={item.scale}
              caption={item.caption}
            />
          </Suspense>
        );
      })}
    </>
  );
}
/* =========================================================
   HTML SCENE
   ========================================================= */

export default function SameBirthdayScene({
  photos = [
    "/photos/us/us_1.jpeg",
    "/photos/us/us_2.jpeg",
    "/photos/us/us_3.jpeg",
    "/photos/us/us_4.jpeg",
    "/photos/us/us_5.jpeg",
    "/photos/us/us_6.jpeg",
    "/photos/us/us_7.jpeg",
    "/photos/us/us_8.jpeg",
  ],
} = {}) {
  const safePhotos = useMemo(
    () => photos.filter(Boolean).slice(0, 8),
    [photos]
  );

  return (
    <section
      className="same-birthday-scene"
      aria-label="Pavan and Jambu share the same birthday"
    >
      <div className="same-birthday-canvas">
        <Canvas
          camera={{
            position: [0, 0.3, 8.8],
            fov: 46,
            near: 0.1,
            far: 100,
          }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
          }}
        >
          <color attach="background" args={["#020914"]} />

          <fog
            attach="fog"
            args={["#020914", 7, 20]}
          />

          <SameBirthdayWorld photos={safePhotos} />
        </Canvas>
      </div>

      <div
        className="same-birthday-overlay"
        aria-hidden="true"
      >
        <div className="same-birthday-copy">
          <p className="same-birthday-kicker">
            TWO LIVES · ONE DATE
          </p>

          <h2 className="same-birthday-title">
            Same Birthday
          </h2>

          <p className="same-birthday-subtitle">
            Some connections are written in the destiny.
          </p>

          <p className="same-birthday-date">
            12 October
          </p>
        </div>
      </div>

      <div className="same-birthday-photo-label left">
        <strong>PAVAN</strong>
        <span>the older birthday twin</span>
      </div>

      <div className="same-birthday-photo-label right">
        <strong>JAMBU</strong>
        <span>my birthday companion</span>
      </div>

      <div
        className="same-birthday-orbit"
        aria-hidden="true"
      />

      <div
        className="same-birthday-scroll"
        aria-hidden="true"
      >
        <span>Continue</span>
        <i />
      </div>
    </section>
  );
}