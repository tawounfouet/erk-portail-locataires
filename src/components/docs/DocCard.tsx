import { FileText } from "lucide-react";
import { Button } from "../ui/button";

interface IDocumentCardProps
{
    document: any;
}

export default function DocumentCard({ document }: IDocumentCardProps) 
{
  return (
    <div className="bg-slate-750 rounded-xl p-4 flex items-center gap-4">
      <div className="bg-slate-200 rounded-lg p-3">
        <FileText className="w-6 h-6" />
      </div>
      
      <div className="flex-1">
        <h3 className="font-semibold">{document.title}</h3>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm text-slate-400">Effectif depuis :</span>
          <span className="text-sm text-slate-300">{document.effective}</span>
        </div>

        <span className={`${document.statusColor} px-3 py-1 text-white rounded-md text-sm font-medium`}>
          {document.status}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          className="bg-slate-400 hover:bg-slate-600 text-white"
        >
          Voir
        </Button>
      </div>
    </div>
  );
};