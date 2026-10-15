import { getSalepersonMetrics } from "@/query/saleperson.query";
import MetricCard from "./metric/metric-card";

interface Props {
    userId: string;
}

export default async function AdminCards({ userId }: Props) {
    const { totalCommission, totalSalesPending, totalSalesSold, growthRate } = await getSalepersonMetrics(userId);

    return (
        <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <MetricCard title="Ma Commission" value={totalCommission} unit="KMF" trend={growthRate} trendLabel={growthRate >= 0 ? `+${growthRate}% vs semaine dernière` : `${growthRate}% vs semaine dernière`} description="Commission gagnée cette semaine" />

            <MetricCard title="Ma Commission" value={totalCommission} unit="KMF" trend={growthRate} trendLabel={growthRate >= 0 ? `+${growthRate}% vs semaine dernière` : `${growthRate}% vs semaine dernière`} description="Commission gagnée cette semaine" />

            <MetricCard title="Ma Commission" value={totalCommission} unit="KMF" trend={growthRate} trendLabel={growthRate >= 0 ? `+${growthRate}% vs semaine dernière` : `${growthRate}% vs semaine dernière`} description="Commission gagnée cette semaine" />

            <MetricCard title="Ma Commission" value={totalCommission} unit="KMF" trend={growthRate} trendLabel={growthRate >= 0 ? `+${growthRate}% vs semaine dernière` : `${growthRate}% vs semaine dernière`} description="Commission gagnée cette semaine" />

        </div>
    )
}