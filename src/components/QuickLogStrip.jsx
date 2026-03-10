import { useState } from 'react';
import { ALLERGENS, F } from '../constants/allergens.js';
import { today } from '../utils/date.js';

export default function QuickLogStrip({ foods, onLog }) {
  const [date, setDate] = useState(today());
  const [logged, setLogged] = useState(null);
  if (!foods.length) return null;

  function handle(food) {
    onLog(food, date);
    if (navigator.vibrate) navigator.vibrate(10);
    setLogged(food.id);
    setTimeout(() => setLogged(null), 3000);
  }

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: 14,
      padding: "16px", marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", fontFamily: F }}>Quick log a food</div>
        <input type="date" value={date} onChange={e => setDate(e.target.value)}
          aria-label="Log date"
          style={{ border: "1.5px solid var(--border-input)", borderRadius: 8, padding: "6px 10px",
            fontSize: 13, fontFamily: F, color: "var(--text-secondary)", minHeight: 36,
            background: "var(--bg-card)" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {foods.map(food => {
          const jl = logged === food.id;
          return (
            <div key={food.id} style={{ display: "flex", alignItems: "center",
              justifyContent: "space-between", background: "var(--bg-page)", borderRadius: 10, padding: "10px 14px" }}>
              <div style={{ minWidth: 0, marginRight: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)", fontFamily: F }}>{food.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-tertiary)", fontFamily: F, marginTop: 2 }}>
                  {food.allergens.map(id => ALLERGENS.find(a => a.id === id)?.emoji).join(" ")}
                  {" \u00B7 "}
                  {food.allergens.map(id => ALLERGENS.find(a => a.id === id)?.label).join(", ")}
                </div>
              </div>
              <button onClick={() => handle(food)} className="touchable"
                aria-label={`Log ${food.name} for ${date}`}
                style={{ background: jl ? "var(--success-text)" : "var(--action-primary)", color: "var(--action-primary-text)",
                  border: "none", borderRadius: 10, padding: "10px 18px", cursor: "pointer", fontSize: 14,
                  fontFamily: F, fontWeight: 600, flexShrink: 0, minHeight: 44,
                  minWidth: 90, transition: "background 0.2s" }}>
                {jl ? "\u2713 Logged!" : "Log"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
