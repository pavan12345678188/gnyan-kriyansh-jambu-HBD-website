import EnterWorldButton from "../components/EnterWorldButton";
import "../styles/birthday.css";

/** BIRTHDAY_REVEAL / BIRTHDAY_WORLD overlay: welcome title above the cake, CTA below. */
export default function BirthdayScene({ onBegin }) {
  return (
    <section className="scene birthday" aria-label="Welcome to Jambu's Little World">
      <div className="bday-top">
        <span className="bday-kicker">WELCOME TO</span>
        <h2 className="jambu-word"><span>Jambu&apos;s</span></h2>
        <p className="bday-sub">LITTLE WORLD</p>
      </div>
      <div className="bday-bottom">
        <p className="bday-line">Gynan Kriyansh <i aria-hidden="true" /> The First Birthday</p>
        <EnterWorldButton down onClick={onBegin}>One Year of Memories</EnterWorldButton>
      </div>
    </section>
  );
}
