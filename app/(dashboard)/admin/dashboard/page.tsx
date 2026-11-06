
import AdminCards from "@/components/card/admin-card"
import { ChartBarInteractive } from "@/components/chart-bar-interactive"
import { getMarginChartData } from "@/query/margin.query"

export default async function AdminPage() {

  const marginChart = await getMarginChartData("week", 0);
  
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2 px-4 lg:px-6">
        <h1 className="text-3xl sm:text-4xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground mt-3">
          Visualisez les performances vos chiffres et les activités.
        </p>
      
       <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <AdminCards />
          <div className="">
            <ChartBarInteractive initialChart={marginChart} />
          </div>
        </div>
      </div>
    </div>
  )
}
