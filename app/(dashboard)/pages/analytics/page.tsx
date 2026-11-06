import AnalyticsCards from "@/components/card/analytics-card";
import { ChartRadarLinesOnly } from "@/components/radar-chart-line-only";
import SalesReviewTable from "@/components/table/sales-review-table";
import { toComorosWallClock } from "@/lib/week-range";
import { getSalesHistoric } from "@/query/historic.query";
import { getDailyMarginTotals, getMonthlyMarginTotals } from "@/query/margin.query";
import { getCurrentSession } from "@/server/current-session";
import { MARGIN_ROLES } from "@/lib/authorization";
import { isRole, ROLE_HOME } from "@/lib/roles";
import { redirect } from "next/navigation";

export default async function AnalyticsPage() {
  const session = await getCurrentSession();
  // Les marges sont des informations financières : réservées aux rôles autorisés
  const role = session.user.role;
  if (!isRole(role)) redirect("/login");
  // Page réservée aux rôles autorisés à voir les marges : les autres retournent à leur tableau de bord
  if (!MARGIN_ROLES.includes(role)) redirect(ROLE_HOME[role]);

  // Jour et mois en cours, heure des Comores
  const now = toComorosWallClock(new Date());
  const today = now.toISOString().slice(0, 10);

  const [sales, daily, monthly] = await Promise.all([
    getSalesHistoric(),
    getDailyMarginTotals(today),
    getMonthlyMarginTotals(now.getUTCFullYear()),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2 px-4 lg:px-6">
        <h1 className="text-3xl sm:text-4xl font-bold">Analyse des ventes et activités</h1>
        <p className="text-muted-foreground mt-3">
          Visualisez les tendances des ventes, les performances des équipes et les activités récentes.
        </p>

        {/* Cartes d'analyse du jour (sélection via le calendrier) et marges mensuelles */}
        {/* Le radar des marges mensuelles se place sous le calendrier, à droite des cartes */}
        <div className="py-4 md:py-6">
          <AnalyticsCards initialDaily={daily}>
            <ChartRadarLinesOnly monthly={monthly} currentMonth={now.getUTCMonth()} />
          </AnalyticsCards>
        </div>

        {/* Tableau de révision des ventes */}
        {/* Le comptable consulte uniquement : pas de boutons d'action */}
        <SalesReviewTable sales={sales} role={role} readOnly={role === "accountant"} />
      </div>
    </div>
  )
}
