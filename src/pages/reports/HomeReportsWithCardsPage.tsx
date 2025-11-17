import { useMyOperations } from "@/hooks/useOperations";
import { getReportStatusBadge } from "@/services/badges";
import { IOperationDetail } from "@/types/operations.type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

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


const FloatingActionButton = ({text, onClick }) => {
  return (
    <div className="fixed bottom-12 right-4 z-10 mx-auto max-w-md sm:right-[calc(50%-11rem)]">
      <button 
        className="flex h-14 min-w-0 cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full bg-primary p-4 text-base font-bold leading-normal tracking-[0.015em] text-white shadow-lg"
        onClick={onClick}
      >
        <Plus />
      </button>
    </div>
  );
};


export default function HomeReportsWithCardsPage()
{
    const { operations: reports, loading, error } = useMyOperations({ operation_type: 'SIGNALEMENT' });
    const navigate = useNavigate();
    const location = useLocation();
        
    const [active_reports] = useState<IOperationDetail[]>([]);


     // États de chargement et d'erreur
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement de vos signalements...</p>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-medium text-red-800 mb-2">
                    Erreur de chargement
                </h3>
                <p className="text-red-600 mb-4">{error}</p>
                <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline"
                >
                    Réessayer
                </Button>
            </div>
        );
    }

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

            <FloatingActionButton 
                text="Signalement"
                onClick={() => navigate('/reports/new', { state: { previousPage: location.pathname } })}
            /> 
        </>
    );
}