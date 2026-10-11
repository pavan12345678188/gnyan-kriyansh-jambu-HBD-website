export default function ChapterTitle({ kicker, title, as: Tag = "h2", align = "left", className = "" }) {
  return (
    <header className={`chapter-title ${className}`} data-align={align}>
      <span className="chapter-kicker">{kicker}</span>
      <Tag>{title}</Tag>
    </header>
  );
}
