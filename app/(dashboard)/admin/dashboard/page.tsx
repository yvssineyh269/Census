
import AdminCards from "@/components/card/admin-card"
import { ChartBarInteractive } from "@/components/chart-bar-interactive"
import { getMarginChartData } from "@/query/margin.query"
import SalesReviewTable from "@/components/table/sales-review-table";
import { getSalesHistoric } from "@/query/historic.query";


export default async function AdminPage() {
    const sales = await getSalesHistoric();
  const marginChart = await getMarginChartData("week", 0);
  
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
       <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <AdminCards />
          <div className="px-4 lg:px-6">
            <ChartBarInteractive initialChart={marginChart} />
          </div>
          <SalesReviewTable sales={sales} role="admin" />
        </div>
      </div>
    </div>
  )
}
