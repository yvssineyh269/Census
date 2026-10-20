
import AdminCards from "@/components/card/admin-card"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { getCurrentSession } from "@/server/current-session";
import SalesReviewTable from "@/components/table/sales-review-table";
import { getSalesHistoric } from "@/query/historic.query";


export default async function AdminPage() {
  
  const session = await getCurrentSession();
  const sales = await getSalesHistoric();
  
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
       <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <AdminCards userId={session.user.id} />
          <div className="px-4 grid md:grid-cols-2 gap-4 sm:grid-cols-1 lg:px-6">
            <ChartAreaInteractive />
            <ChartAreaInteractive />
          </div>
          <SalesReviewTable sales={sales} role="admin" />
        </div>
      </div>
    </div>
  )
}
