"use server";

import { getSessionWithRole, MARGIN_ROLES } from "@/lib/authorization";
import { PERIODS, type Period } from "@/lib/period-range";
import { getDailyMarginTotals, getMarginChartData } from "@/query/margin.query";


export async function fetchMarginChart(period: Period, offset: number) {
  const session = await getSessionWithRole(MARGIN_ROLES);

  if (!session) {
    return { status: "error" as const, message: "Vous n'êtes pas autorisé à consulter les marges" };
  }

  // Uniquement la période en cours ou des périodes passées
  if (!PERIODS.includes(period) || !Number.isInteger(offset) || offset > 0 || offset < -520) {
    return { status: "error" as const, message: "Période invalide" };
  }

  const chart = await getMarginChartData(period, offset);
  return { status: "success" as const, chart };
}

// Totaux d'une journée (YYYY-MM-DD, heure des Comores) pour les cartes d'analyse
export async function fetchDailyMargin(day: string) {
  const session = await getSessionWithRole(MARGIN_ROLES);

  if (!session) {
    return { status: "error" as const, message: "Vous n'êtes pas autorisé à consulter les marges" };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || Number.isNaN(Date.parse(day))) {
    return { status: "error" as const, message: "Date invalide" };
  }

  const daily = await getDailyMarginTotals(day);
  return { status: "success" as const, daily };
}
