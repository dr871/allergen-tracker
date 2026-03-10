import { ALLERGENS, F } from '../constants/allergens.js';
import { today, startOfWeek } from '../utils/date.js';

function weeklySummary(data) {
  const thisWS = startOfWeek(today());
  const dt = new Date(thisWS + "T12:00:00"); dt.setDate(dt.getDate() - 7);
  const lastWS = dt.toISOString().slice(0, 10);
  const thisSet = new Set(), lastSet = new Set();
  ALLERGENS.forEach(a => {
    (data.logs[a.id] || []).forEach(e => {
      const ws = startOfWeek(e.date);
      if (ws === thisWS) thisSet.add(a.id);
      if (ws === lastWS) lastSet.add(a.id);
    });
  });
  return { thisWeek: thisSet.size, lastWeek: lastSet.size, total: ALLERGENS.length };
}

export default function WeeklyBanner({ data }) {
  const { thisWeek, lastWeek, total } = weeklySummary(data);
  const pct = Math.round((thisWeek / total) * 100);
  const diff = thisWeek - lastWeek;
  const barColor = pct >= 80 ? "var(--status-good-dot)" : pct >= 50 ? "var(--status-soon-dot)" : "var(--status-overdue-dot)";
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: 14,
      padding: "16px 18px", marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--text-tertiary)", fontFamily: F, fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>This week</div>
          <div style={{ fontWeight: 800, fontSize: 24, color: "var(--text-primary)", fontFamily: F, lineHeight: 1 }}>
            {thisWeek}
            <span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}>/{total} allergens</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          {diff > 0 && <div style={{ fontSize: 13, color: "var(--success-text)", fontFamily: F, fontWeight: 600 }}>{"\u2191"} {diff} more than last week</div>}
          {diff < 0 && <div style={{ fontSize: 13, color: "var(--danger-text)", fontFamily: F, fontWeight: 600 }}>{"\u2193"} {Math.abs(diff)} fewer than last week</div>}
          {diff === 0 && lastWeek > 0 && <div style={{ fontSize: 13, color: "var(--text-tertiary)", fontFamily: F }}>Same as last week</div>}
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: F, marginTop: 3 }}>Last week: {lastWeek}/{total}</div>
        </div>
      </div>
      <div style={{ height: 8, background: "var(--progress-track)", borderRadius: 99, overflow: "hidden", marginBottom: 6 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 99,
          transition: "width 0.4s ease" }} />
      </div>
      <div style={{ fontSize: 13, color: "var(--text-tertiary)", fontFamily: F }}>
        {thisWeek === total ? "\u{1F389} All allergens covered this week!" :
          thisWeek === 0 ? "No allergens given yet this week \u2014 a good day to start!" :
            `${total - thisWeek} allergen${total - thisWeek !== 1 ? "s" : ""} still to give this week`}
      </div>
    </div>
  );
}
