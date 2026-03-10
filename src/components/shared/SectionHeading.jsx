import { F } from '../../constants/allergens.js';

export default function SectionHeading({ children }) {
  return (
    <div style={{ fontSize: 11, color: "var(--text-label)", textTransform: "uppercase",
      letterSpacing: "0.08em", fontFamily: F, fontWeight: 600, marginBottom: 10 }}>
      {children}
    </div>
  );
}
