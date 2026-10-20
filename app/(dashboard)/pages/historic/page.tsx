import HistoricDataTable from '@/components/table/historic-data-table'
import { getProcessedSales } from '@/query/historic.query'

export default async function HistoricPage() {
  const sales = await getProcessedSales();

  return (
    <div className="px-4 py-6 sm:py-10 space-y-4 sm:space-y-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">Historique des ventes et activités</h1>
            <p className="text-muted-foreground mt-3">
                Toutes les ventes validées ou annulées, avec la personne qui les a traitées et le motif en cas d&apos;annulation.
            </p>
          </div>
          {/* Tableau de l'historique */}
          <HistoricDataTable sales={sales} />
    </div>
  )
}
