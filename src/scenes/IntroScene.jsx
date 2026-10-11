import { ChevronDown } from "lucide-react";
import EnterWorldButton from "../components/EnterWorldButton";
import "../styles/intro.css";

/** INTRO overlay. The 3D world lives behind it; `exiting` fades the text out during the reveal. */
export default function IntroScene({ exiting, onEnter }) {
  return (
    <section className={`scene intro ${exiting ? "is-exiting" : ""}`} aria-labelledby="jambu-title">
      <div className="intro-halo" aria-hidden="true" />
      <div className="intro-stack">
        <div className="intro-eyebrow">
          <i aria-hidden="true" /><span>A VERY SPECIAL STORY</span><i aria-hidden="true" />
        </div>
        <p className="intro-lead">Something beautiful began...</p>

        <p className="intro-fullname">Gnyan Kriyansh</p>

        <div className="intro-nick">
          <span className="intro-our">our little</span>
          <h1 id="jambu-title" className="jambu-word"><span>Jambu</span></h1>
        </div>

        <p className="intro-desc">
          A year of tiny hands, bright eyes, first smiles, and a love that made our family’s world a little brighter.
        </p>

        <EnterWorldButton onClick={onEnter} autoFocus>Enter Jambu&apos;s World</EnterWorldButton>

        <div className="intro-meta">
          <span>12 · 10 · 2026</span>
          <i aria-hidden="true" />
          <span>THE FIRST BIRTHDAY</span>
        </div>
      </div>

      <div className="story-hint" aria-hidden="true">
        <span>PRESS ENTER</span>
        <ChevronDown size={16} strokeWidth={1.6} />
      </div>
    </section>
  );
}
