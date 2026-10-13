import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import {
  Sparkles as SparklesIcon,
  Send,
  WandSparkles,
  BookHeart,
  Heart,
} from "lucide-react";
import * as THREE from "three";
import "./AIUniverse.css";

const QUICK_PROMPTS = [
  "Tell me about Jambu",
  "Create a birthday wish",
  "Tell me a little story",
];

function getBirthdayResponse(message) {
  const text = message.toLowerCase();

  if (text.includes("wish") || text.includes("birthday")) {
    return "Happy Birthday, little Jambu! 🎂 May your days be filled with laughter, your world with love, and your future with beautiful adventures. You will always be a little star in your family's universe. 💛";
  }

  if (text.includes("story") || text.includes("memories")) {
    return "Every beautiful story begins with a little miracle. On October 12, 2025, Jambu began his own journey—a year of tiny smiles, loving arms, precious family moments, and memories that will last a lifetime. ✨";
  }

  if (text.includes("atta")) {
    return "Jambu and his Atta share a special bond filled with love, laughter, and playful moments. No matter how much Jambu grows, he'll always be Atta's little superstar. ❤️";
  }

  return "Welcome to Jambu's little universe! ✨ This is a special place celebrating his first year, the people who love him, and the memories that make his story beautiful. Ask me for a birthday wish, a little story, or something about his bond with Atta.";
}

function EnergyOrb({ activity, pointer }) {
  const group = useRef();
  const shell = useRef();
  const inner = useRef();
  const halo = useRef();
  const particles = useRef();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y += delta * (activity === "thinking" ? 0.85 : 0.22);
      group.current.rotation.x = THREE.MathUtils.damp(
        group.current.rotation.x,
        pointer.current.y * 0.16,
        4,
        delta
      );
      group.current.rotation.z = THREE.MathUtils.damp(
        group.current.rotation.z,
        -pointer.current.x * 0.13,
        4,
        delta
      );
      const pulse = 1 + Math.sin(t * (activity === "thinking" ? 5.5 : 1.8)) *
        (activity === "thinking" ? 0.055 : 0.022);
      group.current.scale.setScalar(pulse);
    }
    if (shell.current) {
      shell.current.rotation.x = t * 0.13;
      shell.current.rotation.y = -t * 0.19;
    }
    if (inner.current) {
      inner.current.rotation.y = -t * 0.55;
      inner.current.rotation.x = Math.sin(t * 0.6) * 0.18;
    }
    if (halo.current) {
      halo.current.rotation.z = t * (activity === "thinking" ? 0.7 : 0.24);
    }
    if (particles.current) {
      particles.current.rotation.y = t * (activity === "thinking" ? 0.32 : 0.12);
      particles.current.rotation.x = Math.sin(t * 0.2) * 0.08;
    }
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.03, 5]} />
        <meshPhysicalMaterial
          color={activity === "thinking" ? "#8a78ff" : "#5b9cff"}
          roughness={0.2}
          metalness={0.28}
          transmission={0.32}
          thickness={0.7}
          clearcoat={1}
          clearcoatRoughness={0.12}
          emissive={activity === "thinking" ? "#3824a6" : "#102c78"}
          emissiveIntensity={activity === "thinking" ? 1.2 : 0.65}
          transparent
          opacity={0.82}
        />
      </mesh>

      <mesh ref={shell}>
        <icosahedronGeometry args={[1.13, 2]} />
        <meshBasicMaterial
          color={activity === "thinking" ? "#c5b5ff" : "#a9d7ff"}
          wireframe
          transparent
          opacity={0.38}
        />
      </mesh>

      <mesh ref={inner} scale={0.55}>
        <icosahedronGeometry args={[1, 3]} />
        <meshStandardMaterial
          color="#d6c7ff"
          emissive="#8c70ff"
          emissiveIntensity={2.1}
          roughness={0.28}
          metalness={0.2}
        />
      </mesh>

      <mesh ref={halo} rotation={[0.8, 0.2, 0.4]}>
        <torusGeometry args={[1.38, 0.012, 10, 180]} />
        <meshBasicMaterial color="#f0d59b" transparent opacity={0.8} />
      </mesh>
      <mesh rotation={[1.25, 0.8, -0.45]}>
        <torusGeometry args={[1.52, 0.007, 8, 180]} />
        <meshBasicMaterial color="#8bcaff" transparent opacity={0.72} />
      </mesh>

      <group ref={particles}>
        <Sparkles count={90} scale={3.7} size={2.1} speed={activity === "thinking" ? 1.6 : 0.55} color="#c9dcff" />
        <Sparkles count={34} scale={2.65} size={3.4} speed={activity === "thinking" ? 2.1 : 0.8} color="#f0d59b" />
      </group>
    </group>
  );
}

function OrbCanvas({ activity, pointer }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      dpr={[1, 1.6]}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      onCreated={({ gl }) => {
        gl.setClearColor("#000000", 0);
      }}
      aria-label="Animated interactive 3D AI energy orb"
    >
      <ambientLight intensity={1.15} />
      <pointLight position={[3, 2, 4]} intensity={32} color="#8bcaff" />
      <pointLight position={[-3, -2, 2]} intensity={18} color="#b69aff" />
      <EnergyOrb activity={activity} pointer={pointer} />
    </Canvas>
  );
}

export default function AIUniverse() {
  const [message, setMessage] = useState("");
  const [activity, setActivity] = useState("idle");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! ✨ Welcome to Jambu's AI Universe. What would you like to discover?",
    },
  ]);
  const pointer = useRef({ x: 0, y: 0 });
  const activityTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(activityTimer.current), []);

  function sendMessage(value = message) {
    const text = value.trim();
    if (!text) return;

    setActivity("thinking");
    window.clearTimeout(activityTimer.current);

    const response = getBirthdayResponse(text);
    setMessages((previous) => [
      ...previous,
      { role: "user", text },
      { role: "assistant", text: response },
    ]);
    setMessage("");

    activityTimer.current = window.setTimeout(() => {
      setActivity("responding");
      activityTimer.current = window.setTimeout(() => setActivity("idle"), 1600);
    }, 650);
  }

  function handleOrbPointerMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    pointer.current = {
      x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
      y: -(((event.clientY - rect.top) / rect.height) * 2 - 1),
    };
  }

  return (
    <section className="ai-universe" id="ai-universe">
      <div className="ai-universe-stars" aria-hidden="true" />

      <div className="ai-universe-heading">
        <span className="ai-universe-kicker">
          <SparklesIcon size={15} />
          A LITTLE WORLD OF WONDER
        </span>
        <h2>
          Welcome to <span>Jambu's Universe</span>
        </h2>
        <p>
          A magical little corner celebrating his story, his memories,
          and all the love surrounding him.
        </p>
      </div>

      <div className="ai-universe-grid">
        <div className="ai-orb-panel">
          <div
            className={`ai-orb-stage ai-orb-${activity}`}
            onPointerMove={handleOrbPointerMove}
            onPointerLeave={() => { pointer.current = { x: 0, y: 0 }; }}
          >
            <OrbCanvas activity={activity} pointer={pointer} />
            <div className="ai-orb-label" aria-live="polite">
              <span className="ai-orb-live-dot" />
              {activity === "thinking" ? "Dreaming up a response…" :
               activity === "responding" ? "A little magic for you" :
               "Your little universe"}
            </div>
          </div>

          <h3>Jambu's Little AI Companion</h3>
          <p>Ask a question, create a wish, or discover a little story.</p>

          <div className="ai-feature-pills">
            <span><Heart size={14} /> Birthday wishes</span>
            <span><BookHeart size={14} /> Little stories</span>
            <span><WandSparkles size={14} /> Magical moments</span>
          </div>
        </div>

        <div className="ai-chat-panel">
          <div className="ai-chat-header">
            <div className={`ai-status-dot ${activity === "thinking" ? "is-thinking" : ""}`} />
            <div>
              <strong>Jambu AI</strong>
              <span>{activity === "thinking" ? "Thinking…" : "Your birthday companion"}</span>
            </div>
          </div>

          <div className="ai-chat-messages" aria-live="polite">
            {messages.map((item, index) => (
              <div
                className={`ai-message ai-message-${item.role}`}
                key={`${index}-${item.role}`}
              >
                {item.text}
              </div>
            ))}
          </div>

          <div className="ai-quick-prompts">
            {QUICK_PROMPTS.map((prompt) => (
              <button type="button" key={prompt} onClick={() => sendMessage(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          <form
            className="ai-chat-form"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask something magical..."
              aria-label="Message Jambu AI"
            />
            <button type="submit" aria-label="Send message">
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>

      <p className="ai-universe-footer">
        Made with love for Jambu · October 12, 2025
      </p>
    </section>
  );
}
