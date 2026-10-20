"use client"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { LucideIcon, Plus } from "lucide-react"
import type { StockAlertDto } from "@/lib/types"
import { StockAlertViewer } from "./stock-alert-viewer"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NavMain({
  items,
  quickAdd,
  stockAlerts,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
  quickAdd: {
    title: string
    url: string
    icon: LucideIcon
  }[]
  // null : le rôle connecté ne reçoit pas les alertes de stock
  stockAlerts: StockAlertDto[] | null
}) {
  const { isMobile, setOpenMobile } = useSidebar()

  const closeMobileSidebar = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  tooltip="Quick Button"
                  className="min-w-8 bg-primary-gradient text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                >
                  <Plus />
                  <span>Ajout Rapide</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-56">
                {quickAdd.map((item) => (
                  <DropdownMenuItem key={item.title} asChild>
                    <Link href={item.url} onClick={closeMobileSidebar}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {stockAlerts && <StockAlertViewer alerts={stockAlerts} />}
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarGroupLabel className="mt-2">Menu Principal</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon

            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton tooltip={item.title} asChild>
                  <Link href={item.url} onClick={closeMobileSidebar}>
                    {Icon ? <Icon /> : null}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
