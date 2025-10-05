import AppSidebar from "@/components/AppSidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import SectionHeader from "@/components/SectionHeader"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { Outlet } from "react-router-dom"

// import data from "./data.json"

export default function DashboardLayout() {
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            
            <SidebarInset>
                <SectionHeader />


                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 px-4 lg:px-6 md:gap-6 md:py-6">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
