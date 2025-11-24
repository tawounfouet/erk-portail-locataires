import { formatISODateToFrenchWithMonth } from "@/lib/date";
import { getReportPercentageStyle, getReportStatusMessage } from "@/lib/operations";
import { IOperationDetail } from "@/types/operations.type";
import { Link } from "react-router-dom";

interface IReportViewProps {
    report: IOperationDetail;
}

export default function ReportView({ report }: IReportViewProps) 
{
console.log(report);
    return (
		<Link to={`/reports/1`} state={{ report }}>
			<div 
				key={report.id}
				className="bg-[#2f2014] border border-white/5 rounded-3xl p-6 hover:bg-white/5 transition-all cursor-pointer mt-5"
			>
				<div className="flex justify-between items-start mb-2">
				<div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-2">
					{/* <Suggestion className="w-5 h-5" /> */}
				</div>
				<span className="text-xs text-gray-200">{formatISODateToFrenchWithMonth(report.created_at)}</span>
				</div>
				
				<h3 className="text-lg font-bold text-white mb-2">{report.title}</h3>
				<p className="text-sm text-gray-400 line-clamp-2">{report.description.substring(0, 160)}...</p>
				
				<div className="mt-4 flex items-center gap-2">
				<div className="h-1 flex-1 bg-secondary rounded-full overflow-hidden">
					<div className={`h-full bg-primary ${getReportPercentageStyle(report.completion_percentage as number)} `}></div>
				</div>
				<span className="text-medium text-primary font-medium">{getReportStatusMessage(report.status)}</span>
				</div>
			</div>
		</Link>
  )
}