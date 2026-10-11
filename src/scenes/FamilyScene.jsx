import FamilySection from "../components/FamilySection";
import { FAMILY } from "../data/family";
import { STAGES } from "../lib/stages";
import "../styles/family.css";

export default function FamilyScene({ onOpen }) {
  return (
    <section
      className="journey-section family"
      id="family"
      data-stage={STAGES.FAMILY}
      aria-labelledby="family-title"
    >
      <header className="section-head">
        <span className="section-kicker">
          THE PEOPLE WHO LOVE HIM
        </span>

        <h2 id="family-title">
          Family Memories
        </h2>

        <p>
          The hands that held him, the voices that sang to him,
          the hearts that grew bigger.
        </p>
      </header>

      <FamilySection
        items={FAMILY}
        onOpen={onOpen}
      />
    </section>
  );
}