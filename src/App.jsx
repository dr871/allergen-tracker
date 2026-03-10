import { useState, useRef } from 'react';
import { ALLERGENS, F } from './constants/allergens.js';
import { getStatus } from './utils/status.js';
import { useAllergenData } from './hooks/useAllergenData.js';
import { useTheme } from './contexts/ThemeContext.jsx';
import { useToast } from './contexts/ToastContext.jsx';
import { useOnlineStatus } from './hooks/useOnlineStatus.js';
import { usePullToRefresh } from './hooks/usePullToRefresh.js';
import InfoModal from './components/InfoModal.jsx';
import CalendarView from './components/CalendarView.jsx';
import WeeklyBanner from './components/WeeklyBanner.jsx';
import AllergenCard from './components/AllergenCard.jsx';
import QuickLogStrip from './components/QuickLogStrip.jsx';
import FoodsView from './components/FoodsView.jsx';
import DetailView from './components/DetailView.jsx';
import BottomNav from './components/BottomNav.jsx';
import FAB from './components/FAB.jsx';
import SkeletonDashboard from './components/SkeletonDashboard.jsx';
import OfflineBanner from './components/OfflineBanner.jsx';
import SectionHeading from './components/shared/SectionHeading.jsx';

export default function AllergenTracker() {
  const [data, setData, loading, refresh] = useAllergenData();
  const [view, setView] = useState("dashboard");
  const [selId, setSelId] = useState(null);
  const [infoA, setInfoA] = useState(null);
  const [animClass, setAnimClass] = useState('');
  const { cycleTheme, resolved } = useTheme();
  const { showToast } = useToast();
  const online = useOnlineStatus();
  const prevView = useRef(view);

  const { pullDistance, refreshing, handlers: pullHandlers } = usePullToRefresh(refresh);

  function navigate(target) {
    if (target === view) return;
    const depth = { dashboard: 0, calendar: 1, foods: 1, detail: 2 };
    const dir = (depth[target] ?? 0) > (depth[view] ?? 0) ? 'view-enter' : 'view-back';
    setAnimClass(dir);
    prevView.current = view;
    setView(target);
    window.scrollTo(0, 0);
    setTimeout(() => setAnimClass(''), 250);
  }

  function logFoodForAll(food, date) {
    if (navigator.vibrate) navigator.vibrate(10);
    const make = () => ({
      id: crypto.randomUUID(), date, food: food.name,
      amount: "", notes: "", foodId: food.id, severity: "none"
    });
    setData(p => {
      const logs = { ...p.logs };
      food.allergens.forEach(aId => {
        logs[aId] = [...(logs[aId] || []), make()].sort((a, b) => a.date.localeCompare(b.date));
      });
      return { ...p, logs };
    });
    showToast('Exposure logged');
  }

  const sorted = [...ALLERGENS].sort((a, b) => {
    const o = { overdue: 0, never: 1, soon: 2, good: 3 };
    return o[getStatus(a.id, data.logs, data.frequencies)] - o[getStatus(b.id, data.logs, data.frequencies)];
  });

  if (loading) return (
    <>
      <SkeletonDashboard />
      <BottomNav activeView="dashboard" onNavigate={() => {}} foodCount={0} />
    </>
  );

  const contentPad = { paddingBottom: 'calc(72px + var(--sab))' };

  const overdue = sorted.filter(a => ["overdue", "never"].includes(getStatus(a.id, data.logs, data.frequencies)));
  const ok = sorted.filter(a => ["good", "soon"].includes(getStatus(a.id, data.logs, data.frequencies)));

  let content;
  if (view === "foods") {
    content = <FoodsView data={data} setData={setData} />;
  } else if (view === "calendar") {
    content = <CalendarView data={data} setData={setData} />;
  } else if (view === "detail") {
    content = <DetailView allergenId={selId} data={data} setData={setData}
      onBack={() => navigate("dashboard")} onOpenInfo={setInfoA} />;
  } else {
    content = (
      <div style={{ minHeight: "100vh", background: "var(--bg-page)", fontFamily: F }}
        {...pullHandlers}>

        {pullDistance > 0 && (
          <div style={{ textAlign: 'center', paddingTop: pullDistance, transition: refreshing ? 'none' : 'padding 0.2s' }}>
            <span className={refreshing ? 'ptr-spinner' : ''} style={{ display: 'inline-block', fontSize: 20, color: 'var(--text-label)' }}>
              {refreshing ? '\u21BB' : '\u2193'}
            </span>
          </div>
        )}

        <div style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-default)",
          padding: "calc(var(--sat) + 12px) 20px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase",
                letterSpacing: "0.12em", marginBottom: 2, fontFamily: F, fontWeight: 600 }}>
                Baby allergen tracker
              </div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--text-primary)", fontFamily: F }}>
                Dashboard
              </h1>
            </div>
            <button onClick={cycleTheme} aria-label="Toggle theme"
              className="touchable"
              style={{ minWidth: 44, minHeight: 44, background: "var(--bg-muted)", border: "none",
                borderRadius: 10, cursor: "pointer", fontSize: 18, display: "flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {resolved === 'dark' ? '\u2600\uFE0F' : '\u{1F319}'}
            </button>
          </div>

          <WeeklyBanner data={data} />
        </div>

        <div style={{ padding: "20px", ...contentPad }}>
          <QuickLogStrip foods={data.foods} onLog={logFoodForAll} />

          {overdue.length > 0 && (
            <>
              <SectionHeading>Needs attention</SectionHeading>
              {overdue.map(a => (
                <AllergenCard key={a.id} allergen={a} data={data}
                  onClick={() => { setSelId(a.id); navigate("detail"); }} onInfo={setInfoA} />
              ))}
            </>
          )}
          {ok.length > 0 && (
            <>
              <div style={{ marginTop: overdue.length ? 18 : 0 }}>
                <SectionHeading>On track</SectionHeading>
              </div>
              {ok.map(a => (
                <AllergenCard key={a.id} allergen={a} data={data}
                  onClick={() => { setSelId(a.id); navigate("detail"); }} onInfo={setInfoA} />
              ))}
            </>
          )}

          <div style={{ marginTop: 28, padding: "14px 16px", background: "var(--bg-muted)",
            borderRadius: 12, fontSize: 12, color: "var(--text-label)", fontFamily: F, lineHeight: 1.6 }}>
            <strong style={{ color: "var(--text-secondary)" }}>Disclaimer:</strong> This tracker is a personal tool, not medical advice. Allergen introduction guidelines are based on{" "}
            <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>ASCIA 2026</span>. If your child has a known allergy, severe eczema, or has had a reaction, consult your GP or allergist before continuing introduction.
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {!online && <OfflineBanner />}
      <InfoModal allergen={infoA} onClose={() => setInfoA(null)} />

      <div className={animClass} style={{ minHeight: '100vh' }}>
        {content}
      </div>

      <FAB data={data} setData={setData} showToast={showToast} />
      <BottomNav activeView={view} onNavigate={navigate} foodCount={data.foods.length} />
    </>
  );
}
