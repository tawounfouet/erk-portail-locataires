import { DataTable } from "@/components/common/DataTable";
import { useContacts } from "@/hooks/useContacts";
import { IContact } from "@/types/contacts.type";
import { ColumnDef } from "@tanstack/react-table";

export default function ContactsPage()
{
    const { contacts, loading, error } = useContacts();

    const columns: ColumnDef<IContact>[] = [
        {
            accessorKey: "name",
            header: "Nom complet",
            cell: ({ row }) => {
                const first_name = row.original.first_name;
                const last_name = row.original.last_name;
                
                return `${last_name} ${first_name}`;
            }
        },
        {
            accessorKey: "type",
            header: "Type"
        },
        {
            accessorKey: "email",
            header: "E-mail"
        },
        {
            accessorKey: "phone_number",
            header: "Téléphone"
        },
        {
            accessorKey: "action",
            header: "Actions"
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
            <DataTable columns={columns} data={contacts} />
        </div>
    );
}