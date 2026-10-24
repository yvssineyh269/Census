import { getWeeklyMarginTotals } from "@/query/margin.query";
import MetricCard from "./metric/metric-card"
import { getGrowthRate, trendLabel } from "@/server/growth-rate";

export default async function ManagerCards() {
    const [current, previous] = await Promise.all([
        getWeeklyMarginTotals(0),
        getWeeklyMarginTotals(-1),
    ])

    const metrics = [
        { title: "Chiffre d'affaires", value: current.revenue, previous: previous.revenue, description: `${current.salesCount} vente${current.salesCount > 1 ? "s" : ""} validée${current.salesCount > 1 ? "s" : ""} cette semaine` },
        { title: "Marge brute", value: current.gross, previous: previous.gross, description: "Prix de vente − prix d'achat" },
        { title: "Marge nette", value: current.net, previous: previous.net, description: "Marge brute − commissions" },
        { title: "Commissions", value: current.commission, previous: previous.commission, description: "Commissions dues aux télévendeurs" },
    ];
    return (
        <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            {
                metrics.map((metric) => {
                    const growthRate = getGrowthRate(metric.value, metric.previous)
                    return (
                        <MetricCard
                            key={metric.title}
                            title={metric.title}
                            value={metric.value}
                            unit="KMF"
                            trend={growthRate}
                            trendLabel={trendLabel(growthRate)}
                            description={metric.description} />
                    )
                })
            }
        </div>
    )
}
