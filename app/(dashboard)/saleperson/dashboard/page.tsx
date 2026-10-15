import SalepersonCard from "@/components/card/saleperson-card";
import SalepersonDataTable from "@/components/table/saleperson-data-table";
import { getCurrentSession } from "@/server/current-session";

export default async function SalepersonDasboardPage() {
  
  const session = await getCurrentSession();

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SalepersonCard userId={session.user.id} />
          <div className="px-4 grid md:grid-cols-2 gap-4 sm:grid-cols-1 lg:px-6">
          </div>
          <SalepersonDataTable />
        </div>
      </div>
    </div>
  )
}
