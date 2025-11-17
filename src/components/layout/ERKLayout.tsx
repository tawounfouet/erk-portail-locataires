import { useIsMobile } from "@/hooks/use-mobile";
import MobileLayout from "./MobileLayout";
import DashboardLayout from "./DashboardLayout";
import { Outlet } from "react-router-dom";

export default function ERKLayout()
{
    const isMobile = useIsMobile();

    if (isMobile)
    {
        return <MobileLayout><Outlet /></MobileLayout>;
    }

    return <DashboardLayout><Outlet /></DashboardLayout>;
}