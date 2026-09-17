export function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

export function daysBetween(earlierDateStr, laterDateStr) {
  const earlier = new Date(earlierDateStr);
  const later = new Date(laterDateStr);
  const diffMs = later - earlier;
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function addDays(dateStr, n) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
} 