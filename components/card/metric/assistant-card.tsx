// Cartes de l'assistant : ventes en attente, ventes qu'il/elle a validées et sa commission de la semaine en cours,
// remises à zéro chaque samedi à 13h (heure des Comores)

import {
    ASSISTANT_COMMISSION_PER_SALE,
    getAssistantWeeklyTotals,
    getPendingSalesCount,
} from "@/query/assistant.query";
import { getCurrentSession } from "@/server/current-session";
import { getGrowthRate, trendLabel } from "@/server/growth-rate";
import MetricCard from "./metric-card";

const plural = (count: number) => (count > 1 ? "s" : "");

export default async function AssistantCards() {
    const session = await getCurrentSession();
    const [pendingCount, current, previous] = await Promise.all([
        getPendingSalesCount(),
        getAssistantWeeklyTotals(session.user.id, 0),
        getAssistantWeeklyTotals(session.user.id, -1),
    ]);

    const validatedTrend = getGrowthRate(current.validatedCount, previous.validatedCount);
    const commissionTrend = getGrowthRate(current.commission, previous.commission);

    return (
        <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
            <MetricCard
                title="Ventes en attente"
                value={pendingCount}
                description={`Vente${plural(pendingCount)} à valider ou annuler`}
            />
            <MetricCard
                title="Ventes validées par moi"
                value={current.validatedCount}
                trend={validatedTrend}
                trendLabel={trendLabel(validatedTrend)}
                description={`Vente${plural(current.validatedCount)} validée${plural(current.validatedCount)} cette semaine`}
            />
            <MetricCard
                title="Mes commissions"
                value={current.commission}
                unit="KMF"
                trend={commissionTrend}
                trendLabel={trendLabel(commissionTrend)}
                description={`${ASSISTANT_COMMISSION_PER_SALE} KMF par vente validée`}
            />
        </div>
    )
}
