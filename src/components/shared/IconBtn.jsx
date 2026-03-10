import { F } from '../../constants/allergens.js';

export default function IconBtn({ onClick, children, ariaLabel, bg = "var(--bg-muted)", color = "var(--text-tertiary)" }) {
  return (
    <button onClick={onClick} aria-label={ariaLabel}
      className="touchable"
      style={{ minWidth: 44, minHeight: 44, background: bg, border: "none", borderRadius: 10,
        cursor: "pointer", color, fontSize: 16, display: "flex", alignItems: "center",
        justifyContent: "center", flexShrink: 0, fontFamily: F }}>
      {children}
    </button>
  );
}
