import { useEffect, useRef } from "react";

/**
 * Cinematic reveal that works inside Jambu's nested .journey scroller.
 * The previous implementation observed against the browser viewport, while
 * the story actually scrolls inside .journey. That could leave cards hidden
 * (opacity: 0) even though the user was scrolling through the story.
 */
export function useReveal(threshold = 0.12) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const root = el.closest(".journey");

    const reveal = () => {
      el.classList.add("is-in");
    };

    // Never leave content permanently invisible if an observer is unavailable
    // or a browser has an unusual clipping/scrolling implementation.
    if (!("IntersectionObserver" in window)) {
      reveal();
      return undefined;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          io.disconnect();
        }
      },
      {
        root: root || null,
        rootMargin: "0px 0px -8% 0px",
        threshold,
      }
    );

    io.observe(el);

    // If the element is already visible, reveal it immediately.
    requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const rootRect = root?.getBoundingClientRect();

      const top = rootRect ? Math.max(rect.top, rootRect.top) : rect.top;
      const bottom = rootRect ? Math.min(rect.bottom, rootRect.bottom) : rect.bottom;
      const viewportHeight = rootRect?.height ?? window.innerHeight;

      if (bottom > top && top < (rootRect?.top ?? 0) + viewportHeight) {
        reveal();
      }
    });

    // Safety net: content should never remain invisible because of animation
    // infrastructure. The reveal still happens cinematically if possible.
    const fallback = window.setTimeout(reveal, 1800);

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [threshold]);

  return ref;
}
