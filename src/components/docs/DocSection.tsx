import { ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "../ui/card";
import DocumentCard from "./DocCard";

interface IDocumentSectionProps
{
    title: string;
    count: number;
    expanded?: boolean;
    onToggle?: () => void;
    documents: any;
}

export function DocumentSection({ title, count, expanded, onToggle, documents }: IDocumentSectionProps)
{
  return (
    <Card className="border-grey-700 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-750 transition-colors"
      >
        <h2 className="text-lg font-semibold">{title} ({count})</h2>
        {expanded ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>

      {expanded && documents.length > 0 && (
        <div className="px-4 pb-4 space-y-3">
          {documents.map(doc => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      )}
    </Card>
  );
};