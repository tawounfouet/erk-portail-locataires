import EmptyState from "@/components/docs/EmptyState";
import { useMyTenantProfile } from "@/hooks/useRental";
import RentalService from "@/services/rental";
import { ITenantDocument } from "@/types/rental.type";
import { useEffect, useState } from "react";

export default function DocsPage()
{
    const { profile } = useMyTenantProfile();
    const [documents, setDocuments] = useState<ITenantDocument>();


    useEffect(() => {
        const fetchDocuments = async (id: string) => {
            try 
            {
                const response = await RentalService.getDocumentsByTenant(id);
                setDocuments(response.results);
            } 
            catch (err) 
            {
              console.error('Erreur lors de la récupération des documents du locataire:', err);
            }
          };

          if (profile)
          {
            fetchDocuments(profile.id);
          }


          console.log(documents);
    }, [profile]);


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