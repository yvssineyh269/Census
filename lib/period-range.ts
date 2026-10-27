import { fromComorosTime, getWeekRange, toComorosWallClock } from "./week-range";

export const PERIODS = ["week", "month", "quarter"] as const;
export type Period = (typeof PERIODS)[number];

export type Bucket = { start: Date; end: Date };

const DAY_MS = 24 * 60 * 60 * 1000;

// Période demandée, décalée de "offset" périodes dans le passé (0 = en cours, -1 = précédente...)
// Toutes les bornes sont en heure des Comores :
// - week    : semaine de travail (samedi 13h → samedi 13h), découpée par jour (minuit → minuit)
// - month   : mois civil, découpé par jour (minuit → minuit)
// - quarter : trimestre civil (janv-mars, avr-juin...), découpé par jour
export function getPeriodRange(period: Period, offset: number) {
  let start: Date;
  let end: Date;

  if (period === "week") {
    const week = getWeekRange();
    start = new Date(week.start.getTime() + offset * 7 * DAY_MS);
    end = new Date(start.getTime() + 7 * DAY_MS);
  } else {
    const local = toComorosWallClock(new Date());
    const monthsPerPeriod = period === "month" ? 1 : 3;
    const firstMonth =
      period === "month" ? local.getUTCMonth() : Math.floor(local.getUTCMonth() / 3) * 3;
    const startMonth = firstMonth + offset * monthsPerPeriod;
    start = fromComorosTime(local.getUTCFullYear(), startMonth);
    end = fromComorosTime(local.getUTCFullYear(), startMonth + monthsPerPeriod);
  }

  // Journées calendaires (minuit → minuit, heure des Comores), rognées aux bornes de la période :
  // la semaine donne donc un samedi après-midi (dès 13h), dimanche → vendredi, puis un samedi matin (jusqu'à 13h)
  const local = toComorosWallClock(start);
  const firstMidnight = fromComorosTime(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate());
  const buckets: Bucket[] = [];
  // Pas d'heure d'été aux Comores : un jour fait toujours 24h
  for (let cursor = firstMidnight.getTime(); cursor < end.getTime(); cursor += DAY_MS) {
    buckets.push({
      start: new Date(Math.max(cursor, start.getTime())),
      end: new Date(Math.min(cursor + DAY_MS, end.getTime())),
    });
  }

  return { start, end, buckets };
}
