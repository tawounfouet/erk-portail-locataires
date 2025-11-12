import * as React from "react"
import { Home } from "lucide-react"
import { NavMain, NavSecondary, NavUser } from "@/components/navigation"

import { data as navigation_data } from "@/static/navigation.static"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"



function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <Home className="h-5 w-5" />
                <span className="text-base font-semibold">EurekaNet.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>


      <SidebarContent>
        <NavMain items={navigation_data.navMain} />
        {/* <NavDocuments items={navigation_data.documents} /> */}
        <NavSecondary items={navigation_data.navSecondary} className="mt-auto" />
      </SidebarContent>


      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar;