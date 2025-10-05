import { DataTable } from "@/components/common/DataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColumnDef } from "@tanstack/react-table";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CircleEllipsis } from "lucide-react";
import { IDocument } from "@/types/docs.type";
import { getFileIcon } from "@/services/icons";
import { useState } from "react";
import { DocumentViewer } from "@/components/common";

export default function DocsPage()
{
    const [selectedDocument, setSelectedDocument] = useState<IDocument | null>(null);
    const [showViewer, setShowViewer] = useState<boolean>(false);

    const handleViewDocument = (doc: IDocument) => {
        setSelectedDocument(doc);
        setShowViewer(true);
    };

    const handleDownload = (doc: IDocument) => {
        // Create a temporary link for downloading
        const link = document.createElement('a');
        
        link.href = doc.url;
        link.download = `${doc.name}.pdf`;
        link.target = '_blank';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


    const columns: ColumnDef<IDocument>[] = [
        {
            id: "document",
            header: "Document",
            cell: ({ row }) => {
                const title = row.original.name;
                const filetype = row.original.filetype;

                return (
                    <div className="flex items-center gap-3">
                        {getFileIcon(filetype)}
                        <div>
                        <div className="text-sm font-medium text-gray-900">
                            {title}
                        </div>
                        </div>
                    </div>
                );
            }
        },
        {
            accessorKey: "type",
            header: "Type"
        },
        {
            accessorKey: "date",
            header: "Date"
        },
        {
            accessorKey: "size",
            header: "Taille"
        },
        {
            id: "action",
            header: "Actions",
            cell: ({row}) => (
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
                        <DropdownMenuItem onClick={() => handleViewDocument(row.original)}>Visualiser</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(row.original)}>Télécharger</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        }
    ];

    const docs: IDocument[] = [
        {
            id: 1,
            type: 'contrat',
            name: 'Contrat de bail 2025-2025',
            date: '2025-09-01',
            size: '2.4 MB',
            url: 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFsgMyAwIFIgXQovQ291bnQgMQo+PgplbmRvYmoKMyAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDIgMCBSCi9NZWRpYUJveCBbIDAgMCA2MTIgNzkyIF0KL0NvbnRlbnRzIDQgMCBSCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCi9GMSAxMiBUZgoxMDAgNzAwIFRkCihDb250cmF0IGRlIGJhaWwgMjAyNC0yMDI1KSBUagpFVApzdHJlYW0KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDU4IDAwMDAwIG4gCjAwMDAwMDAxMTUgMDAwMDAgbiAKMDAwMDAwMDIwNyAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDUKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjI5NwolJUVPRg==',
            filetype: 'pdf'
        },
        {
            id: 4,
            type: 'etat_lieux',
            name: 'État des lieux d\'entrée',
            date: '2025-09-01',
            size: '3.8 MB',
            url: 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFsgMyAwIFIgXQovQ291bnQgMQo+PgplbmRvYmoKMyAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDIgMCBSCi9NZWRpYUJveCBbIDAgMCA2MTIgNzkyIF0KL0NvbnRlbnRzIDQgMCBSCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9MZW5ndGggMzkKPj4Kc3RyZWFtCkJUCi9GMSAxMiBUZgoxMDAgNzAwIFRkCihFdGF0IGRlcyBsaWV1eCkgVGoKRVQKZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDU4IDAwMDAwIG4gCjAwMDAwMDAxMTUgMDAwMDAgbiAKMDAwMDAwMDIwNyAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDUKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjI5MgolJUVPRg==',
            filetype: 'pdf'
        }
    ];

    const billings: IDocument[] = [
        {
            id: 2,
            type: 'facture',
            name: 'Facture Août 2025',
            date: '2025-08-01',
            size: '156 KB',
            url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
            filetype: 'image'
        },
        {
            id: 3,
            type: 'facture',
            name: 'Facture Juillet 2025',
            date: '2025-07-01',
            size: '142 KB',
            url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            filetype: 'image'
        },
    ];

    return (
        <div>
            <Tabs defaultValue="general">
                <TabsList>
                    <TabsTrigger value="general">Général</TabsTrigger>
                    <TabsTrigger value="docs">Documents</TabsTrigger>
                    <TabsTrigger value="billing">Facture</TabsTrigger>
                </TabsList>

                <TabsContent value="general"><DataTable columns={columns} data={[...docs, ...billings]} /></TabsContent>
                <TabsContent value="docs"><DataTable columns={columns} data={docs} /></TabsContent>
                <TabsContent value="billing"><DataTable columns={columns} data={billings} /></TabsContent>
            </Tabs>

            {/* Document Viewer Modal */}
            {showViewer && <DocumentViewer
                                selectedDocument={selectedDocument}
                                onCloseViewer={() => {
                                    setShowViewer(false);
                                    setSelectedDocument(null);
                                    }
                                }
                            />}
        </div>
    );
}