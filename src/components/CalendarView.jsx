import { useState, useMemo } from 'react';
import { ALLERGENS, F } from '../constants/allergens.js';
import { today } from '../utils/date.js';
import { useToast } from '../contexts/ToastContext.jsx';
import IconBtn from './shared/IconBtn.jsx';
import SwipeableEntry from './SwipeableEntry.jsx';
import AddEntryModal from './AddEntryModal.jsx';

export default function CalendarView({ data, setData }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingDate, setAddingDate] = useState(null);
  const { showToast } = useToast();

  function deleteEntry(entryId, allergenId) {
    if (navigator.vibrate) navigator.vibrate(20);
    setData(p => {
      const newLogs = { ...p.logs };
      newLogs[allergenId] = (newLogs[allergenId] || []).filter(e => e.id !== entryId);
      return { ...p, logs: newLogs };
    });
    showToast('Entry deleted');
  }

  function handleSaveEntry(entryData) {
    if (navigator.vibrate) navigator.vibrate(10);
    setData(p => {
      const newLogs = { ...p.logs };
      const newEntry = {
        id: self.crypto?.randomUUID?.() ?? (Date.now().toString(36) + Math.random().toString(36).slice(2)),
        date: entryData.date,
        food: entryData.food,
        amount: entryData.amount,
        notes: entryData.notes,
        foodId: null,
        severity: entryData.severity
      };
      newLogs[entryData.allergenId] = [...(newLogs[entryData.allergenId] || []), newEntry].sort((a, b) => a.date.localeCompare(b.date));
      return { ...p, logs: newLogs };
    });
    showToast('Exposure logged');
  }

  const calMap = useMemo(() => {
    const m = {};
    ALLERGENS.forEach(a => {
      (data.logs[a.id] || []).forEach(e => {
        if (!m[e.date]) m[e.date] = [];
        m[e.date].push({ id: a.id, emoji: a.emoji, label: a.label, severity: e.severity || "none", food: e.food, notes: e.notes, entryId: e.id });
      });
    });
    return m;
  }, [data.logs]);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = today();
  const monthName = new Date(year, month, 1).toLocaleDateString("en-AU", { month: "long", year: "numeric" });

  function prevMonth() { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); setSelected(null); }
  function nextMonth() { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); setSelected(null); }

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const selectedEntries = selected ? (calMap[selected] || []) : [];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", fontFamily: F }}>
      <div style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-default)",
        padding: "calc(var(--sat) + 16px) 20px 12px" }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "var(--text-primary)" }}>Calendar</h1>
      </div>

      <div style={{ padding: "20px", paddingBottom: 'calc(72px + var(--sab))' }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <IconBtn onClick={prevMonth} ariaLabel="Previous month">{"\u2039"}</IconBtn>
          <span style={{ fontWeight: 700, fontSize: 17, color: "var(--text-primary)", fontFamily: F }}>{monthName}</span>
          <IconBtn onClick={nextMonth} ariaLabel="Next month">{"\u203A"}</IconBtn>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 4 }}>
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: 12, color: "var(--text-label)", fontFamily: F,
              fontWeight: 600, padding: "4px 0" }}>{d}</div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
          {cells.map((d, i) => {
            if (!d) return <div key={`e${i}`} />;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            const entries = calMap[dateStr] || [];
            const isToday = dateStr === todayStr;
            const isSel = dateStr === selected;
            const hasSevere = entries.some(e => e.severity === "severe" || e.severity === "moderate");
            return (
              <button key={d} onClick={() => setSelected(isSel ? null : dateStr)}
                aria-label={`${d} ${monthName}${entries.length ? `, ${entries.length} exposure${entries.length > 1 ? "s" : ""}` : ""}${isSel ? ", selected" : ""}`}
                style={{ borderRadius: 12, padding: "8px 4px", minHeight: 56, cursor: "pointer",
                  background: isSel ? "var(--selected-bg)" : isToday ? "var(--today-bg)" : "var(--bg-card)",
                  border: isSel ? "2px solid var(--selected-bg)" : isToday ? "2px solid var(--today-border)" : "1px solid var(--border-light)",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                  width: "100%", fontFamily: F }}>
                <span style={{ fontSize: 14, fontWeight: isToday ? 700 : 500,
                  color: isSel ? "var(--selected-text)" : isToday ? "var(--today-text)" : "var(--text-secondary)" }}>{d}</span>
                {entries.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1 }}>
                    {entries.slice(0, 4).map((e, ei) => (
                      <span key={ei} style={{ fontSize: 11, lineHeight: 1 }}>{e.emoji}</span>
                    ))}
                    {entries.length > 4 && <span style={{ fontSize: 9, color: isSel ? "rgba(255,255,255,0.7)" : "var(--text-muted)" }}>+{entries.length - 4}</span>}
                  </div>
                )}
                {hasSevere && <span style={{ fontSize: 9, background: "var(--danger-bg)", color: "var(--danger-text)",
                  borderRadius: 3, padding: "0 3px" }}>{"\u26A0"}</span>}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 14, flexWrap: "wrap" }}>
          {[
            { swatch: <span style={{ width: 12, height: 12, borderRadius: 3, background: "var(--today-bg)", border: "2px solid var(--today-border)", display: "inline-block" }} />, label: "Today" },
            { swatch: <span style={{ fontSize: 14 }}>{"\u{1F95C}"}</span>, label: "Exposure logged" },
            { swatch: <span style={{ fontSize: 11, background: "var(--danger-bg)", color: "var(--danger-text)", borderRadius: 3, padding: "0 3px" }}>{"\u26A0"}</span>, label: "Reaction noted" },
          ].map(({ swatch, label }, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12,
              color: "var(--text-label)", fontFamily: F }}>{swatch} {label}</div>
          ))}
        </div>

        {selected && (
          <div style={{ marginTop: 20, background: "var(--bg-card)", border: "1px solid var(--border-default)",
            borderRadius: 14, padding: "18px" }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 14, fontFamily: F }}>
              {new Date(selected + "T12:00:00").toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" })}
            </div>
            {selectedEntries.length === 0 ? (
              <div style={{ color: "var(--text-muted)", fontSize: 14, fontFamily: F, textAlign: "center", padding: "20px 0" }}>
                No exposures logged on this day
              </div>
            ) : selectedEntries.map((e, i) => (
              <SwipeableEntry key={i} entry={e} onDelete={deleteEntry} />
            ))}
            <button onClick={() => { setAddingDate(selected); setShowAddModal(true); }}
              className="touchable"
              style={{ width: "100%", background: "var(--action-primary)", color: "var(--action-primary-text)", border: "none",
                borderRadius: 12, padding: "14px", fontSize: 16, cursor: "pointer",
                marginTop: 16, fontFamily: F, fontWeight: 700, minHeight: 52 }}>
              + Add exposure for this day
            </button>
          </div>
        )}

        {showAddModal && (
          <AddEntryModal date={addingDate} onClose={() => setShowAddModal(false)} onSave={handleSaveEntry} foods={data.foods} />
        )}
      </div>
    </div>
  );
}
