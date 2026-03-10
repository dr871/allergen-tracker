import { useState } from 'react';
import { ALLERGENS, F } from '../constants/allergens.js';
import { useModalA11y } from '../hooks/useModalA11y.js';
import IconBtn from './shared/IconBtn.jsx';
import Label from './shared/Label.jsx';
import AllergenChip from './shared/AllergenChip.jsx';
import SeverityPicker from './shared/SeverityPicker.jsx';

export default function AddEntryModal({ date, onClose, onSave, foods }) {
  const contentRef = useModalA11y(onClose);
  const [selectedAllergen, setSelectedAllergen] = useState(null);
  const [severity, setSeverity] = useState("none");
  const [food, setFood] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [showFoodPicker, setShowFoodPicker] = useState(false);
  const [formError, setFormError] = useState("");

  const relevantFoods = selectedAllergen
    ? foods.filter(f => f.allergens.includes(selectedAllergen))
    : [];

  const handleSubmit = () => {
    if (!selectedAllergen) { setFormError("Please select an allergen."); return; }
    setFormError("");
    onSave({
      allergenId: selectedAllergen,
      severity,
      food: food.trim(),
      amount: amount.trim(),
      notes: notes.trim(),
      date
    });
    onClose();
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Add exposure"
      style={{ position: "fixed", inset: 0, background: "var(--overlay-bg)", zIndex: 200,
        display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}>
      <div ref={contentRef} className="sheet-enter" onClick={e => e.stopPropagation()}
        style={{ background: "var(--bg-card)", borderRadius: "20px 20px 0 0", width: "100%",
          maxWidth: 560, maxHeight: "82vh", overflowY: "auto", padding: "24px 24px 48px",
          boxShadow: "0 -8px 32px rgba(0,0,0,0.15)" }}>

        <div style={{ width: 40, height: 4, background: "var(--border-default)", borderRadius: 99,
          margin: "0 auto 20px" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 20, color: "var(--text-primary)", fontFamily: F }}>Add exposure</div>
            <div style={{ fontSize: 13, color: "var(--text-tertiary)", fontFamily: F }}>
              {new Date(date + "T12:00:00").toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" })}
            </div>
          </div>
          <IconBtn onClick={onClose} ariaLabel="Close">{"\u2715"}</IconBtn>
        </div>

        <div style={{ marginBottom: 20 }}>
          <Label required>Allergen</Label>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {ALLERGENS.map(a => (
              <AllergenChip key={a.id} a={a} selected={selectedAllergen === a.id}
                onToggle={() => setSelectedAllergen(selectedAllergen === a.id ? null : a.id)} />
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <Label>Reaction</Label>
          <SeverityPicker value={severity} onChange={setSeverity} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <Label>Food it was in (optional)</Label>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="text" placeholder="e.g. peanut butter on toast" value={food}
              onChange={e => setFood(e.target.value)}
              style={{ flex: 1, padding: "10px 12px", border: "1.5px solid var(--border-input)",
                borderRadius: 10, fontSize: 15, fontFamily: F, boxSizing: "border-box",
                minHeight: 44, background: "var(--bg-card)", color: "var(--text-primary)" }} />
            {relevantFoods.length > 0 && (
              <button onClick={() => setShowFoodPicker(!showFoodPicker)} className="touchable"
                aria-label="Pick from saved foods"
                style={{ background: "var(--success-bg)", border: "1.5px solid var(--success-border)",
                  borderRadius: 10, padding: "10px 14px", cursor: "pointer",
                  fontSize: 13, color: "var(--success-text)", fontFamily: F,
                  whiteSpace: "nowrap", fontWeight: 600, minHeight: 44 }}>
                Saved {"\u25BE"}
              </button>
            )}
          </div>
          {showFoodPicker && relevantFoods.length > 0 && (
            <div style={{ marginTop: 6, background: "var(--bg-card)", border: "1.5px solid var(--border-default)",
              borderRadius: 10, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
              {relevantFoods.map(f => (
                <button key={f.id} onClick={() => { setFood(f.name); setShowFoodPicker(false); }}
                  className="touchable"
                  style={{ width: "100%", padding: "12px 16px", cursor: "pointer",
                    borderBottom: "1px solid var(--bg-muted)", fontSize: 14, fontFamily: F,
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "var(--bg-card)", border: "none", textAlign: "left", minHeight: 48,
                    color: "var(--text-primary)" }}>
                  <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{f.name}</span>
                  <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
                    {f.allergens.map(id => ALLERGENS.find(a => a.id === id)?.emoji).join(" ")}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 20 }}>
          <Label>Amount (optional)</Label>
          <input type="text" placeholder="e.g. 1 tsp, half a cracker" value={amount}
            onChange={e => setAmount(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", border: "1.5px solid var(--border-input)",
              borderRadius: 10, fontSize: 15, fontFamily: F, boxSizing: "border-box",
              minHeight: 44, background: "var(--bg-card)", color: "var(--text-primary)" }} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <Label>Notes (optional)</Label>
          <textarea placeholder="Any observations..." value={notes}
            onChange={e => setNotes(e.target.value)} rows={2}
            style={{ width: "100%", padding: "10px 12px", border: "1.5px solid var(--border-input)",
              borderRadius: 10, fontSize: 15, fontFamily: F, boxSizing: "border-box",
              resize: "vertical", minHeight: 56, background: "var(--bg-card)", color: "var(--text-primary)" }} />
        </div>

        {formError && (
          <div role="alert" style={{ color: "var(--danger-text)", fontSize: 13, fontFamily: F,
            marginBottom: 10, textAlign: "center" }}>
            {formError}
          </div>
        )}
        <button onClick={handleSubmit} disabled={!selectedAllergen} className="touchable"
          style={{ width: "100%", background: selectedAllergen ? "var(--success-text)" : "var(--border-input)",
            color: "#fff", border: "none", borderRadius: 10, padding: "14px",
            fontSize: 16, cursor: selectedAllergen ? "pointer" : "default",
            fontFamily: F, fontWeight: 700, minHeight: 52,
            transition: "background 0.15s" }}>
          Save entry
        </button>
      </div>
    </div>
  );
}
