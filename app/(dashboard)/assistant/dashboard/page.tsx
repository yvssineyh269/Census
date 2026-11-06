import AssistantCards from '@/components/card/metric/assistant-card'
import SalesReviewTable from '@/components/table/sales-review-table'
import { getSalesHistoric } from '@/query/historic.query';

export default async function AssistantDashboardPage() {
  const sales = await getSalesHistoric();
  return (
     <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2 px-4 lg:px-6">
           <h3 className="text-3xl sm:text-4xl font-bold">
            Tableau de bord
           </h3>
           <p>
            Visualisez les performances vos chiffres et les activités.
           </p>
           
           <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <AssistantCards />
              <SalesReviewTable sales={sales} role="assistant" />
            </div>
          </div>
        </div>
  )
}
