import SalesReviewTable from "@/components/table/sales-review-table";
import { getSalesHistoric } from "@/query/historic.query";

export default async function AccountantDashboardPage() {
  const sales = await getSalesHistoric();

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SalesReviewTable sales={sales} role="accountant" />
        </div>
      </div>
    </div>
  )
}
