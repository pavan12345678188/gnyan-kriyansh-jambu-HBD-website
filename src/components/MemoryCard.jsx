import { useRef, useState } from "react";
import { Maximize2 } from "lucide-react";
import SmartImage from "./SmartImage";
import ChapterTitle from "./ChapterTitle";
import { useReveal } from "../lib/useReveal";
import { normaliseImage } from "../lib/slides";

/** Photo with subtle 3D tilt, light sweep and a warm frame. Opens the viewer. */
export function PhotoFrame({ src, alt, position, onOpen, className = "", eager = false }) {
  const ref = useRef(null);
  const [orient, setOrient] = useState();
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.setProperty("--ry", `${x * 7}deg`);
    ref.current.style.setProperty("--rx", `${-y * 7}deg`);
    ref.current.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
  };
  const leave = () => {
    ref.current.style.setProperty("--ry", "0deg");
    ref.current.style.setProperty("--rx", "0deg");
  };
  return (
    <button
      ref={ref}
      type="button"
      className={`photo-frame ${className}`}
      onPointerMove={move}
      onPointerLeave={leave}
      onClick={onOpen}
      data-orient={orient}
      disabled={!src}
      aria-label={alt ? `Open photo: ${alt}` : "Open photo"}
    >
      <SmartImage
        src={src}
        alt={alt}
        position={position}
        eager={eager}
        onLoad={(e) => setOrient(e.target.naturalHeight > e.target.naturalWidth * 1.1 ? "portrait" : undefined)}
      />
      <span className="photo-sheen" aria-hidden="true" />
      <span className="photo-expand" aria-hidden="true"><Maximize2 size={16} /></span>
    </button>
  );
}

export default function MemoryCard({ memory: m, index, onOpen }) {
  const ref = useReveal(0.2);
  const extras = (m.images || []).map(normaliseImage);
  return (
    <article ref={ref} id={`chapter-${m.id}`} className="memory reveal" data-side={index % 2 ? "right" : "left"}>
      <span className="memory-numeral" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>

      <div className="memory-visual">
        <PhotoFrame
          className="memory-photo"
          src={m.image}
          alt={`${m.title} — ${m.month}`}
          position={m.position}
          onOpen={() => onOpen(`m-${m.id}-0`)}
        />
        {extras.slice(0, 2).map((img, i) => (
          <PhotoFrame
            key={img.src}
            className={`memory-extra memory-extra-${i}`}
            src={img.src}
            alt={`${m.title}, photo ${i + 2}`}
            onOpen={() => onOpen(`m-${m.id}-${i + 1}`)}
          />
        ))}
      </div>

      <div className="memory-copy">
        <ChapterTitle kicker={m.chapter} title={m.title} as="h3" />
        <p className="memory-meta">
          <span>{m.month}</span>
          {m.date ? <span>{m.date}</span> : null}
        </p>
        <p className="memory-desc">{m.description}</p>
      </div>
    </article>
  );
}
