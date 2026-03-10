import { useState } from 'react';
import { ALLERGENS, F, BLANK_LOG, statusVar } from '../constants/allergens.js';
import { daysSince } from '../utils/date.js';
import { getStatus } from '../utils/status.js';
import { useToast } from '../contexts/ToastContext.jsx';
import IconBtn from './shared/IconBtn.jsx';
import Label from './shared/Label.jsx';
import SeverityPicker from './shared/SeverityPicker.jsx';
import SeverityBadge from './shared/SeverityBadge.jsx';
import SectionHeading from './shared/SectionHeading.jsx';
import BackBtn from './shared/BackBtn.jsx';
import ReactionSummary from './ReactionSummary.jsx';

export default function DetailView({ allergenId, data, setData, onBack, onOpenInfo }) {
  const selected = ALLERGENS.find(a => a.id === allergenId);
  const [logForm, setLogForm] = useState(BLANK_LOG);
  const [editFreq, setEditFreq] = useState(false);
  const [tmpFreq, setTmpFreq] = useState(null);
  const [showLog, setShowLog] = useState(false);
  const [showOptional, setShowOptional] = useState(false);
  const [delConfirm, setDelConfirm] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const { showToast } = useToast();

  const status = getStatus(allergenId, data.logs, data.frequencies);
  const freq = data.frequencies[allergenId];
  const allergenLogs = [...(data.logs[allergenId] || [])].reverse();
  const lastLog = allergenLogs[0];
  const days = lastLog ? daysSince(lastLog.date) : null;
  const relevantFoods = data.foods.filter(f => f.allergens.includes(allergenId));

  function saveFreq() { const v = parseInt(tmpFreq); if (!v || v < 1) return; setData(p => ({ ...p, frequencies: { ...p.frequencies, [allergenId]: v } })); setEditFreq(false); }
  function pickFood(food) { setLogForm(f => ({ ...f, food: food.name, foodId: food.id })); setShowPicker(false); }
  function submit() {
    if (!logForm.date) return;
    if (navigator.vibrate) navigator.vibrate(10);
    const e = { id: crypto.randomUUID(), date: logForm.date, food: logForm.food.trim(), amount: logForm.amount.trim(),
      notes: logForm.notes.trim(), foodId: logForm.foodId ?? null, severity: logForm.severity || "none" };
    setData(p => ({ ...p, logs: { ...p.logs, [allergenId]: [...(p.logs[allergenId] || []), e].sort((a, b) => a.date.localeCompare(b.date)) } }));
    setLogForm(BLANK_LOG); setShowLog(false); setShowOptional(false);
    showToast('Exposure logged');
  }
  function del(id) {
    if (navigator.vibrate) navigator.vibrate(20);
    setData(p => ({ ...p, logs: { ...p.logs, [allergenId]: p.logs[allergenId].filter(e => e.id !== id) } }));
    setDelConfirm(null);
    showToast('Entry deleted');
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", fontFamily: F }}>
      <div style={{ background: statusVar(status, 'bg'), borderBottom: `2px solid ${statusVar(status, 'border')}`,
        padding: "calc(var(--sat) + 12px) 20px 18px" }}>
        <BackBtn onClick={onBack} />
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 44, lineHeight: 1 }}>{selected.emoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "var(--text-primary)", fontFamily: F }}>{selected.label}</h1>
              <IconBtn onClick={() => onOpenInfo(selected)} ariaLabel={`Info about ${selected.label}`}
                bg="var(--progress-track)" color="var(--text-tertiary)">
                <span style={{ fontSize: 13, fontWeight: 700 }}>{"\u2139"}</span>
              </IconBtn>
            </div>
            <div style={{ fontSize: 13, color: "var(--text-label)", fontFamily: F, marginTop: 3 }}>{selected.examples}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 7, flexWrap: "wrap" }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: statusVar(status, 'dot'),
                display: "inline-block", flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: statusVar(status, 'color'), fontWeight: 700, fontFamily: F }}>
                {status === "never" ? "Never logged" : status === "good" ? "Good" : status === "soon" ? "Due soon" : "Overdue"}
              </span>
              {days !== null && <span style={{ fontSize: 13, color: "var(--text-label)", fontFamily: F }}>
                {"\u00B7"} {days === 0 ? "today" : `${days} day${days !== 1 ? "s" : ""} ago`}
              </span>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px", paddingBottom: 'calc(72px + var(--sab))' }}>

        <ReactionSummary logs={data.logs[allergenId] || []} />

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: 12,
          padding: "14px 16px", marginBottom: 16,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "var(--text-label)", fontFamily: F, fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Target frequency</div>
            {editFreq ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                <input type="number" min="1" max="30" value={tmpFreq}
                  onChange={e => setTmpFreq(e.target.value)} aria-label="Frequency in days"
                  style={{ width: 60, padding: "8px 10px", border: "1.5px solid var(--border-input)",
                    borderRadius: 8, fontSize: 16, fontFamily: F, minHeight: 44 }} />
                <span style={{ fontSize: 14, color: "var(--text-label)", fontFamily: F }}>days</span>
                <button onClick={saveFreq} className="touchable" style={{ background: "var(--action-primary)", color: "var(--action-primary-text)",
                  border: "none", borderRadius: 8, padding: "10px 16px", cursor: "pointer",
                  fontSize: 14, fontFamily: F, fontWeight: 600, minHeight: 44 }}>Save</button>
                <button onClick={() => setEditFreq(false)} style={{ background: "none", border: "none",
                  color: "var(--text-label)", cursor: "pointer", fontSize: 14, fontFamily: F,
                  minHeight: 44, padding: "10px 8px" }}>Cancel</button>
              </div>
            ) : (
              <div style={{ fontSize: 19, fontWeight: 700, color: "var(--text-primary)", fontFamily: F, marginTop: 2 }}>
                Every {freq} day{freq !== 1 ? "s" : ""}
              </div>
            )}
          </div>
          {!editFreq && (
            <button onClick={() => { setTmpFreq(freq); setEditFreq(true); }}
              className="touchable"
              style={{ background: "var(--bg-muted)", border: "none", borderRadius: 10, padding: "10px 16px",
                cursor: "pointer", fontSize: 14, color: "var(--text-secondary)", fontFamily: F,
                fontWeight: 600, minHeight: 44 }}>
              Edit
            </button>
          )}
        </div>

        {selected.clinicalNote && (
          <div style={{ background: "var(--info-bg)", border: "1px solid var(--info-border)", borderRadius: 10,
            padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "var(--info-text)",
            fontFamily: F, lineHeight: 1.5, display: "flex", gap: 8 }}>
            <span style={{ flexShrink: 0 }}>{"\u{1F4A1}"}</span>{selected.clinicalNote}
          </div>
        )}

        <button onClick={() => { setShowLog(!showLog); setShowPicker(false); setShowOptional(false); }}
          className="touchable"
          style={{ width: "100%", background: "var(--action-primary)", color: "var(--action-primary-text)", border: "none",
            borderRadius: 12, padding: "14px", fontSize: 16, cursor: "pointer",
            marginBottom: 16, fontFamily: F, fontWeight: 700, minHeight: 52 }}>
          {showLog ? "Cancel" : `+ Log ${selected.label} exposure`}
        </button>

        {showLog && (
          <div style={{ background: "var(--bg-card)", border: "1.5px solid var(--border-default)", borderRadius: 14,
            padding: "20px", marginBottom: 16 }}>

            <div style={{ marginBottom: 16 }}>
              <Label required>Date</Label>
              <input type="date" value={logForm.date}
                onChange={e => setLogForm(f => ({ ...f, date: e.target.value }))}
                style={{ width: "100%", padding: "10px 12px", border: "1.5px solid var(--border-input)",
                  borderRadius: 10, fontSize: 16, fontFamily: F, boxSizing: "border-box",
                  minHeight: 44 }} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <Label>Reaction</Label>
              <SeverityPicker value={logForm.severity} onChange={v => setLogForm(f => ({ ...f, severity: v }))} />

              {logForm.severity === "severe" && (
                <div role="alert" style={{ marginTop: 10, background: "var(--danger-bg)",
                  border: "2px solid var(--danger-border)", borderRadius: 10, padding: "12px 14px",
                  fontSize: 14, color: "var(--danger-text-strong)", fontFamily: F, fontWeight: 600,
                  lineHeight: 1.5, display: "flex", gap: 8 }}>
                  <span style={{ flexShrink: 0, fontSize: 18 }}>{"\u{1F6A8}"}</span><span>If your child has swelling of the face, lips or tongue, hives, vomiting, or difficulty breathing — call <strong>000</strong> immediately and do not give further food.</span>
                </div>
              )}
            </div>

            <button onClick={() => setShowOptional(!showOptional)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-label)",
                fontSize: 14, fontFamily: F, padding: "0 0 14px 0", display: "flex",
                alignItems: "center", gap: 4, minHeight: 44, width: "100%" }}>
              <span style={{ transition: "transform 0.2s",
                display: "inline-block", transform: showOptional ? "rotate(90deg)" : "none" }}>{"\u25B6"}</span>
              {showOptional ? "Hide optional details" : "Add optional details (food, amount, notes)"}
            </button>

            {showOptional && (
              <>
                <div style={{ marginBottom: 14 }}>
                  <Label>Food it was in</Label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input type="text" placeholder="e.g. peanut butter on toast"
                      value={logForm.food}
                      onChange={e => setLogForm(f => ({ ...f, food: e.target.value, foodId: null }))}
                      style={{ flex: 1, padding: "10px 12px", border: "1.5px solid var(--border-input)",
                        borderRadius: 10, fontSize: 15, fontFamily: F, boxSizing: "border-box",
                        minHeight: 44 }} />
                    {relevantFoods.length > 0 && (
                      <button onClick={() => setShowPicker(!showPicker)}
                        aria-label="Pick from saved foods"
                        className="touchable"
                        style={{ background: "var(--success-bg)", border: "1.5px solid var(--success-border)",
                          borderRadius: 10, padding: "10px 14px", cursor: "pointer",
                          fontSize: 13, color: "var(--success-text)", fontFamily: F,
                          whiteSpace: "nowrap", fontWeight: 600, minHeight: 44 }}>
                        Saved {"\u25BE"}
                      </button>
                    )}
                  </div>
                  {showPicker && (
                    <div style={{ marginTop: 6, background: "var(--bg-card)", border: "1.5px solid var(--border-default)",
                      borderRadius: 10, overflow: "hidden", boxShadow: "var(--shadow-dropdown)" }}>
                      {relevantFoods.map(food => (
                        <button key={food.id} onClick={() => pickFood(food)}
                          style={{ width: "100%", padding: "12px 16px", cursor: "pointer",
                            borderBottom: "1px solid var(--border-faint)", fontSize: 14, fontFamily: F,
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            background: "var(--bg-card)", border: "none", textAlign: "left", minHeight: 48 }}>
                          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{food.name}</span>
                          <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
                            {food.allergens.map(id => ALLERGENS.find(a => a.id === id)?.emoji).join(" ")}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ marginBottom: 14 }}>
                  <Label>Amount</Label>
                  <input type="text" placeholder="e.g. 1 tsp, half a cracker"
                    value={logForm.amount}
                    onChange={e => setLogForm(f => ({ ...f, amount: e.target.value }))}
                    style={{ width: "100%", padding: "10px 12px", border: "1.5px solid var(--border-input)",
                      borderRadius: 10, fontSize: 15, fontFamily: F, boxSizing: "border-box",
                      minHeight: 44 }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <Label>Notes</Label>
                  <textarea placeholder="Any observations..." value={logForm.notes}
                    onChange={e => setLogForm(f => ({ ...f, notes: e.target.value }))} rows={2}
                    style={{ width: "100%", padding: "10px 12px", border: "1.5px solid var(--border-input)",
                      borderRadius: 10, fontSize: 15, fontFamily: F, boxSizing: "border-box",
                      resize: "vertical", minHeight: 56 }} />
                </div>
              </>
            )}

            <button onClick={submit} disabled={!logForm.date}
              className="touchable"
              style={{ width: "100%", background: logForm.date ? "var(--success-text)" : "var(--border-input)",
                color: "var(--action-primary-text)", border: "none", borderRadius: 10, padding: "14px",
                fontSize: 16, cursor: logForm.date ? "pointer" : "default",
                fontFamily: F, fontWeight: 700, minHeight: 52,
                transition: "background 0.15s" }}>
              Save entry
            </button>
          </div>
        )}

        <SectionHeading>History ({allergenLogs.length})</SectionHeading>
        {allergenLogs.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px 0",
            fontSize: 15, fontFamily: F }}>
            No exposures logged yet
          </div>
        ) : allergenLogs.map(entry => (
          <div key={entry.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)",
            borderRadius: 12, padding: "14px 16px", marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 2 }}>
                  <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 15, fontFamily: F }}>
                    {new Date(entry.date + "T12:00:00").toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <SeverityBadge sev={entry.severity} />
                </div>
                {entry.food && (
                  <div style={{ fontSize: 13, color: "var(--text-label)", marginTop: 4, fontFamily: F,
                    display: "flex", alignItems: "center", gap: 6 }}>
                    {"\u{1F37D}"} {entry.food}
                    {entry.foodId && <span style={{ fontSize: 11, background: "var(--success-bg)", color: "var(--success-text)",
                      borderRadius: 4, padding: "1px 6px", fontWeight: 600, fontFamily: F }}>saved</span>}
                  </div>
                )}
                {entry.amount && <div style={{ fontSize: 13, color: "var(--text-label)", marginTop: 3, fontFamily: F }}>{"\u{1F4CF}"} {entry.amount}</div>}
                {entry.notes && <div style={{ fontSize: 13, color: "var(--warn-text)", marginTop: 5,
                  background: "var(--warn-bg)", borderRadius: 6, padding: "5px 10px", fontFamily: F }}>
                  {"\u{1F4DD}"} {entry.notes}
                </div>}
              </div>
              {delConfirm === entry.id ? (
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button onClick={() => del(entry.id)} className="touchable" style={{ background: "var(--danger-text)", color: "var(--action-primary-text)",
                    border: "none", borderRadius: 8, padding: "8px 12px", cursor: "pointer",
                    fontSize: 13, fontFamily: F, minHeight: 36 }}>Delete</button>
                  <button onClick={() => setDelConfirm(null)} className="touchable" style={{ background: "var(--bg-muted)",
                    color: "var(--text-secondary)", border: "none", borderRadius: 8, padding: "8px 12px",
                    cursor: "pointer", fontSize: 13, fontFamily: F, minHeight: 36 }}>Cancel</button>
                </div>
              ) : (
                <IconBtn onClick={() => setDelConfirm(entry.id)}
                  ariaLabel="Delete entry" bg="transparent" color="var(--border-input)">{"\u2715"}</IconBtn>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
