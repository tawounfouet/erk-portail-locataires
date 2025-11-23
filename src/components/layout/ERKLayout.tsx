import { useIsMobile } from "@/hooks/use-mobile";
import MobileLayout from "./MobileLayout";
import DashboardLayout from "./DashboardLayout";
import { Outlet } from "react-router-dom";
import BugReportButton from "../dev/BugReportButton";

export default function ERKLayout()
{
    const isMobile = useIsMobile();

    if (isMobile)
    {
        return <MobileLayout><Outlet /><BugReportButton /></MobileLayout>;
    }

    return <DashboardLayout><Outlet /><BugReportButton /></DashboardLayout>;
}