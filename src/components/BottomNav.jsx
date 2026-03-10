import { F } from '../constants/allergens.js';

const DashboardIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const CalendarIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const FoodsIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 010 8h-1" />
    <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
);

const TABS = [
  { id: 'dashboard', label: 'Home', Icon: DashboardIcon },
  { id: 'calendar', label: 'Calendar', Icon: CalendarIcon },
  { id: 'foods', label: 'Foods', Icon: FoodsIcon },
];

export default function BottomNav({ activeView, onNavigate, foodCount }) {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      background: 'var(--nav-bg)',
      borderTop: '1px solid var(--nav-border)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingBottom: 'var(--sab)',
      height: 'calc(64px + var(--sab))',
      zIndex: 100,
      fontFamily: F,
    }}>
      {TABS.map(({ id, label, Icon }) => {
        const active = activeView === id ||
          (id === 'dashboard' && activeView === 'detail');
        const color = active ? 'var(--nav-text-active)' : 'var(--nav-text)';
        return (
          <button key={id} onClick={() => { if (navigator.vibrate) navigator.vibrate(5); onNavigate(id); }}
            aria-label={label}
            aria-current={active ? 'page' : undefined}
            className="touchable"
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 2, padding: '8px 16px', minHeight: 48, minWidth: 64,
              background: 'none', border: 'none', cursor: 'pointer',
              color, fontFamily: F, fontSize: 11, fontWeight: active ? 700 : 500,
              transition: 'color 0.15s',
              position: 'relative',
            }}>
            <Icon color={color} />
            <span>{label}</span>
            {id === 'foods' && foodCount > 0 && (
              <span style={{
                position: 'absolute', top: 4, right: 8,
                background: 'var(--action-primary)', color: 'var(--action-primary-text)',
                borderRadius: 99, padding: '0 5px', fontSize: 10, fontWeight: 700,
                minWidth: 16, textAlign: 'center', lineHeight: '16px',
              }}>{foodCount}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
