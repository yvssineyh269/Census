// Heure des Comores (Indian/Comoro) : UTC+3 toute l'année, sans heure d'été.
// Tous les calculs de période se font dans ce fuseau, quel que soit celui du serveur (Vercel, Neon, local).
export const COMOROS_TIME_ZONE = "Indian/Comoro";
export const COMOROS_UTC_OFFSET_MS = 3 * 60 * 60 * 1000;

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_RESET_DAY = 6; // samedi
const WEEK_RESET_HOUR = 13; // 13h, heure des Comores

// Date "murale" des Comores : ses champs getUTC* donnent l'heure locale comorienne
export function toComorosWallClock(date: Date) {
  return new Date(date.getTime() + COMOROS_UTC_OFFSET_MS);
}

// Instant réel correspondant à une date/heure exprimée en heure des Comores
export function fromComorosTime(year: number, month: number, day = 1, hour = 0) {
  return new Date(Date.UTC(year, month, day, hour) - COMOROS_UTC_OFFSET_MS);
}

// Semaine de travail en cours : du samedi 13h (heure des Comores) au samedi 13h suivant
export function getWeekRange(now = new Date()) {
  const local = toComorosWallClock(now);
  const daysSinceReset = (local.getUTCDay() - WEEK_RESET_DAY + 7) % 7;

  let start = fromComorosTime(
    local.getUTCFullYear(),
    local.getUTCMonth(),
    local.getUTCDate() - daysSinceReset,
    WEEK_RESET_HOUR,
  );

  // Samedi avant 13h : la semaine précédente n'est pas encore terminée
  if (start.getTime() > now.getTime()) {
    start = new Date(start.getTime() - 7 * DAY_MS);
  }

  const end = new Date(start.getTime() + 7 * DAY_MS);
  return { start, end };
}
