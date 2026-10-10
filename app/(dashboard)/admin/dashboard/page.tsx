
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"


export default function AdminPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 grid md:grid-cols-2 gap-4 sm:grid-cols-1 lg:px-6">
            <ChartAreaInteractive />
            <ChartAreaInteractive />
          </div>
          {/* <AdminDataTable data={} /> */}
        </div>
      </div>
    </div>
  )
}
