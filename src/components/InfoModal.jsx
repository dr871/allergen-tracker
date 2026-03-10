import { F } from '../constants/allergens.js';
import { useModalA11y } from '../hooks/useModalA11y.js';
import IconBtn from './shared/IconBtn.jsx';
import SectionHeading from './shared/SectionHeading.jsx';

export default function InfoModal({ allergen, onClose }) {
  const contentRef = useModalA11y(onClose);

  if (!allergen) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label={`${allergen.label} allergen guide`}
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
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 36 }}>{allergen.emoji}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 20, color: "var(--text-primary)", fontFamily: F }}>{allergen.label}</div>
              <div style={{ fontSize: 13, color: "var(--text-tertiary)", fontFamily: F }}>Allergen guide</div>
            </div>
          </div>
          <IconBtn onClick={onClose} ariaLabel="Close">{"\u2715"}</IconBtn>
        </div>

        {allergen.clinicalNote && (
          <div style={{ background: "var(--info-bg)", border: "1px solid var(--info-border)", borderRadius: 10,
            padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "var(--info-text)",
            fontFamily: F, lineHeight: 1.5, display: "flex", gap: 8 }}>
            <span style={{ flexShrink: 0 }}>{"\u{1F4A1}"}</span>{allergen.clinicalNote}
          </div>
        )}

        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.75, fontFamily: F,
          margin: "0 0 20px", background: "var(--bg-page)", borderRadius: 10, padding: "14px 16px" }}>
          {allergen.info.about}
        </p>

        <div style={{ marginBottom: 20 }}>
          <SectionHeading>Where it hides</SectionHeading>
          {allergen.info.hiddenIn.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
              <span style={{ color: "var(--warn-text)", fontSize: 15, marginTop: 1, flexShrink: 0 }}>{"\u26A0"}</span>
              <span style={{ fontSize: 14, color: "var(--text-secondary)", fontFamily: F, lineHeight: 1.6 }}>{item}</span>
            </div>
          ))}
        </div>

        <div>
          <SectionHeading>Easy ways to serve it</SectionHeading>
          {allergen.info.easyFoods.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
              <span style={{ color: "var(--success-text)", fontSize: 15, marginTop: 1, flexShrink: 0 }}>{"\u2713"}</span>
              <span style={{ fontSize: 14, color: "var(--text-secondary)", fontFamily: F, lineHeight: 1.6 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
