import { MEMORIES } from "../data/memories";
import { FAMILY } from "../data/family";

const norm = (i) => (typeof i === "string" ? { src: i } : i);

/** Flat, ordered list powering the full-screen viewer (memories, then family). */
export function buildSlides() {
  const slides = [];
  MEMORIES.forEach((m) => {
    [m.image, ...(m.images || [])].filter(Boolean).forEach((raw, i) => {
      const img = norm(raw);
      slides.push({
        key: `m-${m.id}-${i}`, src: img.src, kicker: `${m.chapter} · ${m.month}`,
        title: m.title, caption: img.caption || m.caption || m.description,
      });
    });
  });
  FAMILY.forEach((f) => {
    (f.images || []).map(norm).forEach((img, i) => {
      slides.push({
        key: `f-${f.id}-${i}`, src: img.src, kicker: f.kicker, title: f.title,
        caption: img.caption || f.note,
      });
    });
  });
  return slides;
}
export { norm as normaliseImage };
