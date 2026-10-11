import { useEffect, useState } from "react";

const mq = (q) =>
  typeof window !== "undefined" && window.matchMedia && window.matchMedia(q).matches;

/** Snapshot of device class. Mobile gets a separate (lighter) composition. */
export function measure() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const coarse = mq("(pointer: coarse)");
  return {
    mobile: w < 820 || (coarse && Math.min(w, h) < 600),
    portrait: h > w,
    reduced: mq("(prefers-reduced-motion: reduce)"),
  };
}

export function useQuality() {
  const [q, setQ] = useState(measure);
  useEffect(() => {
    const update = () =>
      setQ((prev) => {
        const next = measure();
        return next.mobile === prev.mobile &&
          next.portrait === prev.portrait &&
          next.reduced === prev.reduced
          ? prev
          : next;
      });
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);
  return q;
}

/** Particle budgets: desktop / mobile, scaled down for reduced motion. */
export function budget(q) {
  const k = q.reduced ? 0.35 : 1;
  const pick = (d, m) => Math.max(4, Math.round((q.mobile ? m : d) * k));
  return {
    balloons: pick(17, 9),
    confetti: pick(170, 60),
    hearts: pick(36, 14),
    dots: pick(110, 40),
    bubbles: pick(28, 12),
    dust: pick(110, 40),
    glow: pick(60, 24),
    sparkle: pick(46, 16),
  };
}
