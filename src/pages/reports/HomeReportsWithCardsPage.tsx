import { useMyOperations } from "@/hooks/useOperations";
import { getReportStatusBadge } from "@/services/badges";
import { IOperationDetail } from "@/types/operations.type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface IReportCardProps
{
    report: IOperationDetail
}

function ReportCard({ report }: IReportCardProps)
{
    return (
        <div className="flex cursor-pointer items-start gap-4 rounded-xl border border-transparent bg-slate-100 p-4 transition-all hover:border-primary/50 dark:bg-slate-800/50">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-2xl">water_drop</span>
            </div>

            <div className="flex flex-1 flex-col justify-center gap-1">
                <div className="flex items-center justify-between">
                    <p className="text-base font-medium text-slate-900 dark:text-white">{report.title}</p>
                    <div className="flex items-center gap-2 rounded-full bg-orange-500/20 px-2.5 py-1">
                        <div className="size-1.5 rounded-full bg-orange-500"></div>
                        <p className="text-xs font-medium text-orange-500">{getReportStatusBadge(report.status)}</p>
                    </div>
                </div>

                <p className="text-sm font-normal text-slate-500 dark:text-slate-400">ID: {report.id} | May 20, 2024</p>
                <p className="mt-1 text-sm font-normal text-slate-600 dark:text-slate-300">{report.description}</p>
            </div>
        </div>
    )
}


export default function HomeReportsWithCardsPage()
{
    const { operations: reports, loading, error } = useMyOperations({ operation_type: 'SIGNALEMENT' });
        
    const [active_reports] = useState<IOperationDetail[]>([]);

    return (
        <>
            <Tabs defaultValue="actives">
                <TabsList className="w-full">
                    <TabsTrigger value="actives" className="w-full">Actifs</TabsTrigger>
                    <TabsTrigger value="common" className="w-full">Communs</TabsTrigger>
                    <TabsTrigger value="resolved" className="w-full">Résolus</TabsTrigger>
                </TabsList>

                <TabsContent value="actives">
                    {active_reports.map((report, index) => <ReportCard key={`${report.id}${index}`} report={report} />)}
                </TabsContent>
                <TabsContent value="common"></TabsContent>
                <TabsContent value="resolved"></TabsContent>
            </Tabs>
        </>
    );
}