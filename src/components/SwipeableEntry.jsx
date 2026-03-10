import { useState, useRef } from 'react';
import { F } from '../constants/allergens.js';
import SeverityBadge from './shared/SeverityBadge.jsx';

export default function SwipeableEntry({ entry, onDelete }) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiped, setIsSwiped] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const touchStartX = useRef(0);
  const containerRef = useRef(null);
  const DELETE_THRESHOLD = 60;

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsSwiped(false);
  };

  const handleTouchMove = (e) => {
    const currentX = e.touches[0].clientX;
    const diff = touchStartX.current - currentX;
    if (diff > 0) {
      setSwipeOffset(Math.min(diff, DELETE_THRESHOLD * 1.5));
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset > DELETE_THRESHOLD) {
      setIsSwiped(true);
      setSwipeOffset(DELETE_THRESHOLD);
    } else {
      setIsSwiped(false);
      setSwipeOffset(0);
    }
  };

  const handleDelete = () => {
    setIsDeleting(true);
    if (navigator.vibrate) navigator.vibrate(20);
    onDelete(entry.entryId, entry.id);
  };

  return (
    <div style={{ position: "relative", overflow: "hidden", borderRadius: 8 }}>
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: DELETE_THRESHOLD,
        background: "var(--danger-text)", display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: "0 8px 8px 0" }}>
        <button onClick={handleDelete} disabled={isDeleting}
          style={{ background: "none", border: "none", color: "#fff", cursor: "pointer",
            fontSize: 24, fontWeight: 400, padding: "12px", minWidth: 44, minHeight: 44 }}>
          {isDeleting ? "\u2026" : "\u{1F5D1}"}
        </button>
      </div>

      <div ref={containerRef}
        style={{ transform: `translateX(-${swipeOffset}px)`, transition: isSwiped ? "none" : "transform 0.2s ease",
          background: "var(--bg-card)", position: "relative", zIndex: 1 }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => { if (isSwiped) { setIsSwiped(false); setSwipeOffset(0); } }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0",
          borderBottom: "1px solid var(--bg-muted)" }}>
          <span style={{ fontSize: 24, flexShrink: 0 }}>{entry.emoji}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 600, fontSize: 15, color: "var(--text-primary)", fontFamily: F }}>{entry.label}</span>
              <SeverityBadge sev={entry.severity} />
            </div>
            {entry.food && <div style={{ fontSize: 13, color: "var(--text-tertiary)", fontFamily: F, marginTop: 3 }}>{"\u{1F37D}"} {entry.food}</div>}
            {entry.notes && <div style={{ fontSize: 13, color: "var(--warn-text)", background: "var(--warn-bg)", borderRadius: 6,
              padding: "4px 8px", marginTop: 5, fontFamily: F }}>{"\u{1F4DD}"} {entry.notes}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
