export default function SkeletonDashboard() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-default)',
        padding: 'calc(var(--sat) + 12px) 20px 12px' }}>
        <div className="skeleton" style={{ width: 140, height: 11, marginBottom: 10 }} />
        <div className="skeleton" style={{ width: 120, height: 22, marginBottom: 16 }} />
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)',
          borderRadius: 14, padding: 16 }}>
          <div className="skeleton" style={{ width: 100, height: 12, marginBottom: 8 }} />
          <div className="skeleton" style={{ width: 80, height: 24, marginBottom: 12 }} />
          <div className="skeleton" style={{ width: '100%', height: 8, borderRadius: 99 }} />
        </div>
      </div>
      <div style={{ padding: 20 }}>
        <div className="skeleton" style={{ width: 110, height: 11, marginBottom: 12 }} />
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)',
            borderRadius: 14, padding: '14px 16px', marginBottom: 10, display: 'flex',
            alignItems: 'center', gap: 12 }}>
            <div className="skeleton" style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ width: '60%', height: 16, marginBottom: 8 }} />
              <div className="skeleton" style={{ width: '85%', height: 12, marginBottom: 8 }} />
              <div className="skeleton" style={{ width: '100%', height: 6, borderRadius: 99 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
