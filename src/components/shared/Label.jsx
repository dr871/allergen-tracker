import { F } from '../../constants/allergens.js';

export default function Label({ children, required }) {
  return (
    <div style={{ fontSize: 12, color: "var(--text-tertiary)", fontFamily: F, fontWeight: 600,
      marginBottom: 6, letterSpacing: "0.02em" }}>
      {children}{required && <span style={{ color: "var(--danger-text)", marginLeft: 2 }}>*</span>}
    </div>
  );
}
