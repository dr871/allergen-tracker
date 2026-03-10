import { F } from '../../constants/allergens.js';

export default function Pill({ label }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", background: "var(--bg-muted)",
      color: "var(--text-secondary)", borderRadius: 99, padding: "4px 12px", fontSize: 13, fontFamily: F,
      marginRight: 4, marginBottom: 4 }}>
      {label}
    </span>
  );
}
