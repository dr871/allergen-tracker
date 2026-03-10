export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export function daysSince(d) {
  if (!d) return null;
  const now = new Date();
  const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const [y, m, day] = d.split('-').map(Number);
  const target = new Date(y, m - 1, day);
  return Math.round((todayLocal - target) / 86400000);
}

export function startOfWeek(d) {
  const dt = new Date(d + "T12:00:00");
  dt.setDate(dt.getDate() - dt.getDay());
  return dt.toISOString().slice(0, 10);
}
