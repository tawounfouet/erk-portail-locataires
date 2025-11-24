import { TSuggestionCategory, TSuggestionStatus } from "@/types/suggestions.type";

export function getSuggestionStatusMessage(status: TSuggestionStatus)
{
    const config: Record<TSuggestionStatus, string> = {
        submitted: 'Reçue' ,
        under_review: 'En révision',
        in_progress: 'Mise en place',
        implemented: 'Appliquée',
        rejected: 'Rejetée',
    };
    
    return config[status];
};

export function getSuggestionCategoryMessage(status: TSuggestionCategory)
{
    const config: Record<TSuggestionCategory, string> = {
        common_spaces: 'Espace_Commun',
        services_equipment: 'Equipement',
        activities_events: 'Activités',
        security_comfort: 'Sécurité_Confort',
        communication: 'Communication',
        environment_sustainability: 'Environnement',
        other: 'Autre',
    };
    
    return config[status];
};