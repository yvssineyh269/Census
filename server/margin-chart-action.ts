"use server";

import { getSessionWithRole } from "@/lib/authorization";
import { PERIODS, type Period } from "@/lib/period-range";
import { getMarginChartData } from "@/query/margin.query";

// Rôles autorisés à consulter les marges (informations financières)
const MARGIN_ROLES = ["admin", "manager", "accountant"] as const;

export async function fetchMarginChart(period: Period, offset: number) {
  const session = await getSessionWithRole([...MARGIN_ROLES]);

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
