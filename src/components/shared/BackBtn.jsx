import { F } from '../../constants/allergens.js';

export default function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} className="touchable" style={{ display: "flex", alignItems: "center", gap: 6,
      background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)",
      fontSize: 15, fontFamily: F, padding: "0 0 12px 0", minHeight: 44 }}>
      ← Back
    </button>
  );
}
