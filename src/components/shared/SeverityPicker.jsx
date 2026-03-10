import { SEVERITY, F, severityVar } from '../../constants/allergens.js';

export default function SeverityPicker({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {SEVERITY.map(s => (
        <button key={s.id} onClick={() => onChange(s.id)} className="touchable"
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
            gap: 6, borderRadius: 10, padding: "10px 16px", fontSize: 14, fontFamily: F,
            cursor: "pointer", minHeight: 44, flex: "1 1 auto",
            border: value === s.id ? `2px solid ${severityVar(s.id, 'color')}` : "2px solid var(--border-default)",
            background: value === s.id ? severityVar(s.id, 'bg') : "var(--bg-card)",
            color: value === s.id ? severityVar(s.id, 'color') : "var(--text-tertiary)",
            fontWeight: value === s.id ? 700 : 400, transition: "all 0.15s" }}>
          <span style={{ width: 10, height: 10, borderRadius: 99,
            background: severityVar(s.id, 'color'), flexShrink: 0 }} />
          {s.label}
        </button>
      ))}
    </div>
  );
}
