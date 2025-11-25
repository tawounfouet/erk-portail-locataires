import FloatingAddButton from "@/components/common/FloatingAddButton";
import { IOperationDetail, IOperationList } from "@/types/operations.type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import no_report from "@/assets/images/no_report.webp";
import SearchBar from "@/components/common/SearchBar";
import { useEffect, useState } from "react";
import ReportListView from "@/components/reports/ReportListView";
import { useMyOperations } from "@/hooks/useOperations";

export default function HomeReportsPage()
{
    // ==========================================
	// 				 SERVICE DATA
	// ==========================================
    const navigate = useNavigate();
    const { operations: reports } = useMyOperations();
    const [filteredReports, setFilteredReports] = useState<IOperationList[]>([]);

    // ==========================================
	// 				 APPLY SEARCH
	// ==========================================
    useEffect(() => {
        setFilteredReports(reports);
        console.log(reports);
    }, [reports]);

    // ==========================================
	// 			   REPORT CONDITIONS
	// ==========================================
    const IsReport_Personnal = (report: IOperationList) => true;
    const IsReport_Common = (report: IOperationList) => true;
    const IsReport_Resolved = (report: IOperationList) => report.status === 'REJECTED' || report.status === 'CANCELLED' || report.status === 'COMPLETED';

    return (
        <div className="pt-4 pb-20">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white tracking-tight">Signalements</h2>
                <p className="text-gray-400 mt-1">C'est ici que vous gérez les incidents</p>
            </div>

            <SearchBar<IOperationDetail>
                data={reports as IOperationDetail[]}
                searchFields={['title', 'description', 'requester_name']}
                onFilteredResults={setFilteredReports}
                debounceMs={100}
                className="w-full my-5"
            />

            <Tabs defaultValue="personnal">
                <TabsList className="w-full bg-transparent">
                    <TabsTrigger value="personnal" className="w-full text-white rounded-full">Personnels</TabsTrigger>
                    <TabsTrigger value="common" className="w-full text-white rounded-full">Communs</TabsTrigger>
                    <TabsTrigger value="resolved" className="w-full text-white rounded-full">Résolus</TabsTrigger>
                </TabsList>

                <TabsContent value="personnal">
                    {
                        <ReportListView 
                            emptyStateTitle="We did it !"
                            emptyStateDescription="Aucun signalement dans l'espace commun"
                            emptyStateImg={no_report}
                            reportList={
                                filteredReports.filter(
                                    (report) => IsReport_Personnal(report)
                                ) as IOperationDetail[]
                            } 
                        />
                    }
                </TabsContent>

                <TabsContent value="common">
                    {
                        <ReportListView 
                            emptyStateTitle="We did it !"
                            emptyStateDescription="Aucun signalement dans l'espace commun"
                            emptyStateImg={no_report}
                            reportList={
                                filteredReports.filter(
                                    (report) => IsReport_Common(report)
                                ) as IOperationDetail[]
                            } 
                        />
                    }
                </TabsContent>

                <TabsContent value="resolved">
                    {
                        <ReportListView 
                            emptyStateTitle="We did it !"
                            emptyStateDescription="Je t'avais dit qu'on gérait"
                            emptyStateImg={no_report}
                            reportList={
                                filteredReports.filter(
                                    (report) => IsReport_Resolved(report)
                                ) as IOperationDetail[]
                            } 
                        />
                    }
                </TabsContent>
            </Tabs>

            <FloatingAddButton onClick={() => navigate('/reports/new')} />
        </div>
    );
}