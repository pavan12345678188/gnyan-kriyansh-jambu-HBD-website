import MemoryGallery, { ChapterRail } from "../components/MemoryGallery";
import { STAGES } from "../lib/stages";
import "../styles/memories.css";

export default function MemoryScene({ onOpen }) {
  return (
    <section className="journey-section memories" id="memories" data-stage={STAGES.MEMORIES} aria-labelledby="memories-title">
      <header className="section-head">
        <span className="section-kicker">THE FIRST YEAR</span>
        <h2 id="memories-title">One Year of Memories</h2>
        <p>Twelve months, twelve little chapters — the story of Jambu&apos;s first year.</p>
        <ChapterRail />
      </header>
      <MemoryGallery onOpen={onOpen} />
    </section>
  );
}
