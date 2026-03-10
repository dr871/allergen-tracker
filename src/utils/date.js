export const today = () => new Date().toISOString().slice(0, 10);

export function daysSince(d) {
  if (!d) return null;
  return Math.floor((Date.now() - new Date(d + "T12:00:00").getTime()) / 86400000);
}

export function startOfWeek(d) {
  const dt = new Date(d + "T12:00:00");
  dt.setDate(dt.getDate() - dt.getDay());
  return dt.toISOString().slice(0, 10);
}
