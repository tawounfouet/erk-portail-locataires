import FloatingAddButton from "@/components/common/FloatingAddButton";
import ReportView from "@/components/reports/ReportView";
import { useMyOperations } from "@/hooks/useOperations";
import { IOperationDetail } from "@/types/operations.type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import no_report from "@/assets/images/no_report.webp";


interface IHomeEmptyStateProps 
{
    title: string;
    description: string;
    image: string;
}

function HomeEmptyState({ title, description, image }: IHomeEmptyStateProps)
{
    return (
        <div className="flex flex-col items-center jutify-between gap-4 mt-8">
            <h1 className="text-2xl font-medium text-white">{title}</h1>
            
            <img
                src={image}
                alt="relaxing boy"
                className="opacity-60"
            />

            <p className="text-center text-gray-400">
                {description}
            </p>
        </div>
    );
}


export default function HomeReportsPage()
{
    const navigate = useNavigate();
    const { operations: reports } = useMyOperations();

    return (
        <div className="pt-4 pb-20">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white tracking-tight">Signalements</h2>
                <p className="text-gray-400 mt-1">C'est ici que vous gérez les incidents</p>
            </div>

            <Tabs defaultValue="actives">
                <TabsList className="w-full bg-gray-300">
                    <TabsTrigger value="actives" className="w-full text-gray-800">Actifs</TabsTrigger>
                    <TabsTrigger value="common" className="w-full text-gray-800">Communs</TabsTrigger>
                    <TabsTrigger value="resolved" className="w-full text-gray-800">Résolus</TabsTrigger>
                </TabsList>

                <TabsContent value="actives">
                    {
                        reports.length < 1 ?
                        <HomeEmptyState title="0 Signalement !" description="Elle est pas belle la vie à Eureka ?" image={no_report} />
                        :
                        reports.map((report, index) => <ReportView key={`${report.id}${index}`} report={report as IOperationDetail} />)
                    }
                </TabsContent>
                <TabsContent value="common"></TabsContent>
                <TabsContent value="resolved"></TabsContent>
            </Tabs>

            <FloatingAddButton onClick={() => navigate('/reports/new')} />
        </div>
    );
}