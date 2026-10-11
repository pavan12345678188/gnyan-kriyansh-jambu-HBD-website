import { ArrowDown, ArrowRight } from "lucide-react";

/** Premium glass CTA with animated border, glow and travelling icon. */
export default function EnterWorldButton({ children = "Enter Jambu's World", onClick, down = false, autoFocus = false }) {
  const Icon = down ? ArrowDown : ArrowRight;
  return (
    <button type="button" className={`enter-btn ${down ? "is-down" : ""}`} onClick={onClick} autoFocus={autoFocus}>
      <span className="enter-btn-border" aria-hidden="true" />
      <span className="enter-btn-label">{children}</span>
      <span className="enter-btn-icon" aria-hidden="true">
        <Icon size={18} strokeWidth={1.9} />
      </span>
    </button>
  );
}
