import { useState } from 'react';
import { ALLERGENS, BLANK_FOOD, F } from '../constants/allergens.js';
import { today } from '../utils/date.js';
import { useToast } from '../contexts/ToastContext.jsx';
import IconBtn from './shared/IconBtn.jsx';
import Label from './shared/Label.jsx';
import AllergenChip from './shared/AllergenChip.jsx';
import Pill from './shared/Pill.jsx';

export default function FoodsView({ data, setData }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(BLANK_FOOD);
  const [editId, setEditId] = useState(null);
  const [delConfirm, setDelConfirm] = useState(null);
  const [qDate, setQDate] = useState(today());
  const { showToast } = useToast();

  function openNew() { setForm(BLANK_FOOD); setEditId(null); setShowForm(true); }
  function openEdit(f) { setForm({ name: f.name, allergens: [...f.allergens] }); setEditId(f.id); setShowForm(true); }
  function toggleA(id) { setForm(f => ({ ...f, allergens: f.allergens.includes(id) ? f.allergens.filter(x => x !== id) : [...f.allergens, id] })); }
  function save() {
    if (!form.name.trim() || !form.allergens.length) return;
    setData(p => {
      const foods = editId ? p.foods.map(f => f.id === editId ? { ...f, name: form.name.trim(), allergens: form.allergens } : f)
        : [...p.foods, { id: self.crypto?.randomUUID?.() ?? (Date.now().toString(36) + Math.random().toString(36).slice(2)), name: form.name.trim(), allergens: form.allergens }];
      return { ...p, foods };
    });
    setShowForm(false); setEditId(null); setForm(BLANK_FOOD);
    showToast(editId ? 'Food updated' : 'Food added');
  }
  function del(id) {
    if (navigator.vibrate) navigator.vibrate(20);
    setData(p => ({ ...p, foods: p.foods.filter(f => f.id !== id) }));
    setDelConfirm(null);
    showToast('Food deleted');
  }
  function qLog(food) {
    if (navigator.vibrate) navigator.vibrate(10);
    const make = () => ({ id: self.crypto?.randomUUID?.() ?? (Date.now().toString(36) + Math.random().toString(36).slice(2)), date: qDate, food: food.name, amount: "", notes: "", foodId: food.id, severity: "none" });
    setData(p => {
      const logs = { ...p.logs };
      food.allergens.forEach(aId => { logs[aId] = [...(logs[aId] || []), make()].sort((a, b) => a.date.localeCompare(b.date)); });
      return { ...p, logs };
    });
    showToast('Exposure logged');
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", fontFamily: F }}>
      <div style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-default)",
        padding: "calc(var(--sat) + 16px) 20px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "var(--text-primary)", fontFamily: F }}>Saved Foods</h1>
          <button onClick={openNew} className="touchable" style={{ background: "var(--action-primary)", color: "var(--action-primary-text)", border: "none",
            borderRadius: 10, padding: "10px 18px", cursor: "pointer", fontSize: 14,
            fontFamily: F, fontWeight: 600, minHeight: 44 }}>
            + New food
          </button>
        </div>
      </div>
      <div style={{ padding: "20px", paddingBottom: 'calc(72px + var(--sab))' }}>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: 12,
          padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <label style={{ fontSize: 14, color: "var(--text-secondary)", fontFamily: F, fontWeight: 600, flexShrink: 0 }}>
            Log date:
          </label>
          <input type="date" value={qDate} onChange={e => setQDate(e.target.value)}
            style={{ border: "1.5px solid var(--border-input)", borderRadius: 8, padding: "6px 10px",
              fontSize: 14, fontFamily: F, flex: 1, minHeight: 36 }} />
        </div>

        {showForm && (
          <div style={{ background: "var(--bg-card)", border: "1.5px solid var(--border-default)", borderRadius: 14,
            padding: "20px", marginBottom: 20 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 17, color: "var(--text-primary)", fontFamily: F }}>
              {editId ? "Edit food" : "Add a food"}
            </h3>
            <div style={{ marginBottom: 16 }}>
              <Label required>Food name</Label>
              <input type="text" placeholder="e.g. Everything Nut Butter" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={{ width: "100%", padding: "10px 12px", border: "1.5px solid var(--border-input)",
                  borderRadius: 10, fontSize: 15, fontFamily: F, boxSizing: "border-box",
                  minHeight: 44 }} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <Label required>Contains allergens</Label>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {ALLERGENS.map(a => <AllergenChip key={a.id} a={a} selected={form.allergens.includes(a.id)} onToggle={() => toggleA(a.id)} />)}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={save} disabled={!form.name.trim() || !form.allergens.length}
                className="touchable"
                style={{ flex: 1, background: form.name.trim() && form.allergens.length ? "var(--action-primary)" : "var(--border-input)",
                  color: "var(--action-primary-text)", border: "none", borderRadius: 10, padding: "12px",
                  cursor: form.name.trim() && form.allergens.length ? "pointer" : "default",
                  fontFamily: F, fontSize: 14, fontWeight: 600, minHeight: 44 }}>
                {editId ? "Save changes" : "Add food"}
              </button>
              <button onClick={() => { setShowForm(false); setEditId(null); setForm(BLANK_FOOD); }}
                className="touchable"
                style={{ background: "var(--bg-muted)", color: "var(--text-secondary)", border: "none", borderRadius: 10,
                  padding: "12px 18px", cursor: "pointer", fontFamily: F, fontSize: 14,
                  fontWeight: 600, minHeight: 44 }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {data.foods.length === 0 && !showForm && (
          <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "50px 0", fontFamily: F }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{"\u{1F37D}"}</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text-label)" }}>No saved foods yet</div>
            <div style={{ fontSize: 14, marginTop: 4 }}>Add your first food above</div>
          </div>
        )}

        {data.foods.map(food => (
          <div key={food.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)",
            borderRadius: 14, padding: "16px", marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", fontFamily: F }}>{food.name}</div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => openEdit(food)} className="touchable" style={{ background: "var(--bg-muted)", border: "none",
                  borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 13,
                  fontFamily: F, color: "var(--text-secondary)", fontWeight: 600, minHeight: 36 }}>Edit</button>
                {delConfirm === food.id ? (
                  <>
                    <button onClick={() => del(food.id)} className="touchable" style={{ background: "var(--danger-text)", color: "var(--action-primary-text)",
                      border: "none", borderRadius: 8, padding: "8px 14px", cursor: "pointer",
                      fontSize: 13, fontFamily: F, minHeight: 36 }}>Delete</button>
                    <button onClick={() => setDelConfirm(null)} className="touchable" style={{ background: "var(--bg-muted)",
                      border: "none", borderRadius: 8, padding: "8px 14px", cursor: "pointer",
                      fontSize: 13, fontFamily: F, color: "var(--text-secondary)", minHeight: 36 }}>Cancel</button>
                  </>
                ) : (
                  <IconBtn onClick={() => setDelConfirm(food.id)} ariaLabel={`Delete ${food.name}`}
                    bg="transparent" color="var(--border-input)">{"\u2715"}</IconBtn>
                )}
              </div>
            </div>
            <div style={{ marginBottom: 12, display: "flex", flexWrap: "wrap" }}>
              {food.allergens.map(aId => { const a = ALLERGENS.find(x => x.id === aId); return a ? <Pill key={aId} label={`${a.emoji} ${a.label}`} /> : null; })}
            </div>
            <button onClick={() => qLog(food)} aria-label={`Log ${food.name} for ${qDate}`}
              className="touchable"
              style={{ width: "100%", background: "var(--success-bg)",
                color: "var(--success-text)",
                border: "1.5px solid var(--success-border)",
                borderRadius: 10, padding: "12px", cursor: "pointer", fontFamily: F,
                fontSize: 14, fontWeight: 700, transition: "all 0.2s", minHeight: 44 }}>
              {`Log for ${qDate}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
