import { FileText, Lock } from "lucide-react";
import { Card } from "../ui/card";

export default function EmptyState()
{
  return (
    <Card className="border-primary bg-primary/20 p-8">
        <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-primary rounded-full p-6">
                <FileText className="w-12 h-12 text-white" strokeWidth={1.5} />
            </div>

            <h3 className="text-xl font-semibold text-white">Aucun document disponible</h3>
            <p className="text-slate-400 max-w-sm">
                Vos documents apparaîtront ici une fois qu'ils auront été téléchargés par le personnel de la résidence.
            </p>
            
            <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Lock className="w-4 h-4" />
                <span>Stockage sécurisé</span>
            </div>
        </div>
    </Card>
  );
};