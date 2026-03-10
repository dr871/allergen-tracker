import { useState } from 'react';
import { today } from '../utils/date.js';
import AddEntryModal from './AddEntryModal.jsx';

export default function FAB({ data, setData, showToast }) {
  const [showModal, setShowModal] = useState(false);

  function handleSave(entryData) {
    if (navigator.vibrate) navigator.vibrate(10);
    setData(p => {
      const newLogs = { ...p.logs };
      const newEntry = {
        id: crypto.randomUUID(),
        date: entryData.date,
        food: entryData.food,
        amount: entryData.amount,
        notes: entryData.notes,
        foodId: null,
        severity: entryData.severity,
      };
      newLogs[entryData.allergenId] = [
        ...(newLogs[entryData.allergenId] || []),
        newEntry,
      ].sort((a, b) => a.date.localeCompare(b.date));
      return { ...p, logs: newLogs };
    });
    if (showToast) showToast('Exposure logged');
  }

  return (
    <>
      <button
        onClick={() => { if (navigator.vibrate) navigator.vibrate(10); setShowModal(true); }}
        aria-label="Log new exposure"
        className="touchable"
        style={{
          position: 'fixed',
          bottom: 'calc(80px + var(--sab))',
          right: 20,
          width: 56, height: 56,
          borderRadius: '50%',
          background: 'var(--fab-bg)',
          color: 'var(--fab-text)',
          border: 'none',
          boxShadow: 'var(--fab-shadow)',
          cursor: 'pointer',
          zIndex: 90,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 300,
        }}
      >
        +
      </button>
      {showModal && (
        <AddEntryModal
          date={today()}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          foods={data.foods}
        />
      )}
    </>
  );
}
