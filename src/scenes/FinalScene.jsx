import { RotateCcw } from "lucide-react";
import { PhotoFrame } from "../components/MemoryCard";
import { STAGES } from "../lib/stages";
import { useReveal } from "../lib/useReveal";
import "../styles/final.css";

/** FINAL_CELEBRATION: hero (cake stays visible) followed by the closing message + photo strip. */
export default function FinalScene({ slides, onOpen, onRestart }) {
  const closeRef = useReveal(0.3);
  const strip = slides.filter((s) => s.src).slice(0, 14);
  const loop = [...strip, ...strip];
  return (
    <section className="journey-section final" id="final" data-stage={STAGES.FINAL} aria-labelledby="final-title">
      <div className="final-hero">
        <span className="final-kicker">HAPPY 1ST BIRTHDAY</span>
        <h2 id="final-title" className="jambu-word jambu-word-gold"><span>Jambu</span></h2>
        <p className="final-name">Gynan Kriyansh</p>
      </div>

      <div ref={closeRef} className="final-close reveal">
        <p className="final-message">
          May your little world always be filled with love, laughter, wonder and beautiful memories.
        </p>
        <p className="final-date">12 · 10 · 2026</p>

        {strip.length > 0 && (
          <div className="final-strip" aria-label="Photographs from the first year">
            <div className="final-track">
              {loop.map((s, i) => (
                <PhotoFrame
                  key={`${s.key}-${i}`}
                  src={s.src}
                  alt={s.title}
                  onOpen={() => onOpen(s.key)}
                />
              ))}
            </div>
          </div>
        )}

        <button type="button" className="ghost-btn" onClick={onRestart}>
          <RotateCcw size={16} aria-hidden="true" /> Back to the beginning
        </button>
      </div>
    </section>
  );
}
