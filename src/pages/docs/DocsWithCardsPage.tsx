import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, FileText, Lock } from "lucide-react";
import { useState } from "react";

// Document Card Component
const DocumentCard = ({ document }) => {
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

// Document Section Component
const DocumentSection = ({ title, count, expanded, onToggle, documents }) => {
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


// Empty State Component
const EmptyState = () => {
  return (
    <Card className="border-slate-200 p-8">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="bg-slate-100 rounded-full p-6">
          <FileText className="w-12 h-12" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-semibold">Aucun autre document</h3>
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


export default function DocsWithCardsPage()
{
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        statuses: { signed: true, pending: true },
        sortBy: 'date-desc'
    });
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
        statusColor: 'bg-green-300',
        category: 'leaseAgreements'
        },
        {
        id: 2,
        title: 'Etat des lieux',
        effective: '01/09/2025',
        effectiveDate: new Date('2023-10-15'),
        status: 'Signé',
        statusColor: 'bg-green-300',
        category: 'leaseAgreements'
        }
    ];

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
        ...prev,
        [section]: !prev[section]
        }));
    };

    // Filter documents based on search and filters
    const filteredDocuments = allDocuments.filter(doc => {
        // Search filter
        const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            doc.effective.includes(searchTerm);
        
        // Status filter
        const matchesStatus = 
        (filters.statuses.signed && doc.status === 'Signé') ||
        (filters.statuses.pending && doc.status === 'Pending');
        
        return matchesSearch && matchesStatus;
    });

    // Sort documents
    const sortedDocuments = [...filteredDocuments].sort((a, b) => {
        if (filters.sortBy === 'date-desc') {
        return b.effectiveDate - a.effectiveDate;
        } else if (filters.sortBy === 'date-asc') {
        return a.effectiveDate - b.effectiveDate;
        } else if (filters.sortBy === 'name') {
        return a.title.localeCompare(b.title);
        }
        return 0;
    });

    const leaseDocuments = sortedDocuments.filter(doc => doc.category === 'leaseAgreements');

        
    return (
        <>
            <div className="space-y-4">
                <DocumentSection
                    title="Location"
                    count={leaseDocuments.length}
                    expanded={expandedSections.leaseAgreements}
                    onToggle={() => toggleSection('leaseAgreements')}
                    documents={leaseDocuments}
                />

                <DocumentSection
                    title="Factures"
                    count={0}
                    expanded={expandedSections.bills}
                    onToggle={() => toggleSection('bills')}
                    documents={[]}
                />

                <EmptyState />
            </div>
        </>
    )
}