import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { formatISODateToFrench } from "@/lib/date";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { CircleEllipsis, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { shareToWhatsapp } from "@/services/sharetowhatsapp";
import { getReportStatusBadge } from "@/services/badges";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCategoryIcon } from "@/lib/icons";
import { useMyOperations } from "@/hooks/useOperations";
import { IOperationList } from "@/types/operations.type";

export default function HomeReportsPage()
{   
    const { operations: reports, loading, error } = useMyOperations({ operation_type: 'SIGNALEMENT' });
    const navigate = useNavigate();

    const columns: ColumnDef<IOperationList>[] = [
        {
            accessorKey: "title",
            header: "Signalement",
            cell: ({ row }) => {
                const title = row.original.title;
                // const category = row.original.category;
                // const icon = getCategoryIcon(category);

                return (
                    <div className="text-sm font-medium text-gray-900 flex gap-2">
                        {/* {!!icon && icon}  */} {title}
                    </div>
                );
            }
        },
        {
            id: "category",
            header: "Catégorie",
            cell: ({ row }) => {
                // const category = row.original.category;

                return (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full capitalize">
                      category
                    </span>
                );
            }
        },
        {
            accessorKey: "status",
            header: "Statut",
            cell: ({ row }) => getReportStatusBadge(row.getValue("status"))
        },
        {
            accessorKey: "created_at",
            header: "Date",
            cell: ({ row }) => {
                const date: string = row.getValue("created_at");

                return formatISODateToFrench(date);
            }
        },
        {
            id: "action",
            header: "Actions",
            cell: ({ row }) =>  {
                const navigationState = { 
                    report: row.original, 
                    previousPage: window.location.pathname, 
                };


                return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                            size="icon"
                        >
                            <CircleEllipsis size={64}  />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem onClick={() => {navigate("/reports/details", { state : navigationState })}}>Détails</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {shareToWhatsapp()}}>Partager</DropdownMenuItem>
                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        {/* @TODO: Disable the delete button if the process has already started */}
                        <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                )
            },
        }
    ];

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
        <div>
            {/* <ReportStats reports={reports} /> */}

            <Tabs defaultValue="personal">
                <div className="flex items-center justify-between py-4">
                    <TabsList>
                        <TabsTrigger value="common">Commun</TabsTrigger>
                        <TabsTrigger value="personal">Personnel</TabsTrigger>
                    </TabsList>

                    <Link to="/reports/new">
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Nouveau signalement
                        </Button>
                    </Link>
                </div>

                <TabsContent value="common"><DataTable columns={columns} data={[]} /></TabsContent>
                <TabsContent value="personal"><DataTable columns={columns} data={reports} /></TabsContent>
            </Tabs>
        </div>
    );
}