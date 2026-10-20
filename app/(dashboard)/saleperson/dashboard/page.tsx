import SalepersonCard from "@/components/card/saleperson-card";
import SalepersonDataTable from "@/components/table/saleperson-data-table";
import { getCurrentSession } from "@/server/current-session";
import { getAvailableProducts } from "@/query/product.query";
import { getSalesHistoric } from "@/query/historic.query";
import SalesReviewTable from "@/components/table/sales-review-table";

export default async function SalepersonDasboardPage() {
  
  const session = await getCurrentSession();
  const products = await getAvailableProducts();
  const sales = await getSalesHistoric(session.user.id);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SalepersonCard userId={session.user.id} />
          <div className="px-4 grid md:grid-cols-2 gap-4 sm:grid-cols-1 lg:px-6">
          </div>
          <SalepersonDataTable products={products} />
          <SalesReviewTable sales={sales} role="saleperson" />
        </div>
      </div>
    </div>
  )
}
