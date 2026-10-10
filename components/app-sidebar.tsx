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
import { menu } from "@/lib/menu"
import Image from "next/image"
import Link from "next/link"


export function AppSidebar() {
  const { isMobile, setOpenMobile } = useSidebar()

  const closeMobileSidebar = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="menu-[slot=sidebar-menu-button]:p-1.5! py-8"
            >
              <Link href="/" onClick={closeMobileSidebar}>
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
        <NavMain items={menu.navMain} />
        <NavDocuments items={menu.documents} />
        <NavSecondary items={menu.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
