import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getStockAlerts } from "@/query/product.query"

// Rôles notifiés quand un produit atteint son seuil d'alerte de stock
const STOCK_ALERT_ROLES = ["admin", "manager"]

export default async function DashboardLayout({children}: {children: React.ReactNode}) {
  const session = await auth.api.getSession({ headers: await headers() })
  const stockAlerts =
    session && STOCK_ALERT_ROLES.includes(session.user.role ?? "")
      ? await getStockAlerts()
      : null

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" stockAlerts={stockAlerts} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
       {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
