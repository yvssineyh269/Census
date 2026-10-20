"use client"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import logo from "@/public/next-step-logo.jpeg"
import { menu, filterMenuByRole } from "@/lib/menu"
import { authClient } from "@/lib/auth-client"
import { isRole, ROLE_HOME } from "@/lib/roles"
import type { StockAlertDto } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"


export function AppSidebar({
  stockAlerts,
  ...props
}: React.ComponentProps<typeof Sidebar> & { stockAlerts: StockAlertDto[] | null }) {
  const { data: session } = authClient.useSession()
  const { isMobile, setOpenMobile } = useSidebar()

  const currentRole = isRole(session?.user.role) ? session.user.role : null

  const visibleQuickAdd = filterMenuByRole(menu.quickAdd, currentRole)
  const visibleNavMain = filterMenuByRole(menu.navMain, currentRole)
  const visibleNavDocuments = filterMenuByRole(menu.documents, currentRole)
  const visibleNavSecondary = filterMenuByRole(menu.navSecondary, currentRole)

  const closeMobileSidebar = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="menu-[slot=sidebar-menu-button]:p-1.5! py-8"
            >
              <Link href={currentRole ? ROLE_HOME[currentRole] : "/"} onClick={closeMobileSidebar}>
                <Image src={logo} alt="logo" className="size-10! rounded-lg" />
                <div className="flex flex-col font-semibold">
                <span className="text-base font-semibold">Census App</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">By Next Step</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={visibleNavMain} quickAdd={visibleQuickAdd} stockAlerts={stockAlerts} />
        <NavDocuments items={visibleNavDocuments} />
        <NavSecondary items={visibleNavSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
