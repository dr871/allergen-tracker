import { F } from '../constants/allergens.js';

export default function OfflineBanner() {
  return (
    <div className="offline-enter" role="alert" style={{
      position: 'fixed',
      top: 'var(--sat)',
      left: 0, right: 0,
      background: 'var(--offline-bg)',
      borderBottom: '1px solid var(--offline-border)',
      color: 'var(--offline-text)',
      textAlign: 'center',
      padding: '8px 16px',
      fontSize: 13,
      fontFamily: F,
      fontWeight: 600,
      zIndex: 250,
    }}>
      You're offline — changes will sync when reconnected
    </div>
  );
}
