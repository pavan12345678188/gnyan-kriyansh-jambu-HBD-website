import { useState } from "react";
import { Heart } from "lucide-react";

/** Lazy image that falls back to an elegant placeholder if the file is missing. */
export default function SmartImage({ src, alt = "", position = "50% 50%", className = "", eager = false, onLoad }) {
  const [bad, setBad] = useState(false);
  if (!src || bad) {
    return (
      <div className={`photo-placeholder ${className}`} role="img" aria-label={alt || "Photo coming soon"}>
        <Heart size={26} strokeWidth={1.4} aria-hidden="true" />
        <span>Photo coming soon</span>
      </div>
    );
  }
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable="false"
      style={{ objectPosition: position }}
      onLoad={onLoad}
      onError={() => setBad(true)}
    />
  );
}
