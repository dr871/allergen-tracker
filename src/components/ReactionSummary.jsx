import { SEVERITY, F, severityVar } from '../constants/allergens.js';
import SectionHeading from './shared/SectionHeading.jsx';

export default function ReactionSummary({ logs }) {
  const counts = { none: 0, mild: 0, moderate: 0, severe: 0 };
  logs.forEach(e => { const s = e.severity || "none"; counts[s] = (counts[s] || 0) + 1; });
  const total = logs.length;
  if (total === 0) return null;
  const hasAny = counts.mild + counts.moderate + counts.severe > 0;
  return (
    <div style={{ background: "var(--bg-page)", border: "1px solid var(--border-default)", borderRadius: 12,
      padding: "14px 16px", marginBottom: 16 }}>
      <SectionHeading>Reaction history {"\u00B7"} {total} exposure{total !== 1 ? "s" : ""}</SectionHeading>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {SEVERITY.map(s => { const n = counts[s.id] || 0; if (n === 0) return null;
          return (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 6,
              background: severityVar(s.id, 'bg'), border: `1px solid ${severityVar(s.id, 'border')}`,
              borderRadius: 8, padding: "6px 12px" }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: severityVar(s.id, 'color'), fontFamily: F }}>{n}{"\u00D7"}</span>
              <span style={{ fontSize: 13, color: severityVar(s.id, 'color'), fontFamily: F }}>{s.label}</span>
            </div>
          );
        })}
      </div>
      {hasAny && (
        <div style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: F, marginTop: 10,
          background: "var(--warn-bg)", border: "1px solid var(--warn-border)", borderRadius: 8, padding: "8px 12px" }}>
          {"\u{1F4A1}"} Keep a record of any reactions to share with your GP or allergist.
        </div>
      )}
    </div>
  );
}
