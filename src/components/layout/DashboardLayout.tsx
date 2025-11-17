import AppSidebar from "@/components/AppSidebar"
import SectionHeader from "@/components/SectionHeader"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"


export default function DashboardLayout({ children }) {
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            
            <SidebarInset>
                <SectionHeader />

                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 px-4 lg:px-6 md:gap-6 md:py-6">
                            {children}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
