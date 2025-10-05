import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { useReports } from "@/hooks/useReports";
import { IReport } from "@/types/reports.type";
import { formatDashDateToSlashDate } from "@/lib/date";
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

export default function HomeReportsPage()
{
    const { reports, loading, error } = useReports();
    const navigate = useNavigate();

    const columns: ColumnDef<IReport>[] = [
        {
            accessorKey: "report",
            header: "Signalement",
            cell: ({ row }) => {
                const title = row.original.title;
                const description = row.original.description;

                return (
                    <div>
                      <div className="text-sm font-medium text-gray-900">{title}</div>

                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {description}
                      </div>
                    </div>
                );
            }
        },
        {
            accessorKey: "category",
            header: "Catégorie",
            cell: ({ row }) => {
                const category = row.original.category;

                return (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full capitalize">
                      {category}
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
            accessorKey: "date",
            header: "Date",
            cell: ({ row }) => {
                const date: string = row.getValue("date");

                return formatDashDateToSlashDate(date);
            }
        },
        {
            id: "action",
            header: "Actions",
            cell: () => (
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
                        <DropdownMenuItem onClick={() => {navigate("/reports/details")}}>Détails</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {shareToWhatsapp()}}>Partager</DropdownMenuItem>
                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        {/* @TODO: Disable the delete button if the process has already started */}
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        }
    ];

    if (error)
    {
        return (
            <div>
                Une erreur s'est produite lors du chargement des données.
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-end py-4">
                <Link to="/reports/new">
                    <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Nouveau signalement
                    </Button>
                </Link>
            </div>

            <DataTable columns={columns} data={reports} />
        </div>
    );
}