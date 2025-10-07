import { IReport } from "@/types/reports.type";
import { AlertCircle, CheckCircle, Clock, FileText } from "lucide-react";
import { StatCard } from "@/components/common";

export default function ReportStats({ reports }: { reports: IReport[] }) {
  const stats = {
    total: reports.length,
    enCours: reports.filter(r => r.status === 'en_cours').length,
    enTraitement: reports.filter(r => r.status === 'en_processus').length,
    traitees: reports.filter(r => r.status === 'traite').length,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
      <StatCard 
        title="Total" 
        value={stats.total} 
        icon={<FileText className="h-4 w-4" />}
      />
      <StatCard 
        title="En cours" 
        value={stats.enCours} 
        icon={<Clock className="h-4 w-4" />}
        className="text-blue-600"
      />
      <StatCard 
        title="En traitement" 
        value={stats.enTraitement} 
        icon={<AlertCircle className="h-4 w-4" />}
        className="text-orange-600"
      />
      <StatCard 
        title="Traitées" 
        value={stats.traitees} 
        icon={<CheckCircle className="h-4 w-4" />}
        className="text-green-600"
      />
    </div>
  );
}