import MemoryCard from "./MemoryCard";
import { MEMORIES } from "../data/memories";

/** Data-driven month-by-month journey. Add or edit chapters in data/memories.js. */
export default function MemoryGallery({ onOpen }) {
  return (
    <div className="memory-gallery">
      {MEMORIES.map((m, i) => (
        <MemoryCard key={m.id} memory={m} index={i} onOpen={onOpen} />
      ))}
    </div>
  );
}

export function ChapterRail() {
  const go = (id) => document.getElementById(`chapter-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  return (
    <nav className="chapter-rail" aria-label="Jump to a month">
      {MEMORIES.map((m, i) => (
        <button key={m.id} type="button" onClick={() => go(m.id)} aria-label={`${m.month}: ${m.title}`} title={`${m.month} · ${m.title}`}>
          {String(i + 1).padStart(2, "0")}
        </button>
      ))}
    </nav>
  );
}
