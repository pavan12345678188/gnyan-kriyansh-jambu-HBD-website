import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import SmartImage from "./SmartImage";

/** Full-screen cinematic viewer: keyboard, swipe, captions, chapter info. */
export default function PhotoViewer({ slides, openKey, onClose }) {
  const start = slides.findIndex((s) => s.key === openKey);
  const [index, setIndex] = useState(Math.max(0, start));
  const [closing, setClosing] = useState(false);
  const [dir, setDir] = useState(0);
  const closeBtn = useRef(null);
  const touch = useRef(null);
  const timer = useRef(0);
  const slide = slides[index];

  const go = useCallback((d) => {
    setDir(d);
    setIndex((i) => (i + d + slides.length) % slides.length);
  }, [slides.length]);

  const close = useCallback(() => {
    setClosing(true);
    timer.current = window.setTimeout(onClose, 280);
  }, [onClose]);

  useEffect(() => {
    const prevFocus = document.activeElement;
    closeBtn.current?.focus();
    const key = (e) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab") { e.preventDefault(); closeBtn.current?.focus(); }
    };
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      window.clearTimeout(timer.current);
      prevFocus?.focus?.();
    };
  }, [close, go]);

  if (!slide) return null;

  const onTouchEnd = (e) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    touch.current = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  // Preload neighbours so next/previous feels instant.
  const next = slides[(index + 1) % slides.length];
  const prev = slides[(index - 1 + slides.length) % slides.length];

  return (
    <div
      className={`viewer ${closing ? "is-closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${slide.title} photo viewer`}
      onClick={(e) => e.target === e.currentTarget && close()}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={onTouchEnd}
    >
      <button ref={closeBtn} type="button" className="viewer-close" onClick={close} aria-label="Close viewer"><X size={22} /></button>
      {slides.length > 1 && (
        <>
          <button type="button" className="viewer-nav viewer-prev" onClick={() => go(-1)} aria-label="Previous photo"><ChevronLeft size={26} /></button>
          <button type="button" className="viewer-nav viewer-next" onClick={() => go(1)} aria-label="Next photo"><ChevronRight size={26} /></button>
        </>
      )}
      <figure className="viewer-figure" key={slide.key} data-dir={dir}>
        <SmartImage src={slide.src} alt={slide.caption} eager className="viewer-img" />
        <figcaption>
          <span className="viewer-kicker">{slide.kicker}</span>
          <strong>{slide.title}</strong>
          <p>{slide.caption}</p>
        </figcaption>
      </figure>
      <span className="viewer-count" aria-live="polite">{index + 1} / {slides.length}</span>
      <link rel="preload" as="image" href={next.src} />
      <link rel="preload" as="image" href={prev.src} />
    </div>
  );
}
