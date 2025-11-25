import { IOperationDetail } from "@/types/operations.type"
import EmptyState from "../common/EmptyState"
import ReportView from "./ReportView"

interface IReportListViewProps
{ 
    reportList: IOperationDetail[];
    emptyStateTitle: string;
    emptyStateDescription: string;
    emptyStateImg: string;
}

export default function ReportListView({ 
    reportList, 
    emptyStateTitle,
    emptyStateDescription,
    emptyStateImg
} : IReportListViewProps) 
{
    if (reportList.length < 1)
        return <EmptyState title={emptyStateTitle} description={emptyStateDescription} image={emptyStateImg} />

    return reportList.map((report, index) => {
        
            return <ReportView key={`${report.id}${index}`} report={report as IOperationDetail} />
    })
}