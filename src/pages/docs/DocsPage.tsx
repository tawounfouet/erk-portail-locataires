import EmptyState from "@/components/docs/EmptyState";

export default function DocsPage()
{
    return (
        <div className="pb-20">
            <div className="mb-8 mt-4">
                <h2 className="text-3xl font-bold text-white tracking-tight">Documents</h2>
                <p className="text-gray-400 mt-1">Tous vos papiers importants en un seul endroit</p>
            </div>

            <EmptyState />
        </div>
    );
}