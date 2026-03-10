import { F, statusVar } from '../constants/allergens.js';
import { daysSince } from '../utils/date.js';
import { getStatus } from '../utils/status.js';
import IconBtn from './shared/IconBtn.jsx';

export default function AllergenCard({ allergen, data, onClick, onInfo }) {
  const status = getStatus(allergen.id, data.logs, data.frequencies);
  const logs = data.logs[allergen.id] || [];
  const lastLog = [...logs].reverse()[0];
  const days = lastLog ? daysSince(lastLog.date) : null;
  const freq = data.frequencies[allergen.id];

  return (
    <div style={{ background: statusVar(status, 'bg'), border: `1.5px solid ${statusVar(status, 'border')}`,
      borderRadius: 14, padding: "14px 14px 14px 16px", marginBottom: 10, display: "flex",
      alignItems: "center", gap: 12 }}>

      <button onClick={onClick} className="touchable" aria-label={`Open ${allergen.label} detail`}
        style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0,
          background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left",
          minHeight: 44 }}>
        <span style={{ fontSize: 30, flexShrink: 0, lineHeight: 1 }}>{allergen.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
            <span style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", fontFamily: F }}>{allergen.label}</span>
            <span style={{ fontSize: 13, color: statusVar(status, 'color'), fontWeight: 700, fontFamily: F,
              flexShrink: 0, marginLeft: 8 }}>
              {status === "never" ? "Never logged" : days == null || isNaN(days) ? "Never" : days === 0 ? "Today" : `${days}d ago`}
            </span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-tertiary)", fontFamily: F,
            lineHeight: 1.4 }}>{allergen.examples}</div>
          <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 5, fontFamily: F }}>
            {status === "never" ? `Target: every ${freq} days` :
              status === "good" ? `Next due in ${Math.max(0, freq - days)} day${freq - days !== 1 ? "s" : ""}` :
                status === "soon" ? `Due in ${Math.max(0, freq - days)} day${freq - days !== 1 ? "s" : ""}` :
                  `${days - freq} day${days - freq !== 1 ? "s" : ""} overdue`}
          </div>
        </div>
      </button>

      <IconBtn onClick={e => { e.stopPropagation(); onInfo(allergen); }} ariaLabel={`Info about ${allergen.label}`}
        bg="var(--bg-muted)" color="var(--text-tertiary)">
        <span style={{ fontSize: 14, fontWeight: 700 }}>{"\u2139"}</span>
      </IconBtn>
    </div>
  );
}
