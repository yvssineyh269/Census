export function getWeekRange() {
  const now = new Date();
  const dayOfWeek = now.getDay();

  const lastSaturday = new Date(now);
  const daysToLastSaturday = dayOfWeek === 6 ? 0 : dayOfWeek + 1;
  lastSaturday.setDate(now.getDate() - daysToLastSaturday);
  lastSaturday.setHours(10, 0, 0, 0);

  if (dayOfWeek === 6 && now.getHours() < 10) {
    lastSaturday.setDate(lastSaturday.getDate() - 7);
  }

  const nextSaturday = new Date(lastSaturday);
  nextSaturday.setDate(lastSaturday.getDate() + 7);
  return { start: lastSaturday, end: nextSaturday };
}
