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
      <div className="@container/main flex flex-1 flex-col gap-2 px-4 lg:px-6">
      <h1 className="text-3xl sm:text-4xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground mt-3">
          Visualisez vos performances et vos ventes faites dans la semaine
        </p>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SalepersonCard userId={session.user.id} />
          
          <SalepersonDataTable products={products} />
          <SalesReviewTable sales={sales} role="saleperson" />
        </div>
      </div>
    </div>
  )
}
