import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, FileText, Lock } from "lucide-react";
import { useState } from "react";
import SearchBar from "@/components/common/SearchBar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

// Document Card Component
const DocumentCard = ({ document }: { document: any }) => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (document.title.includes("Etat des lieux")) {
      navigate("inventory-validation");
    }
  };

  return (
    <div className="group bg-secondary/20 hover:bg-secondary/40 border border-input/50 rounded-xl p-4 flex items-center gap-4 transition-all duration-300">
      <div className="bg-primary/10 rounded-lg p-3 group-hover:bg-primary/20 transition-colors">
        <FileText className="w-6 h-6 text-primary" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white truncate">{document.title}</h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Effectif depuis :</span>
          <span className="text-xs text-gray-300 font-medium">{document.effective}</span>
        </div>

        <Badge
          variant="outline"
          className={`${document.status === 'Signé' ? 'border-green-500/50 text-green-400 bg-green-500/10' : 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10'} font-medium`}
        >
          {document.status}
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAction}
          className="text-white border-white/20 hover:bg-white/10"
        >
          {document.status === 'À valider' ? 'Vérifier' : 'Voir'}
        </Button>
      </div>
    </div>
  );
};

// Document Section Component
const DocumentSection = ({ title, count, expanded, onToggle, documents }: any) => {
  return (
    <Card className="bg-secondary/10 border-white/5 overflow-hidden transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`p-1 rounded-md ${expanded ? 'bg-primary/20 text-primary' : 'bg-gray-800 text-gray-400'}`}>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
          <Badge variant="secondary" className="bg-white/10 text-gray-300">{count}</Badge>
        </div>
      </button>

      {expanded && (
        <CardContent className="px-4 pb-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          {documents.length > 0 ? (
            documents.map((doc: any) => (
              <DocumentCard key={doc.id} document={doc} />
            ))
          ) : (
            <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-xl">
              <p className="text-gray-500 text-sm">Aucun document dans cette catégorie</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};


// Empty State Component
const EmptyState = () => {
  return (
    <div className="bg-secondary/5 border-2 border-dashed border-white/5 rounded-2xl p-12 mt-4 transition-all hover:border-white/10 group">
      <div className="flex flex-col items-center text-center space-y-5">
        <div className="bg-secondary/40 rounded-full p-8 group-hover:scale-110 transition-transform duration-500">
          <FileText className="w-16 h-16 text-gray-400" strokeWidth={1} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Aucun autre document</h3>
          <p className="text-gray-400 max-w-sm mx-auto leading-relaxed">
            Vos documents personnels et complémentaires apparaîtront ici une fois validés par l'équipe de gestion.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-gray-500 text-xs font-medium uppercase tracking-widest">
          <Lock className="w-3.5 h-3.5" />
          <span>Stockage hautement sécurisé</span>
        </div>
      </div>
    </div>
  );
};


export default function DocsWithCardsPage() {
  const [expandedSections, setExpandedSections] = useState({
    leaseAgreements: true,
    bills: false,
    stateOfAffairs: false
  });

  const allDocuments = [
    {
      id: 1,
      title: 'Contrat de bail 2025-2026',
      effective: '01/09/2025',
      effectiveDate: new Date('2023-09-01'),
      status: 'Signé',
      category: 'leaseAgreements'
    },
    {
      id: 2,
      title: 'Etat des lieux d\'entrée',
      effective: '23/02/2026',
      effectiveDate: new Date('2026-02-23'),
      status: 'À valider',
      category: 'leaseAgreements'
    }
  ];

  const [filteredDocuments, setFilteredDocuments] = useState(allDocuments);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      // @ts-ignore
      [section]: !prev[section]
    }));
  };

  const leaseDocuments = filteredDocuments.filter(doc => doc.category === 'leaseAgreements');
  const billsDocuments = filteredDocuments.filter(doc => doc.category === 'bills');

  return (
    <div className="pt-4 pb-24">
      <div className="mb-8">
        <h2 className="text-4xl font-extrabold text-white tracking-tighter mb-2">Documents</h2>
        <p className="text-gray-400 text-lg">Consultez et gérez vos documents administratifs</p>
      </div>

      <div className="mb-8 pt-4">
        <SearchBar
          data={allDocuments}
          searchFields={['title', 'effective']}
          onFilteredResults={setFilteredDocuments}
          placeholder="Rechercher un document..."
          className="w-full"
        />
      </div>

      <div className="space-y-6">
        <DocumentSection
          title="Location & Bail"
          count={leaseDocuments.length}
          expanded={expandedSections.leaseAgreements}
          onToggle={() => toggleSection('leaseAgreements')}
          documents={leaseDocuments}
        />

        <DocumentSection
          title="Quittances & Factures"
          count={billsDocuments.length}
          expanded={expandedSections.bills}
          onToggle={() => toggleSection('bills')}
          documents={billsDocuments}
        />

        <Separator className="bg-white/5 my-8" />

        <EmptyState />
      </div>
    </div>
  )
}
