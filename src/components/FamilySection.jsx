import { Heart } from "lucide-react";
import { PhotoFrame } from "./MemoryCard";
import ChapterTitle from "./ChapterTitle";
import { useReveal } from "../lib/useReveal";
import { normaliseImage } from "../lib/slides";

function FamilyBlock({ f, index, onOpen }) {
  const ref = useReveal(0.2);
  const imgs = f.images.map(normaliseImage);
  const [hero, ...rest] = imgs;
  return (
    <article ref={ref} className="family-block reveal" data-side={index % 2 ? "right" : "left"}>
      <div className="family-visual">
        {hero ? (
          <PhotoFrame
            className="family-hero"
            src={hero.src}
            alt={`${f.title}`}
            onOpen={() => onOpen(`f-${f.id}-0`)}
          />
        ) : (
          <div className="family-empty" role="img" aria-label={`${f.title}: photos coming soon`}>
            <Heart size={34} strokeWidth={1.2} aria-hidden="true" />
            <span>Photos coming soon</span>
          </div>
        )}

        {rest.length > 0 && (
          <div className="family-strip">
            {rest.map((img, i) => (
              <PhotoFrame
                key={img.src}
                src={img.src}
                alt={`${f.title}, photo ${i + 2}`}
                onOpen={() => onOpen(`f-${f.id}-${i + 1}`)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="family-copy">
        <ChapterTitle kicker={f.kicker} title={f.title} as="h3" />
        <p className="family-note">{f.note}</p>
      </div>
    </article>
  );
}

export default function FamilySection({ items, onOpen }) {
  return (
    <div className="family-list">
      {items.map((f, i) => (
        <FamilyBlock key={f.id} f={f} index={i} onOpen={onOpen} />
      ))}
    </div>
  );
}