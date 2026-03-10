import { F } from '../../constants/allergens.js';

export default function AllergenChip({ a, selected, onToggle }) {
  return (
    <button onClick={onToggle} className="touchable" style={{ display: "inline-flex", alignItems: "center", gap: 5,
      borderRadius: 99, padding: "8px 14px", fontSize: 14, fontFamily: F, cursor: "pointer",
      marginRight: 6, marginBottom: 8, minHeight: 44,
      border: selected ? "2px solid var(--action-primary)" : "2px solid var(--border-default)",
      background: selected ? "var(--action-primary)" : "var(--bg-card)",
      color: selected ? "var(--action-primary-text)" : "var(--text-secondary)",
      userSelect: "none", fontWeight: selected ? 600 : 400 }}>
      {a.emoji} {a.label}
    </button>
  );
}
