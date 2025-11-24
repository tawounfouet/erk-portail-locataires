import { useMyOperations, useOperationTypes } from "@/hooks/useOperations";
import { getReportStatusBadge } from "@/services/badges";
import { IOperationDetail, TOperationCategory } from "@/types/operations.type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getIconComponent } from "@/lib/icons";
import { formatISODateToFrench } from "@/lib/date";
import FloatingAddButton from "@/components/common/FloatingAddButton";

interface IReportCardProps
{
    idx: number;
    report: IOperationDetail;
    category: string | TOperationCategory;
}

function ReportCard({ idx, report, category }: IReportCardProps)
{   
    const Icon = getIconComponent(category || '');

    return (
        <Link to={`report-${idx}`} state={{ report }}>
            <div className="my-4 flex cursor-pointer items-start gap-4 rounded-xl border border-transparent bg-slate-100 p-4 transition-all hover:border-primary/50 dark:bg-slate-800/50">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <Icon />
                </div>

                <div className="flex flex-1 flex-col justify-center gap-1">
                    <div className="flex items-center justify-between">
                        <p className="text-base font-medium text-slate-900 dark:text-white">{report.title}</p>
                        {getReportStatusBadge(report.status)}
                    </div>

                    <p className="text-sm font-normal text-slate-500 dark:text-slate-400">ID: {report.operation_number} | {formatISODateToFrench(report.created_at)}</p>
                    <p className="mt-1 text-sm font-normal text-slate-600 dark:text-slate-300">{report.description}</p>
                </div>
            </div>
        
        </Link>
    )
}


export default function HomeReportsWithCardsPage()
{
    // ==========================================
	// 				   STATE
	// ==========================================
    const { operations: reports, loading, error } = useMyOperations({ operation_type: 'SIGNALEMENT' });
    const { operationTypes, isLoading: operationTypeLoading, error: operationTypeError } = useOperationTypes();
    const navigate = useNavigate();
    const location = useLocation();

	// ==========================================
	// 				    RENDER
	// ==========================================

    // États de chargement et d'erreur
    if (loading || operationTypeLoading)
    {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement de vos signalements...</p>
                </div>
            </div>
        );
    }
    
    if (error || operationTypeError) 
    {
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

    const getReportCategory = (operationTypeId: string | TOperationCategory): string => {
        const operationType = operationTypes.get(operationTypeId);

        if (operationType)
            return operationType.category;

        return 'none';
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
                    {reports.map((report, index) => <ReportCard key={`${report.id}${index}`} idx={index} report={report as IOperationDetail} category={getReportCategory(report.operation_type)} />)}
                </TabsContent>
                <TabsContent value="common"></TabsContent>
                <TabsContent value="resolved"></TabsContent>
            </Tabs>

            <FloatingAddButton onClick={() => navigate('/reports/new', { state: { previousPage: location.pathname } })} />
        </>
    );
}