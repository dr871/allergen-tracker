import { daysSince } from './date.js';

export function getStatus(id, logs, freq) {
  const l = logs[id];
  if (!l || !l.length) return "never";
  const d = daysSince(l[l.length - 1].date), t = freq[id];
  if (d <= Math.floor(t * 0.6)) return "good";
  if (d < t) return "soon";
  return "overdue";
}
