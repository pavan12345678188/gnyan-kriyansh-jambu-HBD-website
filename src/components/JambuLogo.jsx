export default function JambuLogo({ onClick }) {
  const inner = (
    <>
      <span className="logo-mark" aria-hidden="true">J</span>
      <span className="logo-text">
        <strong>JAMBU</strong>
        <small>GYNAN KRIYANSH</small>
      </span>
    </>
  );
  return onClick ? (
    <button type="button" className="jambu-logo" onClick={onClick} aria-label="Jambu — back to the birthday world">
      {inner}
    </button>
  ) : (
    <div className="jambu-logo">{inner}</div>
  );
}
