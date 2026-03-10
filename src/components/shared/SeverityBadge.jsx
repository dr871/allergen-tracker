import { SEVERITY, F, severityVar } from '../../constants/allergens.js';

export default function SeverityBadge({ sev }) {
  const s = SEVERITY.find(x => x.id === sev);
  if (!s || sev === "none") return null;
  return (
    <span style={{ fontSize: 12, background: severityVar(s.id, 'bg'), color: severityVar(s.id, 'color'),
      borderRadius: 6, padding: "2px 8px", fontFamily: F, fontWeight: 600,
      border: `1px solid ${severityVar(s.id, 'border')}` }}>
      {s.label}
    </span>
  );
}
