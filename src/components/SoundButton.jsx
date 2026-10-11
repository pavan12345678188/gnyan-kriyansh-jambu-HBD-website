import { Volume2, VolumeX } from "lucide-react";

export default function SoundButton({ on, available, onClick }) {
  const label = !available ? "Music unavailable" : on ? "Mute music" : "Play music";
  return (
    <button
      type="button"
      className={`sound-button ${on && available ? "is-on" : ""}`}
      onClick={onClick}
      aria-label={label}
      aria-pressed={on && available}
      title={available ? label : "Add /public/audio/jambu-theme.mp3 to enable music"}
    >
      {on && available ? <Volume2 size={18} strokeWidth={1.8} /> : <VolumeX size={18} strokeWidth={1.8} />}
    </button>
  );
}
